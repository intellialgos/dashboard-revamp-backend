import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { sitesFilter } from "../../utils/siteFilter.js";

export const eventsRoutes = async (app) => {
    app.post('/events', async (request, reply) => {
      var sites_filter = await sitesFilter(request);
      var filtersVendors = [];
      if ( request?.body?.vendors && request?.body?.vendors.length > 0 ) {
        filtersVendors = request?.body?.vendors;
      }

      try {
        const requestData = {
          msgType: "queryevents",
          ...( sites_filter ? { sites: sites_filter } : {} ),
          ...( request?.body?.startTime ? { startTime: request?.body?.startTime } : {} ),
          ...( request?.body?.endTime ? { endTime: request?.body?.endTime } : {} ),
          ...( (request?.body?.sites && request?.body?.sites.length > 0) ? { sites: request?.body?.sites } : {} ),
          ...( (filtersVendors.length > 0) ? { vendors: filtersVendors } : {} ),
          ...( request?.body?.priority ? { itemLevels: request?.body?.priority } : {itemLevels: [0,1,2,3,4,5]} ),
          ...( request?.body?.eventType ? { keyword: request?.body?.eventType } : {} ),
          ...( request?.body?.devices ? { keyword: request?.body?.devices } : {} ),
          ...( request?.body?.pageIndex ? { pageIndex: request?.body?.pageIndex } : {} ),
          ...( request?.body?.pageSize ? { pageSize: request?.body?.pageSize } : {} ),
          ...( request?.body?.processed ? { processed: request?.body?.processed } : {} ),
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.QUERY_EVENTS}`, requestData, {
          headers: {
            ...request?.headers,
          }
        });
        reply.send({data: response.data});
      } catch (error) {
        console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });
    app.post('/processEvent', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.PROCESS_EVENT,
          ...request?.body
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.PROCESS_EVENT}`, requestData, {
          headers: {
            ...request?.headers,
          }
        });
        reply.send({data: response.data});
      } catch (error) {
        console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });
    app.post('/fastRecovery', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.FAST_RECOVERY,
          startTime: request?.body?.startTime ? request?.body?.startTime : formatDate(getLastMonthDate(date)),
          endTime: request?.body?.endTime ? request?.body?.endTime : formatDate(date),
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.FAST_RECOVERY}`, requestData, {
          headers: {
            ...request?.headers
          }
        });
        reply.send({data: response.data});
      } catch (error) {
        console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });
}