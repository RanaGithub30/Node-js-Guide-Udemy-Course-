import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import todosRoutes from "./routes/todos.ts";

const app = new Application();

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 3000 });