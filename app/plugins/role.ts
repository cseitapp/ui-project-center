export default defineNuxtPlugin((nuxtApp) => {
  const adminRoleCode = "ADMIN";
  const generalRoleCode = "GENERAL";
  nuxtApp.provide("role", () => {
    return {
      ADMIN: adminRoleCode,

      GENERAL: generalRoleCode,
    };
  });
  nuxtApp.provide("isAdmin", (roleCode: string) => {
    return adminRoleCode == roleCode;
  });

  nuxtApp.provide("isGeneral", (roleCode: string) => {
    return generalRoleCode == roleCode;
  });
});
