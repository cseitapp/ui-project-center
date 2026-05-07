<template>
  <div class="py-2">
    <v-row class="ma-0" :align="'center'">
      <v-avatar color="grey" :size="props.size ?? 50" class="ml-2">
        <v-img
          v-if="props.picture"
          :src="nuxtApp.$profilePath(props.picture)"
          :alt="`${props.picture}`"
          cover
          ><template v-slot:placeholder>
            <v-row :align="'center'" class="fill-height ma-0" justify="center">
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
        <v-img
          v-else
          cover
          class="rounded-lg"
          src="~/assets/img/profile.jpg"
        ></v-img>
      </v-avatar>
      <v-col v-if="props.showText" class="py-0">
        <p>
          <v-chip
            :text="props.userName"
            variant="tonal"
            color="secondary"
            class="px-1"
            size="small"
            label
          ></v-chip>
          {{ props.fullname }}
        </p>
        <p class="text-second">{{ props.subName }}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
const nuxtApp: any = useNuxtApp();
const props = defineProps({
  picture: { type: String, required: false },
  userName: { type: String, required: false },
  fullname: { type: String, required: false },
  subName: { type: String, required: false },
  showText: { type: Boolean, required: false },
  size: { type: Number, required: false },
});
</script>
