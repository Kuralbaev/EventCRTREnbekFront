<template>
  <div class="statistic px-6 mx-auto">
    <Header />

    <!-- <a-button
      class="mb-10 !bg-[#34414A] !border-0 !text-white"
      size="large"
      @click="start"
    >
      Статистика 2025
    </a-button> -->

    <!-- <Button
      v-if="!user"
      @click="auth"
      text="Авторизоваться"
      color="black"
      class="w-[606px] m-auto mt-10"
    /> -->

    <div class="bg-white justify-between rounded-[64px] p-14 mx-auto">
      <div>
        <div class="flex items-center gap-4 mb-4">
          <div
            class="cursor-pointer w-10 h-10 rounded-full bg-[#34414A] flex items-center justify-center text-white"
            @click="$router.back()"
          >
            <ArrowLeftOutlined class="text-[16px]" />
          </div>
          <p class="text-[24px] font-light">
            Всего
            <span class="font-bold">{{ protocols.length }}</span>
            участников
          </p>
        </div>
      </div>

      <a-divider />

      <div class="flex items-end gap-4 border-b border-[#767676] pb-4">
        <div
          class="grid grid-cols-[180px_1fr_200px_180px_180px] items-end w-full"
        >
          <p class="text-[14px] font-bold w-full">ИИН</p>
          <p class="text-[14px] font-bold w-full">ФИО</p>
          <p class="text-[14px] font-bold w-full text-center">Количество</p>
          <p class="text-[14px] font-bold w-full text-center">Исполненые</p>
          <p class="text-[14px] font-bold w-full text-center">В работе</p>
        </div>
      </div>
      <div
        class="flex items-end gap-4"
        v-for="(user, key) in Object.values(getByCommission).sort((a: any, b: any) => b.isChairman - a.isChairman)"
        :key="user.iin"
      >
        <div
          class="grid grid-cols-[180px_1fr_200px_180px_180px] items-end w-full"
        >
          <p
            class="text-[14px] font-bold w-full py-2 border-b h-full flex items-center gap-2"
          >
            {{ check_iin(user.iin) }}
          </p>
          <p class="text-[14px] font-bold w-full pr-4 h-full py-2 border-b">
            {{ user.fio }}
          </p>
          <p
            class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full text-center"
          >
            {{ protocols.length }}
          </p>
          <p
            class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full text-center"
          >
            <span class="bg-[#7AAB7A] text-white rounded-full py-1 px-4">{{
              user.count
            }}</span>
          </p>
          <p
            class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full text-center"
          >
            <span class="bg-yellow-500 text-white rounded-full py-1 px-4">{{
              protocols.length - user.count
            }}</span>
          </p>
        </div>
      </div>
      <div
        class="flex items-end gap-4"
        v-for="(user, key) in Object.values(republic_commissions).filter((commission: any) => !commission_iins.includes(check_iin(commission?.iin))
        )"
        :key="key"
      >
        <div
          class="grid grid-cols-[180px_1fr_200px_180px_180px] items-end w-full"
        >
          <p
            class="text-[14px] font-bold w-full py-2 border-b h-full flex items-center gap-2"
          >
            {{ check_iin(user.iin) }}
          </p>
          <p class="text-[14px] font-bold w-full pr-4 h-full py-2 border-b">
            {{ user.surname }} {{ user.firstname }}
          </p>
          <p
            class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full text-center"
          >
            {{ protocols.length }}
          </p>
          <p
            class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full text-center"
          >
            <span class="bg-[#7AAB7A] text-white rounded-full py-1 px-4">{{
              user.count || 0
            }}</span>
          </p>
          <p
            class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full text-center"
          >
            <span class="bg-yellow-500 text-white rounded-full py-1 px-4">{{
              protocols.length - (user.count || 0)
            }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { API_URL } from "../../env";
import { computed, onMounted, ref } from "vue";
import Button from "../../components/Button.vue";
import { connectAndSign } from "../../helpers/ecp";
import { useStore } from "../../store";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ArrowLeftOutlined, StarOutlined } from "@ant-design/icons-vue";
import Header from "../../components/Header.vue";
import { useRoute, useRouter } from "vue-router";
import { check_iin } from "../../helpers/update_region";
import { republic_commissions } from "../voting/voting_criteria";

const votings = ref([] as any[]);
const protocols = ref([] as any[]);
const loading = ref(false);
const store = useStore();
const { user, users } = storeToRefs(store);
const route = useRoute();
const router = useRouter();
const commission_iins = computed(() => {
  return Object.values(getByCommission.value).map((v: any) => check_iin(v.iin));
});

onMounted(async () => {
  if (!!user.value) {
    loading.value = true;
    await getVotings();
    await store.fetchUsers(route.query.region || user.value?.workDistrictRu);
    loading.value = false;
  }
});

const getByCommission = computed(() => {
  return votings.value
    .filter((v) => !!v.voting)
    .reduce((acc, v) => {
      const _key = v.fio;

      if (acc[_key]) {
        acc[_key].count++;
      } else {
        acc = {
          ...acc,
          [_key]: {
            count: 1,
            iin: v.iin,
            region: v.region,
            fio: v.fio,
          },
        };
      }
      return acc;
    }, {});
});

// const auth = () => {
//   loading.value = true;
//   connectAndSign()
//     .then(async (user) => {
//       await getUser(user.iin);
//       await getVotings();

//       loading.value = false;
//     })
//     .catch(() => {
//       message.error("Не удалось авторизоваться");
//     });
// };

const getProtocol = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/protocols?pagination[pageSize]=10000000000&populate=file&populate=users&populate=users.user&populate=users.user.nomination`
  );

  protocols.value = data.data
    .map((protocol: any) => protocol.users.map((user: any) => user.user))
    .flat();
};

const getVotings = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/republic-votings?populate=user&pagination[pageSize]=10000000000`
  );

  votings.value = data.data;
};

onMounted(async () => {
  await getVotings();
  await getProtocol();

  if (
    !republic_commissions
      .map((v: any) => check_iin(v.iin))
      .includes(check_iin(user.value?.iin))
  ) {
    message.error(
      "Вы не являетесь председателем комиссии или нет доступа к статистике"
    );
    router.push("/");
  }
});
</script>

<style scoped></style>
