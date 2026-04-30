<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-tooltip text="Reset ລະຫັດຜ່ານ">
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <v-btn
              variant="tonal"
              size="small"
              color="warning"
              class="ma-1"
              v-bind="activatorProps"
            >
              <Icon name="carbon:reset" class="text-warning" />
            </v-btn>
          </div>
        </template>
      </v-tooltip>
    </template>

    <template v-slot:default="{ isActive }">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="3">
          <v-card rounded="lg">
            <v-card-title>
              <v-row class="ma-0" :align="'center'">
                <p>Reset ລະຫັດຜ່ານ</p>
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
                <div class="text-center mb-4">
                  <p>{{ props.item?.USER_NAME }}</p>
                  <p>{{ props.item?.FULL_NAME_LA }}</p>
                  <p>
                    {{ props.item?.BR_NAME }}, {{ props.item?.SEC_NAME }},
                    {{ props.item?.TEAM_NAME }}
                  </p>
                </div>

                <p class="mb-1">ປ້ອນລະຫັດຜ່ານໃໝ່</p>
                <v-text-field
                  v-model="txtNewPasscode"
                  persistent-hint
                  rounded="lg"
                  color="primary"
                  prepend-inner-icon="mdi-lock"
                  :type="showPw ? 'text' : 'password'"
                  :rules="[
                    (v) => $passwordTextFieldRule(v),
                    (v) => $countMinRule(v, 6),
                  ]"
                  variant="outlined"
                  density="compact"
                ></v-text-field>

                <p class="mb-1">ປ້ອນລະຫັດຜ່ານໃໝ່ອີກຄັ້ງ</p>

                <v-text-field
                  v-model="txtConfirmPasscode"
                  persistent-hint
                  rounded="lg"
                  color="primary"
                  prepend-inner-icon="mdi-lock"
                  :type="showPw ? 'text' : 'password'"
                  :rules="[
                    (v) => $passwordTextFieldRule(v),
                    (v) => $countMinRule(v, 6),
                  ]"
                  variant="outlined"
                  density="compact"
                ></v-text-field>
                <v-checkbox
                  v-model="showPw"
                  color="primary"
                  label="ສະແດງລະຫັດຜ່ານ"
                  hide-details
                ></v-checkbox>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                variant="flat"
                color="primary"
                class="w-100"
                @click="
                  async () => {
                    await onChangePasscode(isActive);
                  }
                "
                >ປ່ຽນລະຫັດຜ່ານ</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["onSuccess", "onClose"]);
const props = defineProps({
  item: Object as PropType<UserLoginModel>,
});

const userStore = useUserStore();
const nuxtApp: any = useNuxtApp();
//paramitter
const myForm = ref();
const txtNewPasscode = ref();
const txtConfirmPasscode = ref();
const showPw = ref(false);

const onChangePasscode = async (isActive: any) => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    if (
      txtNewPasscode.value.length < 6 ||
      txtConfirmPasscode.value.length < 6
    ) {
      nuxtApp.$openAlert("W", "ລະຫັດຜ່ານຕ້ອງມີຫຼາຍກວ່າ 5 ຕົວ");
      return;
    }
    if (txtNewPasscode.value != txtConfirmPasscode.value) {
      nuxtApp.$openAlert("W", "ລະຫັດຜ່ານໃໝ່ບໍ່ຕົງກັນ");
      return;
    }

    nuxtApp
      .$openAlert("Q", "ທ່ານຕ້ອງການ restet ແທ້ບໍ?")
      .then(async (r: any) => {
        var body = {
          user_name: props.item?.USER_NAME,
          new_password: txtNewPasscode.value,
          confirm_password: txtConfirmPasscode.value,
        };
        nuxtApp.$openLoading();
        await userStore
          .acResetPasswordUserLogin(body)
          .then(async (result: ResponseModel) => {
            nuxtApp.$closeLoading();
            txtNewPasscode.value = "";
            txtConfirmPasscode.value = "";
            if (result.ERROR_CODE == "00") {
              nuxtApp.$openAlert(
                "S",
                result.ERROR_CODE + ": " + result.ERROR_DESC
              );
              isActive.value = false;
              emit("onSuccess");
            } else {
              nuxtApp.$openAlert(
                "E",
                result.ERROR_CODE + ": " + result.ERROR_DESC
              );
            }
          });
      })
      .catch((c: any) => {});
  }
};
</script>
