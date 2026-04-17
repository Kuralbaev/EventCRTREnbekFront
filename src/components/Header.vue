<template>
  <div
    class="head flex justify-center w-full text-[12px] md:text-[20px] leading-none items-center py-1 text-[#34414A]"
  >
    <img src="/logo.svg" alt="" class="w-18" />
    <p class="border-[#34414A] ml-4 font-medium">
      {{ $t("header.top.title") }}
    </p>
    <p class="border-l-[2px] border-[#34414A] pl-4 ml-4 font-medium">
      {{ $t("header.top.subtitle") }}
    </p>
    <p
      class="border-l-[2px] leading-none border-[#34414A] pl-4 ml-4 font-medium mr-6 md:mr-0"
    >
      {{ $t("header.top.year") }}
    </p>
  </div>
</template>
