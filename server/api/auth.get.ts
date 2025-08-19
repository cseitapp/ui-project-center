import isAuth from "../utils/isAuth";

export default defineEventHandler(async (event) => {
  return isAuth(event);
});
