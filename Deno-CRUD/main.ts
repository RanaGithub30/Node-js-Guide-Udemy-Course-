import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import crudRoutes from "./routes/crud.ts";

const app = new Application();

app.use(crudRoutes.routes());
app.use(crudRoutes.allowedMethods());

await app.listen({ port: 3000 });