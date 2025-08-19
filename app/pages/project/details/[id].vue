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
      <v-btn
        variant="tonal"
        color="secondary"
        class="ma-1"
        @click="goToProjectUser(itemSelected?.PRO_ID)"
      >
        <Icon name="si:user-line" class="text-warning mr-1" />
        ຕັ້ງຄ່າຜູ້ໃຊ້
      </v-btn>
      <v-btn
        variant="tonal"
        color="secondary"
        class="ma-1"
        @click="goToProjectRole(itemSelected?.PRO_ID)"
      >
        <Icon name="lets-icons:setting-line" class="text-warning mr-1" />
        ສິດເຂົ້າໃຊ້ລະບົບ
      </v-btn>
      <v-btn
        variant="tonal"
        color="secondary"
        class="ma-1"
        @click="goToProjectMenu(itemSelected?.PRO_ID)"
      >
        <Icon name="ep:menu" class="text-warning mr-1" />
        ຕັ້ງຄ່າເມນູ
      </v-btn>
    </v-row>
    <div class="py-2">
      <v-row>
        <v-col cols="12" md="4">
          <v-card elevation="0" rounded="lg" class="m-shadow">
            <v-card-title class="text-center bg-primary">
              <h5>ຂໍ້ມູນລະບົບ</h5>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-table>
                <tr>
                  <td class="text-right pr-2">
                    <span class="text-secondary mr-1">{{ $t("id") }}: </span>
                  </td>
                  <td>
                    <v-chip class="mb-2" label color="success">
                      {{ itemSelected?.PRO_ID }}</v-chip
                    >
                  </td>
                </tr>
                <tr>
                  <td class="text-right pr-2">
                    <span class="text-secondary mr-1">ຊື່ລະບົບ:</span>
                  </td>
                  <td>
                    <div>
                      <p>
                        {{ itemSelected?.PRO_NAME_LA }}
                      </p>
                      <p class="text-secondary">
                        {{ itemSelected?.PRO_NAME_EN }}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="text-right pr-2">
                    <span class="text-secondary mr-1">{{ $t("type") }}:</span>
                  </td>
                  <td>
                    <code-to-text
                      :data="
                        utilStore.acGetCodetoText(
                          projectStore.getProjectType,
                          itemSelected?.PRO_TYPE
                        )
                      "
                    ></code-to-text>
                  </td>
                </tr>
                <tr>
                  <td class="text-right pr-2">
                    <span class="text-secondary mr-1"
                      >{{ $t("Address") }}:</span
                    >
                  </td>
                  <td>
                    <a :href="itemSelected?.ADDRESS" target="_blank">
                      {{ itemSelected?.ADDRESS }}</a
                    >
                  </td>
                </tr>
                <tr>
                  <td class="text-right pr-2">
                    <span class="text-secondary mr-1">{{ $t("status") }}:</span>
                  </td>
                  <td>
                    <code-to-text
                      :data="
                        utilStore.acGetActiveUnactiveStatus(
                          itemSelected?.PRO_STATUS
                        )
                      "
                    ></code-to-text>
                  </td>
                </tr>
              </v-table>
            </v-card-text>
          </v-card>

          <v-card elevation="0" rounded="lg" class="m-shadow mt-4">
            <v-card-title class="text-center bg-primary">
              <h5>ເອກະສານລະບົບ</h5>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div>
                <v-row class="ma-0" :align="'center'">
                  <p class="text-secondary">ຄູ່ມືລະບົບ:</p>
                  <v-spacer></v-spacer
                  ><v-btn
                    variant="tonal"
                    color="secondary"
                    class="ma-1"
                    @click="onUploadGuideLine"
                  >
                    <Icon
                      name="famicons:cloud-upload-outline"
                      class="text-warning mr-1"
                    />
                    {{ $t("upload") }}
                  </v-btn>
                </v-row>
                <v-divider></v-divider>
                <div class="mt-2">
                  <div
                    v-if="guidelineFileList.length <= 0"
                    class="text-center py-4"
                  >
                    <no-data></no-data>
                  </div>
                  <div v-else>
                    <v-row class="ma-0">
                      <util-file-item
                        v-for="f in guidelineFileList"
                        :file-item="JSON.stringify(f)"
                        :file-path="guidelinePath"
                        :show-delete="true"
                        @on-delete-success="onLoadGuidelineFileList"
                      ></util-file-item>
                    </v-row>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <v-row class="ma-0" :align="'center'">
                  <p class="text-secondary">ເອກະສານລະບົບ:</p>
                  <v-spacer></v-spacer
                  ><v-btn
                    variant="tonal"
                    color="secondary"
                    class="ma-1"
                    @click="onUploadSystemDoc"
                  >
                    <Icon
                      name="famicons:cloud-upload-outline"
                      class="text-warning mr-1"
                    />
                    {{ $t("upload") }}
                  </v-btn>
                </v-row>
                <v-divider></v-divider>
                <div class="mt-2">
                  <div
                    v-if="systemDocumnetList.length <= 0"
                    class="text-center py-4"
                  >
                    <no-data></no-data>
                  </div>
                  <div v-else>
                    <v-row class="ma-0">
                      <util-file-item
                        v-for="f in systemDocumnetList"
                        :file-item="JSON.stringify(f)"
                        :file-path="systemDocPath"
                        :show-delete="true"
                        @on-delete-success="onLoadSystemDocFileList"
                      ></util-file-item>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="0" rounded="lg" class="m-shadow">
            <v-card-title class="text-center bg-primary">
              <h5>ຂໍ້ມູນຜູ້ຄຸ້ມຄອງ</h5>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-center"> <no-data></no-data> </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card elevation="0" rounded="lg" class="m-shadow">
            <v-card-title class="text-center bg-primary">
              <h5>ພາກສ່ວນເຂົ້າໃຊ້ລະບົບ</h5>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-center"> <no-data></no-data> </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
  <modals-upload-file
    v-model="uploadFileModal"
    :file-path="uploadFilePath"
    @on-close="uploadFileModal = false"
    @on-upload-success="onUploadFileSuccess"
  ></modals-upload-file>
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
const fileStore = useFileStore();

