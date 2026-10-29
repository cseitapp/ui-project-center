import { defineEventHandler, fromNodeMiddleware, getRequestURL } from "h3";
import { getOidcProvider } from "../utils/oidcProvider";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (!path.startsWith("/.well-known/") && !path.startsWith("/oauth/")) return;

  const provider = await getOidcProvider();
  return fromNodeMiddleware(provider.callback())(event);
});
