export default defineEventHandler((event) => {
  const cookies = parseCookies(event);
  console.log(cookies);

  for (const name in cookies) {
    deleteCookie(event, name, {
      path: "/",
      domain: ".cselao.la",
    });
  }

  return { message: "Logged out" };
});
