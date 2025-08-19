import config from "../../utils/config";
import fetchData from "../../utils/fetchData";
import isAuth from "../../utils/isAuth";
import isSendError from "../../utils/isSendError";

export default defineEventHandler(async (event) => {
  const body: any = await getQuery(event);
  if (!isAuth) {
    return;
  }


  var newBody:object=body?{...JSON.parse(body.body)}:body;

  return await fetchData(config().projectCenterPath + body.path, {
    method: "GET",
    headers: {
      "x-api-key": config().projectCenterApiKey,
    },
    body: newBody,
  })
    .then(async (result: any) => {

      return result;
    })
    .catch((err: any) => {
      return isSendError(event, err);
    });
});
