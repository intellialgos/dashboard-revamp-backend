export const userSessionMiddleware = (req, res, next,) => {
  // const user = req.session.get('user');
  console.log(`[Middleware] req: `, req);
  next(); // Pass control to the next middleware or route
};