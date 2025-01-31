import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
// import { decodeBase64 } from "../../utils/base64.js";
import { calculateDuration, convertDurationToSeconds } from "../../utils/calculateDuration.js";
import { formatDate, getLast90DaysDate, getLastMonthDate, getLastWeekDate } from "../../utils/dates.js";
import { sitesFilter } from "../../utils/siteFilter.js";
// import { userFilter } from "../../utils/userFilter.js";

function aggregateByName(inputArray) {
    const result = [];

    inputArray.forEach((alert) => {
        const { obj } = alert;
        const existing = result.find(item => item.name === obj.name);
        if (existing) {
            existing.count++;
        } else {
            result.push({ name: obj.name, count: 1, time: alert.timeEvent });
        }
    });

    return result;
}
function aggregateBySite(inputArray, sites) {
    const result = [];
    
    inputArray.forEach((alert) => {
        const { site } = alert;
        const existing = result.find(item => item.site_id === site.id);
        if (existing) {
            existing.count++;
        } else {
            const s = sites.find(item => item.id === site.id);
            result.push({
                site_name: site.name,
                site_id: site.id,
                count: 1,
                lng: s.longitude,
                lat: s.latitude,
            });
        }
    });
    return result;
}
function filterByTimeRange(array, startTime, endTime) {
    // Parse the start and end times to Date objects for comparison
    const start = new Date(startTime);
    const end = new Date(endTime);

    if ( !array ) { return [] };
    // Filter the array
    return array.filter(item => {
        const itemTime = new Date(item.time); // Parse "time" from the array
        return itemTime >= start && itemTime <= end; // Check if it's within the range
    });
}
function aggregateByMonths(inputArray) {
  const result = [];

  inputArray.forEach((alarm) => {
    const date = new Date(alarm.time);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const name = `${month} ${year}`; // Format as "Jan 2024"

    // Determine the alarm levels
    let low = 0,
      medium = 0,
      high = 0;

    if (alarm.level === 1 || alarm.level === 2) low = 1;
    if (alarm.level === 2 || alarm.level === 3) medium = 1;
    if (alarm.level === 4 || alarm.level === 5) high = 1;

    // Check if the month-year already exists
    const existing = result.find((item) => item.name === name);

    if (existing) {
      // Increment counts
      existing.low += low;
      existing.medium += medium;
      existing.high += high;
    } else {
      // Add a new entry
      result.push({
        name,
        low,
        medium,
        high,
      });
    }
  });

  return result;
}