const itemSelected = ref<ProjectListModel>();

const uploadFileModal = ref(false);
const uploadFilePath = ref("");

onMounted(async () => {
  await onInitLoading();
  await onLoadGuidelineFileList();
  await onLoadSystemDocFileList();
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
const goToProjectUser = async (id: any) => {
  nuxtApp.$router.push("/project/user/" + id);
};
const goToProjectRole = async (id: any) => {
  nuxtApp.$router.push("/project/role/" + id);
};
const goToProjectMenu = async (id: any) => {
  nuxtApp.$router.push("/project/menu/" + id);
};

const onUploadGuideLine = () => {
  uploadFilePath.value = guidelinePath.value;
  uploadFileModal.value = true;
};
const onUploadSystemDoc = () => {
  uploadFilePath.value = systemDocPath.value;
  uploadFileModal.value = true;
};

const onUploadFileSuccess = async () => {
  uploadFileModal.value = false;
  await onLoadGuidelineFileList();
  await onLoadSystemDocFileList();
};

const guidelineFileList = ref<FileInfoModel[]>([]);
const systemDocumnetList = ref<FileInfoModel[]>([]);
const guidelinePath = ref("");
const systemDocPath = ref("");
const onLoadGuidelineFileList = async () => {
  nuxtApp.$openLoading();
  var path = "/" + itemSelected.value?.PRO_ID + "/GUIDELINE";
  guidelinePath.value = path;
  guidelineFileList.value = [];
  var a = await fileStore.acGetFileList({ path: path });
  guidelineFileList.value = a;
  nuxtApp.$closeLoading();
};
const onLoadSystemDocFileList = async () => {
  nuxtApp.$openLoading();
  var path = "/" + itemSelected.value?.PRO_ID + "/SYS_DOCUMENT";
  systemDocPath.value = path;
  systemDocumnetList.value = [];
  var a = await fileStore.acGetFileList({ path: path });
  systemDocumnetList.value = a;
  nuxtApp.$closeLoading();
};
</script>
