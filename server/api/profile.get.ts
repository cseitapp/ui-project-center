import isAuth from "../utils/isAuth";

export default defineEventHandler((event) => {
  console.log(123);
  console.log("1", isAuth);
  console.log("2", !isAuth);

  const cookies = parseCookies(event);
  const origin = getHeader(event, "origin");
  console.log(origin);

  // allow only your frontend domain
  const allowedOrigins = ["https://edocument.cselao.la"];

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

  const token = cookies;
  console.log("event.context.auth", event.context.auth);

  if (!token) {
    return { message: "Please login", status: false };
  }

  return {
    message: "User authenticated",
    status: true,
    token,
    user: event.context.auth,
  };
});
