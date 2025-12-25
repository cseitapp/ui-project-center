<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-tooltip text="ປ່ຽນ Passcode">
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <v-btn
              variant="tonal"
              size="small"
              color="info"
              class="ma-1"
              v-bind="activatorProps"
            >
              <Icon name="ri:exchange-line" class="text-info" />
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
                <p>ປ່ຽນ Passcode</p>
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
                <p>ປ້ອນ Passcode ເກົ່າ</p>
                <v-otp-input
                  length="6"
                  v-model="txtOldPasscode"
                  class="text-primary"
                  :type="showPw ? 'number' : 'number'"
                ></v-otp-input>
                <p>ປ້ອນ Passcode ໃໝ່</p>
                <v-otp-input
                  length="6"
                  v-model="txtNewPasscode"
                  class="text-primary"
                  :type="showPw ? 'number' : 'number'"
                ></v-otp-input>
                <p>ປ້ອນ Passcode ໃໝ່ອີກຄັ້ງ</p>
                <v-otp-input
                  length="6"
                  v-model="txtConfirmPasscode"
                  class="text-primary"
                  :type="showPw ? 'number' : 'number'"
                ></v-otp-input>
                <!-- <v-checkbox
                  v-model="showPw"
                  color="primary"
                  label="ສະແດງ Passcode"
                ></v-checkbox> -->
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
                    onChangePasscode();
                  }
                "
                >ປ່ຽນ Passcode</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(["onClose"]);
const props = defineProps({
  item: Object as PropType<PasscodeInfoModel>,
});
const passcodeStore = usePasscodeStore();
const nuxtApp = useNuxtApp();
//paramitter
const myForm = ref();
const txtOldPasscode = ref();
const txtNewPasscode = ref();
const txtConfirmPasscode = ref();
const showPw = ref(false);

const onChangePasscode = async () => {
  if (
    !txtOldPasscode.value ||
    !txtNewPasscode.value ||
    !txtConfirmPasscode.value ||
    txtOldPasscode.value.length < 6 ||
    txtNewPasscode.value.length < 6 ||
    txtConfirmPasscode.value.length < 6
  ) {
    nuxtApp.$openAlert("W", "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ");
    return;
  }
  if (txtNewPasscode.value != txtConfirmPasscode.value) {
    nuxtApp.$openAlert("W", "Passcode ໃໝ່ບໍ່ຕົງກັນ");
    return;
  }
  nuxtApp
    .$openAlert("Q", "ທ່ານຕ້ອງການປ່ຽນ passcode ແທ້ບໍ?")
    .then(async (r: any) => {
      var body = {
        user_name: props.item?.USER_NAME,
        purepose: props.item?.PUREPOSE,
        old_passcode: txtOldPasscode.value,
        new_passcode: txtNewPasscode.value,
        confirm_passcode: txtConfirmPasscode.value,
      };
      nuxtApp.$openLoading();
      await passcodeStore
        .acChangePasscode(body)
        .then(async (result: ResponseModel) => {
          nuxtApp.$closeLoading();
          txtOldPasscode.value = "";
          txtNewPasscode.value = "";
          txtConfirmPasscode.value = "";
          if (result.ERROR_CODE == "00") {
            nuxtApp.$openAlert(
              "S",
              result.ERROR_CODE + ": " + result.ERROR_DESC
            );
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
