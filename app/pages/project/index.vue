<template>
  <v-container fluid>
    <v-data-table
      :search="txtSearch"
      :headers="tableHeaders"
      :items="dataList"
      class="rounded-lg custom-table-header m-shadow"
      density="comfortable"
      v-model:page="page"
      :items-per-page="itemsPerPage"
      :items-per-page-text="$t('itemShowing')"
      :mobile="nuxtApp.$isMobile($vuetify, ['XS', 'SM'])"
    >
      <template v-slot:top="">
        <v-row class="ma-0 mt-2" :align="'center'" justify="end">
          <v-col cols="12" sm="6" class="text-right">
            <v-row :align="'center'">
              <div class="px-4 text-left">
                <v-row class="ma-0" :align="'center'">
                  <Icon
                    name="material-symbols:table"
                    size="1.8rem"
                    class="mr-1"
                  />
                  <span class="text-title"><b>ຂໍ້ມູນລະບົບ</b></span>
                </v-row>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                variant="tonal"
                class="mr-2"
                @click="goToAddNewItem('NEW')"
                ><Icon
                  name="line-md:plus"
                  class="mr-1 text-success"
                  size="1.2rem"
                ></Icon
                >{{ $t("addNew") }}</v-btn
              >
            </v-row>
          </v-col>
          <v-col cols="12" sm="6"
            ><v-text-field
              v-model="txtSearch"
              color="text-secondary"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              clearable
              density="compact"
              rounded="lg"
              :label="$t('Search')"
              :placeholder="$t('Search')"
            ></v-text-field
          ></v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
        <no-data></no-data>
      </template>
      <template v-slot:item.PRO_TYPE="{ item }: any">
        <code-to-text
          :data="
            utilStore.acGetCodetoText(
              projectStore.getProjectType,
              item.PRO_TYPE
            )
          "
        ></code-to-text>
      </template>
      <template v-slot:item.ADDRESS="{ item }: any">
        <div v-if="item.PRO_TYPE == 'A'">
          {{ item.ADDRESS }}
        </div>
        <a v-else target="_blank" :href="item.ADDRESS">{{ item.ADDRESS }}</a>
      </template>
      <template v-slot:item.PRO_STATUS="{ item }: any">
        <code-to-text
          :data="utilStore.acGetActiveUnactiveStatus(item.PRO_STATUS)"
        ></code-to-text>
      </template>
      <template v-slot:item.ACTION="{ item }: any">
        <v-btn
          variant="tonal"
          size="small"
          color="info"
          class="mx-1"
          @click="goToProjectDetail(item.PRO_ID)"
        >
          <Icon name="si:grid-view-duotone" class="text-info" />
        </v-btn>
        <v-btn
          variant="tonal"
          size="small"
          color="warning"
          class="mx-1"
          @click="goToAddNewItem(item.PRO_ID)"
        >
          <Icon name="fa7-regular:edit" class="text-warning" />
        </v-btn>
        <v-btn
          variant="tonal"
          size="small"
          color="error"
          class="ma-1"
          @click="onDeleteItem(item)"
        >
          <Icon name="mdi-light:delete" class="text-error" />
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth", "menu"],
});

const nuxtApp: any = useNuxtApp();
const route: any = useRoute();

//store

const projectStore = useProjectStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();

//paramitter

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const tableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "PRO_ID", align: "start" },
  { title: nuxtApp.$t("title"), key: "PRO_NAME_LA", align: "start" },
  {
    title: nuxtApp.$t("type"),
    key: "PRO_TYPE",
    align: "start",
  },
  {
    title: nuxtApp.$t("Address"),
    key: "ADDRESS",
    align: "start",
    width: 100,
  },
  {
    title: nuxtApp.$t("status"),
    key: "PRO_STATUS",
    align: "start",
  },
  {
    title: "",
    sortable: false,
    align: "center",
    key: "ACTION",
  },
]);

onMounted(async () => {
  await onLoadProjectList();
});

const goToAddNewItem = async (id: any) => {
  nuxtApp.$router.push("/project/addNew/" + id);
};

const onLoadProjectList = async () => {
  nuxtApp.$openLoading();
  await projectStore.acGetProjectList({ status: "", type: "" });
  dataList.value = projectStore.getProjectList;
  nuxtApp.$closeLoading();
};

const onDeleteItem = async (item: ProjectListModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var body = {
        project_id: item.PRO_ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await projectStore
        .acInsertProjectInfo(body)
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadProjectList();
              });
          } else {
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
          }
        });
    })
    .catch((c: any) => {});
};

const goToProjectDetail = async (id: any) => {
  nuxtApp.$router.push("/project/details/" + id);
};
</script>
