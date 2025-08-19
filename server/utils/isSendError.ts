import { createError, H3Event, sendError } from "h3";

export default function (event: H3Event, err: any) {
  var isTimeout = err.message == "The operation was aborted. ()" ? true : false;
  sendError(
    event,
    createError({
      statusCode: isTimeout ? 408 : 401,
      statusMessage: isTimeout ? "Timeout" : err.message,
    })
  );
}
