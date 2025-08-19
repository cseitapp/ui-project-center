<template>
  <div>
    <v-dialog
      v-model="$alertState.dialog"
      transition="dialog-top-transition"
      width="auto"
      persistent
    >
      <v-card class="rounded-lg">
        <v-toolbar
          v-if="
            $alertState.type == 'Q' ||
            $alertState.type == 'A' ||
            $alertState.type == 'R'
          "
          density="compact"
          color="info"
        >
          <Icon
            name="line-md:question"
            size="2rem"
            class="mx-2 text-white"
          ></Icon>
          <h3>{{ $t("Question") }}</h3>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar
          v-else-if="$alertState.type == 'S'"
          density="compact"
          color="success"
        >
          <Icon
            name="line-md:check-all"
            size="2rem"
            class="mx-2 text-white"
          ></Icon>
          <h3>{{ $t("Success") }}</h3>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar
          v-else-if="$alertState.type == 'E'"
          density="compact"
          color="error"
        >
          <Icon
            name="icon-park-solid:error"
            size="2rem"
            class="mx-2 text-white"
          ></Icon>
          <h3>{{ $t("Error") }}</h3>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar
          v-else-if="$alertState.type == 'W'"
          density="compact"
          color="warning"
        >
          <Icon
            name="typcn:warning-outline"
            size="2rem"
            class="mx-2 text-white"
          ></Icon>
          <h3 class="text-white">{{ $t("Warning") }}</h3>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar
          v-else-if="$alertState.type == 'I'"
          density="compact"
          color="info"
        >
          <Icon
            name="clarity:help-info-solid"
            size="2rem"
            class="mx-2 text-white"
          ></Icon>
          <h3>{{ $t("Info") }}</h3>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-toolbar
          v-else
          density="compact"
          color="secondary"
          title="Alert"
        ></v-toolbar>

        <v-card-text>
          <!-- <div class="text-h6 text-left">
            <span v-if="$alertState.type == 'Q'"> {{ $t("Question") }}</span>
            <span v-else-if="$alertState.type == 'S'">
              {{ $t("Success") }}</span
            >
            <span v-else-if="$alertState.type == 'E'"> {{ $t("Error") }}</span>
            <span v-else-if="$alertState.type == 'W'">
              {{ $t("Warning") }}</span
            >
            <span v-else-if="$alertState.type == 'I'"> {{ $t("Info") }}</span>
            <span v-else> Alert</span>
          </div> -->
          <div style="min-width: 300px; max-width: 600px">
            <v-row
              style="min-height: 100px; max-height: 250px"
              justify="center"
              :align="'center'"
            >
              <span>{{ $alertState.message }}</span>
            </v-row>

            <div v-if="$alertState.type == 'A' || $alertState.type == 'R'">
              <v-form ref="myForm">
                <v-textarea
                  v-model="$alertState.description"
                  :label="
                    $alertState.type == 'A'
                      ? $t('description')
                      : $alertState.type == 'R'
                      ? $t('reason')
                      : ''
                  "
                  row-height="25"
                  rows="3"
                  variant="outlined"
                  rounded="lg"
                  auto-grow
                  shaped
                  :rules="[(v) => $textFieldRule(v)]"
                ></v-textarea>
              </v-form>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end py-0">
          <v-btn
            class="rounded-lg"
            width="100px"
            variant="tonal"
            color="primary"
            @click="onAgree()"
            >{{ $t("OK") }}</v-btn
          >
          <v-btn
            v-if="
              $alertState.type == 'Q' ||
              $alertState.type == 'A' ||
              $alertState.type == 'R'
            "
            class="rounded-lg"
            width="100px"
            variant="tonal"
            color="error"
            @click="$alertCancel()"
            >{{ $t("Cancel") }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const nuxtApp = useNuxtApp();
const myForm: any = ref(null);
const onAgree = async () => {
  // nuxtApp.$alertState.type == "A" ||
  if (nuxtApp.$alertState.type == "R") {
    const { valid } = await myForm.value.validate();
    if (!valid) {
      return;
    }
  }

  nuxtApp.$alertAgree();
};
</script>
