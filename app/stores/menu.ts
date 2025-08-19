// @ts-ignore
import CryptoJS from "crypto-js";
const nuxtApp: any = useNuxtApp();

export const useMenuStore = defineStore("menu", {
  state: () => ({
    menuList: [] as MenuModel[],
    roleMenuList: [] as MenuModel[],
    allMenuList: [] as AllMenuModel[],
  }),
  getters: {
    getMenuList: (state): MenuModel[] => state.menuList,
    getAllMenuList: (state): AllMenuModel[] => state.allMenuList,
    getMenuStatus: (): CodeAndTextModel[] => [
      { CODE: "1", TEXT: nuxtApp.$t("Active"), CLASS: "text-success" },
      { CODE: "0", TEXT: nuxtApp.$t("Unactive"), CLASS: "text-error" },
    ],
  },
  actions: {
    acGetLoginMenuList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/menu/role",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.menuList = [];

                if (result.ERROR_CODE == "00") {
                  this.menuList = result.DATA;

                  ///SAVE TO LOCALSTORAGE
                  var ciphertext = await CryptoJS.AES.encrypt(
                    JSON.stringify(result.DATA),
                    nuxtApp.$env.menukey
                  ).toString();
                  localStorage.setItem(nuxtApp.$env.menukey, ciphertext);
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
    acGetRoleMenuList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/menu/role",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.roleMenuList = [];

                if (result.ERROR_CODE == "00") {
                  this.roleMenuList = result.DATA;
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

    acGetAllMenuList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/menu",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.allMenuList = [];

                if (result.ERROR_CODE == "00") {
                  this.allMenuList = result.DATA;
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

    async acGetLocalMenu() {
      const menu = await localStorage.getItem(nuxtApp.$env.menukey);
      if (menu) {
        var bytes = await CryptoJS.AES.decrypt(menu, nuxtApp.$env.menukey);
        var originalText = await bytes.toString(CryptoJS.enc.Utf8);
        this.menuList = JSON.parse(originalText);
      } else {
        this.menuList;
      }
    },


    acInsertMenu(body: Object) {

      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/menu",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));

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
    acInsertMenuRole(body: Object) {

      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/menu/role",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));

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
  },
});
