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
                  <span class="text-title"><b>ຂໍ້ມູນຜູ້ໃຊ້ລະບົບ</b></span>
                </v-row>
              </div>
              <v-spacer></v-spacer>
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

      <template v-slot:item.USER_NAME="{ item }: any">
        <v-chip label color="primary">
          {{ item.USER_NAME }}
        </v-chip>
      </template>

      <template v-slot:item.USER_STATUS="{ item }: any">
        <v-radio-group
          inline
          v-model="item.USER_STATUS"
          hide-details
          justify="end"
          @update:model-value="onUpdateStatus(item)"
        >
          <v-spacer></v-spacer>
          <div>
            <v-radio
              v-for="r in utilStore.getActiveUnActiveNumberStatus"
              :label="r.TEXT"
              :value="Number(r.CODE)"
              :class="r.CLASS"
            ></v-radio>
          </div>
        </v-radio-group>
      </template>

      <template v-slot:item.ACTION="{ item }: any">
        <v-row class="ma-0" justify="end">
          <v-tooltip text="Unlock">
            <template v-slot:activator="{ props }">
              <v-btn
                :variant="item.IS_LOCK == 1 ? 'flat' : 'tonal'"
                size="small"
                :color="item.IS_LOCK == 1 ? 'warning' : 'success'"
                class="ma-1"
                @click="onUnlockUser(item)"
                v-bind="props"
              >
                <Icon
                  name="circum:unlock"
                  :class="item.IS_LOCK == 1 ? 'text-white' : 'text-success'"
                />
              </v-btn>
            </template>
          </v-tooltip>
          <pages-user-reset-password-modal
            v-if="nuxtApp.$isAdmin(loginStore.loginUser?.ROLE_CODE)"
            :item="item"
            @on-success="onLoadUserLoginList"
          ></pages-user-reset-password-modal>
          <pages-user-change-password-modal
            :item="item"
            @on-success="onLoadUserLoginList"
          ></pages-user-change-password-modal>

          <v-tooltip text="Reset ເປັນລະຫັດຜ່ານເລີ່ມຕົ້ນ">
            <template v-slot:activator="{ props }">
              <v-btn
                :variant="'tonal'"
                size="small"
                :color="'error'"
                class="ma-1"
                @click="onResetPasswordToDefault(item)"
                v-bind="props"
              >
                <Icon
                  name="fluent:password-reset-48-regular"
                  :class="'text-error'"
                />
              </v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="Reset all device code">
            <template v-slot:activator="{ props }">
              <v-btn
                :variant="'tonal'"
                size="small"
                :color="'success'"
                class="ma-1"
                @click="onResetDeviceCode(item)"
                v-bind="props"
              >
                <Icon
                  name="ix:generic-device-refresh"
                  :class="'text-success'"
                />
              </v-btn>
            </template>
          </v-tooltip>
        </v-row>
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

const userStore = useUserStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();

//paramitter

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);
const tableHeaders: any = ref([
  { title: nuxtApp.$t("id"), key: "USER_NAME", align: "start" },

  { title: nuxtApp.$t("name"), key: "FULL_NAME_LA", align: "start" },

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
    title: nuxtApp.$t("status"),
    key: "USER_STATUS",
    align: "center",
  },
  {
    title: "",
    sortable: false,
    align: "center",
    key: "ACTION",
  },
]);

onMounted(async () => {
  await onLoadUserLoginList();
});

const onLoadUserLoginList = async () => {
  nuxtApp.$openLoading();
  await userStore.acGetUserLoginList({
    user_name: "",
    pos_id: "",
    team_id: "",
    section_id: "",
    branch_code: "",
    status: "",
  });
  dataList.value = userStore.getUserLoginList;
  nuxtApp.$closeLoading();
};

const onUpdateStatus = async (item: UserLoginModel) => {
  nuxtApp.$openLoading();
  await userStore
    .acInsertUpdateUserLoginList({
      user_name: item.USER_NAME,
      attempts: item.MAX_ATTEMPTS,
      status: item.USER_STATUS,
      action: utilStore.getActnoCode.UPDATE,
    })
    .then(async (result: ResponseModel) => {
      nuxtApp.$closeLoading();
      if (result.ERROR_CODE == "00") {
        await onLoadUserLoginList();
      } else {
        nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
      }
    });
  nuxtApp.$closeLoading();
};

const onUnlockUser = async (item: UserLoginModel) => {
  nuxtApp
    .$openAlert("Q", "ທ່ານຕ້ອງການ Unlock ແທ້ບໍ?")
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await userStore
        .acUnlockUserLogin({
          user_name: item.USER_NAME,
        })
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadUserLoginList();
              });
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

const onResetDeviceCode = async (item: UserLoginModel) => {
  nuxtApp
    .$openAlert("Q", "ທ່ານຕ້ອງການ Reset ແທ້ບໍ?")
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await userStore
        .acResetDeviceCode({
          project_id: nuxtApp.$env.projectID,
          user_name: item.USER_NAME,
        })
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadUserLoginList();
              });
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
const onResetPasswordToDefault = async (item: UserLoginModel) => {
  nuxtApp
    .$openAlert("Q", "ທ່ານຕ້ອງການ Reset ແທ້ບໍ?")
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await userStore
        .acResetPasswordUserLogin({
          project_id: nuxtApp.$env.projectID,
          user_name: item.USER_NAME,
          new_password: "123456",
          confirm_password: "123456",
        })
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadUserLoginList();
              });
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
