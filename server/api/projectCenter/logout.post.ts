import config from "../../utils/config";

export default defineEventHandler((event) => {
  const cookies = parseCookies(event);
  for (const name in cookies) {
    if (config().domain != "") {
      deleteCookie(event, name, {
        path: "/",
        domain: config().domain,
      });
    } else {
      deleteCookie(event, name, {
        path: "/",
      });
    }
  }
  const name = config().authCookieName;
  deleteCookie(event, name);
  event.context.auth = null;

  return { message: "Logged out" };
});
