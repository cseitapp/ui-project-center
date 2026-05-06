<template>
  <v-layout>
    <v-main style="overflow: hidden !important"> <slot /></v-main>
    <v-footer
      app
      class="gradient-gold-color text-center d-flex flex-column pa-0 pt-2"
    >
      <div class="gradient-bg-primary wd-100 pa-2">
        <span>
          @{{ new Date().getFullYear() }} CHALEUN SEKONG ENERGY COMPANY LIMITED
          (CSE), All rights reserved</span
        >
      </div>
    </v-footer>
  </v-layout>
</template>
