<template>
  <v-container>
    <div class="text-center mb-8">
      <img src="~/assets/img/logo_company.png" height="160" />
      <h1 class="text-secondary">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ Project Center</h1>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth", "menu"],
});
</script>
