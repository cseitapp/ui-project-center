<template>
  <div :class="props.data?.CLASS">
    
      <template v-if="props.data?.ICON != null && props.data?.ICON != ''">
        <Icon
          :name="props.data?.ICON ?? ''"
          :class="props.data?.CLASS"
          class="mr-1"
          style="margin-bottom: -4px;"
        />
      </template>
      <span> {{ props.data?.TEXT }}</span>

  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: Object as PropType<CodeAndTextModel>,
});
</script>
