interface State {
  user: LoginModel | null;
}
const nuxtApp: any = useNuxtApp();

export const useLoginStore = defineStore("login", {
  state: (): State => ({ user: null }),
  getters: {
    loginUser: (state) => state.user,
    isAdmin: (state): boolean => state.user?.ROLE_CODE == "ADMIN",
    isDev: (state): boolean => state.user?.ROLE_CODE == "DEV",
    isITAdmin: (state): boolean => state.user?.ROLE_CODE == "IT-ADMIN",
    isGeneral: (state): boolean => state.user?.ROLE_CODE == "GENERAL",
  },
  actions: {
    async loginSystem(body: object) {
      const result = await $fetch<ResponseModel>(
        nuxtApp.$env.serverProjectCenter + "/login",
        { method: "POST", body },
      );
      this.user = result.ERROR_CODE === "00" ? result.DATA[0] : null;
      return result;
    },

    async setLoginUser() {
      try {
        this.user = await $fetch<LoginModel>("/api/auth/session");
        return this.user;
      } catch (error) {
        this.user = null;
        throw error;
      }
    },

    async logOutSystem() {
      await $fetch(nuxtApp.$env.serverProjectCenter + "/logout", {
        method: "POST",
        body: {},
      });
      this.user = null;
    },
  },
});
