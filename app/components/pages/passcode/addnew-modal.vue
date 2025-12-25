<template>
  <v-dialog>
    <template v-slot:activator="{ props: activatorProps }">
      <v-tooltip text="ປ່ຽນ Passcode">
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <v-btn variant="tonal" color="success" v-bind="activatorProps">
              <Icon name="mingcute:add-fill" class="text-success mr-1" />
              <p>{{ $t("addNew") }}</p>
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
                <v-combobox
                  v-model="userSelected"
                  :items="employeeStore.getEmployeeList"
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
                <v-combobox
                  v-model="typeSelected"
                  :items="passcodeStore.getPasscodeTypeList"
                  density="comfortable"
                  rounded="lg"
                  autocomplete="off"
                  item-title="TYPE_CODE"
                  item-value="TYPE_CODE"
                  :label="$t('type')"
                  color="primary"
                  variant="outlined"
                  :rules="[(v) => $selectionRule(v)]"
                ></v-combobox>

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
const emit = defineEmits(["onSuccess"]);

const passcodeStore = usePasscodeStore();
const loginStore = useLoginStore();
const utilStore = useUtilStore();
const employeeStore = useEmployeeStore();
const nuxtApp = useNuxtApp();
//paramitter
const myForm = ref();

const txtNewPasscode = ref();
const txtConfirmPasscode = ref();
const showPw = ref(false);
const userSelected = ref<EmployeeModel | null>(null);
const typeSelected = ref<PasscodeTypeModel | null>(null);

const onChangePasscode = async () => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    if (
      !txtNewPasscode.value ||
      !txtConfirmPasscode.value ||
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

    var body = {
      user_name: userSelected.value?.USER_NAME,
      purepose: typeSelected.value?.TYPE_CODE,
      passcode: txtNewPasscode.value,
      created_by: loginStore.loginUser?.USER_NAME,
      status: "A",
      action: utilStore.getActnoCode.INSERT,
    };
    nuxtApp.$openLoading();
    await passcodeStore
      .acCreatePasscode(body)
      .then(async (result: ResponseModel) => {
        nuxtApp.$closeLoading();

        txtNewPasscode.value = "";
        txtConfirmPasscode.value = "";
        if (result.ERROR_CODE == "00") {
          nuxtApp
            .$openAlert("S", result.ERROR_CODE + ": " + result.ERROR_DESC)
            .then((r) => {
              emit("onSuccess");
            });
        } else {
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      });
  }
};
</script>
