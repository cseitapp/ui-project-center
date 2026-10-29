export default defineNuxtRouteMiddleware(async (to) => {
  try {
    await useLoginStore().setLoginUser();
  } catch (error: any) {
    if (error.statusCode === 401 || error.status === 401) {
      if (to.path !== "/") return navigateTo("/");
      return;
    }
    return abortNavigation(createError({
      statusCode: error.statusCode || 503,
      statusMessage: "Unable to verify session. Please try again.",
    }));
  }
});
