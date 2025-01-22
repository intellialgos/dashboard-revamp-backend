import { authRoutes } from "./authRoutes.js";
import { groupRoutes } from "./groupRoutes.js";
import { orgRoutes } from "./orgRoutes.js";
import { userRoutes } from "./userRoutes.js";
import { eventsRoutes } from "./eventsRoutes.js";
import { statisticsRoutes } from "./statisticsRoutes.js";
import { uploadRoutes } from "./uploadRoutes.js";

export const routes = async (app) => {
    app.get('/', async (request, reply) => {
      return { status: 404, message: '404 Not Found !' };
    });

    await authRoutes(app);
    await userRoutes(app);
    await orgRoutes(app);
    await groupRoutes(app);
    await eventsRoutes(app);
    await statisticsRoutes(app);
    await uploadRoutes(app);
  };
  