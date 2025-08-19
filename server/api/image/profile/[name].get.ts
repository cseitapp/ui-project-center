import config from "../../../utils/config";
import fetchData from "../../../utils/fetchData";
import isSendError from "../../../utils/isSendError";

export default defineEventHandler(async (event) => {
  const filePath = getRouterParam(event, "name");

  var url = config().filePath + "/PROFILE/" + filePath;

  return await fetchData(url, {
    method: "GET",

    headers: {
      //   mode: "cors",
      //   "access-control-allow-origin": "*",
      //    'content-type': 'image/jpeg'
    },
  })
    .then(async (result: any) => {
      return result;
    })
    .catch((err: any) => {
      return isSendError(event, err);
    });
});
