export default defineNuxtPlugin((nuxtApp) => {
  const msg = useState("msg", () => {
    return {
      state: {
        dialog: false,
        resolve: ({ val: boolean, msg: string }: any) => {},
        reject: (val: boolean) => {},
        message: "",
        title: "",
        type: "I", // "S:Success; E:Error, W:Warning; I:Info; Q:Question"
        description: "",
        options: {
          color: "primary",
          width: 290,
          zIndex: 200,
        },
      },
    };
  });
  return {
    provide: {
      alertState: msg.value.state,
      openAlert: (
        type: string,
        // title: string,
        message: string
        // options?: {} | undefined
      ) => {
        msg.value.state.dialog = true;
        msg.value.state.type = type;
        // msg.value.state.title = title;
        msg.value.state.message = message;
        // msg.value.state.options = Object.assign(
        //   msg.value.state.options
        //   // options
        // );
        return new Promise<boolean>((resolve, reject) => {
          msg.value.state.resolve = resolve;
          msg.value.state.reject = reject;
        });
      },
      alertAgree: () => {
        msg.value.state.resolve({
          val: true,
          msg: msg.value.state.description,
        });
        msg.value.state.dialog = false;
        msg.value.state.description = "";
      },
      alertCancel: () => {
        if (msg.value.state.type == "Q") {
          msg.value.state.reject(true);
        }
        msg.value.state.dialog = false;
        msg.value.state.description = "";
      },
    },
  };
});
