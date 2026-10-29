import { createError, type H3Event } from "h3";

export default function isAuth(event: H3Event) {
  if (!event.context.auth?.USER_NAME) {
    throw createError({ statusCode: 401, statusMessage: "Please login" });
  }
  return true;
}
