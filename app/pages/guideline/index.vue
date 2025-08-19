<template>
  <v-container>
    <div class="mb-8">
      <v-card elevation="0" rounded="lg">
        <v-card-title class="bg-primary">
          <p>ຄູ່ມືນຳໃຊ້ລະບົບ</p>
        </v-card-title>
        <v-card-text>
          <div class="py-4">
            <div v-if="guidelineFileList.length <= 0" class="text-center py-4">
              <no-data></no-data>
            </div>
            <div v-else>
              <v-row class="ma-0">
                <util-file-item
                  v-for="f in guidelineFileList"
                  :file-item="JSON.stringify(f)"
                  :file-path="guidelinePath"
                  @on-delete-success="onLoadGuidelineFileList"
                ></util-file-item>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "custom",
  middleware: ["auth"],
});

const nuxtApp: any = useNuxtApp();

const fileStore = useFileStore();

const guidelineFileList = ref<FileInfoModel[]>([]);
const guidelinePath = ref("");

onMounted(async () => {
  await onLoadGuidelineFileList();
});

const onLoadGuidelineFileList = async () => {
  nuxtApp.$openLoading();
  var path = "/" + nuxtApp.$env.projectID + "/GUIDELINE";
  guidelinePath.value = path;
  guidelineFileList.value = [];
  var a = await fileStore.acGetFileList({ path: path });
  guidelineFileList.value = a;
  nuxtApp.$closeLoading();
};
</script>
