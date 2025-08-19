import isDecrypt from "../utils/decrypt";
import config from "../utils/config";

export default defineEventHandler((event) => {
  //append header

  appendHeader(event, "Access-Control-Allow-Origin", "*");

  const myCookie: any = getCookie(event, config().authCookieName);
  const cookieLife: any = config().cookieLife;

  if (typeof myCookie != "undefined") {
    const userData = isDecrypt(myCookie, config().authCookieKey);
    ///SET NEW COOKIE EXPIRE TIME
    setCookie(event, config().authCookieName, myCookie, {
      httpOnly: false,
      sameSite: true,
      maxAge: cookieLife, //1day //3600 // 1h
    });
    event.context.auth = userData ? JSON.parse(userData) : null;
  } else {
    event.context.auth = null;
  }
});
