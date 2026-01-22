<template>
  <v-container fluid>
    <v-row class="ma-0 mt-2" :align="'center'" justify="end">
      <v-col cols="12" sm="6" lg="8" class="text-right">
        <v-row :align="'center'">
          <div class="px-4 text-left">
            <v-row class="ma-0" :align="'center'">
              <Icon name="material-symbols:table" size="1.8rem" class="mr-1" />
              <span class="text-title"><b>ຂໍ້ມູນລະບົບ</b></span>
            </v-row>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="tonal"
            class="mr-2"
            rounded="lg"
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
      <v-col cols="12" sm="6" lg="4"
        ><v-text-field
          v-model="txtSearch"
          color="primary"
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
    <v-data-iterator
      :items="dataList"
      :page="page"
      :items-per-page="itemsPerPage"
    >
      <template #no-data>
        <div class="text-center">
          <no-data></no-data>
        </div>
      </template>
      <template v-slot:default="{ items }: any">
        <v-row>
          <v-col cols="12" sm="6" lg="4" v-for="(item, i) in items" :key="i">
            <v-card v-bind="item" rounded="lg" elevation="0">
              <v-card-title> </v-card-title>

              <v-card-text>
                <div class="text-center">
                  <h2>{{ item.raw.PRO_NAME_LA }}</h2>
                  <p class="text-secondary">{{ item.raw.PRO_NAME_EN }}</p>
                </div>
                <v-table density="compact">
                  <tbody>
                    <tr>
                      <td>{{ nuxtApp.$t("id") }}:</td>

                      <td class="text-right"><v-chip label><h4 class="text-primary">{{ item.raw.PRO_ID }}</h4></v-chip></td>
                    </tr>

                    <tr>
                      <td>{{ nuxtApp.$t("type") }}:</td>

                      <td class="text-right">
                        <code-to-text
                          :data="
                            utilStore.acGetCodetoText(
                              projectStore.getProjectType,
                              item.raw.PRO_TYPE
                            )
                          "
                        ></code-to-text>
                      </td>
                    </tr>

                    <tr>
                      <td>{{ nuxtApp.$t("Address") }}:</td>

                      <td class="text-right">
                        <div v-if="item.raw.PRO_TYPE == 'A'">
                          <v-textarea
                            variant="plain"
                            density="compact"
                            :value="item.raw.ADDRESS"
                            class="w-100"
                            max-rows="1"
                            :rows="1"
                            readonly
                          ></v-textarea>
                          <!-- {{ item.raw.ADDRESS }} -->
                        </div>
                        <a v-else target="_blank" :href="item.raw.ADDRESS">{{
                          item.raw.ADDRESS
                        }}</a>
                      </td>
                    </tr>

                    <tr>
                      <td>{{ nuxtApp.$t("status") }}:</td>

                      <td class="text-right">
                        <code-to-text
                          :data="
                            utilStore.acGetActiveUnactiveStatus(
                              item.raw.PRO_STATUS
                            )
                          "
                        ></code-to-text>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <v-divider></v-divider>
                <v-row class="mx-0 mt-2 mb-0" :align="'center'" justify="end">
                  <v-btn
               
                    variant="tonal"
                    size="small"
                    color="secondary"
                    class="mr-1"
                    @click="goToProjectDetail(item.raw.PRO_ID)"
                  >
                    <Icon name="hugeicons:view" class="text-info" />
                  </v-btn>
                  <v-btn
                
                    variant="tonal"
                    size="small"
                    color="secondary"
                    class="mr-1"
                    @click="goToAddNewItem(item.raw.PRO_ID)"
                  >
                    <Icon name="fa7-regular:edit" class="text-warning" />
                  </v-btn>
                  <v-btn
              
                    variant="tonal"
                    size="small"
                    color="secondary"
                    class="mr-1"
                    @click="onDeleteItem(item.raw)"
                  >
                    <Icon name="mdi-light:delete" class="text-error" />
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-slot:footer="{ pageCount }">
        <v-pagination
          v-model="page"
          :length="pageCount"
          density="compact"
          class="mt-4"
        ></v-pagination>
      </template>
    </v-data-iterator>

    <!-- <v-data-table
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
    </v-data-table> -->
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
const itemsPerPage = ref(9);

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
