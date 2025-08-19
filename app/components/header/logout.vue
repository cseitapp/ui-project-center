<template>
  <v-btn
    @click="logout"
    class="w-100"
    color="error"
    elevation="0"
    variant="flat"
  >
    <Icon name="line-md:logout" style="color: white" class="mr-2"></Icon>
    <span>{{ $t("logOut") }}</span>
  </v-btn>
</template>

<script setup lang="ts">
const nuxtApp: any = useNuxtApp();
const loginStore = useLoginStore();
const logout = () => {
  //@ts-ignore
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToLogout"))
    .then((r: any) => {
      //@ts-ignore
      nuxtApp.$router.push("/");
    })
    .catch((c: any) => {});
};
</script>
