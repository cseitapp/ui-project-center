import { createError, defineEventHandler, setHeader } from "h3";

export default defineEventHandler((event) => {
  setHeader(event, "Cache-Control", "no-store");
  if (!event.context.auth?.USER_NAME) {
    throw createError({ statusCode: 401, statusMessage: "Please login" });
  }

  return {
    message: "User authenticated",
    status: true,
    user: event.context.auth.USER_NAME,
  };
});
