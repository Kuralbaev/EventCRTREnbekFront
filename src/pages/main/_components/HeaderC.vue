<template>
  <Header />
  <div
    class="header py-0 md:py-14 rounded-t-3xl relative h-[670px] md:h-[800px]"
  >
    <img
      src="../../../assets/images/back.png"
      class="absolute top-0 left-1/2 -translate-x-1/2 h-full object-cover rounded-[48px] md:rounded-[100px] w-full"
    />
    <div class="container mx-auto relative z-10 h-full p-6 md:p-0">
      <div class="flex justify-end items-center gap-2 md:gap-5 relative z-10">
        <div
          class="flex gap-6 px-6 items-center h-12 md:h-18 rounded-full bg-white font-bold text-[14px] md:text-[20px]"
        >
          <p
            class="cursor-pointer"
            @click="(locale = 'kk'), store.setLanguage('kk')"
            :class="{
              'opacity-50': locale !== 'kk',
              'opacity-100': locale === 'kk',
            }"
          >
            Қаз
          </p>
          <p
            class="cursor-pointer"
            @click="(locale = 'ru'), store.setLanguage('ru')"
            :class="{
              'opacity-50': locale !== 'ru',
              'opacity-100': locale === 'ru',
            }"
          >
            Руc
          </p>
        </div>
        <template v-if="!!user">
          <div
            @click="$router.push('/profile')"
            class="flex gap-2 px-6 items-center h-12 md:h-18 rounded-full bg-white font-bold text-[14px] md:text-[20px] cursor-pointer"
          >
            <img
              src="../../../assets/images/icons/user.png"
              class="w-4 h-4 md:w-6 md:h-6"
            />
            {{ $t("actions.profile") }}
          </div>
        </template>
        <template v-else>
          <div
            @click="handleSign"
            class="flex gap-2 px-6 items-center h-12 md:h-18 rounded-full bg-white font-bold text-[14px] md:text-[20px] cursor-pointer"
          >
            <img
              src="../../../assets/images/icons/logout.png"
              class="w-4 h-4 md:w-6 md:h-6"
            />
            {{ $t("actions.login") }}
          </div>
        </template>
      </div>
      <div
        class="z-10 text-white md:w-1/2 top-2/5 md:top-1/2 -translate-y-1/2 absolute"
      >
        <h1
          class="text-[36px] md:text-[72px] font-semibold mb-5 md:mb-10 leading-[1.1]"
        >
          {{ $t("header.title") }}
        </h1>
        <p
          class="text-[16px] md:text-[32px] font-normal mb-5 md:mb-10 leading-[1.2]"
        >
          {{ $t("header.subtitle") }}
        </p>
        <p
          class="text-[12px] md:text-[20px] font-normal flex items-center gap-2"
        >
          <img
            src="../../../assets/images/icons/calendar.png"
            alt=""
            class="w-6 -mt-1"
          />
          {{ $t("header.date") }}
        </p>
      </div>
      <div
        class="absolute w-[calc(100%-50px)] md:w-full h-full md:flex justify-center gap-10 top-[calc(100%-40px)] md:top-[calc(100%-20px)]"
      >
        <template v-if="store.voting">
          <Button
            :text="$t('header.button.voting')"
            color="green"
            @click="handleSign()"
            class="mb-4 md:mb-0 w-full md:w-[706px]"
          />
        </template>
        <template v-else>
          <Button
            :text="$t('header.button.worker')"
            color="green"
            @click="scrollToApplication()"
            class="mb-4 md:mb-0 w-full md:w-[606px]"
          />
          <Button
            :text="$t('header.button.project')"
            color="orange"
            @click="scrollToApplication()"
            class="w-full md:w-[606px]"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "../../../components/Button.vue";
import { useStore } from "../../../store";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { connectAndSign } from "../../../helpers/ecp";
import { ref } from "vue";
import axios from "axios";
import Header from "../../../components/Header.vue";
const store = useStore();
const { user } = storeToRefs(store);
const { locale } = useI18n();
const router = useRouter();
const loading = ref(false);

const getUser = async (iin: string) => {
  const { data } = await axios.post(
    `https://interaction.enbek.kz/questionary`,
    {
      serviceType: "questionary",
      action: "getByIin",
      data: { iin: iin },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "Questionary12#$%",
      },
    }
  );
  store.fetchUser({
    ...data.data,
    iin: iin,
    education: !data.data.education.length
      ? ""
      : `${data.data.education[data.data.education.length - 1].orgNameRu} (${
          data.data.education[data.data.education.length - 1].specialtyRu
        })`,
  });
};

const handleSign = () => {
  if (user.value) {
    router.push("/voting");
    return;
  }
  loading.value = true;
  connectAndSign()
    .then(async (user) => {
      await getUser(user.iin);
      await store.fetchCommission();
      router.push("/voting");
    })
    .catch(() => {
      message.error("Не удалось подписать");
    })
    .finally(() => {
      loading.value = false;
    });
};

const scrollToApplication = () => {
  if (!user.value) {
    message.warning("Нужно авторизоваться");
  }
  const application = document.getElementById("application");
  if (application) {
    application.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<style lang="scss" scoped></style>
