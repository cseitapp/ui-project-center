export default defineNuxtRouteMiddleware(async (to, from) => {
  // // isAuthenticated() is an example method verifying if a user is authenticated

  const menuStore = useMenuStore();
  ///SET INIT MENU STATE
  await menuStore.acGetLocalMenu();
  const isContain = ref(false);
  const list: MenuModel[] = menuStore.getMenuList.filter(
    (el) => el.PATH == to.path
  );
  if (list.length > 0 || to.path == "/home") {
    isContain.value = true;
  }
  if (isContain.value === false) {
    return navigateTo("/");
  }
});
