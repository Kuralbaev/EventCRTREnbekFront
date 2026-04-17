<template>
  <div class="statistic px-6 mx-auto">
    <Header />

    <div class="bg-white justify-between rounded-[64px] p-14 mx-auto">
      <!-- <a-button
        class="mb-10 !bg-[#34414A] !border-0 !text-white"
        size="large"
        @click="start"
      >
        Статистика 2025
      </a-button> -->
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

      <a-divider />
      <div>
        <div class="flex items-end gap-4 border-b border-[#767676] pb-4">
          <p class="text-[14px] font-bold min-w-[350px]">Регионы</p>
          <div
            class="grid grid-cols-[50px_50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-end w-full"
          >
            <p class="text-[10px] font-bold w-full text-center">Количество</p>
            <p
              class="text-[10px] font-bold w-full text-center"
              v-for="nomination in nominations"
              :key="nomination"
            >
              {{ nomination }}
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-4 border-b border-[#767676]mb-4"
          :key="'Казахстан'"
        >
          <p
            class="text-[14px] h-full pl-0 p-4 font-bold min-w-[350px] max-w-[350px] border-r border-[#767676] pr-4"
          >
            {{ "Казахстан" }}
          </p>
          <div
            class="grid grid-cols-[50px_50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-end w-full"
          >
            <p class="text-[16px] font-bold w-full text-center">
              {{ groupByRegionKazakhstan["Казахстан"]?.count }}
            </p>
            <p
              class="text-[16px] font-bold w-full text-center"
              v-for="nomination in nominations"
              :key="nomination"
              :class="
                groupByRegionKazakhstan['Казахстан'][nomination]?.length
                  ? 'text-[#000000]'
                  : 'text-[#aaaaaa]'
              "
            >
              {{
                groupByRegionKazakhstan["Казахстан"][nomination]?.length || 0
              }}
            </p>
          </div>
        </div>
        <div
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
              v-for="nomination in nominations"
              :key="nomination"
              :class="
                region[nomination]?.length ? 'text-[#000000]' : 'text-[#aaaaaa]'
              "
            >
              {{ region[nomination]?.length || 0 }}
            </p>
          </div>
        </div>
      </div>

      <!-- <div>
        <a-collapse
          v-model:activeKey="activeKey"
          ghost
          expandIconPosition="end"
        >
          <a-collapse-panel
            v-for="(nomination, key) in goupeByNomination"
            :key="key"
            :header="`${key} (${nomination.length})`"
            :style="{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#34414A',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              backgroundColor: '#F5F5F5',
            }"
          >
            <p
              class="text-[16px] font-bold mb-3 border-t border-[#e7e7e7] pt-3"
            >
              Количество участников: {{ nomination.length }}
            </p>
            <div class="grid grid-cols-3 gap-4">
              <div
                v-for="user in nomination"
                :key="user.id"
                class="p-4 rounded-2xl border-[#767676] bg-white"
              >
                <a-dropdown>
                  <p class="text-[18px] font-bold mb-4 cursor-pointer">
                    {{ user.fio }}
                  </p>
                  <template #overlay>
                    <div class="p-4 bg-white rounded-lg shadow-lg w-[400px]">
                      <template
                        v-for="key in [
                          'work_place',
                          'position',
                          'iin',
                          'bin',
                          'languages',
                          'work_experience',
                        ]"
                        :key="key"
                      >
                        <p
                          v-if="!!user[key]"
                          class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                        >
                          <template v-if="key === 'work_experience'">
                            Опыт работы:
                          </template>
                          {{ user[key] }}
                        </p>
                      </template>
                    </div>
                  </template>
                </a-dropdown>

                <p
                  v-for="key in ['region', 'phone', 'email', 'education']"
                  class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                >
                  {{ user[key] }}
                </p>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>

      <a-divider />

      <p class="text-[24px] mb-4">
        <span class="font-bold">{{ goupeByProject.length }}</span> компаний
      </p>
      <div>
        <div class="grid grid-cols-3 gap-4">
          <div
            v-for="user in goupeByProject"
            :key="user.id"
            class="p-4 rounded-2xl border-[#767676] bg-[#F0F2F4]"
          >
            <a-dropdown>
              <p class="text-[18px] font-bold mb-4 cursor-pointer">
                {{ user.author }}
              </p>
              <template #overlay>
                <div
                  class="p-4 bg-white rounded-lg shadow-lg w-[500px] max-h-[500px] overflow-y-auto"
                >
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Автор:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.author }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Регион:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.region }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Наименование проекта:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.project_name }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Направление проекта:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.project_direction }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Срок реализации:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.project_duration }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">
                      Актуальность и социальная значимость:
                    </p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.project_actuality }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Достигнутые результаты:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.project_results }}
                    </p>
                  </div>
                  <div class="grid grid-cols-[130px_1fr] gap-2">
                    <p class="text-[14px] mt-2">Источники финансирования:</p>
                    <p
                      class="text-[14px] font-medium p-2 px-3 rounded-lg bg-[#F0F2F4] text-[#34414A] mb-2 inline-block mr-2"
                    >
                      {{ user.project_funding }}
                    </p>
                  </div>
                </div>
              </template>
            </a-dropdown>

            <p
              v-for="key in ['region', 'phone', 'email', 'bin', 'project_name']"
              class="text-[14px] font-medium p-2 px-3 rounded-lg bg-white text-[#34414A] mb-2 inline-block mr-2"
            >
              {{ user[key] }}
            </p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import { API_URL, districts } from "../../env";
import { computed, onMounted, ref } from "vue";
import { start } from "../../helpers/update_region";
import Header from "../../components/Header.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const users = ref([]);

const nominations = computed(() => {
  return new Set(
    users.value.map((user) =>
      user.nomination ? user.nomination.name_ru : "Не корректный"
    )
  );
});

const groupByRegionKazakhstan = computed(() => {
  return users.value.reduce((acc, user, index) => {
    const _kaz = "Казахстан";
    const _nomination = !!user.nomination
      ? user.nomination.name_ru
      : "Не корректный";

    if (acc[_kaz]) {
      if (acc[_kaz]?.[_nomination]) {
        acc[_kaz][_nomination].push(user);
      } else {
        acc[_kaz] = {
          ...acc[_kaz],
          [_nomination]: [user],
        };
      }
      acc[_kaz].count++;
    } else {
      acc[_kaz] = {
        count: 1,
        [_nomination]: [user],
      };
    }

    return acc;
  }, {});
});

const groupByRegion = computed(() => {
  return users.value.reduce((acc, user, index) => {
    const _key = user.work_region;
    const _nomination = !!user.nomination
      ? user.nomination.name_ru
      : "Не корректный";

    if (acc[_key]) {
      if (acc[_key]?.[_nomination]) {
        acc[_key][_nomination].push(user);
      } else {
        acc[_key] = {
          ...acc[_key],
          [_nomination]: [user],
        };
      }
      acc[_key].count++;
    } else {
      acc[_key] = {
        count: 1,
        [_nomination]: [user],
      };
    }

    return acc;
  }, {});
});

onMounted(() => {
  // if (prompt("Введите пароль") !== "Admin123456") {
  //   router.push("/");
  // } else {
  axios.get(`${API_URL}/api/users?populate=nomination`).then((res) => {
    users.value = res.data;
  });
  // }
});
</script>

<style scoped></style>
