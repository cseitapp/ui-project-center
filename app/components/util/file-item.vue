<template>
  <div class="ma-1 px-2 py-1 rounded-lg bg-grey-lighten-3 m-cursor">
    <v-row :align="'center'">
      <v-col>
        <v-row class="ma-0" :align="'center'" @click="onOpenFile">
          <img :src="fileIcon(file.name)" width="30" height="30" />
          <v-col class="py-0">
            <div>
              <p class="text-second">
                {{ file.name }}
              </p>
            </div>
            <p class="text-second">
              {{ nuxtApp.$convertFileSize(file.size) }}
            </p>
          </v-col>
        </v-row>
      </v-col>
      <v-btn
        v-if="showDelete"
        variant="text"
        size="small"
        icon=""
        color="error"
        class="ma-1"
        @click="onDeleteFile(file.name)"
      >
        <Icon name="mdi-light:delete" class="text-error" />
      </v-btn>
    </v-row>
  </div>
</template>
<script setup lang="ts">
const nuxtApp: any = useNuxtApp();
const emit = defineEmits(["onDeleteSuccess"]);
const props = defineProps({
  fileItem: { type: String, required: true },
  filePath: { type: String, required: true },
  showDelete: { type: Boolean, required: false },
});
const file = ref<FileInfoModel>(JSON.parse(props.fileItem));
const fileIcon = (name: string) => {
  const src = "/api/image/icon/" + name.split(".").pop() + ".png";
  return src;
};
const fileLocation = (name: string) => {
  const src = nuxtApp.$getFilePath(props.filePath + "/" + name);
  return src;
};
const onOpenFile = () => {
  const url = fileLocation(file.value.name);
  window.open(url, "_blank")?.focus();
};

const fileStore = useFileStore();

const onDeleteFile = async (name: string) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      nuxtApp.$openLoading();
      await fileStore
        .acRemoveFile({ path: props.filePath + "/" + name })
        .then((res: ResponseModel) => {
          if (res.ERROR_CODE == "00") {
            emit("onDeleteSuccess");
          } else {
            nuxtApp.$openAlert("E", res.ERROR_DESC);
          }
        });
      nuxtApp.$closeLoading();
    })
    .catch((c: any) => {});
};
</script>
