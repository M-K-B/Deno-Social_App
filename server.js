import { Application } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/usersRoutes.js"



// Create a new Oak application
const app = new Application();


app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
  });

  app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  });
// Use the router
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

// Start the server
const PORT = 8001;
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
