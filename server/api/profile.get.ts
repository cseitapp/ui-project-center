import isAuth from "../utils/isAuth";
import config from "../utils/config";

export default defineEventHandler((event) => {
  const cookies = parseCookies(event);
  const origin = getHeader(event, "origin");

  // allow only your frontend domain
  const allowedOrigins = config().allowOrigin; ///["https://edocument.cselao.la"];

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, "Access-Control-Allow-Origin", origin);
    setHeader(event, "Access-Control-Allow-Credentials", "true");
    setHeader(
      event,
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    setHeader(
      event,
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // const token = cookies;
  // console.log("event.context.auth", event.context.auth);

  if (!event.context.auth) {
    return { message: "Please login", status: false };
  }

  return {
    message: "User authenticated",
    status: true,
    // token,
    user: event.context.auth.USER_NAME,
  };
});
