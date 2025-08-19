export default defineNuxtRouteMiddleware(async (to, from) => {
  // // isAuthenticated() is an example method verifying if a user is authenticated
  const isAuthenticated = ref(false);
  // const errorMsg = ref();

  await $fetch("/api/auth")
    .then((result) => {
      isAuthenticated.value = result;
    })
    .catch((err) => {
      isAuthenticated.value = false;
      showError({
        statusCode: err.statusCode,
        statusMessage: err.statusText,
      });
    });
  if (isAuthenticated.value === false) {
    return navigateTo("/");
  }
});
