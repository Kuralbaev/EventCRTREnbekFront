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
          <!-- <p class="text-[24px] font-light">
            Всего
            <span class="font-bold">{{ voting_count }}</span>
            участников
          </p> -->
        </div>
      </div>

      <a-divider />
      {{ data.value }}
      {{ groupByNomination }}

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
          v-for="(nomination, key) in groupByNomination"
          :key="key"
          class="border border-[#767676] p-4 rounded-2xl mb-3"
        >
          <p class="text-[20px] font-bold w-full mb-4">
            {{ key }}
          </p>
          <div v-for="user in nomination" :key="user?.user.iin">
            <div
              class="grid grid-cols-[170px_2fr_200px_1fr_1fr_150px] items-end w-full"
            >
              <p class="text-[14px] font-bold w-full py-3 mt-2 border-t h-full">
                {{ check_iin(user.bin || user.iin) }}
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
                  user.count
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
import { computed, onMounted, reactive, ref } from "vue";
import Button from "../../components/Button.vue";
import { connectAndSign } from "../../helpers/ecp";
import { useStore } from "../../store";
import { message } from "ant-design-vue";
import { storeToRefs } from "pinia";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import Header from "../../components/Header.vue";
import { check_iin } from "../../helpers/update_region";

const loading = ref(false);
const store = useStore();
const { user } = storeToRefs(store);
const data = reactive<any>({
  republicStatistics: [],
  peopleStatistics: [],
  commissionStatistics: [],
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
    await getVotingsRepublic();
    loading.value = false;
  }
});

const groupByNomination = computed(() => {
  console.log(data);

  return Object.values(data?.republicStatistics || {}).reduce(
    (acc: any, item: any) => {
      console.log(item);

      const _nomination = item.user.nomination;
      if (acc[_nomination]) {
        acc[_nomination].push(item);
      } else {
        acc[_nomination] = [item];
      }
      return acc;
    },
    {}
  );
});

const auth = () => {
  loading.value = true;
  connectAndSign()
    .then(async (user) => {
      await getUser(user.iin);
      await store.fetchUsers();
      await getVotingsRepublic();

      loading.value = false;
    })
    .catch(() => {
      message.error("Не удалось авторизоваться");
    });
};

const getVotingsRepublic = async () => {
  const res = await axios.get(`${API_URL}/api/statistics-v5`);

  data.value = res.data;
};
</script>

<style scoped></style>
