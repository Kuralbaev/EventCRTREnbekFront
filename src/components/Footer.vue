<template>
  <div class="bg-[#34414A] rounded-t-[56px] md:rounded-t-[100px] mt-16">
    <div
      class="footer container mx-auto grid md:grid-cols-[1fr_450px] pt-6 md:pt-16 pb-16 px-6 md:px-24 text-white"
    >
      <div
        class="md:pr-11 md:mr-11 border-b mb-6 md:mb-0 pb-6 md:pb-0 md:border-b-0 md:border-r-[1px] border-[#ffffff2a]"
      >
        <p class="text-[18px] md:text-[32px] font-regular mb-6">
          {{ $t("footer.description") }}
        </p>
        <ul
          class="text-[12px] md:text-[20px] font-medium gap-y-2 gap-x-4 text-center md:text-left grid grid-cols-3 md:grid-cols-3 justify-center md:justify-between items-center"
        >
          <li class="cursor-pointer" @click="scrollToApplication('about')">
            {{ $t("footer.links.0") }}
          </li>
          <!-- <li
            class="cursor-pointer"
            @click="scrollToApplication('application')"
          >
            {{ $t("footer.links.1") }}
          </li> -->
          <li class="cursor-pointer" @click="scrollToApplication('questions')">
            {{ $t("footer.links.2") }}
          </li>
          <li
            class="cursor-pointer col-2 md:col-none md:row-1"
            @click="scrollToApplication('about')"
          >
            {{ $t("footer.links.3") }}
          </li>
        </ul>
      </div>
      <img src="../assets/images/footer.png" alt="" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
const scrollToApplication = (id: string) => {
  const application = document.getElementById(id);
  if (application) {
    application.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style lang="scss" scoped></style>
