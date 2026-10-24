import { defineMiddleware } from "void";
import { getUser, type AuthUser } from "void/auth";

declare module "void" {
  interface CloudContextVariables {
    shared: { auth: { user: AuthUser | null } };
  }
}

export default defineMiddleware(async (c, next) => {
  const user = getUser();
  c.set("shared", { auth: { user } });

  const path = c.req.path;
  if (!user && c.req.method === "GET" && (path === "/ballot" || path === "/ballot/fcs")) {
    return c.redirect(`/login?next=${encodeURIComponent(path)}`);
  }

  await next();
});
