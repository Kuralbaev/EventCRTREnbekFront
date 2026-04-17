<template>
  <div class="about pt-[200px] pb-10 md:pb-[120px]" id="about">
    <div class="container mx-auto">
      <h2 class="text-[16px] md:text-[32px] font-semibold md:w-3/5 mb-16">
        {{ $t("about.title") }}
      </h2>
      <div class="grid md:grid-cols-[552px_1fr] gap-5">
        <div>
          <div
            class="bg-white rounded-[32px] md:rounded-[80px] p-6 md:p-14 mb-5 md:mb-10"
          >
            <p class="text-[24px] md:text-[44px] font-semibold mb-4 md:mb-8">
              {{ $t("about.subtitle") }}
            </p>
            <ul
              class="text-[14px] md:text-[20px] font-semibold list-disc ml-5 space-y-4 md:space-y-8"
            >
              <li v-for="item in list" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div
            class="bg-[#ffffffbf] rounded-[32px] md:rounded-[80px] p-6 md:p-14"
          >
            <p class="text-[24px] md:text-[44px] font-semibold mb-4 md:mb-8">
              {{ $t("about.stages.title") }}
            </p>
            <p
              class="text-[16px] md:text-[32px] font-bold mb-2 bg-[#34414A] rounded-[24px] text-white p-4 w-fit"
            >
              {{ $t("about.stages.regional") }}
            </p>
            <p
              class="text-[16px] md:text-[32px] font-bold mb-8 bg-[#D9913F] rounded-[24px] text-white p-4 w-fit"
            >
              {{ $t("about.stages.republican") }}
            </p>
            <p class="text-[14px] md:text-[20px] font-semibold">
              {{ $t("about.stages.description") }}
            </p>
          </div>
        </div>
        <div>
          <div
            class="bg-[#ffffff45] rounded-[32px] md:rounded-[80px] p-6 md:p-14 mb-5"
          >
            <p class="text-[24px] md:text-[44px] font-semibold mb-4 md:mb-8">
              {{ $t("about.who.title") }}
            </p>
            <ul
              class="text-[14px] md:text-[20px] font-semibold list-disc ml-5 space-y-4 md:space-y-8"
            >
              <li v-for="item in who" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div
            class="bg-[#ffffff71] rounded-[32px] md:rounded-[80px] p-6 md:p-14"
          >
            <p class="text-[24px] md:text-[44px] font-semibold mb-4 md:mb-8">
              {{ $t("about.dates.title") }}
            </p>
            <p
              v-for="(item, idx) in dates"
              class="text-[16px] md:text-[32px] font-bold mb-2 rounded-[24px] text-white p-4 w-fit"
              :class="idx % 2 !== 0 ? 'bg-[#D9913F]' : 'bg-[#34414A]'"
            >
              {{ item }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n();

const list = computed(() => {
  return [
    t("about.list.0"),
    t("about.list.1"),
    t("about.list.2"),
    t("about.list.3"),
  ];
});

const who = computed(() => {
  return [t("about.who.list.0"), t("about.who.list.1")];
});

const dates = computed(() => {
  return [
    t("about.dates.list.0"),
    t("about.dates.list.1"),
    t("about.dates.list.2"),
    t("about.dates.list.3"),
    t("about.dates.list.4"),
  ];
});
</script>
