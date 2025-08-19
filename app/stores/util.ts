const nuxtApp: any = useNuxtApp();

export const useUtilStore = defineStore("util", {
  state: () => ({ searchDrawer: false, startYear: 2023 }),
  getters: {
    getSearchDrawe: (state) => state.searchDrawer,
    getYearList: (state) =>
      Array.from(
        Array(new Date().getFullYear() - (state.startYear - 1)),
        (_, i) => i + state.startYear
      ),
    getYearWithNextyearList: (state) =>
      Array.from(
        Array(new Date().getFullYear() + 1 - (state.startYear - 1)),
        (_, i) => i + state.startYear
      ),
    getActnoCode: () => ({
      INSERT: "INSERT",
      UPDATE: "UPDATE",
      DELETE: "DELETE",
    }),
    getWeekendCode: () => ({
      SAT: "SAT",
      SUN: "SUN",
    }),
    getActiveUnActiveStatus: (): CodeAndTextModel[] => [
      { CODE: "A", TEXT: nuxtApp.$t("Active"), CLASS: "text-success" },
      { CODE: "U", TEXT: nuxtApp.$t("Unactive"), CLASS: "text-error" },
    ],
  },
  actions: {
    acOpenSearchDrawer(value: boolean) {
      this.searchDrawer = value;
    },
    acGetActiveUnactiveStatus(code: any) {
      const result = this.getActiveUnActiveStatus.filter(
        (el: CodeAndTextModel) => el.CODE == code
      );
      if (result.length > 0) {
        return result[0];
      }
      return;
    },
    acGetCodetoText(list: CodeAndTextModel[], code: any) {
      const result = list.filter((el: CodeAndTextModel) => el.CODE == code);
      if (result.length > 0) {
        return result[0];
      }
      return;
    },
  },
});
