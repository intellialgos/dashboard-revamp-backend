import axiosInstance from "../../config/axios.js";
import { ENDPOINTS } from "../../config/endpoints.js";
import { hashPassword } from "../../utils/hashPassword.js";

export const authRoutes = async (app) => {
    app.post('/login', async (request, reply) => {
      try {
        const hashedPass = await hashPassword(request?.body?.password);
        const requestData = {
          msgType: ENDPOINTS.LOGIN,
          ...request?.body,
          password: hashedPass || ""
        };

        const response = await axiosInstance.post(`/${ENDPOINTS.LOGIN}`, requestData, {
          headers: {
            ...request?.headers
          }
        });

        if ( !response.error && response?.data?.token ) {
          const token = response.data.token;

          try {
            // GET USER
            const user = await axiosInstance.post(`/${ENDPOINTS.GET_USER}`,
              {
                msgType: ENDPOINTS.GET_USER,
                token: token
              }, {
              headers: {
                "Authorization": token
              }
            });

            if ( user && !user.data.error ) {
              request.session.set('user', user.data.user);
              console.log("SESSION USER after login:", request.session.get('user'));
              
              reply.send({data: {
                ...response.data,
                user: user.data.user,
              }});
            } else {
              reply.send({data: {
                error: 1021
              }});
            }
          } catch (err) {
            reply.send({data: {
              error: 1020
            }});
          }
        }

        reply.send({data: {
          error: 1000
        }});
      } catch (error) {
        // console.error("[ERROR] Login Failed: ", error);
        // console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });
    app.post('/refreshToken', async (request, reply) => {
      try {
        const requestData = {
          msgType: ENDPOINTS.REFRESH_TOKEN,
        };
        const response = await axiosInstance.post(`/${ENDPOINTS.LOGIN}`, requestData, {
          headers: {
            ...request?.headers
          }
        });
        reply.send({data: response.data});
      } catch (error) {
        console.error("[ERROR] Refresh Token Failed:");
        console.error(`[RESPONSE] Error: ${error.response?.data || error.message}`);
        throw error;
      }
    });
}