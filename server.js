import { Application } from "https://deno.land/x/oak/mod.ts";
import userRouter from "./routes/usersRoutes.js"
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";


// Create a new Oak application
const app = new Application();

app.use(oakCors({
  origin: [
    'http://localhost:3000', // Allow local development server
    'http://m-k-b.github.io', // Allow GitHub Pages site
  ],
  methods: ['GET', 'POST'], // Allow only GET and POST methods
   // Allow Authorization header
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
