export default defineNuxtPlugin((nuxtApp) => {
  //   nuxtApp.provide("textFieldRule", [
  //     (v: any) => (v ? true : "PleaseEnterData"),
  //   ]);
  return {
    provide: {
      userNameTextFieldRule: (v: any) => (v ? true : "ກະລຸນາປ້ອນໄອດີພະນັກງານ"),
      passwordTextFieldRule: (v: any) => (v ? true : "ກະລຸນາປ້ອນລະຫັດຜ່ານ"),
      textFieldRule: (v: any) => (v ? true : "ກະລຸນາປ້ອນຂໍ້ມູນ"),
      selectionRule: (v: any) => (v ? true : "ກະລຸນາເລືອກຂໍ້ມູນ"),
      countMinRule: (v: any, min: number) =>
        (v && v.length >= min) || `ຕົວອັກສອນ ຕ້ອງຫຼາຍກວ່າ ${min} ຕົວອັກສອນ`,
      countMinMaxRule: (v: any, min: number, max: number) =>
        (v && v.length >= min && v.length < max) ||
        `ຕົວອັກສອນ ຕ້ອງຫຼາຍກວ່າ ${min} ຫຼື ນ້ອຍກວ່າ ${max}  ຕົວອັກສອນ`,
      textFieldScoreRule: (v: any, min: number, max: number) =>
        (v && Number(v) >= min && Number(v) <= max) ||
        `ຄະແນນ > ${min} ແລະ <= ${max}  ຄະແນນ`,
    },
  };
});
