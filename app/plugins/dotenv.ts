export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  nuxtApp.provide("env", config.public);
});
