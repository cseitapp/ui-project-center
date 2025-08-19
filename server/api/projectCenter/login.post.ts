import config from "../../utils/config";
import encrypt from "../../utils/encrypt";
import fetchData from "../../utils/fetchData";
import isSendError from "../../utils/isSendError";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return await fetchData(config().projectCenterPath + "/api/login", {
    method: "POST",
    headers: {
      "x-api-key": config().projectCenterApiKey,
    },
    body: {
      project_id: config().projectID,
      user_name: body.userName,
      password: body.password,
      detail: "1",
      token: "0",
    },
  })
    .then(async (result) => {
      var res: any = JSON.parse(JSON.stringify(result));
      if (res.ERROR_CODE == "00") {
        ///SET COOKIES
        const cookieLife: any = config().cookieLife;
        var userData = JSON.stringify(res.DATA[0]);
        const ciphertext = await encrypt(userData, config().authCookieKey);
        await setCookie(event, config().authCookieName, ciphertext, {
          httpOnly: false,
          sameSite: true,
          maxAge: cookieLife, // 1day
        });
        event.context.auth = userData;
      }
      return result;
    })
    .catch((err: any) => {
      return isSendError(event, err);
    });
});
