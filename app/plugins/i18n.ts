// @ts-ignore
import { createI18n } from "vue-i18n";
import en from "../locales/en.json";
import la from "../locales/la.json";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: "la",
    messages: {
      en,
      la,
    },
  });
  nuxtApp.vueApp.use(i18n);
  nuxtApp.provide("t", nuxtApp.vueApp.config.globalProperties.$t);
  nuxtApp.provide("i18n", nuxtApp.vueApp.config.globalProperties.$i18n);

  nuxtApp.provide("hello", (name: any) => `Hello ${name}!`);
});
