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
        v-if="tab == 1"
        color="success"
        variant="tonal"
        class="mr-2"
        @click="goToAddNewItem('NEW')"
        ><Icon
          name="line-md:plus"
          class="mr-1 text-success"
          size="1.2rem"
        ></Icon
        >{{ $t("addNew") }}</v-btn
      >
    </v-row>
    <div class="py-2">
      <v-tabs
        v-model="tab"
        align-tabs="center"
        color="primary"
        class="bg-white rounded-xl"
        stacked
      >
        <v-tab :value="1">
          <Icon
            name="hugeicons:menu-square"
            class="mb-1"
            :class="tab == 1 ? 'text-primary' : ''"
          ></Icon>

          All Menu
        </v-tab>

        <v-tab :value="2">
          <Icon
            name="bi:menu-up"
            class="mb-1"
            :class="tab == 2 ? 'text-primary' : ''"
          ></Icon>

          Menu Role
        </v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <div v-if="menuStore.getAllMenuList.length > 0">
            <div
              v-for="m in menuStore.getAllMenuList.filter(
                (el) => el.TYPE == 'M'
              )"
            >
              <v-divider></v-divider>
              <div class="text-secondary">
                <v-row class="ma-0">
                  <v-col>
                    <span> {{ m.MENU_NAME_LA }}</span> </v-col
                  ><v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    size="small"
                    color="warning"
                    icon=""
                    @click="onEditMenuItem(m)"
                  >
                    <Icon name="fa7-regular:edit" class="text-warning" />
                  </v-btn>
                  <v-btn
                    v-if="menuStore.getAllMenuList.filter((el:AllMenuModel) => el.SUB_MENU_ID == m.MENU_ID).length<=0"
                    variant="text"
                    size="small"
                    color="error"
                    icon=""
                    @click="onDeleteMenuItem(m)"
                  >
                    <Icon name="mdi-light:delete" class="text-error" />
                  </v-btn>
                </v-row>
              </div>
              <div
                v-for="item in menuStore.getAllMenuList.filter((el:AllMenuModel) => el.SUB_MENU_ID == m.MENU_ID)"
                :key="item.MENU_ID"
                class="bg-white mb-2 rounded-lg"
              >
                <div>
                  <v-row class="ma-0" :align="'center'">
                    <div class="px-2">
                      <Icon
                        v-if="item.CSS_ICON"
                        :name="item.CSS_ICON"
                        size="1.8rem"
                        class="mx-2"
                      ></Icon>
                      <p class="text-secondary">{{ item.MENU_ID }}</p>
                    </div>
                    <v-col cols="12" md="3">
                      <p>{{ item.MENU_NAME_LA }}</p>
                      <p class="text-secondary">{{ item.MENU_NAME_EN }}</p>
                    </v-col>
                    <v-col cols="12" md="3">
                      <div>
                        <p>
                          <span class="text-secondary">Path: </span
                          >{{ item.PATH ?? "" }}
                        </p>
                      </div>
                    </v-col>
                    <v-col cols="12" md="3" v-if="item.ICON">
                      <v-row class="ma-0" :align="'center'" justify="start">
                        <div
                          class="bg-grey-lighten-2 rounded-lg pa-2 mx-2"
                          style="width: 40px"
                        >
                          <v-img
                            :src="'/api/image/menu?filePath=' + item.ICON"
                            :alt="`${item.ICON}`"
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
                          </v-img>
                        </div>
                        <div>
                          <p class="text-secondary">
                            {{ item.ICON ?? "" }}
                          </p>
                        </div>
                      </v-row>
                    </v-col>

                    <div class="mx-3">
                      <code-to-text
                        :data="
                          utilStore.acGetCodetoText(
                            menuStore.getMenuStatus,
                            item.ENABLE
                          )
                        "
                      ></code-to-text>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                      variant="text"
                      size="small"
                      color="warning"
                      icon=""
                      @click="onEditMenuItem(item)"
                    >
                      <Icon name="fa7-regular:edit" class="text-warning" />
                    </v-btn>
                    <v-btn
                      variant="text"
                      size="small"
                      color="error"
                      icon=""
                      @click="onDeleteMenuItem(item)"
                    >
                      <Icon name="mdi-light:delete" class="text-error" />
                    </v-btn>
                  </v-row>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center">
            <no-data></no-data></div
        ></v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <div v-if="dataList.length <= 0" class="text-center">
            <no-data></no-data>
          </div>
          <div v-else>
            <v-expansion-panels
              v-model="panel"
              elevation="0"
              multiple
              rounded="xl"
              variant="popout"
              hideActions
            >
              <v-expansion-panel
                v-for="(i, idx) in dataList"
                :key="i.ROLE_ID"
                class="my-1"
                :value="idx"
              >
                <v-expansion-panel-title expand-icon="mdi-menu-down">
                  <v-row :align="'center'">
                    <div>
                      <v-chip label color="primary">
                        {{ i.ROLE_ID }}
                      </v-chip>
                    </div>
                    <v-col>
                      <p class="my-2">
                        <span class="text-secondary">{{ $t("name") }}</span
                        >: {{ i.ROLE_NAME_LA }}
                      </p>
                      <p class="my-2">
                        <span class="text-secondary">{{ $t("name") }} (EN)</span
                        >:
                        {{ i.ROLE_NAME_EN }}
                      </p>
                    </v-col>

                    <v-col>
                      <v-row class="ma-0 h-100" justify="end">
                        <v-btn
                          color="secondary"
                          variant="tonal"
                          density="comfortable"
                          class="ma-1"
                          @click="addNewMenuRole(i.ROLE_ID)"
                        >
                          <Icon name="line-md:plus" class="text-success mr-1" />
                          <span>ເພີ່ມເມນູ</span>
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div
                    v-if="
                      menuStore.roleMenuList.filter(
                        (el) => el.ROLE_ID == i.ROLE_ID
                      ).length > 0
                    "
                  >
                    <div
                      v-for="m in menuStore.roleMenuList.filter(
                        (el) => el.ROLE_ID == i.ROLE_ID && el.TYPE == 'M'
                      )"
                    >
                      <div>
                        <v-row class="mx-0 my-2">
                          <div>
                            <p>{{ m.MENU_NAME_LA }}</p>
                            <p class="text-secondary">{{ m.MENU_NAME_EN }}</p>
                          </div>

                          <v-spacer></v-spacer>
                          <v-btn
                            variant="text"
                            size="small"
                            color="error"
                            icon=""
                            @click="onDeleteMenuRoleItem(m)"
                          >
                            <Icon name="mdi-light:delete" class="text-error" />
                          </v-btn>
                        </v-row>
                      </div>

                      <v-divider></v-divider>
                      <div
                        v-for="item in menuStore.roleMenuList.filter((el:MenuModel) => el.SUB_MENU_ID == m.MENU_ID && el.ROLE_ID == i.ROLE_ID)"
                        :key="item.MENU_ID"
                      >
                        <v-row class="ma-0" :align="'center'">
                          <Icon
                            v-if="item.CSS_ICON"
                            :name="item.CSS_ICON"
                            size="1.8rem"
                            class="mx-2"
                          ></Icon>
                          <v-col cols="12" md="4">
                            <p>{{ item.MENU_NAME_LA }}</p>
                            <p class="text-secondary">
                              {{ item.MENU_NAME_EN }}
                            </p>
                          </v-col>
                          <v-col cols="12" md="4">
                            <div>
                              <p>
                                <span class="text-secondary">Path: </span
                                >{{ item.PATH ?? "" }}
                              </p>
                            </div>
                          </v-col>

                          <div class="mx-3">
                            <code-to-text
                              :data="
                                utilStore.acGetCodetoText(
                                  menuStore.getMenuStatus,
                                  item.ENABLE
                                )
                              "
                            ></code-to-text>
                          </div>
                          <v-spacer></v-spacer>
                          <v-btn
                            variant="text"
                            size="small"
                            color="error"
                            icon=""
                            @click="onDeleteMenuRoleItem(item)"
                          >
                            <Icon name="mdi-light:delete" class="text-error" />
                          </v-btn>
                        </v-row>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center">
                    <no-data></no-data>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </v-container>
  <v-dialog v-model="addNewModal">
    <v-row :justify="'center'">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="0" rounded="xl">
          <v-card-title class="text-center">
            <h4>ເພີ່ມເມນູໃໝ່</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="myForm" class="pa-0">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="txtNameLa"
                    :label="$t('name')"
                    persistent-hint
                    rounded="lg"
                    :rules="[(v) => $textFieldRule(v)]"
                    variant="outlined"
                    density="comfortable"
                    class="py-1"
                  ></v-text-field>
                  <v-text-field
                    v-model="txtNameEn"
                    :label="$t('name') + ' (EN)'"
                    persistent-hint
                    rounded="lg"
                    variant="outlined"
                    density="comfortable"
                    class="py-1"
                  ></v-text-field>
                  <v-text-field
                    v-model="txtPath"
                    :label="'Path'"
                    persistent-hint
                    rounded="lg"
                    variant="outlined"
                    density="comfortable"
                    class="py-1"
                  ></v-text-field>
                  <v-text-field
                    v-model="txtDesc"
                    :label="$t('description')"
                    persistent-hint
                    rounded="lg"
                    variant="outlined"
                    density="comfortable"
                    class="py-1"
                  ></v-text-field>
                  <v-text-field
                    v-model="txtCssIcon"
                    :label="'CSS Icon'"
                    persistent-hint
                    rounded="lg"
                    variant="outlined"
                    density="comfortable"
                    class="py-1"
                  ></v-text-field>
                  <v-file-input
                    v-if="action == utilStore.getActnoCode.UPDATE"
                    v-model="fileUpload"
                    accept="image/*"
                    label="Image Icon"
                    placeholder="Upload your photos"
                    prepend-icon="mdi-camera"
                    rounded="lg"
                    variant="outlined"
                    density="comfortable"
                  ></v-file-input>
                  <v-radio-group inline :label="$t('type')" v-model="rbType">
                    <v-radio
                      label="Main Menu"
                      value="M"
                      color="primary"
                    ></v-radio>
                    <v-radio
                      label="Sub Menu"
                      value="S"
                      color="warning"
                    ></v-radio>
                  </v-radio-group>

                  <v-combobox
                    v-if="rbType == 'S'"
                    v-model="mainMenuSelected"
                    :items="
                      menuStore.getAllMenuList.filter((el) => el.TYPE == 'M')
                    "
                    density="comfortable"
                    rounded="lg"
                    autocomplete="off"
                    item-title="MENU_NAME_LA"
                    item-value="MENU_ID"
                    :label="'Main menu'"
                    color="primary"
                    variant="outlined"
                    :rules="[(v) => $selectionRule(v)]"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" md="6">
                  <p>Icon color</p>
                  <v-color-picker
                    v-model="txtColor"
                    rounded="xl"
                    class="mt-2 mb-4 w-100"
                  ></v-color-picker>

                  <v-number-input
                    v-model="txtOrder"
                    :label="nuxtApp.$t('rowNum')"
                    control-variant="split"
                    variant="outlined"
                    density="comfortable"
                    rounded="lg"
                  ></v-number-input>

                  <v-radio-group
                    inline
                    :label="$t('status')"
                    v-model="rbStatus"
                  >
                    <v-radio
                      v-for="(item, index) in menuStore.getMenuStatus"
                      :label="item.TEXT"
                      :value="item.CODE"
                      :class="item.CLASS"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              variant="tonal"
              rounded="lg"
              @click="onInserUpdateMenuItem"
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

  <v-dialog v-model="addNewMenuRoleModal">
    <v-row :justify="'center'">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="0" rounded="xl">
          <v-card-title class="text-center">
            <h4>ເພີ່ມເມນູໃໝ່</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="overflow-auto" style="height: 80vh">
            <div v-if="allMenuRoleList.length > 0">
              <div
                v-for="m in allMenuRoleList.filter(
                  (el:any) => el.TYPE == 'M'
                )"
              >
                <div>
                  <v-row class="ma-0">
                    <v-col>
                      <span> {{ m.MENU_NAME_LA }}</span> </v-col
                    ><v-spacer></v-spacer>
                    <v-checkbox
                      v-if="
                        menuRoleSelected.filter((el) => el.MENU_ID == m.MENU_ID)
                          .length <= 0
                      "
                      v-model="m.IS_SELECTED"
                      color="primary"
                      :label="'ເລືອກທັງໝົດ'"
                      :value="true"
                      hide-details
                      @update:model-value="onSelectAllMenuRole(m)"
                    ></v-checkbox>
                    <div v-else>
                      <v-row class="ma-0" :align="'center'">
                        <Icon
                          name="mingcute:check-2-line"
                          class="text-success mr-2"
                        />
                        <span class="text-secondary">ເພີ່ມແລ້ວ</span>
                      </v-row>
                    </div>
                  </v-row>
                </div>
                <v-divider></v-divider>
                <div
                  v-for="item in allMenuRoleList.filter((el:AllMenuModel) => el.SUB_MENU_ID == m.MENU_ID)"
                  :key="item.MENU_ID"
                  class="bg-white mb-2 rounded-lg"
                >
                  <div>
                    <v-row class="ma-0" :align="'center'">
                      <div class="px-2">
                        <Icon
                          v-if="item.CSS_ICON"
                          :name="item.CSS_ICON"
                          size="1.8rem"
                          class="mx-2"
                        ></Icon>
                        <p class="text-secondary">{{ item.MENU_ID }}</p>
                      </div>
                      <v-col cols="12" md="3">
                        <p>{{ item.MENU_NAME_LA }}</p>
                        <p class="text-secondary">{{ item.MENU_NAME_EN }}</p>
                      </v-col>
                      <v-col cols="12" md="3">
                        <div>
                          <p>
                            <span class="text-secondary">Path: </span
                            >{{ item.PATH ?? "" }}
                          </p>
                        </div>
                      </v-col>
                      <v-col cols="12" md="3" v-if="item.ICON">
                        <v-row class="ma-0" :align="'center'" justify="start">
                          <div
                            class="bg-grey-lighten-2 rounded-lg pa-2 mx-2"
                            style="width: 40px"
                          >
                            <v-img
                              :src="'/api/image/menu?filePath=' + item.ICON"
                              :alt="`${item.ICON}`"
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
                            </v-img>
                          </div>
                          <div>
                            <p class="text-secondary">
                              {{ item.ICON ?? "" }}
                            </p>
                          </div>
                        </v-row>
                      </v-col>

                      <div class="mx-3">
                        <code-to-text
                          :data="
                            utilStore.acGetCodetoText(
                              menuStore.getMenuStatus,
                              item.ENABLE
                            )
                          "
                        ></code-to-text>
                      </div>
                      <v-spacer></v-spacer>

                      <v-checkbox
                        v-if="
                          menuRoleSelected.filter(
                            (el) => el.MENU_ID == item.MENU_ID
                          ).length <= 0
                        "
                        v-model="item.IS_SELECTED"
                        color="primary"
                        :label="$t('select')"
                        :value="true"
                        hide-details
                        @update:model-value="onSelectMenuRole(item)"
                      ></v-checkbox>
                      <div v-else>
                        <v-row class="ma-0" :align="'center'">
                          <Icon
                            name="mingcute:check-2-line"
                            class="text-success mr-2"
                          />
                          <span class="text-secondary">ເພີ່ມແລ້ວ</span>
                        </v-row>
                      </div>
                    </v-row>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center">
              <no-data></no-data>
            </div>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              variant="tonal"
              rounded="lg"
              @click="onInserMenuRoleItem"
            >
              <Icon name="material-symbols:save-rounded" class="text-success" />
              <span
                >{{ $t("Save") }} ({{
                  allMenuRoleList.filter((e: any) => e.IS_SELECTED == true)
                    .length
                }})</span
              >
            </v-btn>

            <v-btn
              color="error"
              variant="tonal"
              rounded="lg"
              @click="addNewMenuRoleModal = false"
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
const menuStore = useMenuStore();
const fileStore = useFileStore();

