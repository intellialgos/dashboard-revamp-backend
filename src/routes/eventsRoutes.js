import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";

export const eventsRoutes = async (app) => {
    app.post('/events', async (request, reply) => {
      try {
        const requestData = {
          msgType: "queryevents",
          ...request?.body
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