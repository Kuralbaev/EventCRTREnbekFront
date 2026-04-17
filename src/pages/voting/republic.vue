<template>
  <div>
    <Header />
    <div class="header py-0 md:py-14 rounded-t-3xl relative p-14">
      <div class="absolute top-6 right-6 z-10 flex gap-2">
        <div
          class="flex gap-6 px-6 items-center h-12 rounded-full bg-white text-[14px] font-bold"
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
        <div
          @click="$router.push('/profile')"
          class="flex gap-2 px-6 items-center rounded-full bg-white font-bold text-[14px] cursor-pointer"
        >
          <img src="../../assets/images/icons/user.png" class="w-5 h-5" />
          {{ $t("actions.profile") }}
        </div>
      </div>
      <img
        src="../../assets/images/back.png"
        class="absolute top-0 left-1/2 -translate-x-1/2 h-full object-cover rounded-[48px] md:rounded-[100px] w-full"
      />
      <div
        class="container mx-auto relative z-10 h-full p-6 md:p-0 text-center text-white"
      >
        <h1 class="text-[72px] mb-6">
          Голосуйте за лучших <br />
          участников конкурса!
        </h1>
        <p class="text-[24px] opacity-80 mb-11">
          Один голос - одна возможность изменить судьбу.
        </p>
      </div>
      <div
        class="relative z-10 bg-white rounded-[56px] md:rounded-[40px] mx-auto p-6 md:p-14"
      >
        <div class="flex items-center">
          <a-form
            layout="vertical"
            :model="formState"
            class="grid grid-cols-4 gap-4 w-full"
            :class="{ '!grid-cols-3': check_commission }"
          >
            <a-form-item
              :label="$t('application.employee.form.fio')"
              name="fio"
              class="w-full input"
            >
              <a-input
                v-model:value="formState.fio"
                class="h-[40px] md:h-[56px] w-full !rounded-[24px] !border-[#E0E5EA] disabled:!text-black !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6 !cursor-default"
              />
            </a-form-item>
            <a-form-item
              :label="$t('application.employee.form.essay.nomination')"
              name="nomination"
              class="w-full input h-min"
            >
              <a-select
                size="small"
                v-model:value="formState.nomination"
                class="h-[40px] md:h-[56px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[20px] !font-medium"
              >
                <a-select-option value="">Все номинации</a-select-option>
                <a-select-option
                  v-for="nomination in nominations"
                  :value="nomination"
                >
                  {{ nomination }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="Статус"
              name="voting"
              class="w-full input h-min"
            >
              <a-select
                size="small"
                v-model:value="formState.voting"
                class="h-[40px] md:h-[56px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[20px] !font-medium"
              >
                <a-select-option value="">Все</a-select-option>
                <a-select-option value="voting">Исполненые</a-select-option>
                <a-select-option value="not_voting">В работе</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
          <div
            class="w-[50px] flex items-end justify-end"
            v-if="
              formState.fio ||
              formState.work_place ||
              formState.region ||
              formState.nomination
            "
            @click="resetForm"
          >
            <CloseCircleFilled
              class="text-[24px] cursor-pointer !text-red-600"
              @click="formState.fio = ''"
            />
          </div>
        </div>
        <template v-if="check_commission">
          <a-divider class="!my-3 !mt-0" />
          <p class="text-[20px] font-medium mb-2">Комиссия: {{ user.fio }}</p>
          <div class="flex gap-3">
            <p
              class="text-[16px] font-medium border border-[#E0E5EA] rounded-[12px] p-2 px-3 w-max"
            >
              {{ filterUsers?.length }} участников
            </p>
            <p
              class="text-[16px] font-medium bg-[#7AAB7A] text-white rounded-[12px] p-2 px-3 w-max"
            >
              {{ votingListRepublic?.length }} проголосовали
            </p>
            <p
              class="text-[16px] font-medium bg-yellow-500 text-white rounded-[12px] p-2 px-3 w-max"
            >
              {{ filterUsers?.length - votingListRepublic?.length }} не
              проголосовали
            </p>
          </div>
        </template>
      </div>
    </div>

    <div class="flex justify-center items-center h-full pt-20" v-if="loading">
      <a-spin size="large" />
    </div>
    <div class="list p-14 grid grid-cols-3 gap-2" v-else>
      <div
        class="card p-6 rounded-[26px] relative bg-white pb-18"
        v-for="user in filterUsers.filter((user) =>
          !formState.voting
            ? true
            : formState.voting === 'voting'
            ? voting_ids.includes(+user.id)
            : !voting_ids.includes(+user.id)
        )"
        :key="user.id"
      >
        <div
          v-if="voting_ids?.includes(+user.id)"
          class="bg-[#7AAB7A] text-white rounded-full p-1 w-max absolute top-3 right-3 z-10 text-[24px] flex items-center justify-center"
        >
          <span class="text-[16px] block px-2" v-if="voting_balls(user.id)">{{
            voting_balls(user.id)
          }}</span>
          <CheckCircleOutlined />
        </div>
        <p class="text-[20px] font-medium mb-3 w-[calc(100%-48px)]">
          {{ user.fio || user.author }}
        </p>
        <p class="text-[16px] font-medium mb-3">
          {{ user.nomination ? user.nomination.name_ru : "Проект" }}
        </p>
        <div>
          <template
            v-for="key in [
              'project_name',
              'work_region',
              'languages',
              'education',
              'iin',
              'bin',
            ]"
            :key="key"
          >
            <div
              v-if="user[key]"
              class="inline-block mr-2 mb-1 bg-[#F0F2F4] p-2 px-3 rounded-[12px]"
            >
              <p class="text-[14px] font-medium text-[#656565] line-clamp-2">
                {{ user[key] }}
              </p>
            </div>
          </template>
        </div>

        <a-button
          class="w-[calc(100%-50px)] mt-4 !bg-[#7AAB7A] !border-0 !text-white !absolute bottom-4"
          size="large"
          color="green"
          @click="$router.push(`/voting/${user.id}`)"
          >Посмотреть</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref, computed } from "vue";
