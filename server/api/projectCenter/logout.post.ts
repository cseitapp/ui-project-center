import { defineEventHandler } from "h3";
import { clearAuthSession } from "../../utils/authSession";

export default defineEventHandler(async (event) => {
  await clearAuthSession(event);
  return { message: "Logged out" };
});
