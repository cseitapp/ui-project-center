<template>
  <div v-if="menuList.length <= 0" class="text-center py-4">
    <no-data></no-data>
  </div>
  <v-list
    v-else
    v-model="menuSelected"
    density="compact"
    active-class="text-white"
  >
    <v-list-item
      :value="guidelineItem.MENU_ID"
      color="primary"
      @click="onMenuClick(homeItem)"
    >
      <template v-slot:prepend v-if="homeItem.CSS_ICON">
        <Icon
          :name="homeItem.ICON!"
          class="mr-2 text-white"
          :class="menuSelected.MENU_ID == 'HOME' ? 'text-white' : ''"
        ></Icon>
      </template>
      <v-list-item-title
        class="text-white"
        v-text="homeItem.MENU_NAME_LA"
      ></v-list-item-title>
    </v-list-item>
    <div v-for="i in mainMenu">
      <v-list-subheader class="text-secondary">{{
        i.MENU_NAME_LA
      }}</v-list-subheader>
      <v-list-item
        v-for="item in menuList.filter((el:MenuModel) => el.SUB_MENU_ID == i.MENU_ID)"
        :key="item.MENU_ID"
        :value="item"
        color="white"
        @click="onMenuClick(item)"
      >
        <template v-slot:prepend v-if="item.CSS_ICON">
          <Icon
            :name="item.CSS_ICON"
            class="mr-2 text-white"
            :class="menuSelected.MENU_ID == item.MENU_ID ? 'text-white' : ''"
          ></Icon>
        </template>
        <v-list-item-title v-text="item.MENU_NAME_LA"></v-list-item-title>
      </v-list-item>
    </div>
    <v-list-subheader class="text-secondary">{{ "ຄູ່ມື" }}</v-list-subheader>
    <v-list-item
      :value="guidelineItem.MENU_ID"
      color="primary"
      @click="onMenuClick(guidelineItem)"
    >
      <template v-slot:prepend v-if="guidelineItem.CSS_ICON">
        <Icon
          :name="guidelineItem.ICON!"
          class="mr-2 text-white"
          :class="menuSelected.MENU_ID == 'GUIDELINE' ? 'text-white' : ''"
        ></Icon>
      </template>
      <v-list-item-title
        class="text-white"
        v-text="guidelineItem.MENU_NAME_LA"
      ></v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const menuStore = useMenuStore();
const mainMenu = ref<MenuModel[]>([]);
const menuList = ref<MenuModel[]>([]);
const menuSelected: any = ref({});
const homeItem = ref<MenuModel>({
  ROLE_ID: "",
  MENU_ID: "HOME",
  ICON: "line-md:home",
  CSS_ICON: "text-primary",
  MENU_NAME_EN: "Home",
  MENU_NAME_LA: "ໜ້າຫຼັກ",
  PATH: "/home",
  TYPE: "",
  ENABLE: 1,
  MENU_ORDER: 0,
  SUB_MENU_ID: "",
  COLOR: "",
  MENU_DESC: "",
});
const guidelineItem = ref<MenuModel>({
  ROLE_ID: "",
  MENU_ID: "GUIDELINE",
  ICON: "akar-icons:book",
  CSS_ICON: "text-primary",
  MENU_NAME_EN: "Guideline",
  MENU_NAME_LA: "ຄູ່ມືນຳໃຊ້ລະບົບ",
  PATH: "/guideline",
  TYPE: "",
  ENABLE: 1,
  MENU_ORDER: 0,
  SUB_MENU_ID: "",
  COLOR: "",
  MENU_DESC: "",
});
onMounted(async () => {
  ///SET INIT MENU STATE ON RELOAD PAGE
  await menuStore.acGetLocalMenu();
  mainMenu.value = menuStore.getMenuList.filter(
    (el: MenuModel) => el.TYPE == "M"
  );
  menuList.value = menuStore.getMenuList.filter(
    (el: MenuModel) => el.TYPE != "M"
  );
});

const onMenuClick = async (item: MenuModel) => {
  menuSelected.value = item;
  if (item.PATH != null && item.PATH != "") {
    nuxtApp.$router.push(item.PATH);
  }
};
</script>
