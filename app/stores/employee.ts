const nuxtApp: any = useNuxtApp();

export const useEmployeeStore = defineStore("employee", {
  state: () => ({
    employeeList: [] as EmployeeModel[],
  }),
  getters: {
    getEmployeeList: (state): EmployeeModel[] => state.employeeList,
  },
  actions: {
    acGetEmployeeList(body: Object | null) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "GET",
            params: {
              path: "/api/user",
              body: body,
            },
          })
            .then(async (result: any) => {
              try {
                ResponseModelConvert.toResponseModel(JSON.stringify(result));
                this.employeeList = [];
                if (result.ERROR_CODE == "00") {
                  this.employeeList = result.DATA;
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
  },
});
