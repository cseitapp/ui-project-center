<template>
  <div
    style="height: 100%; width: 100%; position: absolute"
    class="d-flex justify-center align-center"
  >
    <div class="text-center">
      <img src="~/assets/img/404-01.png" height="250" />
      <div class="pa-8">
        <h1>{{ error.statusCode }}</h1>
        <span>{{ error.statusMessage }}</span>
      </div>
      <v-btn color="primary" variant="tonal" @click="handleError"
        >Clear errors</v-btn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
//@ts-ignore
import type { NuxtError } from "#app";
//@ts-ignore
const props = defineProps({
  error: Object as () => NuxtError,
});

const handleError = () => clearError({ redirect: "/" });
</script>
