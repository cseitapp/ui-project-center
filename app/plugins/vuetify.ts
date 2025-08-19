// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";
// @ts-ignore
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/VDateInput";
import { VFileUpload } from "vuetify/labs/VFileUpload";

export default defineNuxtPlugin((app) => {
  const myCustomLightTheme = {
    dark: false,
    colors: {
      background: "#FFFFFF",
      secondary: "#9e9e9e",
      info: "#2196f3",
      primary: "#2b6ba0",
      warning: "#edba02",
      error: "#E02B20",
      success: "#08a246",
    },
  };

  const vuetify = createVuetify({
    // ... your configuration
    components: {
      VDateInput,
      VFileUpload,
    },
    ssr: false,
    theme: {
      defaultTheme: "myCustomLightTheme",
      themes: {
        myCustomLightTheme,
      },
    },
    defaults: {
      VTextField: {
        color: "primary",
      },
      VTextarea: {
        color: "primary",
      },
    },
  });
  app.vueApp.use(vuetify);
});
