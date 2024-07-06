import { Application } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import userRouter from "./routes/usersRoutes.js"



// Create a new Oak application
const app = new Application();



// Use the router
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

// Start the server
const PORT = 8001;
console.log(`Server is running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
