import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { sitesFilter } from "../../utils/siteFilter.js";

export const orgRoutes = async (app) => {
    // Get Organizations & Sites & Groups
    app.post('/getOrganizations', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.GET_ORGANIZATIONS,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.GET_ORGANIZATIONS}`, requestData, {
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

    app.post('/postOrganization', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.POST_ORGANIZATION,
          ...request?.body
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.POST_ORGANIZATION}`, requestData, {
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

    app.get('/sites', async (request, reply) => {
      try {
        var sites = [];
        var sites_filter = await sitesFilter(request);

        const requestData = {
          msgType: ENDPOINTS.GET_ORGANIZATIONS,
        };

        const response = await axiosInstance.post(`/${ENDPOINTS.GET_ORGANIZATIONS}`, requestData, {
          headers: {
            ...request?.headers
          }
        });
        if ( response?.data && response.data?.error == 0 ) {
          response.data.orgs.map( org => {
            if ( org.sites ) {
              const filteredSites = (sites_filter.length > 0) ? org.sites.filter(item => sites_filter.includes(item.id)) : org.sites;
              sites = [...sites, ...filteredSites];
            }
          })
        }

        reply.send({data: sites});
      } catch (error) {
        console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });

    // RegisterBox
    app.post('/createSite', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.REGISTER_BOX,
          name: request?.body?.name,
          orgId: request?.body?.orgId,
          boxType: request?.body?.boxType
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.REGISTER_BOX}`, requestData, {
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

    // DeleteBox / Delete Site
    app.post('/deleteSite', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.DELETE_SITE,
          siteId: request?.body?.siteId,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.DELETE_SITE}`, requestData, {
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

    // Restart Box
    app.post('/restartBox', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.RESTART_BOX,
          siteId: request?.body?.siteId,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.RESTART_BOX}`, requestData, {
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

    // updateioeventstext
    app.post('/updateioevents', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.UPDATE_IO_EVENTS,
          siteId: request?.body?.siteId,
          ioCustomText: request?.body?.ioCustomText,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.UPDATE_IO_EVENTS}`, requestData, {
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

    // Get Box Status
    app.post('/getBoxStatus', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.GET_BOX_STATUS,
          siteId: request?.body?.siteId,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.GET_BOX_STATUS}`, requestData, {
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
    
    // GET IO Events Text
    app.post('/getIoEvents', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.GET_IO_EVENTS,
          siteId: request?.body?.siteId,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.GET_IO_EVENTS}`, requestData, {
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

    // Get Masked Items Key
    app.post('/getMaskedItemKey', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.GET_MASKED_ITEM
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.GET_MASKED_ITEM}`, requestData, {
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

    // Mask Item
    app.post('/maskItem', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.MASK_ITEM,
          keyId: request?.body?.keyId
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.MASK_ITEM}`, requestData, {
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

    // Upgrade Box Firmware
    app.post('/upgradeBoxFirmware', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.UPGRADE_BOX_FIRMWARE,
          ...request?.body
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.UPGRADE_BOX_FIRMWARE}`, requestData, {
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

    // deletemaskeditemkey
    app.post('/deleteMaskedItem', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.DELETE_MASKED_ITEM,
          keyId: request?.body?.keyId
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.DELETE_MASKED_ITEM}`, requestData, {
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

    // deletemaskeditemkey
    app.post('/configureBox', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.CONFIGURE_BOX,
          ...request?.body
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.CONFIGURE_BOX}`, requestData, {
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