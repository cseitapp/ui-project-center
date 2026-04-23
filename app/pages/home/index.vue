<template>
  <v-container>
    <div class="text-center mb-4">
      <img src="~/assets/img/logo/logo_cse.png" height="80" />
      <h2 class="text-secondary">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບ CSE Community</h2>
    </div>
    <div v-if="projectStore.getProjecGroup.length > 0">
      <div v-for="group in projectStore.getProjecGroup">
        <div class="d-flex">
          <div
            v-if="
              projectStore.getProjectList.filter(
                (el) => el.GROUP_ID == group.GROUP_ID
              ).length > 0
            "
            class="mt-6"
          >
            <v-row :align="'center'" class="ma-0">
              <Icon
                name="oui:editor-item-align-right"
                class="mr-2"
                size="1.6rem"
              />
              <h3>{{ group.GROUP_NAME }}</h3>
            </v-row>

            <div class="d-flex flex-wrap">
              <v-card
                v-for="pro in projectStore.getProjectList.filter(
                  (el) => el.GROUP_ID == group.GROUP_ID
                )"
                rounded="xl"
                elevation="0"
                class="ma-2 m-cursor"
                min-width="180"
                @click="goToProject(pro.ADDRESS)"
              >
                <v-card-text class="text-center">
                  <Icon :name="pro.PRO_ICON" size="5rem" />
                  <p>{{ pro.PRO_NAME_LA }}</p>
                  <p class="text-second">{{ pro.PRO_NAME_EN }}</p>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth", "menu"],
});

const nuxtApp = useNuxtApp();
const projectStore = useProjectStore();

const dataList = ref<ProjectListModel[]>([]);

onMounted(async () => {
  await projectStore.acGetProjectGroup({
    status: "A",
  });
  await onLoadProjectList();
});

const onLoadProjectList = async () => {
  nuxtApp.$openLoading();
  await projectStore.acGetProjectList({ status: "", type: "W" });
  dataList.value = projectStore.getProjectList;
  nuxtApp.$closeLoading();
};

const goToProject = async (url: string) => {
  if (url) {
    window.open(url, "_blank");
  }
};
</script>
