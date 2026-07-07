const nuxtApp: any = useNuxtApp();

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectList: [] as ProjectListModel[],
    projectGroup: [] as ProjectGroupModel[],
    projectManager: [] as ProjectManagerModel[],
  }),
  getters: {
    getProjectList: (state): ProjectListModel[] => state.projectList,
    getProjecGroup: (state): ProjectGroupModel[] => state.projectGroup,
    getProjecManager: (state): ProjectManagerModel[] => state.projectManager,
    getProjectType: (): CodeAndTextModel[] => [
      { CODE: "W", TEXT: "Website", CLASS: "text-info", ICON: "gg:website" },
      {
        CODE: "A",
        TEXT: "Mobile App",
        CLASS: "text-warning",
        ICON: "carbon:application-mobile",
      },
      {
        CODE: "S",
        TEXT: "API Service",
        CLASS: "text-error",
        ICON: "mdi:api",
      },
    ],
    getProtocolCode: () => ({
      HTTPS: "HTTPS",
      HTTP: "HTTP",
    }),

    getProjectStatus: (): CodeAndTextModel[] => [
      {
        CODE: "D",
        TEXT: nuxtApp.$t("underDevelopment"),
        CLASS: "text-warning",
        ICON: "typcn:code-outline",
      },
      {
        CODE: "T",
        TEXT: nuxtApp.$t("testing"),
        CLASS: "text-info",
        ICON: "streamline-ultimate:ab-testing-monitors",
      },
      {
        CODE: "A",
        TEXT: nuxtApp.$t("Active"),
        CLASS: "text-success",
        ICON: "solar:check-read-bold",
      },
      {
        CODE: "U",
        TEXT: nuxtApp.$t("Unactive"),
        CLASS: "text-error",
        ICON: "solar:close-square-broken",
      },
    ],
    getProjectManagerType: (): CodeAndTextModel[] => [
      {
        CODE: "D",
        TEXT: "ຜູ້ພັດທະນາ",
        CLASS: "text-warning",
        ICON: "hugeicons:phone-developer-mode",
      },
      {
        CODE: "S",
        TEXT: "ຜູ້ຊ່ວຍ",
        CLASS: "text-info",
        ICON: "streamline:customer-support-1",
      },
    ],
  },
  actions: {
    acGetProjectList(body: Object | null) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/project/info",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.projectList = [];
                if (result.ERROR_CODE == "00") {
                  this.projectList = result.DATA;
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

    acInsertProjectInfo(body: Object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/project/info",
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
    acGetProjectGroup(body: Object | null) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/project/group",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.projectGroup = [];
                if (result.ERROR_CODE == "00") {
                  this.projectGroup = result.DATA;
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

    acInsertProjectGroup(body: Object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/project/group",
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
    acGetProjectManger(body: Object | null) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/project/manager",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.projectManager = [];
                if (result.ERROR_CODE == "00") {
                  this.projectManager = result.DATA;
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

    acInsertProjectManager(body: Object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/project/manager",
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
