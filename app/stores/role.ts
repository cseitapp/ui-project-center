const nuxtApp: any = useNuxtApp();

export const useRoleStore = defineStore("roles", {
  state: () => ({
    roleList: [] as RoleModel[],
    userRoleList: [] as UserRoleModel[],
  }),
  getters: {
    getRoleList: (state): RoleModel[] => state.roleList,
    getUserRoleList: (state): UserRoleModel[] => state.userRoleList,
  },
  actions: {
    acGetRoleList(body: Object | null) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/role",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.roleList = [];
                if (result.ERROR_CODE == "00") {
                  this.roleList = result.DATA;
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

    acInsertRole(body: Object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/role",
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
    acGetRoleDetailList(body: Object | null) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/role/Detail",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.userRoleList = [];
                if (result.ERROR_CODE == "00") {
                  this.userRoleList = result.DATA;
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

    acInsertUserRole(body: Object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/role/user",
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
