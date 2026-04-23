export default defineNuxtPlugin((nuxtApp) => {
  const adminRoleCode = "ADMIN";
  const itRoleCode = "IT";
  const generalRoleCode = "GENERAL";
  nuxtApp.provide("role", () => {
    return {
      ADMIN: adminRoleCode,
      IT: itRoleCode,
      GENERAL: generalRoleCode,
    };
  });
  nuxtApp.provide("isAdmin", (roleCode: string) => {
    return adminRoleCode == roleCode;
  });
  nuxtApp.provide("isIT", (roleCode: string) => {
    return itRoleCode == roleCode;
  });

  nuxtApp.provide("isGeneral", (roleCode: string) => {
    return generalRoleCode == roleCode;
  });
});
