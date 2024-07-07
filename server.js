import { Application } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/usersRoutes.js"
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


// Create a new Oak application
const app = new Application();


app.use(async (ctx, next) => {
  ctx.response.headers.set('Access-Control-Allow-Origin', '*'); // * for all servers, you can use your own server address
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Which methods you want to allow
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type'); // If your request body has json
  await next(); // If you use async await in other middlewares, you must use async await here
 });

app.use(oakCors({
  origin: "*", // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
  headers: '*',
  
  optionsSuccessStatus: 200, // Allow all headers
}));


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
