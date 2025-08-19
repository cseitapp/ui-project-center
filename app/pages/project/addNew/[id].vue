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
      <!-- 
      <v-btn color="success" variant="tonal">
        <Icon name="material-symbols:save-rounded" class="text-success" />
        <span>{{ $t("Save") }}</span>
      </v-btn> -->
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card elevation="0" class="m-shadow rounded-lg">
          <v-card-title class="text-center">
            <h3>ເພີ່ມຂໍ້ມູນລະບົບ</h3>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="myForm">
              <p class="my-1">
                {{ $t("name") }} <span class="text-error mr-1">*</span>:
              </p>
              <v-text-field
                v-model="txtNameLa"
                color="primary"
                variant="outlined"
                density="compact"
                :placeholder="$t('name')"
                :rules="[(v) => $textFieldRule(v)]"
              ></v-text-field>
              <p class="my-1">
                {{ $t("name") }} (EN) <span class="text-error mr-1">*</span>:
              </p>
              <v-text-field
                v-model="txtNameEn"
                color="primary"
                variant="outlined"
                density="compact"
                :placeholder="$t('name')"
                :rules="[(v) => $textFieldRule(v)]"
              ></v-text-field>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-radio-group inline :label="$t('type')" v-model="rbType">
                    <v-radio
                      v-for="(item, index) in projectStore.getProjectType"
                      :label="item.TEXT"
                      :value="item.CODE"
                      :class="item.CLASS"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-radio-group
                    inline
                    :label="'Protocol'"
                    v-model="rbProtocol"
                  >
                    <v-radio
                      :label="projectStore.getProtocolCode.HTTPS"
                      :value="projectStore.getProtocolCode.HTTPS"
                      color="success"
                    ></v-radio>
                    <v-radio
                      :label="projectStore.getProtocolCode.HTTP"
                      :value="projectStore.getProtocolCode.HTTP"
                      color="warning"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

              <p class="my-1">{{ $t("Address") }} (URL) :</p>
              <v-text-field
                v-model="txtAddress"
                color="primary"
                variant="outlined"
                density="compact"
                :placeholder="$t('Address')"
              ></v-text-field>
              <v-row>
                <v-col cols="12" sm="8">
                  <p class="my-1">IP Address :</p>
                  <v-text-field
                    v-model="txtHost"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    :placeholder="' IP Address'"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <p class="my-1">Port:</p>
                  <v-text-field
                    v-model="txtPort"
                    color="primary"
                    variant="outlined"
                    density="compact"
                    :placeholder="'Port'"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-radio-group inline :label="$t('status')" v-model="rbStatus">
                <v-row class="my-0">
                  <v-radio
                    v-for="(item, index) in utilStore.getActiveUnActiveStatus"
                    :label="item.TEXT"
                    :value="item.CODE"
                    :class="item.CLASS"
                  ></v-radio>
                </v-row>
              </v-radio-group>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              class="w-100"
              color="success"
              variant="tonal"
              @click="onInsertItem"
            >
              <Icon name="material-symbols:save-rounded" class="text-success" />
              <span>{{ $t("Save") }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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

//paramitter
const myForm = ref();
const txtNameLa = ref();
const txtNameEn = ref();
const txtAddress = ref();
const rbProtocol = ref("HTTPS");
const txtHost = ref();
const txtPort = ref();
const rbStatus:any = ref("A");
const rbType:any = ref("W");
const action = ref(utilStore.getActnoCode.INSERT);
const itemSelected = ref<ProjectListModel>();

onMounted(async () => {
  onInitLoading();
});


const onInitLoading = async () => {
  if (route.params.id != "NEW") {
    if (projectStore.getProjectList.length <= 0) {
      await onLoadProjectList();
    }
    var a = projectStore.getProjectList.filter(
      (el) => el.PRO_ID == route.params.id
    );
    if (a.length > 0) {
      var item = a[0];
      itemSelected.value = item;
      txtNameLa.value = item?.PRO_NAME_LA;
      txtNameEn.value = item?.PRO_NAME_EN;
      rbType.value = item?.PRO_TYPE;
      rbProtocol.value = item?.PROTOCOL;
      txtAddress.value = item?.ADDRESS;
      txtHost.value = item?.HOST;
      txtPort.value = item?.PORT;
      rbStatus.value = item?.PRO_STATUS;
      action.value = utilStore.getActnoCode.UPDATE;
    } else {
      nuxtApp.$openAlert("E", "No project info").then(async (r: any) => {
        nuxtApp.$router.back();
      });
      return;
    }
  }
};

const onLoadProjectList = async () => {
  nuxtApp.$openLoading();
  await projectStore.acGetProjectList({ status: "", type: "" });
  nuxtApp.$closeLoading();
};
const onInsertItem = async () => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    var body = {
      project_id: itemSelected.value?.PRO_ID,
      name_la: txtNameLa.value,
      name_en: txtNameEn.value,
      address: txtAddress.value,
      protocol: rbProtocol.value,
      host: txtHost.value,
      port: txtPort.value,
      status: rbStatus.value,
      type: rbType.value,
      user: loginStore.loginUser?.USER_NAME,
      action: action.value,
    };
    //  console.log(body);
    nuxtApp.$openLoading();
    await projectStore
      .acInsertProjectInfo(body)
      .then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();
        if (result.ERROR_CODE == "00") {
          nuxtApp
            .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
            .then(async (r: any) => {
              nuxtApp.$router.back();
            });
        } else {
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      });
  }
};
</script>
