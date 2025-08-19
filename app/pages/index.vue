<style scoped>
.login-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  padding: 0px;
  overflow: hidden;
  /* background-image: url("~/assets/img/bg/background.webp"); */
  background-color: #6f5bf2;
}

.bg-text {
  background-color: rgb(255, 255, 255);
  /* Fallback color */
  background-color: rgba(218, 218, 218, 0.242);
  border: 1px solid #ffffff;
  color: white;
  /* Black w/opacity/see-through */
}

.gold-text {
  -webkit-background-clip: text;
  background-image: linear-gradient(
    90deg,
    #cb9b51 22%,
    #f6e27a 45%,
    #f6f2c0 50%,
    #f6e27a 55%,
    #cb9b51 78%
  );
  color: transparent;
}
</style>

<template>
  <div class="login-bg d-flex justify-center align-center gradient-bg-primary">
    <v-card
      class="rounded-xl ma-4 pa-6 bg-text"
      style="position: absolute; backdrop-filter: blur(2px)"
    >
      <v-card-text>
        <v-row class="ma-0" justify="center">
          <div>
            <div class="text-center">
              <img
                src="~/assets/img/logo/logo_cse_white.png"
                height="70"
                alt="cse_logo"
              />
            </div>
            <div class="gold-text text-center">
              <div class="mb-6" style="font-size: 24px">
                <h3>{{ $t("projectName") }}</h3>
              </div>
            </div>
            <v-form ref="myForm">
              <div class="py-1">
                <v-text-field
                  v-model="txtUserName"
                  :label="$t('UserName')"
                  persistent-hint
                  rounded="lg"
                  color="white"
                  prepend-inner-icon="mdi-account"
                  :rules="[(v:any) => $userNameTextFieldRule(v)]"
                  variant="outlined"
                  density="compact"
                  @keyup.enter="onSubmit"
                ></v-text-field>
              </div>
              <div class="py-1">
                <v-text-field
                  v-model="txtPassword"
                  :label="$t('Password')"
                  persistent-hint
                  rounded="lg"
                  color="white"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="
                    showPw ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                  "
                  :type="showPw ? 'text' : 'password'"
                  :rules="[
                    (v) => $passwordTextFieldRule(v),
                    (v) => $countMinRule(v, 6),
                  ]"
                  variant="outlined"
                  density="compact"
                  @click:append-inner="showPw = !showPw"
                  @keyup.enter="onSubmit"
                ></v-text-field>
              </div>
            </v-form>
          </div>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          rounded="lg"
          variant="elevated"
          class="wd-100"
          color="primary"
          @click="onSubmit"
        >
          <v-row clas s="ma-0">
            <Icon
              name="line-md:login"
              class="mr-2 text-white"
              size="1.2rem"
            ></Icon>
            <span>{{ $t("login") }}</span>
          </v-row>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const nuxtApp: any = useNuxtApp();
const myForm: any = ref(null);
// const txtUserName = ref("CSE891");
// const txtPassword = ref("admincse");
const txtUserName = ref();
const txtPassword = ref();
const showPw = ref(false);

const loginStore = useLoginStore();
const menuStore = useMenuStore();

//clear filter
// leaveStore.setLeaveFilterBody(null);
// leaveStore.setLeaveAuthorizeFilterBody(null);
// checkInStore.setCheckInFilterBody(null);
// checkInStore.setCheckInAuthorizeFilterBody(null);

const onSubmit = async () => {
  const { valid } = await myForm.value.validate();
  if (valid) {
    const body: any = {
      userName: txtUserName.value.trim(),
      password: txtPassword.value,
    };
    nuxtApp.$openLoading();
    loginStore
      .loginSystem(body)
      .then(async (result: ResponseModel) => {
        if (result.ERROR_CODE == "00") {
          menuStore
            .acGetLoginMenuList({
              project_id: nuxtApp.$env.projectID,
              role_id: loginStore.user?.ROLE_ID,
            })
            .then((menuResult) => {
              nuxtApp.$closeLoading();
              nuxtApp.$router.push("/home");
            })
            .catch((err) => {
              nuxtApp.$closeLoading();
              nuxtApp.$openAlert("E", err);
            });
        } else {
          nuxtApp.$closeLoading();
          nuxtApp.$openAlert("E", result.ERROR_CODE + ": " + result.ERROR_DESC);
        }
      })
      .catch((err: any) => {
        nuxtApp.$closeLoading();
        nuxtApp.$openAlert("E", err);
      });
  }
};
</script>
