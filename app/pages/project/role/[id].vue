<template>
  <v-container fluid>
    <v-row class="ma-0">
      <v-btn variant="text" @click="$router.back()">
        <div class="d-flex align-center">
          <Icon name="material-symbols:arrow-back-2" class="mr-1" />
          {{ $t("back") }}
        </div>
      </v-btn>
      <v-spacer></v-spacer>
    </v-row>
    <div class="py-2">
      <v-data-table
        :search="txtSearch"
        :headers="tableHeaders"
        :items="dataList"
        class="rounded-xl custom-table-header m-shadow"
        density="comfortable"
        v-model:page="page"
        :items-per-page="itemsPerPage"
        :items-per-page-text="$t('itemShowing')"
        :mobile="nuxtApp.$isMobile($vuetify, ['XS', 'SM'])"
      >
        <template v-slot:top="">
          <v-row class="ma-0 mt-2" :align="'center'" justify="end">
            <v-col class="text-right">
              <v-row :align="'center'">
                <div class="px-4 text-left">
                  <v-row class="ma-0" :align="'center'">
                    <Icon
                      name="material-symbols:table"
                      size="1.8rem"
                      class="mr-1"
                    />
                    <span class="text-title"
                      ><b>ຂໍ້ມູນສິດເຂົ້າໃຊ້ລະບົບ</b></span
                    >
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
            <v-col cols="12" sm="6" md="4" lg="3"
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

        <template v-slot:item.ROLE_NAME_LA="{ item }: any">
          <p>{{ item.ROLE_NAME_LA }}</p>
          <p class="text-secondary">{{ item.ROLE_NAME_EN }}</p>
        </template>
        <template v-slot:item.ROLE_CODE="{ item }: any">
          <v-chip label>
            <span class="text-primary">{{ item.ROLE_CODE }}</span>
          </v-chip>
        </template>
        <template v-slot:item.IS_DEFAULT="{ item }: any">
          <Icon
            v-if="item.IS_DEFAULT == 1"
            name="mingcute:check-2-line"
            class="text-success"
          />

          <Icon v-else name="ic:round-close" class="text-error" />
        </template>

        <template v-slot:item.ACTION="{ item }: any">
          <v-btn
            variant="tonal"
            size="small"
            color="warning"
            class="mx-1"
            @click="onEditItem(item)"
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
    </div>
  </v-container>
  <v-dialog v-model="addNewModal">
    <v-row :justify="'center'">
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="0" rounded="xl">
          <v-card-title class="text-center">
            <h4>ເພີ່ມສິດເຂົ້າໃຊ້ລະບົບ</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="myForm" class="pa-0">
              <v-text-field
                v-model="txtRoleCode"
                label="Role code"
                persistent-hint
                rounded="lg"
                :rules="[(v) => $textFieldRule(v)]"
                variant="outlined"
                density="comfortable"
                class="py-1"
              ></v-text-field>
              <v-text-field
                v-model="txtNameLa"
                :label="$t('name')"
                persistent-hint
                rounded="lg"
                :rules="[(v) => $textFieldRule(v)]"
                variant="outlined"
                density="comfortable"
                class="py-1"
              ></v-text-field>
              <v-text-field
                v-model="txtNameEn"
                :label="$t('name') + ' (EN)'"
                persistent-hint
                rounded="lg"
                variant="outlined"
                density="comfortable"
                class="py-1"
              ></v-text-field>

              <v-row :align="'center'">
                <v-col cols="12" sm="6">
                  <v-number-input
                    v-model="txtOrder"
                    :label="nuxtApp.$t('rowNum')"
                    control-variant="split"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                  ></v-number-input>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-radio-group
                    inline
                    label="ສິດເລີ່ມຕົ້ນ"
                    v-model="rbDefault"
                  >
                    <v-radio label="No" :value="0" color="error"></v-radio>
                    <v-radio label="Yes" :value="1" color="success"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              variant="tonal"
              rounded="lg"
              @click="onInserUpdateItem"
            >
              <Icon name="material-symbols:save-rounded" class="text-success" />
              <span>{{ $t("Save") }}</span>
            </v-btn>

            <v-btn
              color="error"
              variant="tonal"
              rounded="lg"
              @click="addNewModal = false"
            >
              <Icon name="mingcute:close-fill" class="text-error" />
              <span>{{ $t("Cancel") }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth"],
});

