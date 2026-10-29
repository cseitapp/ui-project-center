import { defineEventHandler } from "h3";
import { clearAuthSession } from "../../utils/authSession";

export default defineEventHandler((event) => {
  clearAuthSession(event);
  return { message: "Logged out" };
});
