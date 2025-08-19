// @ts-ignore
import CryptoJS from "crypto-js";

interface State {
  user: LoginModel | null;
}
const nuxtApp: any = useNuxtApp();

export const useLoginStore = defineStore("login", {
  state: (): State => ({ user: null }),
  getters: {
    loginUser: (state) => state.user,
  },
  actions: {
    loginSystem(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {        
          await $fetch(nuxtApp.$env.serverProjectCenter + "/login", {
            method: "POST",
            body: body,
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.user = null;
                if (result.ERROR_CODE == "00") {
                  this.user = result.DATA[0];
                }
                resolve(result);
              } catch (error) {                
                reject(nuxtApp.$t("somthingWrong"));
              }
            })
            .catch((err) => {
              reject(err.message);
            });
        }
      );
    },

    setLoginUser() {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          try {
            const name = nuxtApp.$env.authCookieName;
            const myCookie: any = useCookie(name);
            if (typeof myCookie.value != "undefined") {
              var bytes = await CryptoJS.AES.decrypt(
                myCookie.value,
                nuxtApp.$env.authCookieKey
              );
              var originalText = await bytes.toString(CryptoJS.enc.Utf8);
              this.user = JSON.parse(originalText);
              resolve(JSON.parse(originalText));
            } else {
              showError({
                statusCode: 500,
                statusMessage: "Please login",
              });
            }
          } catch (error) {
            showError({
              statusCode: 500,
              statusMessage: "Please login",
            });
          }
        }
      );
    },
  },
});