const dataList: any = ref([]);

const itemSelected = ref<ProjectListModel>();
const addNewModal = ref(false);

const action = ref(utilStore.getActnoCode.INSERT);

const tab = ref(1);
const panel = ref<number[]>([]);
const myForm = ref();
const txtNameLa = ref();
const txtNameEn = ref();
const rbStatus = ref("1");
const txtCssIcon = ref();
const rbType = ref("S");
const txtOrder = ref(10);
const txtPath = ref();
const menuSelected = ref<AllMenuModel>();
const mainMenuSelected = ref<AllMenuModel | null>();
const txtDesc = ref();
const txtColor = ref("#FFFFFF");
const fileUpload = ref();

const roleIdSelected = ref("");
const menuRoleSelected = ref<MenuModel[]>([]);
const addNewMenuRoleModal = ref(false);
const allMenuRoleList: any = ref([]);

onMounted(async () => {
  await onInitLoading();
  await onLoadAllMenu();
  await onLoadRoleList();
  await onLoadMenuRole();
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

const goToAddNewItem = async (id: any) => {
  txtNameLa.value = "";
  txtNameEn.value = "";
  rbStatus.value = "1";
  txtCssIcon.value = "";
  rbType.value = "S";
  txtOrder.value = 10;
  txtPath.value = "";
  txtDesc.value = "";
  txtColor.value = "#FFFFFF";
  mainMenuSelected.value = null;
  action.value = utilStore.getActnoCode.INSERT;
  addNewModal.value = true;
};

const onLoadRoleList = async () => {
  nuxtApp.$openLoading();
  await roleStore.acGetRoleList({
    project_id: itemSelected.value?.PRO_ID,
  });
  dataList.value = roleStore.getRoleList;
  nuxtApp.$closeLoading();
};

const onLoadMenuRole = async () => {
  nuxtApp.$openLoading();
  menuStore.acGetRoleMenuList({
    project_id: itemSelected.value?.PRO_ID,
    role_id: "",
  });
  menuRoleSelected.value=[]
  addNewMenuRoleModal.value=false
  nuxtApp.$closeLoading();
};

const onLoadAllMenu = async () => {
  nuxtApp.$openLoading();
  menuStore.acGetAllMenuList({
    project_id: itemSelected.value?.PRO_ID,
  });
  addNewModal.value = false;
  nuxtApp.$closeLoading();
};

const onEditMenuItem = async (item: AllMenuModel) => {
  menuSelected.value = item;
  txtNameLa.value = item.MENU_NAME_LA;
  txtNameEn.value = item.MENU_NAME_EN;

  rbStatus.value = item.ENABLE.toString();
  txtCssIcon.value = item.CSS_ICON;
  rbType.value = item.TYPE;
  txtOrder.value = item.MENU_ORDER;
  txtPath.value = item.PATH;
  txtDesc.value = item.MENU_DESC;
  txtColor.value = item.COLOR;
  if (item.TYPE == "S") {
    var a = menuStore.getAllMenuList.filter(
      (el) => el.MENU_ID == item.SUB_MENU_ID
    );
    if (a.length > 0) {
      mainMenuSelected.value = a[0];
    }
  }
  action.value = utilStore.getActnoCode.UPDATE;
  addNewModal.value = true;
};

const onInserUpdateMenuItem = async (item: UserRoleModel) => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    nuxtApp.$openLoading();
    var iconPath = "";
    if (fileUpload.value && action.value == utilStore.getActnoCode.UPDATE) {
      iconPath =
        "/" + nuxtApp.$env.projectID + "/MENU/" + menuSelected.value?.MENU_ID;
      await uploadFile(iconPath)
        .then((upload) => {
          if (!upload) {
            return;
          }
        })
        .catch((err) => {
          return;
        });

      // REMOVE OLD FILE
      await fileStore.acRemoveFile({ path: menuSelected.value?.ICON });
    }

    var body = {
      project_id: itemSelected.value?.PRO_ID,
      menu_id: menuSelected.value?.MENU_ID,
      user: loginStore.loginUser?.USER_NAME,
      status: rbStatus.value,
      icon: iconPath ? iconPath + "/" + fileUpload.value.name : "",
      css_icon: txtCssIcon.value,
      type: rbType.value,
      color: txtColor.value,
      name_en: txtNameEn.value,
      name_la: txtNameLa.value,
      order: txtOrder.value,
      path: txtPath.value,
      sub_menu_id: mainMenuSelected.value ? mainMenuSelected.value.MENU_ID : "",
      desc: txtDesc.value,
      action: action.value,
    };

    await menuStore.acInsertMenu(body).then(async (result: ResponseModel) => {
      nuxtApp.$closeLoading();
      if (result.ERROR_CODE == "00") {
        nuxtApp
          .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
          .then(async (r: any) => {
            await onLoadAllMenu();
          });
      } else {
        nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
      }
    });
  }
};