import { useStore } from "../../store";
import { useI18n } from "vue-i18n";
import { CheckCircleOutlined, CloseCircleFilled } from "@ant-design/icons-vue";
import { storeToRefs } from "pinia";
import Header from "../../components/Header.vue";

const store = useStore();
const {
  check_commission,
  votingListRepublic,
  voting_ids,
  user,
  users_nomination,
  protocol_users,
} = storeToRefs(store);
const { locale } = useI18n();
const loading = ref(true);

const formState = reactive({
  fio: "",
  work_place: "",
  region: "",
  nomination: "",
  voting: "",
});

const voting_balls = (id: any) => {
  return votingListRepublic.value
    .find((v: any) => v.user.id === id)
    ?.voting?.split(",")
    .reduce((acc: any, v: any) => acc + +v, 0);
};

const regions = computed(() => {
  return new Set(users_nomination.value.map((user) => user.region));
});

const nominations = computed(() => {
  return new Set(
    users_nomination.value.map((user) =>
      user.nomination ? user.nomination : "Проект"
    )
  );
});

onMounted(async () => {
  await store.fetchUsersNominationRepublic();
  await store.fetchVotingRepublic();
  loading.value = false;
});

const filterUsers = computed(() => {
  return protocol_users.value
    .filter((user) =>
      !!formState.fio
        ? user.fio.toLowerCase().includes(formState.fio.toLowerCase())
        : true
    )
    .filter((user) =>
      !!formState.region ? user.region === formState.region : true
    )
    .filter((user) =>
      !!formState.nomination
        ? formState.nomination === "Проект"
          ? !user.nomination
          : user.nomination.name_ru === formState.nomination
        : true
    )
    .filter((user) =>
      !!formState.work_place
        ? user.work_place
            ?.toLowerCase()
            ?.includes(formState.work_place.toLowerCase())
        : true
    );
});

const resetForm = () => {
  formState.fio = "";
  formState.region = "";
  formState.nomination = "";
  formState.voting = "";
};
</script>
