<template>
  <button
    :class="colors[props.color]"
    class="cursor-pointer transition-all duration-300 border-b-[8px] md:border-b-[16px] w-[606px] h-[80px] md:h-[154px] rounded-[56px] flex items-center justify-center text-[16px] md:text-[32px] font-medium text-white"
  >
    <template v-if="loading">
      <div
        class="w-[24px] md:w-[34px] h-[24px] md:h-[34px] border-t-[2px] border-b-[2px] border-t-white border-white rounded-full animate-spin"
      ></div>
    </template>
    <template v-else>
      {{ text }}
    </template>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  text: string;
  color: "green" | "orange" | "grey" | "black";
  loading?: boolean;
}>();

const colors = {
  green:
    "bg-[#7AAB7A] border-[#689168] hover:bg-[#549D54] hover:border-[#478547] shadow-[0px_24px_32px_0px_rgba(0,0,0,0.25)]",
  orange:
    "bg-[#FFAB4A] border-[#D9913F] hover:bg-[#F5992E] hover:border-[#D08227] shadow-[0px_24px_32px_0px_rgba(0,0,0,0.25)]",
  black:
    "bg-[#34414A] border-[#2C373F] shadow-[0px_24px_32px_0px_rgba(0,0,0,0.25)]",
  grey: "bg-[#DEE3E9] border-[#BDC1C6] cursor-not-allowed",
};
</script>

<style lang="scss" scoped></style>
