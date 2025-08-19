<template>
  <v-menu :close-on-content-click="false" v-model="datePickerMenu">
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="dateRang"
        :label="label ?? $t('startDate') + '-' + $t('startDate')"
        variant="outlined"
        density="comfortable"
        rounded="lg"
        prepend-inner-icon="mdi-calendar-range"
        :placeholder="
          $t('dateFormat') + ' ' + $t('to') + ' ' + $t('dateFormat')
        "
        readonly
        v-bind="props"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="dateSelected"
      color="primary"
      :multiple="'range'"
      rounded="lg"
      :min="props.minDate"
      :max="props.maxDate"
    >
      <template v-slot:actions>
        <v-btn variant="text" color="primary" @click="datePickerMenu = false">
          {{ $t("OK") }}
        </v-btn>
      </template>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts" setup>
const nuxtApp:any = useNuxtApp();
const dateRangSelected: any = defineModel("dateRangSelected");
const props = defineProps({
  minDate: {},
  maxDate: {},
  label: { type: String, required: false },
  rules: { type: Array, required: false },
});

const datePickerMenu = ref(false);
const dateSelected = ref();
const dateRang = ref();

watch(
  dateSelected,
  async (newValue, oldValue) => {
    if (newValue) {
      const range = {
        start: await nuxtApp.$formateDate(newValue[0], "DD-MM-YYYY"),
        end: await nuxtApp.$formateDate(
          dateSelected.value[newValue.length - 1],
          "DD-MM-YYYY"
        ),
      };
      dateRangSelected.value = range;
      dateRang.value = range.start + " " + nuxtApp.$t("to") + " " + range.end;
    }
  },
  { deep: true, immediate: true }
);
onMounted(async () => {
  if (dateRangSelected.value) {
    dateRang.value =
      dateRangSelected.value.start +
      " " +
      nuxtApp.$t("to") +
      " " +
      dateRangSelected.value.end;
    dateSelected.value = await nuxtApp.$getDateList(
      dateRangSelected.value.start,
      dateRangSelected.value.end,
      "DD-MM-YYYY"
    );
  }
});
</script>
