import config from "../../utils/config";
import fetchData from "../../utils/fetchData";
import isAuth from "../../utils/isAuth";
import isSendError from "../../utils/isSendError";

export default defineEventHandler(async (event) => {
  const body: any = await readMultipartFormData(event);
  var formData = new FormData();
  body.forEach((element: any) => {
    if (element.name == "files") {
      const blob = new Blob([element.data], {
        type: element.type,
      });
      formData.append(element.name, blob, element.filename);
    } else {
      //string value
      var str = Buffer.from(element.data);
      formData.append(element.name, str.toString());
    }
  });

  if (!isAuth) {
    return;
  }

  const user = event.context;
  return await fetchData(config().projectCenterPath + "/api/files/upload", {
    method: "POST",
    headers: {
      "x-api-key": config().projectCenterApiKey,
    },
    body: formData,
  })
    .then(async (result: any) => {
      return result;
    })
    .catch((err: any) => {
      return isSendError(event, err);
    });
});
