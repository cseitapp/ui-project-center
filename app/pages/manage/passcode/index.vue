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
              <!-- <v-btn
                color="success"
                variant="tonal"
                class="mr-2"
                @click="searchEmployeeModal = true"
                ><Icon
                  name="line-md:plus"
                  class="mr-1 text-success"
                  size="1.2rem"
                ></Icon
                >{{ $t("addNew") }}</v-btn
              > -->
              <pages-passcode-addnew-modal
                @on-success="onLoadPasscodeList"
              ></pages-passcode-addnew-modal>
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

      <template v-slot:item.PUREPOSE="{ item }: any">
        <v-chip label color="primary">
          {{ item.PUREPOSE }}
        </v-chip>
      </template>

      <template v-slot:item.PASSCODE_STATUS="{ item }: any">
        <v-radio-group
          inline
          v-model="item.PASSCODE_STATUS"
          hide-details
          @update:model-value="onUpdateStatus(item)"
          justify="end"
        >
          <v-spacer></v-spacer>
          <div>
            <v-radio
              v-for="r in utilStore.getActiveUnActiveStatus"
              :label="r.TEXT"
              :value="r.CODE"
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
                :variant="item.IS_LOCKED == 1 ? 'flat' : 'tonal'"
                size="small"
                :color="item.IS_LOCKED == 1 ? 'warning' : 'success'"
                class="ma-1"
                @click="onUnlockPasscode(item)"
                v-bind="props"
              >
                <Icon
                  name="circum:unlock"
                  :class="item.IS_LOCKED == 1 ? 'text-white' : 'text-success'"
                />
              </v-btn>
            </template>
          </v-tooltip>
          <pages-passcode-reset-modal :item="item"></pages-passcode-reset-modal>
          <pages-passcode-change-modal
            :item="item"
          ></pages-passcode-change-modal>
          <v-tooltip :text="$t('Delete')">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="tonal"
                size="small"
                color="error"
                class="ma-1"
                @click="onDeletePasscode(item)"
                v-bind="props"
              >
                <Icon name="mdi-light:delete" class="text-error" />
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

const passcodeStore = usePasscodeStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();
const employeeStore = useEmployeeStore();

//paramitter

const dataList: any = ref([]);
const txtSearch = ref("");
const page = ref(1);
const itemsPerPage = ref(10);

const tableHeaders: any = ref([
  {
    title: nuxtApp.$t("type"),
    key: "PUREPOSE",
    align: "start",
  },
  { title: nuxtApp.$t("id"), key: "USER_NAME", align: "start" },

  { title: nuxtApp.$t("name"), key: "FULL_NAME_LA", align: "start" },
  //   {
  //     title: nuxtApp.$t("position"),
  //     key: "POS_NAME",
  //     align: "start",
  //   },
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
  // {
  //   title: nuxtApp.$t("team"),
  //   key: "TEAM_NAME",
  //   align: "start",
  // },
  {
    title: nuxtApp.$t("status"),
    key: "PASSCODE_STATUS",
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
  await onLoadPasscodeList();
  await passcodeStore.acGetPasscodeType({ status: "A" });
  await await employeeStore.acGetEmployeeList({});
});

const onLoadPasscodeList = async () => {
  nuxtApp.$openLoading();
  await passcodeStore.acGetPasscodeList({
    user_name: "",
    purepose: "",
    status: "",
  });
  dataList.value = passcodeStore.getPasscodeList;
  nuxtApp.$closeLoading();
};

const onUpdateStatus = async (item: PasscodeInfoModel) => {
  nuxtApp.$openLoading();
  await passcodeStore
    .acInsertUpdatePasscode({
      user_name: item.USER_NAME,
      purepose: item.PUREPOSE,
      status: item.PASSCODE_STATUS,
      action: utilStore.getActnoCode.UPDATE,
    })
    .then(async (result: ResponseModel) => {
      nuxtApp.$closeLoading();
      if (result.ERROR_CODE == "00") {
        await onLoadPasscodeList();
      } else {
        nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
      }
    });

  nuxtApp.$closeLoading();
};

const onDeletePasscode = async (item: PasscodeInfoModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await passcodeStore
        .acInsertUpdatePasscode({
          user_name: item.USER_NAME,
          purepose: item.PUREPOSE,
          action: utilStore.getActnoCode.DELETE,
        })
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            await onLoadPasscodeList();
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

const onUnlockPasscode = async (item: PasscodeInfoModel) => {
  nuxtApp
    .$openAlert("Q", "ທ່ານຕ້ອງການ Unlock ແທ້ບໍ?")
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await passcodeStore
        .acUnlockPasscode({
          user_name: item.USER_NAME,
          purepose: item.PUREPOSE,
        })
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadPasscodeList();
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
