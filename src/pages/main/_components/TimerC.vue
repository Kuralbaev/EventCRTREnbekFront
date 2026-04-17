<template>
  <div class="time">
    <!-- <h2 class="text-[32px] md:text-[72px] font-semibold text-center mb-8">
      {{ $t("timer.title") }}
    </h2>
    <div
      class="bg-white rounded-[36px] md:rounded-[80px] p-6 md:p-14 max-w-[1488px] w-[90%] mx-auto"
    >
      <div class="timer grid grid-cols-4 gap-2 md:gap-5 mb-4 md:mb-8">
        <p
          v-for="(t, idx) in timer.split(',')"
          :key="t"
          class="text-[14px] md:text-[32px] font-semibold h-[40px] md:h-[100px] flex items-center justify-center w-full rounded-[16px] md:rounded-[32px] bg-[#7AAB7A] text-white"
        >
          {{ t }} {{ timeText[idx] }}
        </p>
      </div>
      <p class="text-[12px] md:text-[24px] font-medium text-center">
        {{ $t("timer.description") }}
      </p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { countdown } from "../../../helpers/countdown.ts";
import { ref } from "vue";

const timer = ref("");
const timeText = ["дней", "часа", "минут", "секунд"];

setInterval(() => {
  timer.value = countdown(
    new Date(2025, 9, 1, 0, 0),
    null,
    countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS
  ).toString();
}, 1000);
</script>
