<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <div @click="onInitData" v-bind="activatorProps">
        <slot name="content">
          <v-btn variant="tonal" color="success" class="w-100" rounded="lg">
            <Icon name="mingcute:add-fill" class="text-success mr-1" />
            <p>{{ $t("addNew") }}</p>
          </v-btn></slot
        >
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="3">
          <v-card rounded="lg">
            <v-card-title>
              <v-row class="ma-0" :align="'center'">
                <p>Project Manager</p>
                <v-spacer></v-spacer>
                <v-btn
                  variant="text"
                  density="compact"
                  icon=""
                  @click="isActive.value = false"
                >
                  <Icon name="mingcute:close-fill" class="text-error" />
                </v-btn>
              </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form ref="myForm" class="text-left">
                <v-combobox
                  v-model="userSelected"
                  :items="employeeStore.getEmployeeList"
                  :disabled="action == utilStore.getActnoCode.UPDATE"
                  variant="outlined"
                  density="comfortable"
                  rounded="lg"
                  color="primary"
                  item-title="FULL_NAME_LA"
                  item-value="USER_NAME"
                  :filter-keys="[
                    'raw.USER_NAME',
                    'raw.FULL_NAME_LA',
                    'raw.FULL_NAME_EN',
                  ]"
                  :rules="[(v) => $selectionRule(v)]"
                  :label="'ພະນັກງານ'"
                  ><template v-slot:selection="{ item, index }: any">
                    ({{ item.raw.USER_NAME }})
                    {{ item.raw.FULL_NAME_LA }}
                  </template>
                  <template v-slot:item="{ props, item }: any">
                    <v-list-item
                      :active="
                        userSelected?.USER_NAME == item.value ? true : false
                      "
                      color="primary"
                      @click="props.onClick"
                    >
                      {{ item.raw.USER_NAME }} -
                      {{ item.raw.FULL_NAME_LA }}
                    </v-list-item>
                  </template></v-combobox
                >

                <v-radio-group
                  inline
                  :label="$t('type')"
                  v-model="rbManagerType"
                >
                  <v-row class="my-0">
                    <v-radio
                      v-for="(
                        item, index
                      ) in projectStore.getProjectManagerType"
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
                variant="flat"
                color="primary"
                class="w-100"
                @click="
                  () => {
                    onInsertUpdateManager(isActive);
                  }
                "
              >
                <Icon
                  name="material-symbols:save-rounded"
                  class="text-white mr-1"
                />
                <span>{{ $t("Save") }}</span></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["onSuccess"]);
const props = defineProps({
  projectId: { type: String, require: true },
  item: Object as PropType<ProjectManagerModel>,
});

const projectStore = useProjectStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();
const employeeStore = useEmployeeStore();
const nuxtApp = useNuxtApp();
//paramitter
const myForm = ref();

const rbManagerType = ref("D");
const action = ref(utilStore.getActnoCode.INSERT);

const userSelected = ref<EmployeeModel | null>(null);

onMounted(async () => {
  if (employeeStore.getEmployeeList.length <= 0) {
    nuxtApp.$openLoading();
    await employeeStore.acGetEmployeeList({});
    nuxtApp.$closeLoading();
  }
});

const onInitData = async () => {
  if (props.item) {
    var a = employeeStore.getEmployeeList.filter(
      (el) => el.USER_NAME.toUpperCase() == props.item?.USER_NAME.toUpperCase()
    );
    if (a.length > 0) {
      userSelected.value = a[0] ?? null;
    }
    rbManagerType.value = props.item.MN_TYPE;
    action.value = utilStore.getActnoCode.UPDATE;
  }
};

const onInsertUpdateManager = async (isActive: any) => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    var body = {
      id: props.item ? props.item.ID : "",
      project_id: props.projectId,
      user_name: userSelected.value?.USER_NAME,
      mn_type: rbManagerType.value,
      user: loginStore.loginUser?.USER_NAME,
      status: "A",
      action: action.value,
    };
    nuxtApp.$openLoading();
    await projectStore
      .acInsertProjectManager(body)
      .then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();

        if (result.ERROR_CODE == "00") {
          nuxtApp
            .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
            .then((r) => {
              emit("onSuccess");
              isActive.value = false;
            });
        } else {
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      });
  }
};
</script>
