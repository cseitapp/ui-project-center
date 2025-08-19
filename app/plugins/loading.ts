export default defineNuxtPlugin((nuxtApp) => {
  const loadingState = useState("loadingState", () => {
    return {
      state: {
        open: false,
      },
    };
  });
  return {
    provide: {
      isLoading: loadingState.value.state,
      openLoading: () => {
        loadingState.value.state.open = true;
      },

      closeLoading: () => {
        loadingState.value.state.open = false;
      },
    },
  };
});
