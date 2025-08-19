const nuxtApp: any = useNuxtApp();

export const useFileStore = defineStore("file", {
  state: () => ({}),
  getters: {},
  actions: {
    acUploadFiles(body: FormData) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          //   const loginStore = useLoginStore();
          await $fetch("/api/file/upload", {
            method: "POST",
            body: body,
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

    acRemoveFolder(body: object) {
      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/files/remove/folder",
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

    acRemoveFile(body: object) {

      return new Promise(
        async (
          resolve: (val: ResponseModel) => any,
          reject: (val: string) => any
        ) => {
          await $fetch(nuxtApp.$env.serverProjectCenter, {
            method: "POST",
            body: {
              path: "/api/files/remove",
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
    acGetFileList(body: object) {
      return new Promise(async (resolve: (val: FileInfoModel[]) => any) => {
        await $fetch(nuxtApp.$env.serverProjectCenter, {
          method: "GET",
          params: {
            path: "/api/files",
            body: body,
          },
        })
          .then(async (result: any) => {
            try {
              ResponseModelConvert.toResponseModel(JSON.stringify(result));
              resolve(result.DATA);
            } catch (error) {
              resolve([]);
            }
          })
          .catch((err) => {
            resolve([]);
          });
      });
    },
  },
});
