export default defineEventHandler((event) => {
  console.log(123);

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

  if (!token) {
    return { error: "No token", cookies: cookies };
  }

  return {
    message: "User authenticated",
    token,
  };
});
