import config from "../../utils/config";
import fetchData from "../../utils/fetchData";
import isAuth from "../../utils/isAuth";
import isSendError from "../../utils/isSendError";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!isAuth) {
    return;
  }

  return await fetchData(config().projectCenterPath + body.path, {
    method: "POST",
    headers: {
      "x-api-key": config().projectCenterApiKey,
    },
    body: body.body,
  })
    .then(async (result: any) => {
  
      return result;
    })
    .catch((err: any) => {
      return isSendError(event, err);
    });
});