const onDeleteMenuItem = async (item: AllMenuModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var body = {
        menu_id: item.MENU_ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await menuStore.acInsertMenu(body).then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();
        if (result.ERROR_CODE == "00") {
          if (item.ICON) {
            // REMOVE OLD FILE
            await fileStore.acRemoveFile({ path: item.ICON });
          }
          nuxtApp
            .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
            .then(async (r: any) => {
              await onLoadAllMenu();
            });
        } else {
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      });
    })
    .catch((c: any) => {});
};

const uploadFile = async (path: string) => {
  return new Promise((resolve, reject) => {
    try {
      var files = new FormData();

      if (fileUpload.value) {
        files.append("files", fileUpload.value, fileUpload.value.name);

        files.append("path", path);

        fileStore.acUploadFiles(files).then((res: ResponseModel) => {
          if (res.ERROR_CODE == "00") {
            resolve(true);
          } else {
            nuxtApp.$openAlert("E", res.ERROR_DESC);
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    } catch (err) {
      nuxtApp.$openAlert("E", err);
      reject();
    }
  });
};

const addNewMenuRole = async (role_id: String) => {
  allMenuRoleList.value = [];
  menuStore.getAllMenuList.forEach((element) => {
    allMenuRoleList.value.push({ ...element, IS_SELECTED: false });
  });

  menuRoleSelected.value = menuStore.roleMenuList.filter(
    (el) => el.ROLE_ID == role_id
  );
  roleIdSelected.value = role_id.toString();
  addNewMenuRoleModal.value = true;
};

const onSelectAllMenuRole = async (item: any) => {
  menuStore.getAllMenuList
    .filter(
      (el) => el.SUB_MENU_ID == item.MENU_ID || el.MENU_ID == item.MENU_ID
    )
    .forEach((element) => {
      var isSelect = item.IS_SELECTED ? true : false;

      allMenuRoleList.value.filter(
        (e: any) => e.MENU_ID == element.MENU_ID
      )[0].IS_SELECTED = isSelect;
    });
};
const onSelectMenuRole = async (item: any) => {
  var a = menuRoleSelected.value.filter((el) => el.MENU_ID == item.SUB_MENU_ID);
  var b = allMenuRoleList.value.filter(
    (el: any) => el.SUB_MENU_ID == item.SUB_MENU_ID && el.IS_SELECTED
  );

  allMenuRoleList.value.filter(
    (e: any) => e.MENU_ID == item.SUB_MENU_ID
  )[0].IS_SELECTED = b.length > 0 && a.length <= 0 ? true : false;
};

const onInserMenuRoleItem = async () => {
  var menuId;
  if (
    roleIdSelected.value != "" &&
    allMenuRoleList.value.filter((el: any) => el.IS_SELECTED == true).length > 0
  ) {
    menuId = allMenuRoleList.value
      .filter((el: any) => el.IS_SELECTED == true)
      .map(function (item: any) {
        return item.MENU_ID;
      });
  } else {
    nuxtApp.$openAlert("W", "Please select a menu");
    return;
  }

  var body = {
    role_id: roleIdSelected.value,
    menu_id: menuId.toString(),
    action: utilStore.getActnoCode.INSERT,
  };

  await menuStore.acInsertMenuRole(body).then(async (result: ResponseModel) => {
    nuxtApp.$closeLoading();
    if (result.ERROR_CODE == "00") {
      nuxtApp
        .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
        .then(async (r: any) => {
          await onLoadMenuRole();
        });
    } else {
      nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
    }
  });
};

const onDeleteMenuRoleItem = async (item: MenuModel) => {
  nuxtApp
    .$openAlert("Q", nuxtApp.$t("AreYouSureToDelete"))
    .then(async (r: any) => {
      var body = {
        role_id: item.ROLE_ID,
        menu_id: item.MENU_ID,
        action: utilStore.getActnoCode.DELETE,
      };
      nuxtApp.$openLoading();
      await menuStore
        .acInsertMenuRole(body)
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          if (result.ERROR_CODE == "00") {
            nuxtApp
              .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
              .then(async (r: any) => {
                await onLoadMenuRole();
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
