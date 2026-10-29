import config from "../../utils/config";
import { createAuthSession } from "../../utils/authSession";
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
        const profile = await createAuthSession(event, res.DATA[0]);
        return {
          ERROR_CODE: res.ERROR_CODE,
          ERROR_DESC: res.ERROR_DESC,
          DATA: [profile],
        };
      }
      return {
        ERROR_CODE: res.ERROR_CODE,
        ERROR_DESC: res.ERROR_DESC,
        DATA: [],
      };
    })
    .catch((err: any) => {
      return isSendError(event, err);
    });
});
