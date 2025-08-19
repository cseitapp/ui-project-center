<template>
  <v-dialog v-model="uploadModal">
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <v-card elevation="0" rounded="lg">
          <v-card-title class="bg-primary">
            <v-row class="ma-0" :align="'center'">
              <Icon name="gis:layer-upload" class="text-white mr-2" />
              <span>{{ $t("upload") }}</span
              ><v-spacer></v-spacer>
              <v-btn
                variant="text"
                size="x-small"
                icon=""
                color="error"
                class="ma-1"
                @click="onCloseModal"
              >
                <Icon name="ic:round-close" class="text-white" />
              </v-btn>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" style="max-height: 70vh">
            <v-file-upload v-model="fileUpload" clearable multiple show-size>
            </v-file-upload>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="px-6">
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              class="px-6"
              @click="uploadFile"
            >
              <Icon name="line-md:upload-loop" class="text-white mr-1" />
              <span>{{ $t("upload") }}</span>
            </v-btn></v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  filePath: { type: String, required: true },
  accept: { type: String, required: false },
});
const emit = defineEmits(["onClose", "onUploadSuccess"]);
const nuxtApp: any = useNuxtApp();
const fileStore = useFileStore();
const uploadModal: any = defineModel("vModel");
const fileUpload = ref([]);

const onCloseModal = () => {
  emit("onClose");
};

const uploadFile = async () => {
  try {
    nuxtApp.$openLoading();
    var files = new FormData();

    if (fileUpload.value.length > 0 && props.filePath != "") {
      fileUpload.value.forEach((element: any) => {
        files.append("files", element, element.name);
      });

      files.append("path", props.filePath);

      await fileStore.acUploadFiles(files).then((res: ResponseModel) => {
        nuxtApp.$closeLoading();
        if (res.ERROR_CODE == "00") {
          nuxtApp.$openAlert("S", res.ERROR_DESC).then((r: any) => {
            emit("onUploadSuccess");
          });
        } else {
          nuxtApp.$openAlert("E", res.ERROR_DESC);
        }
      });
    } else {
      nuxtApp.$closeLoading();
      nuxtApp.$openAlert("W", nuxtApp.$t("PleaseSelectYourFile"));
    }
  } catch (err) {
    nuxtApp.$closeLoading();
    nuxtApp.$openAlert("E", err);
  }
};
</script>
