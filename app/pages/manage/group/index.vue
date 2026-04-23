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
          <v-col cols="12" sm="8" class="text-right">
            <v-row :align="'center'">
              <div class="px-4 text-left">
                <v-row class="ma-0" :align="'center'">
                  <Icon
                    name="material-symbols:table"
                    size="1.8rem"
                    class="mr-1"
                  />
                  <span class="text-title"><b>ຂໍ້ມູນກຸ່ມລະບົບ</b></span>
                </v-row>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                variant="tonal"
                class="mr-2"
                @click="goToAddnewItem"
                ><Icon
                  name="line-md:plus"
                  class="mr-1 text-success"
                  size="1.2rem"
                ></Icon
                >{{ $t("addNew") }}</v-btn
              >
            </v-row>
          </v-col>
          <v-col
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
      <template v-slot:item.GROUP_STATUS="{ item }: any">
        <code-to-text
          :data="utilStore.acGetActiveUnactiveStatus(item.GROUP_STATUS)"
        ></code-to-text>
      </template>
      <template v-slot:item.ACTION="{ item }: any">
        <v-row class="ma-0" justify="end">
          <v-btn
            variant="tonal"
            size="small"
            color="secondary"
            class="mr-1"
            @click="goToEditItem(item)"
          >
            <Icon name="fa7-regular:edit" class="text-warning" />
          </v-btn>

          <v-btn
            variant="tonal"
            size="small"
            color="error"
            @click="onDeleteItem(item)"
          >
            <Icon name="mdi-light:delete" class="text-error" />
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
    <!-- ADD NEW MODA -->
    <v-dialog v-model="addNewModal">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="0" rounded="lg">
            <v-card-title>
              <v-row class="ma-0" :align="'center'">
                <span>ເພີ່ມກຸ່ມໃໝ່</span><v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  size="x-small"
                  icon=""
                  color="error"
                  class="ma-1"
                  @click="addNewModal = false"
                >
                  <Icon name="ic:round-close" class="text-error" />
                </v-btn>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="overflow-auto" style="max-height: 75vh">
              <v-form ref="myForm">
                <v-text-field
                  v-model="txtName"
                  variant="outlined"
                  clearable
                  density="comfortable"
                  rounded="lg"
                  :rules="[(v) => $textFieldRule(v)]"
                  :label="$t('name')"
                ></v-text-field>
                <v-number-input
                  v-model="txtOrder"
                  :label="nuxtApp.$t('rowNum')"
                  control-variant="split"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                ></v-number-input>

                <v-radio-group inline :label="$t('status')" v-model="rbStatus">
                  <v-radio
                    v-for="(item, index) in utilStore.getActiveUnActiveStatus"
                    :label="item.TEXT"
                    :value="item.CODE"
                    :class="item.CLASS"
                  ></v-radio>
                </v-radio-group>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <div class="w-100">
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="lg"
                  class="w-100"
                  @click="onInsertItem"
                >
                  <Icon name="ic:sharp-search" class="text-white mr-1" />
                  <span>{{ $t("Save") }}</span>
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth", "menu"],
});

const nuxtApp: any = useNuxtApp();
const route: any = useRoute();

const projectStore = useProjectStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();

//paramitter

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const tableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "GROUP_ID", align: "start" },

  { title: nuxtApp.$t("name"), key: "GROUP_NAME", align: "start" },

  {
    title: nuxtApp.$t("order"),
    key: "GROUP_ORDER",
    align: "start",
  },

  {
    title: nuxtApp.$t("status"),
    key: "GROUP_STATUS",
    align: "center",
  },
  {
    title: "",
    sortable: false,
    align: "center",
    key: "ACTION",
  },
]);

const addNewModal = ref(false);
const myForm = ref();
const txtGroupId = ref("");
const txtName = ref("");
const txtOrder = ref(1);
const rbStatus = ref("A");
const action = ref(utilStore.getActnoCode.INSERT);

onMounted(async () => {
  await onLoadProjectGroupList();
});

const onLoadProjectGroupList = async () => {
  nuxtApp.$openLoading();
  await projectStore.acGetProjectGroup({
    status: "",
  });
  dataList.value = projectStore.getProjecGroup;
  addNewModal.value = false;
  nuxtApp.$closeLoading();
};

const goToAddnewItem = async () => {
  txtGroupId.value = "";
  txtName.value = "";
  txtOrder.value = 1;
  rbStatus.value = "A";
  action.value = utilStore.getActnoCode.INSERT;
  addNewModal.value = true;
};
const goToEditItem = async (item: ProjectGroupModel) => {
  txtGroupId.value = item.GROUP_ID.toString();
  txtName.value = item.GROUP_NAME;
  txtOrder.value = item.GROUP_ORDER;
  rbStatus.value = item.GROUP_STATUS;
  action.value = utilStore.getActnoCode.UPDATE;
  addNewModal.value = true;
};

const onInsertItem = async () => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    nuxtApp.$openLoading();
    await projectStore
      .acInsertProjectGroup({
        group_id: txtGroupId.value,
        group_name: txtName.value,
        order: txtOrder.value,
        status: rbStatus.value,
        user: loginStore.loginUser?.USER_NAME,
        action: action.value,
      })
      .then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();
        if (result.ERROR_CODE == "00") {
          nuxtApp.$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC);
          await onLoadProjectGroupList();
        } else {
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      });
  }
};

const onDeleteItem = async (item: ProjectGroupModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await projectStore
        .acInsertProjectGroup({
          group_id: item.GROUP_ID,
          action: utilStore.getActnoCode.DELETE,
        })
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp.$openAlert(
              "S",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
            await onLoadProjectGroupList();
          } else {
            nuxtApp.$openAlert(
              "E",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
          }
        });

      nuxtApp.$closeLoading();
    })
    .catch((c: any) => {});
};
</script>
