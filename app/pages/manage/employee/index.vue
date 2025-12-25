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
                  <span class="text-title"><b>ຂໍ້ມູນຄຸ້ມຄອງພະນັກງານ</b></span>
                </v-row>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                variant="tonal"
                class="mr-2"
                @click="searchEmployeeModal=true"
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

      <template v-slot:item.ACTION="{ item }: any">
        <v-btn
          variant="tonal"
          size="small"
          color="info"
          class="mx-1"
          @click="goToEmployeeDetail(item)"
        >
          <Icon name="si:grid-view-duotone" class="text-info" />
        </v-btn>

        <v-btn variant="tonal" size="small" color="error" class="ma-1">
          <Icon name="mdi-light:delete" class="text-error" />
        </v-btn>
      </template>
    </v-data-table>
  </v-container>

  <!-- SEARCH EMPLOYEE -->
  <v-dialog v-model="searchEmployeeModal">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title>
            <v-row class="ma-0" :align="'center'">
              <span>ຄົ້ນຫາພະນັກງານ</span><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="searchEmployeeModal = false"
              >
                <Icon name="ic:round-close" class="text-error" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" style="max-height: 75vh">
            <div v-if="employeeSearchList.length <= 0" class="text-center">
              <no-data></no-data>
            </div>
            <div v-else class="mb-4">
              <v-row
                class="ma-0"
                :align="'start'"
                v-for="emp in employeeSearchList"
              >
                <div class="mb-2">
                  <div>
                    <v-avatar color="grey" size="80" class="mt-4">
                      <v-img :src="nuxtApp.$profilePath(emp?.PICTURE)" cover
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

                  <div class="text-center pt-2">
                    <p :class="'text-secondary'">
                      <b>{{ emp?.USER_NAME }}</b>
                    </p>
                  </div>
                </div>
                <v-col class="py-0">
                  <v-row class="ma-0" :align="'center'">
                    <v-col class="px-2">
                      <p>{{ emp?.FULL_NAME_LA }}</p>
                      <p>{{ emp?.FULL_NAME_EN }}</p>
                    </v-col>
                    <v-btn
                      variant="tonal"
                      size="small"
                      icon=""
                      color="success"
                      class="ma-1"
                      @click="goToAddNew(emp)"
                    >
                      <Icon
                        name="mingcute:check-2-line"
                        class="text-success"
                      /> </v-btn
                  ></v-row>
                  <div>
                    <p>
                      <span class="text-secondary"
                        >{{ $t("positionLevel") }}:</span
                      >
                      {{ emp?.POS_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("position") }}:</span>
                      {{ emp?.POS_DESC }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("team") }}:</span>
                      {{ emp?.TEAM_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("section") }}:</span>
                      {{ emp?.SEC_NAME }}
                    </p>
                    <p>
                      <span class="text-secondary">{{ $t("branch") }}:</span>
                      {{ emp?.BR_NAME }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <div class="w-100">
              <v-text-field
                v-model="txtSearchUserName"
                color="text-secondary"
                variant="outlined"
                clearable
                density="comfortable"
                rounded="lg"
                :label="$t('UserName')"
                placeholder="CSE000,CSE000"
                @keyup.enter="onSearchEmployee"
              ></v-text-field>
              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="w-100"
                @click="onSearchEmployee"
              >
                <Icon name="ic:sharp-search" class="text-white mr-1" />
                <span>{{ $t("Search") }}</span>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth", "menu"],
});

const nuxtApp: any = useNuxtApp();
const route: any = useRoute();

const orgStore = useOrgStore();
const loginStore = useLoginStore();
const employeeStore = useEmployeeStore();

//paramitter

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const tableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "USER_NAME", align: "start" },

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
  await onLoadOrgManagementList();
});

const onLoadOrgManagementList = async () => {
  nuxtApp.$openLoading();
  await orgStore.acGetOrgManagementList({
    user_name: "",
    pos_id: "",
    team_id: "",
    section_id: "",
    branch_code: "",
  });
  dataList.value = orgStore.getOrgManagementList;
  nuxtApp.$closeLoading();
};

const goToEmployeeDetail = async (item: OrgManagementListModel) => {
  nuxtApp.$router.push("/manage/employee/details/" + item.USER_NAME);
};

// SEARCH EMPLOYEE
const searchEmployeeModal = ref(false);
const txtSearchUserName = ref("");
const employeeSearchList = ref<EmployeeModel[]>([]);

const onSearchEmployee = async () => {
  nuxtApp.$openLoading();
  await employeeStore.acGetEmployeeList({
    user: txtSearchUserName.value,
  });
  employeeSearchList.value = employeeStore.getEmployeeList;
  nuxtApp.$closeLoading();
};

const goToAddNew = async (item: EmployeeModel) => {
  nuxtApp.$router.push("/manage/employee/details/" + item.USER_NAME);
};
</script>
