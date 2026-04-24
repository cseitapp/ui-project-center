export default defineEventHandler((event) => {

  const cookies = parseCookies(event);

  const token = cookies.token;

  if (!token) {
    return { error: "No token" };
  }

  return {
    message: "User authenticated",
    token,
  };
});
