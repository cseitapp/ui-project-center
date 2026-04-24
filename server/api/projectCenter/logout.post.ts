import config from "../../utils/config";

export default defineEventHandler((event) => {
  const cookies = parseCookies(event);
  console.log(cookies);

  for (const name in cookies) {
    deleteCookie(event, name, {
      path: "/",
      domain: config().domain,
    });
  }

  return { message: "Logged out" };
});
