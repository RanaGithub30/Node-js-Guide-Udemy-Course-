import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const router = new Router();

router
.get("/", (ctx) => {
  ctx.response.body = "Welcome to Oak!";
})
.get("/about", (ctx) => {
  ctx.response.body = "About Oak Framework";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("🌐 Listening on http://localhost:8000");
await app.listen({ port: 8000 });