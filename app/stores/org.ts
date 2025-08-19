const nuxtApp: any = useNuxtApp();

export const useOrgStore = defineStore("org", {
  state: () => ({
    branchList: [] as BranchModel[],
    sectionList: [] as SectionModel[],
    teamList: [] as TeamModel[],
    orgList: [],
    positionList: [] as PositionModel[],
    directorSectionList: [] as any,
    orgManagementGroup: [] as EmployeeModel[],
    orgManagementDetail: [] as OrgManagementDetailModel[],
    orgManagementList: [] as OrgManagementListModel[],
  }),
  getters: {
    getBranchList: (state) => state.branchList,
    getSectionList: (state) => state.sectionList,
    getTeamList: (state) => state.teamList,
    getOrgList: (state) => state.orgList,
    getPositionList: (state) => state.positionList,
    getDirectorSectionList: (state) => state.directorSectionList,
    getOrgManagementGroup: (state) => state.orgManagementGroup,
    getOrgManagementDetail: (state) => state.orgManagementDetail,
    getOrgManagementList: (state) => state.orgManagementList,
  },
  actions: {
    acGetBranchList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          //   const loginStore = useLoginStore();

          $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/branch",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.branchList = [];
                if (result.ERROR_CODE == "00") {
                  this.branchList = result.DATA;
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
    acGetSectionList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          //   const loginStore = useLoginStore();

          $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/section",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.sectionList = [];
                if (result.ERROR_CODE == "00") {
                  this.sectionList = result.DATA;
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
    acGetTeamList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          //   const loginStore = useLoginStore();

          $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/team",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.teamList = [];
                if (result.ERROR_CODE == "00") {
                  this.teamList = result.DATA;
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
    acGetOrganizationList(body: any) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          //   const loginStore = useLoginStore();

          $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/organization",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.orgList = [];
                if (result.ERROR_CODE == "00") {
                  this.orgList = result.DATA;
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

    acGetPositionList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/position",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.positionList = [];
                if (result.ERROR_CODE == "00") {
                  this.positionList = result.DATA;
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

    acGetOrgManagementGroup(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/org/management",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.orgManagementGroup = [];

                if (result.ERROR_CODE == "00") {
                  if (result.DATA.length > 0) {
                    this.orgManagementGroup = result.DATA;
                  }
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

    acGetOrgManagementDetail(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/org/management/detail",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.orgManagementDetail = [];

                if (result.ERROR_CODE == "00") {
                  if (result.DATA.length > 0) {
                    this.orgManagementDetail = result.DATA;
                  }
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
    acGetOrgManagementList(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/org/management/list",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.orgManagementList = [];

                if (result.ERROR_CODE == "00") {
                  if (result.DATA.length > 0) {
                    this.orgManagementList = result.DATA;
                  }
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

    acInsertOrgManagement(body: Object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/org/management",
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
