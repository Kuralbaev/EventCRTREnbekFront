<template>
  <div class="nominations pt-10 md:pt-16 mx-auto">
    <h2 class="text-[32px] md:text-[72px] font-semibold text-center mb-16">
      {{ $t("nominations.title") }}
    </h2>
    <!-- rounded-t-[56px] md:rounded-t-[80px] p-6 md:p-14 pb-[200px] -mb-[370px] hover:-mb-[140px] transition-all duration-400 relative z-10 -->
    <div
      class="rounded-t-[56px] md:rounded-t-[80px] p-6 md:p-14 pb-[200px] -mb-[230px] hover:-mb-[0px] transition-all duration-400 relative z-10"
      v-for="(item, index) in nominations"
      :key="item.id"
      :style="{ background: colors[index] }"
    >
      <div
        class="grid md:grid-cols-2 gap-5 mb-14"
        :class="[2, 4].includes(index) ? 'text-[#34414A]' : 'text-white'"
      >
        <p class="text-[24px] md:text-[44px] font-medium">
          {{ item[`name_${locale}`] }}
        </p>
        <p
          class="text-[16px] md:text-[32px] font-light italic grid md:grid-cols-[70px_1fr] gap-2 opacity-80"
        >
          <a-tooltip :title="item.note">
            <img
              v-if="[2, 4].includes(index)"
              src="../../../assets/images/icons/star_gray.png"
              alt=""
              class="w-10 md:w-15"
            />
            <img
              v-else
              src="../../../assets/images/icons/star.png"
              alt=""
              class="w-10 md:w-15"
            />
          </a-tooltip>
          {{ item[`note_${locale}`] }}
        </p>
      </div>

      <div
        @click="
          store.currentNomination = item.id;
          scrollToApplication(item);
        "
        class="cursor-pointer relative h-[170px] rounded-[56px] flex items-center justify-center text-[44px] font-medium"
        :class="
          [2, 4].includes(index)
            ? 'bg-[#34414A] text-white'
            : 'bg-white text-[#34414A]'
        "
      >
        {{ $t("nominations.button.select") }}
        <img
          src="../../../assets/images/icons/n_arrow.png"
          alt=""
          class="absolute right-10 w-26"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../../../store";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";

const { locale, t } = useI18n();
const store = useStore();
const { nominations, company } = storeToRefs(store);
const colors = [
  "#34414A",
  "#7AAB7A",
  "#FFFFFF",
  "#F79F3A",
  "#FFE0B9",
  "#3C6824",
  "#D36A01",
];

const scrollToApplication = (item: any) => {
  if (item.id === 8) {
    if (company.value) {
      store.setUserType("project");
    } else {
      message.error(t("action.not_authorized"));
    }
  }

  const application = document.getElementById("application");
  if (application) {
    application.scrollIntoView({ behavior: "smooth" });
  }
};
</script>