export const statisticsRoutes = async (app) => {
    app.post('/assetsStatistics', async (request, reply) => {
        var data = {}
        var reqBody = {
            msgType: ENDPOINTS.GET_ORGANIZATIONS
        }

        // SITES
        var sites = [];
        var sites_filter = await sitesFilter(request);

        // REQUEST FOR ALL ORGANIZATIONS
        const response = await axiosInstance.post(`/${ENDPOINTS.GET_ORGANIZATIONS}`, reqBody, {
          headers: {
            ...request?.headers
          }
        });
        if ( response?.data && response.data?.error == 0 ) {
          response.data.orgs.map( org => {
            if ( org.sites ) {
              sites = [...sites, ...org.sites];
            }
          })
        }

        // DATES
        const todayDate = formatDate(new Date());
        const last30DaysDate = formatDate(getLastMonthDate(new Date()));
        const last90DaysDate = formatDate(getLast90DaysDate(new Date()));
        const last7DaysDate = formatDate(getLastWeekDate(new Date()));

        // 90 Days offline
        const last90DaysAlerts = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, {
          msgType: "QueryEvents",
          ...( sites_filter ? { sites: sites_filter } : {} ),
          startTime: last90DaysDate,
          endTime: todayDate,
        }, {
          headers: {
            ...request?.headers
          }
        });
        if ( last90DaysAlerts.data?.error == 0 ) {
          const alerts = last90DaysAlerts.data.data.event || [];
          const notRespondingItems = alerts.filter( event => event.obj.value == "Not Responding" );
          data.notResponding90DaysAgo = aggregateByName(notRespondingItems);
        }

        // 30 Days offline
        const monthlyAlerts = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, {
          msgType: "QueryEvents",
          ...( sites_filter ? { sites: sites_filter } : {} ),
          startTime: last30DaysDate,
          endTime: todayDate
        }, {
          headers: {
            ...request?.headers
          }
        });
        if ( monthlyAlerts.data?.error == 0 ) {
          const alerts = monthlyAlerts.data.data.event || [];
          const notRespondingItems = alerts.filter( event => event.obj.value == "Not Responding" );
          data.notResponding30DaysAgo = aggregateByName(notRespondingItems);
        }

        // 7 Days offline
        const weekAlerts = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, {
          msgType: "QueryEvents",
          ...( sites_filter ? { sites: sites_filter } : {} ),
          startTime: last7DaysDate,
          endTime: todayDate
        }, {
          headers: {
            ...request?.headers
          }
        });
        if ( weekAlerts.data?.error == 0 ) {
          const alerts = weekAlerts.data.data.event || [];
          const notRespondingItems = alerts.filter( event => event.obj.value == "Not Responding" );
          data.notResponding7DaysAgo = aggregateByName(notRespondingItems);

          const lastDay = new Date();
          lastDay.setDate(lastDay.getDate() - 1);
          data.notResponding24HourAgo = filterByTimeRange(data.notResponding24HourAgo, lastDay, new Date());

        }

        // REQUEST ALL ALERTS
        const requestData = {
            msgType: "QueryEvents",
            ...( sites_filter ? { sites: sites_filter } : {} ),
            ...( request?.body?.startTime ? { startTime: request?.body?.startTime } : {} ),
            ...( request?.body?.endTime ? { endTime: request?.body?.endTime } : {} ),
            ...( request?.body?.sites ? { sites: request?.body?.sites } : {} ),
            ...( request?.body?.vendors ? { vendors: request?.body?.vendors } : {} ),
            ...( request?.body?.priority ? { itemLevels: request?.body?.priority } : {itemLevels: [0,1,2,3,4,5]} ),
            ...( request?.body?.eventType ? { keyword: request?.body?.eventType } : {} ),
        };
        const allAlerts = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, requestData, {
            headers: {
              ...request?.headers
            }
        });
 
        if ( allAlerts.data?.error == 0 ) {
            const alerts = allAlerts.data.data.event || [];
            const notRespondingItems = alerts.filter( event => event.obj.value == "Not Responding" );
            // Rectified 7 Days Ago
            // filterByTimeRange(notRespondingItems, sevenDaysAgo, today)
            const rectifiedAlarms = notRespondingItems.filter( event => event.process?.status == 2 );
            const rectifications = rectifiedAlarms.map( item => {
              const duration = calculateDuration(item.timeEvent, item.process.time)
              return {
                name: item.obj.name,
                nameSmall: item.obj.name.slice(0, 2),
                rectification_time: duration,
                seconds: convertDurationToSeconds(duration),
                amt: convertDurationToSeconds(duration),
              }
            } )
            .sort((a, b) => a.seconds - b.seconds) // Sort by duration in ascending order
            .slice(0, 10); // Take the top 10;
            
            const response_time = alerts
            .map(item => {
              const duration = calculateDuration(item.timeEvent, item.process.time);
              return {
                name: item.obj.name,
                nameSmall: item.obj.name.slice(0, 2),
                rectification_time: duration,
                seconds: convertDurationToSeconds(duration),
                amt: convertDurationToSeconds(duration),
              };
            })
            .sort((a, b) => a.seconds - b.seconds) // Sort by duration in ascending order
            .slice(0, 10); // Take the top 10

            const totalAlerts = alerts.length;
            const closedTickets = alerts.filter(event => event.process.status == 2 ).length;

            data.totalCount = allAlerts.data.data.totalCount;
            data.totalAlarmsCount = totalAlerts;
            data.closedAlarmsCount = closedTickets;
            data.openAlarmsCount = totalAlerts-closedTickets;
            data.successRate = (totalAlerts > 0) ? (closedTickets*100)/totalAlerts : 0;
            data.allAlerts = alerts;
            data.allAlertsByMonths = aggregateByMonths(alerts);
            data.rectifications = rectifications;
            data.response_time = response_time;
            data.sitesAlerts = aggregateBySite(alerts, sites);
            data.totalAssets = aggregateByName(alerts);
            // data.notRespondingTotal = aggregateByName(notRespondingItems);
            // data.notResponding30DaysAgo = filterByTimeRange(data.notRespondingTotal, lastMonth, today);
            // data.notResponding90Days = filterByTimeRange(data.notRespondingTotal, lastMonth, today);
            // data.notResponding7DaysAgo = filterByTimeRange(data.notResponding30DaysAgo, sevenDaysAgo, today);
            // data.notResponding24HourAgo = filterByTimeRange(data.notResponding24HourAgo, lastDay, today);
        }

        // REQUEST ALERTS WITH FILTERS
        // const requestFilteredData = {
        //   msgType: "QueryEvents",
        //   ...( sites_filter ? { sites: sites_filter } : {} ),
        //   ...( request?.body?.sites ? { sites: request?.body?.sites } : {} ),
        //   ...( request?.body?.vendors ? { vendors: request?.body?.vendors } : {} ),
        //   ...( request?.body?.priority ? { itemLevels: request?.body?.priority } : {itemLevels: [0,1,2,3,4,5]} ),
        //   ...( request?.body?.eventType ? { keyword: request?.body?.eventType } : {} ),
        // };
        // const filteredAlerts = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, requestFilteredData, {
        //   headers: {
        //     ...request?.headers
        //   }
        // });
        // if ( filteredAlerts.data?.error == 0 ) {
        //   const alerts = filteredAlerts.data.data.event || [];
        //   const notRespondingItems = alerts.filter( event => event.obj.value == "Not Responding" );
        //   // Last Week (7 Days)
        //   const today = new Date(); // Current date and time
        //   const sevenDaysAgo = new Date(); // Initialize with today
        //   sevenDaysAgo.setDate(today.getDate() - 7);

        //   // Last Day (24 Hours)
        //   const lastDay = new Date();
        //   lastDay.setDate(today.getDate() - 1);

        //   // Last Month (30 Days)
        //   const lastMonth = new Date();
        //   lastMonth.setDate(today.getDate() - 30);
        // }

        reply.send({data: data});

    });
    app.post('/dashboardStats', async (request, reply) => {
      try {
        const requestData = {
          msgType: "queryevents",
          ...request?.body,
          keyword: 'CameraResponding'
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, requestData, {
          headers: {
            ...request?.headers
          }
        });

        var data = {
            notRespondingTotal: []
        }

        if ( response.data?.error == 0 ) {
            const notRespondingItems = response.data.data.event.filter( event => event.obj.value == "Not Responding" )
            data.notRespondingTotal = aggregateByName(notRespondingItems)
        }

        reply.send({data: data});
      } catch (error) {
        console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });
    app.post('/getFilters', async (request, reply) => {
      var sites_filter = await sitesFilter(request);
      const requestData = {
        msgType: "QueryEvents",
        ...( sites_filter ? { sites: sites_filter } : {} )
      };
      const allAlerts = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, requestData, {
          headers: {
            ...request?.headers
          }
      });

      if ( allAlerts.data?.error == 0 ) {
        const alerts = allAlerts.data.data.event || [];
        const vendors = [];
        const devices = [];
        const eventTypes = [];
        
        alerts.map( alert => {
          if (!devices.includes(alert.obj.name)) {
            devices.push(alert.obj.name);
          }
          if ( !vendors.includes(alert.vendor) ) {
            vendors.push(alert.vendor);
          }
          if ( !eventTypes.includes(alert.obj.key) ) {
            eventTypes.push(alert.obj.key);
          }
        });

        reply.send({data: {
          vendors,
          devices,
          eventTypes
        }});
      }

      reply.send({data: []});
  });
}