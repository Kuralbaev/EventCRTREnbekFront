<template>
  <div class="statistic px-6 mx-auto">
    <Header />

    <div class="bg-white justify-between rounded-[64px] p-14 mx-auto">
      <div>
        <div class="flex items-center gap-4 mb-4">
          <div
            class="cursor-pointer w-10 h-10 rounded-full bg-[#34414A] flex items-center justify-center text-white"
            @click="$router.back()"
          >
            <ArrowLeftOutlined class="text-[16px]" />
          </div>
          <p class="text-[24px] font-medium">
            Всего
            <span class="font-bold">{{ users.length }}</span>
            участников
          </p>
        </div>
      </div>
      <a-form-item class="w-full">
        <a-select v-model:value="selectedRegion" placeholder="Выбрать регион">
          <a-select-option value="">Все регионы</a-select-option>
          <a-select-option v-for="region in regions" :value="region">
            {{ region }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-divider />
      <div>
        <div class="flex items-end gap-4 border-b border-[#767676] pb-4">
          <div class="grid grid-cols-[1fr_1fr_1fr] gap-4 items-end w-full">
            <p class="text-[14px] font-bold w-full">ФИО</p>
            <p class="text-[14px] font-bold w-full">Регион</p>
            <p class="text-[14px] font-bold w-full">
              Наименование номинации/проекта
            </p>
          </div>
        </div>
        <div
          class="flex items-end gap-4"
          v-for="user in users
            .filter((user) =>
              selectedRegion ? user.work_region === selectedRegion : true
            )
            .sort((a, b) =>
              a.fio
                ? a.fio.localeCompare(b.fio)
                : a.author.localeCompare(b.author)
            )"
          :key="user.id"
        >
          <div class="grid grid-cols-[1fr_1fr_1fr] items-start w-full">
            <p
              class="text-[14px] font-bold w-full border-r border-[#767676] pr-4 h-full py-2 border-b"
            >
              {{ user.fio ? user.fio : user.author }}
            </p>
            <p class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full">
              {{ user.work_region || "Не корректный" }}
            </p>
            <p class="text-[14px] font-bold w-full py-2 border-b pl-4 h-full">
              {{
                user.nomination ? user.nomination.name_ru : user.project_name
              }}
            </p>
          </div>
        </div>
        <!-- <div
          class="flex items-center gap-4 border-b border-[#767676]mb-4"
          v-for="(region, key) in groupByRegion"
          :key="key"
        >
          <p
            class="text-[14px] h-full pl-0 p-4 font-bold min-w-[350px] max-w-[350px] border-r border-[#767676] pr-4"
          >
            {{ key }}
          </p>
          <div
            class="grid grid-cols-[50px_50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-end w-full"
          >
            <p class="text-[16px] font-bold w-full text-center">
              {{ region.count }}
            </p>
            <p
              class="text-[16px] font-bold w-full text-center"
              v-for="nomination in groupByRegion"
              :key="nomination"
              :class="
                region[nomination]?.length ? 'text-[#000000]' : 'text-[#aaaaaa]'
              "
            >
              {{ region[nomination]?.length || 0 }}
            </p>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import { API_URL } from "../../env";
import { computed, onMounted, ref } from "vue";
import Header from "../../components/Header.vue";

const users = ref([] as any[]);
const selectedRegion = ref();
const regions = computed(() => {
  return Array.from(new Set(users.value.map((user) => user.work_region)));
});

onMounted(() => {
  axios.get(`${API_URL}/api/users?populate=nomination`).then((res) => {
    users.value = res.data;
  });
});
</script>

<style scoped></style>
