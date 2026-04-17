<template>
  <div class="statistic px-6 mx-auto">
    <Header />

    <Button
      v-if="!user"
      @click="auth"
      text="Авторизоваться"
      color="black"
      class="w-[606px] m-auto mt-10"
    />

    <div v-else class="bg-white justify-between rounded-[64px] p-14 mx-auto">
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
            <span class="font-bold">{{ voting_count }}</span>
            участников с голосами в регионе
            <span class="font-bold">{{
              route.query.region || user.workDistrictRu
            }}</span>
          </p>
        </div>
      </div>

      <a-divider />

      <a-spin :spinning="loading">
        <div class="flex items-end gap-4 mb-4 px-4">
          <div
            class="grid grid-cols-[170px_2fr_200px_1fr_1fr_150px] items-end w-full"
          >
            <p class="text-[14px] font-bold w-full">ИИН</p>
            <p class="text-[14px] font-bold w-full">ФИО</p>
            <p class="text-[14px] font-bold w-full">Регион</p>
            <p class="text-[14px] font-bold w-full">Место работы</p>
            <p class="text-[14px] font-bold w-full">Наименование номинации</p>
            <p class="text-[14px] font-bold w-full text-center">
              Количество баллов
            </p>
          </div>
        </div>

        <div
          v-for="(nomination, key) in voting"
          :key="key"
          class="border border-[#767676] p-4 rounded-2xl mb-3"
        >
          <p class="text-[20px] font-bold w-full mb-4">
            {{ key }}
          </p>
          <div
            v-for="user in Object.values(nomination)?.sort(
              (a, b) =>
                voting_calc(b.count) +
                b.voting -
                (voting_calc(a.count) + a.voting)
            )"
            :key="user?.fio"
          >
            <div
              class="grid grid-cols-[170px_2fr_200px_1fr_1fr_150px] items-end w-full"
            >
              <p class="text-[14px] font-bold w-full py-3 mt-2 border-t h-full">
                {{ check_iin(user.iin) }}
              </p>
              <p
                class="text-[14px] font-bold w-full pr-4 h-full py-3 mt-2 border-t"
              >
                {{ user.fio }}
                <span class="text-[12px] font-medium block">{{
                  user.email || "-"
                }}</span>
              </p>
              <p class="text-[14px] font-bold w-full py-3 mt-2 border-t h-full">
                {{ user.region }}
              </p>
              <p
                class="text-[14px] font-bold w-full py-3 mt-2 border-t h-full pr-3"
              >
                {{ user.work_place }}
              </p>
              <p class="text-[14px] font-bold w-full py-3 mt-2 border-t h-full">
                {{ user.nomination }}
              </p>
              <p
                class="text-[14px] font-bold w-full py-3 mt-2 border-t pl-4 h-full text-center"
              >
                <span class="bg-[#7AAB7A] text-white rounded-full py-1 px-4">{{
                  voting_calc(user.count) + user.voting
                }}</span>
              </p>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { API_URL } from "../../env";
import { computed, onMounted, ref, watch } from "vue";
import Button from "../../components/Button.vue";
import { connectAndSign } from "../../helpers/ecp";
import { useStore } from "../../store";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import Header from "../../components/Header.vue";
import { voting_calc } from "../voting/voting_criteria";
import { useRouter, useRoute } from "vue-router";
import { check_iin } from "../../helpers/update_region";

const voting = ref([] as any[]);
const loading = ref(false);
const store = useStore();
const { user } = storeToRefs(store);
const router = useRouter();
const route = useRoute();
const votings = ref([]);

const voting_count = computed(() => {
  return Object.values(voting.value)?.reduce((acc, v) => {
    return acc + Object.values(v).length;
  }, 0);
});

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
  });
};

onMounted(async () => {
  if (!!user.value) {
    loading.value = true;
    voting.value = [];
    await getVoting();
    loading.value = false;
  }
});

const auth = () => {
  loading.value = true;
  connectAndSign()
    .then(async (user) => {
      await getUser(user.iin);
      await store.fetchUsers();
      await getVoting();

      loading.value = false;
    })
    .catch(() => {
      message.error("Не удалось авторизоваться");
    });
};

const getVoting = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/statistics?region=${
      route.query.region || user.value?.workDistrictRu
    }&iins=${iin_not_voting.value.map((v) => v.iin).join(",")}`
  );

  voting.value = data;
};

const groupByCommission = computed(() => {
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

const iin_not_voting = computed(() => {
  return Object.values(groupByCommission.value).filter(
    (v) => v.count < voting_count.value
  );
});

const getVotingByRegion = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/votings?populate=user&filters[voting][$ne]=&pagination[pageSize]=10000000000`
  );

  votings.value = data.data;
};

watch(iin_not_voting, async () => {
  await getVoting();
});

onMounted(async () => {
  await getVotingByRegion();
  // if (prompt("Введите пароль") !== "Admin123456") {
  //   router.push("/");
  // }
});
</script>

<style scoped></style>
