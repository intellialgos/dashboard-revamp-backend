import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { getUserPostData } from "../../utils/userPostData.js";

export const userRoutes = async (app) => {
    app.get('/users', async (request, reply) => {
      try {
        // console.log("USERS REQUEST: ", request);
        const requestData = {
          msgType: ENDPOINTS.USERS_LIST,
          ...request?.body,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.USERS_LIST}`, requestData, {
          headers: {
            ...request?.headers
          }
        });
        console.log("SESSION USER: ", request.session.get('user'));

        reply.send({data: response?.data});
      } catch (error) {
        console.error("[ERROR] Users Fetching Failed:");
        console.error(`[RESPONSE] Error: ${error}`);
        throw error;
      }
    });

    app.get('/user', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.GET_USER
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.GET_USER}`, requestData, {
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

    app.post('/postUser', async (request, reply) => {
      try {
        const userData = await getUserPostData(request?.body);
        const requestData = {
          msgType: ENDPOINTS.POST_USER,
          ...userData
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.POST_USER}`, requestData, {
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

    app.post('/deleteUser', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.DELETE_USER,
          ...request?.body
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.DELETE_USER}`, requestData, {
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