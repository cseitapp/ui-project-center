<template>
  <v-layout>
    <v-app-bar scroll-behavior="elevate" elevation="0">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>
        <div class="pt-1">
          <img src="~/assets/img/logo/logo_cse.png" height="55" />
        </div>
      </v-app-bar-title>

      <template v-slot:append>
        <!-- {{ $vuetify.display.name }} -->
        <v-row
          class="ma-0"
          :align="'center'"
          v-if="!$isMobile($vuetify, ['XS', 'SM'])"
        >
          <v-col>
            <v-avatar color="grey" size="50" class="ml-2">
              <v-img
                :src="$profilePath(loginStore.user?.PICTURE)"
                :alt="`${loginStore.user?.PICTURE}`"
                cover
                ><template v-slot:placeholder>
                  <v-row
                    :align="'center'"
                    class="fill-height ma-0"
                    justify="center"
                  >
                    <v-progress-circular
                      color="grey-lighten-5"
                      indeterminate
                    ></v-progress-circular>
                  </v-row>
                </template>
                <template v-slot:error>
                  <v-img
                    cover
                    class="rounded-lg"
                    src="~/assets/img/profile.jpg"
                  ></v-img> </template
              ></v-img>
            </v-avatar>
          </v-col>

          <div>
            <p>
              <v-chip
                :text="loginStore.user?.USER_NAME"
                variant="tonal"
                color="secondary"
                class="px-1"
                size="small"
                label
              ></v-chip>
              {{ loginStore.user?.FULL_NAME_LA }}
            </p>
            <p class="text-second">{{ loginStore.user?.TEAM_NAME }}</p>
          </div>
        </v-row>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      style=" border: none"
      class="gradient-bg-primary-bottom-top"
    >
      <template v-slot:prepend>
        <div class="text-center" v-if="$isMobile($vuetify, ['XS', 'SM'])">
          <v-row class="ma-1" justify="center">
            <div>
              <v-img
                height="90"
                width="70"
                :src="$profilePath(loginStore.user?.PICTURE)"
                aspect-ratio="1"
                class="rounded-lg"
                :alt="`${loginStore.user?.PICTURE}`"
              >
                <template v-slot:placeholder>
                  <v-row
                    :align="'center'"
                    class="fill-height ma-0"
                    justify="center"
                  >
                    <v-progress-circular
                      color="grey-lighten-5"
                      indeterminate
                    ></v-progress-circular>
                  </v-row>
                </template>
                <template v-slot:error>
                  <v-img
                    height="110"
                    width="90"
                    class="rounded-lg"
                    src="~/assets/img/profile.jpg"
                  ></v-img>
                </template>
              </v-img>
            </div>
          </v-row>
          <p>
            <v-chip
              :text="loginStore.user?.USER_NAME"
              variant="tonal"
              color="secondary"
              class="px-1"
              size="small"
              label
            ></v-chip>
            {{ loginStore.user?.FULL_NAME_LA }}
          </p>
          <p class="text-second">{{ loginStore.user?.TEAM_NAME }}</p>
        </div>
      </template>
      <div>
        <header-menu-list></header-menu-list>
      </div>
      <template v-slot:append>
        <div class="pa-2">
          <header-logout></header-logout>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>

<script>
export default {
  async setup() {
    const nuxtApp = useNuxtApp();
    const drawer = ref(true);
    const loginStore = useLoginStore();
    // const orgStore = useOrgStore();

    // onMounted(async () => {
    //   ///SET INIT USER STATE
    //   await loginStore.setLoginUser();
    // });

    ///SET INIT USER STATE
    await loginStore.setLoginUser();

    // if (nuxtApp.$isDirector(loginStore.loginUser?.ROLE_CODE)) {
    //   await orgStore.acGetSectionDirectorList(loginStore.loginUser.USER_NAME);
    // }

    return {
      drawer,
      loginStore,
    };
  },
};
</script>
