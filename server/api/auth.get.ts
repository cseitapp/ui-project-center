import isAuth from "../utils/isAuth";
import { defineEventHandler, setHeader } from "h3";

export default defineEventHandler(async (event) => {
  setHeader(event, "Cache-Control", "no-store");
  return isAuth(event);
});
