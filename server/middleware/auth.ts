import { defineEventHandler } from "h3";
import { readAuthSession } from "../utils/authSession";

export default defineEventHandler(async (event) => {
  await readAuthSession(event);
});
