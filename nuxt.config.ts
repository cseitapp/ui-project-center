// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import pkg from "./package.json";
export default defineNuxtConfig({
  compatibilityDate: "2025-08-08",
  devtools: { enabled: true },
  ssr: false,
  experimental: {
    renderJsonPayloads: false,
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "CSE Project center",
      script: [
        {
          // src: "",
        },
      ],

      link: [{ rel: "icon", type: "image/x-icon", href: "/cse.ico" }],
    },
  },
  //VUETIFY
  build: {
    transpile: ["vuetify"],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
    ["@pinia/nuxt", { autoImports: ["defineStore"] }],
    "@nuxt/icon",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  imports: {
    dirs: ["types", "stores"],
  },

  runtimeConfig: {
    projectCenterPath: process.env.PROJECT_CENTER_PATH,
    projectCenterApiKey: process.env.PROJECT_CENTER_X_API_KEY,
    projectID: process.env.PROJECT_ID,
    filePath: process.env.FILE_PATH,
    picPath: process.env.PIC_PATH,
    //key
    authUserKey: process.env.AUTH_USER_KEY,
    authCookieKey: process.env.AUTH_COOKIE_KEY,
    authCookieName: process.env.AUTH_COOKIE_NAME,
    cookieLife: process.env.COOKIE_LIFT,

    public: {
      clientVersion: pkg.version,
      filePath: process.env.FILE_PATH,
      projectID: process.env.PROJECT_ID,
      //server
      serverProjectCenter: "/api/projectCenter",
      //key
      authUserKey: process.env.AUTH_USER_KEY,
      authCookieKey: process.env.AUTH_COOKIE_KEY,
      authCookieName: process.env.AUTH_COOKIE_NAME,
      cookieLife: process.env.COOKIE_LIFT,

      menukey: process.env.MENU_KEY,
      currentMenukey: process.env.CURRENT_MENU_KEY,
      langKey: process.env.LANG_KEY,
    },
  },
  css: [
    "@/assets/css/main.css",
    "@/assets/css/vuetify.css",
    "@/assets/css/iconify.css",
  ],
});
