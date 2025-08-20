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



server {
  listen 80;
  server_name evaluation.cselao.la;
  # Redirect HTTP to HTTPS
  location / {
      return 301 https://$host$request_uri;
  }
}
server {
   listen 443 ssl;
   server_name evaluation.cselao.la;
   ssl_certificate /etc/nginx/ssl/hrms_cselao_la.crt;
   ssl_certificate_key /etc/nginx/ssl/hrms_cselao_la.key;
   ssl_protocols TLSv1.2 TLSv1.3;
   ssl_ciphers HIGH:!aNULL:!MD5;
   location / {
       proxy_pass http://20.10.100.71:2000; # UI service
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
}