const nuxtApp: any = useNuxtApp();
const route: any = useRoute();

const projectStore = useProjectStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();
const roleStore = useRoleStore();

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const tableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "ROLE_ID", align: "start" },
  {
    title: nuxtApp.$t("role"),
    key: "ROLE_CODE",
    align: "start",
  },
  {
    title: nuxtApp.$t("name"),
    key: "ROLE_NAME_LA",
    align: "start",
  },

  {
    title: nuxtApp.$t("rowNum"),
    key: "ROLE_ORDER",
    align: "start",
  },
  {
    title: "ສິດເລີ່ມຕົ້ນ",
    key: "IS_DEFAULT",
    align: "start",
  },

  {
    title: "",
    sortable: false,
    align: "center",
    key: "ACTION",
  },
]);

const itemSelected = ref<ProjectListModel>();
const addNewModal = ref(false);
const roleSelected = ref<RoleModel>();
const action = ref(utilStore.getActnoCode.INSERT);

const myForm = ref();
const txtNameLa = ref();
const txtNameEn = ref();
const txtRoleCode = ref();
const txtOrder = ref(1);
const rbDefault = ref(0);

onMounted(async () => {
  await onInitLoading();

  await onLoadRoleList();
});

const onInitLoading = async () => {
  if (projectStore.getProjectList.length <= 0) {
    await onLoadProjectList();
  }
  var a = projectStore.getProjectList.filter(
    (el) => el.PRO_ID == route.params.id
  );
  if (a.length > 0) {
    var item = a[0];
    itemSelected.value = item;
  } else {
    nuxtApp.$openAlert("E", "No project info").then(async (r: any) => {
      nuxtApp.$router.back();
    });
    return;
  }
};

const onLoadProjectList = async () => {
  nuxtApp.$openLoading();
  await projectStore.acGetProjectList({ status: "", type: "" });
  nuxtApp.$closeLoading();
};

const goToAddNewItem = async (id: any) => {
  txtRoleCode.value = "";
  txtNameLa.value = "";
  txtNameEn.value = "";
  txtOrder.value = 1;
  rbDefault.value = 0;
  action.value = utilStore.getActnoCode.INSERT;
  addNewModal.value = true;
};

const onLoadRoleList = async () => {
  nuxtApp.$openLoading();
  await roleStore.acGetRoleList({
    project_id: itemSelected.value?.PRO_ID,
  });
  dataList.value = roleStore.getRoleList;
  addNewModal.value = false;
  nuxtApp.$closeLoading();
};

const onEditItem = async (item: RoleModel) => {
  roleSelected.value = item;
  txtRoleCode.value = item.ROLE_CODE;
  txtNameLa.value = item.ROLE_NAME_LA;
  txtNameEn.value = item.ROLE_NAME_EN;
  txtOrder.value = item.ROLE_ORDER;
  rbDefault.value = item.IS_DEFAULT;
  action.value = utilStore.getActnoCode.UPDATE;
  addNewModal.value = true;
};

const onInserUpdateItem = async (item: UserRoleModel) => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    var body = {
      role_id: roleSelected.value?.ROLE_ID,
      project_id: itemSelected.value?.PRO_ID,
      name_la: txtNameLa.value,
      name_en: txtNameEn.value,
      role_code: txtRoleCode.value,
      order: txtOrder.value,
      is_default: rbDefault.value,
      action: action.value,
    };
    nuxtApp.$openLoading();
    await roleStore.acInsertRole(body).then(async (result: ResponseModel) => {
      nuxtApp.$closeLoading();
      if (result.ERROR_CODE == "00") {
        nuxtApp
          .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
          .then(async (r: any) => {
            await onLoadRoleList();
          });
      } else {
        nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
      }
    });
  }
};

const onDeleteItem = async (item: UserRoleModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var body = {
        role_id: item.ROLE_ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await roleStore.acInsertRole(body).then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();
        if (result.ERROR_CODE == "00") {
          nuxtApp
            .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
            .then(async (r: any) => {
              await onLoadRoleList();
            });
        } else {
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      });
    })
    .catch((c: any) => {});
};
</script>
