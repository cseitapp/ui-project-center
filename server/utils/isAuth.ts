import { createError, sendError } from "h3";
import config from "./config";

export default defineEventHandler((event) => {
  console.log(config().authCookieName);
  
  const myCookie = getCookie(event, config().authCookieName);
  console.log(myCookie);
  
  if (typeof myCookie == "undefined") {
    sendError(
      event,
      createError({
        statusCode: 498,
        statusMessage: "Please login",
      })
    );
    return false;
  } else {
    return true;
  }
});
