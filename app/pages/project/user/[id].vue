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
                    <span class="text-title"><b>ຂໍ້ມູນຜູ້ໃຊ້ລະບົບ</b></span>
                  </v-row>
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  variant="tonal"
                  class="mr-2"
                  @click="employeeModal=true"
                  ><Icon
                    name="hugeicons:user"
                    class="mr-1 text-primary"
                    size="1.2rem"
                  ></Icon
                  >ຄົ້ນຫາພະນັກງານ</v-btn
                >
                <v-btn
                  color="success"
                  variant="tonal"
                  class="mr-2"
                  @click="goToAddNewItem()"
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
          <v-chip label>
            <span class="text-primary">{{ item.ROLE_NAME_LA }}</span>
          </v-chip>
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
            <h4>ເພີ່ມຂໍ້ມູນເຂົ້າລະບົບ</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row class="ma-0">
              <v-text-field
                v-model="txtSearchUserName"
                label="ຫັດພະນັກງານ"
                :placeholder="'ຄົ້ນຫາລະຫັດພະນັກງານ CSE000'"
                persistent-hint
                rounded="lg"
                variant="outlined"
                density="comfortable"
                class="py-1"
                @keyup.enter="onSearchEmployeeByID"
              ></v-text-field>
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="ma-2"
                @click="onSearchEmployeeByID"
              >
                <Icon name="ic:sharp-search" class="text-white mr-1" />
                <span>{{ $t("Search") }}</span>
              </v-btn>
            </v-row>

            <div v-if="employeeSelected" class="mb-4">
              <div class="mb-2">
                <v-avatar color="grey" size="100" class="ml-2">
                  <v-img
                    :src="nuxtApp.$profilePath(employeeSelected?.PICTURE)"
                    cover
                    ><template v-slot:placeholder>
                      <v-row
                        :align="'center'"
                        class="fill-height ma-0"
                        justify="center"
                      >
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
                </v-avatar>
              </div>
              <v-row class="ma-0"
                ><v-chip label :color="'primary'"
                  ><b>{{ employeeSelected?.USER_NAME }}</b></v-chip
                >
                <div class="px-2">
                  <p>{{ employeeSelected?.FULL_NAME_LA }}</p>
                  <p>{{ employeeSelected?.FULL_NAME_EN }}</p>
                </div></v-row
              >
              <div class="mt-4">
                <p>
                  <span class="text-secondary">{{ $t("positionLevel") }}:</span>
                  {{ employeeSelected?.POS_NAME }}
                </p>
                <p>
                  <span class="text-secondary">{{ $t("position") }}:</span>
                  {{ employeeSelected?.POS_DESC }}
                </p>
                <p>
                  <span class="text-secondary">{{ $t("team") }}:</span>
                  {{ employeeSelected?.TEAM_NAME }}
                </p>
                <p>
                  <span class="text-secondary">{{ $t("section") }}:</span>
                  {{ employeeSelected?.SEC_NAME }}
                </p>
                <p>
                  <span class="text-secondary">{{ $t("branch") }}:</span>
                  {{ employeeSelected?.BR_NAME }}
                </p>
              </div>
            </div>
            <v-combobox
              v-model="roleSelected"
              :items="roleStore.getRoleList"
              density="comfortable"
              rounded="lg"
              aria-autocomplete="off"
              item-title="ROLE_NAME_LA"
              item-value="ROLE_ID"
              :label="'ສິດເຂົ້າໃຊ້ລະບົບ'"
              color="primary"
              variant="outlined"
            ></v-combobox>
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
  <v-dialog v-model="employeeModal">
    <v-row :justify="'center'">
      <v-col cols="12" lg="11">
        <v-card elevation="0" rounded="xl">
          <v-card-title class="text-center">
            <h4>ຄົ້ນຫາພະນັກງານ</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" style="height: 80vh">
            <v-row class="ma-0">
              <v-col cols="12" md="3">
                <v-combobox
                  v-model="branchSelected"
                  :items="empOrgList"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  aria-autocomplete="none"
                  item-title="BR_NAME"
                  item-value="BR_CODE"
                  :label="$t('branch')"
                  color="primary"
                  @update:model-value="
                    sectionSelected = null;
                    teamSelected = null;
                  "
                ></v-combobox>

                <v-combobox
                  v-model="sectionSelected"
                  :items="branchSelected ? branchSelected.SECTION_LIST : []"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  item-title="SEC_NAME"
                  item-value="SECTION_ID"
                  :label="$t('section')"
                  aria-autocomplete="none"
                  @update:model-value="teamSelected = null"
                  color="primary"
                ></v-combobox>

                <v-combobox
                  v-model="teamSelected"
                  :items="sectionSelected ? sectionSelected.TEAM_LIST : []"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  aria-autocomplete="none"
                  item-title="TEAM_NAME"
                  item-value="TEAM_ID"
                  :label="$t('team')"
                  color="primary"
                ></v-combobox>

                <v-combobox
                  v-model="positionSelected"
                  :items="orgStore.getPositionList"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  aria-autocomplete="none"
                  item-title="POS_NAME"
                  item-value="POS_ID"
                  :label="$t('position')"
                  color="primary"
                ></v-combobox>

                <v-text-field
                  v-model="txtSearchUserName"
                  color="text-secondary"
                  variant="outlined"
                  clearable
                  density="comfortable"
                  rounded="lg"
                  :label="$t('UserName')"
                  placeholder="CSE000,CSE000"
                ></v-text-field>
                <v-btn
                  color="primary"
                  variant="flat"
                  rounded="lg"
                  class="w-100"
                  @click="onLoadEmployee"
                >
                  <Icon name="ic:sharp-search" class="text-white mr-1" />
                  <span>{{ $t("Search") }}</span>
                </v-btn>
              </v-col>
              <v-col>
                <v-data-table
                  :search="txtSearchEmployee"
                  :headers="employeeTableHeaders"
                  :items="employeeList"
                  class="rounded-xl custom-table-header"
                  density="comfortable"
                  :items-per-page-text="$t('itemShowing')"
                  :mobile="nuxtApp.$isMobile($vuetify, ['XS', 'SM', 'MD'])"
                >
                  <template v-slot:top="">
                    <v-row class="ma-0 mt-2" :align="'center'" justify="end">
                      <v-col cols="12" sm="6" md="4" lg="3"
                        ><v-text-field
                          v-model="txtSearchEmployee"
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
                    <div
                      v-if="dataList.filter((el:any)=>el.USER_NAME.toLowerCase()==item.USER_NAME.toLowerCase()).length>0"
                    >
                      <v-chip
                        label
                        @click="
                          onEditItem(
                            dataList.filter(
                              (el: any) =>
                                el.USER_NAME.toLowerCase() ==
                                item.USER_NAME.toLowerCase()
                            )[0]
                          )
                        "
                      >
                        <span class="text-primary">{{
                          dataList.filter(
                            (el: any) =>
                              el.USER_NAME.toLowerCase() ==
                              item.USER_NAME.toLowerCase()
                          )[0].ROLE_NAME_LA
                        }}</span>
                      </v-chip>
                    </div>
                    <div v-else>
                      <v-btn
                        variant="tonal"
                        size="small"
                        color="success"
                        class="mx-1"
                        @click="onSelectEmployeeToAddNew(item)"
                      >
                        <Icon
                          name="fa7-regular:edit"
                          class="text-success mr-1"
                        />
                        <span>ເພີ່ມສິດ</span>
                      </v-btn>
                    </div>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              variant="tonal"
              rounded="lg"
              @click="employeeModal = false"
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
const employeeStore = useEmployeeStore();
const orgStore = useOrgStore();

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const tableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "USER_NAME", align: "start" },

  {
    title: nuxtApp.$t("role"),
    key: "ROLE_NAME_LA",
    align: "start",
  },
  { title: nuxtApp.$t("name"), key: "FULL_NAME_LA", align: "start" },
  {
    title: nuxtApp.$t("position"),
    key: "POS_NAME",
    align: "start",
  },
  {
    title: nuxtApp.$t("branch"),
    key: "BR_NAME",
    align: "start",
  },
  {
    title: nuxtApp.$t("section"),
    key: "SEC_NAME",
    align: "start",
  },
  {
    title: nuxtApp.$t("team"),
    key: "TEAM_NAME",
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
const employeeSelected = ref<EmployeeModel | null>();
const roleSelected = ref<RoleModel>();
const txtSearchUserName = ref("");
const action = ref(utilStore.getActnoCode.INSERT);
const userRoleSelected = ref<UserRoleModel>();

const empOrgList = ref([]);
const branchSelected = ref();
const sectionSelected = ref();
const teamSelected = ref();
const positionSelected = ref();

const employeeModal = ref(false);
const txtSearchEmployee = ref("");
const employeeList = ref<EmployeeModel[]>([]);
const employeeTableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "USER_NAME", align: "start" },

  {
    title: nuxtApp.$t("role"),
    key: "ROLE_NAME_LA",
    align: "start",
  },
  { title: nuxtApp.$t("name"), key: "FULL_NAME_LA", align: "start" },
  {
    title: nuxtApp.$t("position"),
    key: "POS_NAME",
    align: "start",
  },
  {
    title: nuxtApp.$t("branch"),
    key: "BR_NAME",
    align: "start",
  },
  {
    title: nuxtApp.$t("section"),
    key: "SEC_NAME",
    align: "start",
  },
  {
    title: nuxtApp.$t("team"),
    key: "TEAM_NAME",
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
  await onInitLoading();
  await onLoadUserRole();
  await onLoadRoleList();
  await orgStore.acGetOrganizationList({});
  empOrgList.value = orgStore.getOrgList;
  await orgStore.acGetPositionList({});
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

const goToAddNewItem = async () => {
  action.value = utilStore.getActnoCode.INSERT;
  addNewModal.value = true;
};

const onLoadUserRole = async () => {
  nuxtApp.$openLoading();
  await roleStore.acGetRoleDetailList({
    project_id: itemSelected.value?.PRO_ID,
    role_id: "",
  });
  dataList.value = roleStore.getUserRoleList;
  addNewModal.value = false;
  nuxtApp.$closeLoading();
};

const onLoadRoleList = async () => {
  nuxtApp.$openLoading();
  await roleStore.acGetRoleList({
    project_id: itemSelected.value?.PRO_ID,
  });
  nuxtApp.$closeLoading();
};

const onSearchEmployeeByID = async () => {
  employeeSelected.value = null;
  if (txtSearchUserName.value.trim().length > 0) {
    nuxtApp.$openLoading();
    await employeeStore.acGetEmployeeList({
      user: txtSearchUserName.value.trim(),
    });
    if (employeeStore.getEmployeeList.length > 0) {
      employeeSelected.value = employeeStore.getEmployeeList[0];
    }
    nuxtApp.$closeLoading();
  }
};

const onSelectEmployeeToAddNew = async (item: EmployeeModel) => {
  await goToAddNewItem();

  employeeSelected.value = item;
};

const onLoadEmployee = async () => {
  const org = {
    team_id: teamSelected.value ? teamSelected.value.TEAM_ID : "",
    section_id: sectionSelected.value ? sectionSelected.value.SECTION_ID : "",
    branch_code: branchSelected.value ? branchSelected.value.BR_CODE : "",
    pos_id: positionSelected.value ? positionSelected.value.POS_ID : "",
    user: txtSearch.value,
  };
  nuxtApp.$openLoading();
  await employeeStore.acGetEmployeeList(org);
  employeeList.value = employeeStore.getEmployeeList;
  nuxtApp.$closeLoading();
};

const onEditItem = async (item: UserRoleModel) => {
  userRoleSelected.value = item;
  action.value = utilStore.getActnoCode.UPDATE;
  txtSearchUserName.value = item.USER_NAME;
  var a = roleStore.getRoleList.filter((el) => el.ROLE_ID == item.ROLE_ID);
  if (a.length > 0) {
    roleSelected.value = a[0];
    await onSearchEmployeeByID();
    addNewModal.value = true;
  } else {
    nuxtApp.$openAlert("E", "No Role data");
  }
};

const onInserUpdateItem = async (item: UserRoleModel) => {
  var body = {
    id: userRoleSelected.value?.ID,
    user_name: employeeSelected.value?.USER_NAME,
    role_id: roleSelected.value?.ROLE_ID,
    action: action.value,
  };
  nuxtApp.$openLoading();
  await roleStore.acInsertUserRole(body).then(async (result: ResponseModel) => {
    nuxtApp.$closeLoading();
    if (result.ERROR_CODE == "00") {
      nuxtApp
        .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
        .then(async (r: any) => {
          await onLoadUserRole();
        });
    } else {
      nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
    }
  });
};

const onDeleteItem = async (item: UserRoleModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var body = {
        id: item.ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await roleStore
        .acInsertUserRole(body)
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadUserRole();
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
</script>
