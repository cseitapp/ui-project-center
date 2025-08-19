import { ResponseModel } from "~/types/responseModel";

export default async function (
  path: String,
  opt?: { method?: string; headers?: {}; body?: any } | undefined
) {
  return new Promise((resolve, reject) => {
    const defaultOpt: object = {
      method: opt?.method ? opt.method : "GET",
      headers: opt?.headers ?? { "Content-Type": "application/json" },
      // headers: { ...opt?.headers },
      body: opt?.method != "GET" ? opt?.body : null,
      params: opt?.method == "GET" ? opt?.body : null,
      signal: AbortSignal.timeout(20000),
    };

    $fetch(path + "", { ...defaultOpt })
      .then((result) => {
        // console.log(result);
        resolve(result);
      })
      .catch((err) => {
        err.message = "Network Error, Please contract administrator";
        reject(err);
      });
  });
}
