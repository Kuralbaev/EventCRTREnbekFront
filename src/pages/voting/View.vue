<template>
  <div class="">
    <Header />
    <a-spin v-if="loading" />
    <div v-else class="p-14 pt-0">
      <a-button
        class="mb-10 !bg-[#34414A] !border-0 !text-white"
        size="large"
        @click="$router.back()"
      >
        Назад
      </a-button>

      <div class="bg-white rounded-[36px] p-10">
        <p class="text-[22px] font-medium mb-6">
          {{ data?.fio || data?.author }}
        </p>
        <div class="grid grid-cols-2 gap-4">
          <template v-for="key in userInfo">
            <p class="text-[16px] font-medium">
              <span class="block opacity-50 text-[14px] mb-1"
                >{{ key.title }}:</span
              >
              {{ key.value }}
            </p>
          </template>
        </div>
        <div class="flex gap-4 mt-6">
          <template v-for="item in Object.keys(items)" :key="item">
            <div v-if="data?.[item]" class="w-full">
              <a
                :href="`${API_URL}${data[item]?.url}`"
                target="_blank"
                class="w-full mb-1 block"
                download
              >
                <div
                  class="bg-[#F0F2F4] w-full rounded-[26px] p-6 cursor-pointer"
                  @click=""
                >
                  <img
                    src="../../assets/images/icons/file_1.png"
                    alt=""
                    class="w-10 h-10 mb-6"
                  />
                  <p class="text-[16px] font-medium text-[#656565]">
                    {{ items[item] }}
                  </p>
                </div>
              </a>
            </div>
          </template>
        </div>

        <div
          class="bg-[#F0F2F4] w-full rounded-[26px] p-6 cursor-pointer mt-10 text-center font-semibold"
          :class="{ 'mb-10': check_commission }"
          @click=""
        >
          <p class="text-[24px]">
            {{ loading_voting ? "Загрузка..." : voting || 0 }}
          </p>
          <p class="text-[16px]">голосов</p>
          <p class="text-[16px]" v-if="check_commission">
            ( {{ voting_calc(voting || 0) }} балл )
          </p>
        </div>
        <a-form
          v-if="false"
          layout="vertical"
          :model="votingForm.value"
          @finish="open = true"
        >
          <div class="grid grid-cols-2 gap-4" v-if="check_commission">
            <a-form-item
              :name="`${item.name}_${item.id}`"
              class="w-full input"
              v-for="(item, index) in !!data?.bin
                ? republic_commission_project
                : republic_commission"
              :key="index"
              :rules="[
                {
                  required: true,
                  message: 'Поле обязательно для заполнения',
                },
              ]"
            >
              <p class="text-[16px] mb-2 font-semibold">
                {{ item.name }} {{ item.id }}
              </p>
              <a-radio-group
                v-model:value="votingForm.value[`${item.name}_${item.id}`]"
              >
                <a-radio
                  class="w-full !text-[16px]"
                  v-for="option in item.options"
                  :value="option.value"
                  >{{ option.name }}</a-radio
                >
              </a-radio-group>
            </a-form-item>
          </div>

          <a-button
            html-type="submit"
            class="w-full cols-span-2 disabled:opacity-50 mt-2 mb-8 !bg-[#7AAB7A] !border-0 !text-white !h-[90px] !rounded-[26px] !text-[22px] font-semibold"
            color="green"
            v-if="!!check_commission"
          >
            Голосовать
            <template v-if="check_commission">
              : {{ voting_array().reduce((acc, v) => acc + +v, 0) }} баллов
            </template>
          </a-button>
          <a-alert
            v-else
            type="warning"
            message="Голосование закончилось"
            class="!mb-10 block !mt-5"
          />
        </a-form>
        <a-alert
          v-else
          type="warning"
          message="Голосование закончилось"
          class="!mb-10 block !mt-5"
        />

        <VotingComment />
      </div>
    </div>
    <a-modal
      v-model:open="open"
      title="Вы действительно хотите проголосовать?"
      @ok="handleVote"
      ok-text="Проголосовать"
      cancel-text="Отмена"
    >
      <p>После голосования вы не сможете изменить ваш голос.</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { API_URL, TOKEN } from "../../env";
import { onMounted, ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import VotingComment from "./_components/VotingComment.vue";
import { useStore } from "../../store";
import { storeToRefs } from "pinia";
import {
  criteria,
  criteria_7,
  republic_commission,
  republic_commission_project,
  voting_calc,
} from "./voting_criteria";
import Header from "../../components/Header.vue";

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const id = route.params.id;
const store = useStore();
const { user, check_commission, votingList } = storeToRefs(store);
const data = ref<any>(null);
const userInfo = ref(null);
const loading = ref(false);
const loading_voting = ref(true);
const voting = ref(0);
const open = ref(false);

const votingForm = reactive({ value: {} });
const check_voite = computed(() => {
  return votingList.value.find((v: any) => v.user.id === +id);
});

const items = {
  essay: locale.value === "ru" ? "Эссе" : "Эссе",
  achievements: locale.value === "ru" ? "Жетістіктер" : "Жетістіктер",
  plan: locale.value === "ru" ? "План" : "План",
  presentation: locale.value === "ru" ? "Презентация" : "Презентация",
  recommendation: locale.value === "ru" ? "Рекомендация" : "Рекомендация",
};

const getProfile = (data: any) => {
  let profile = [];

  if (!!data?.nomination?.name_ru) {
    profile.push({
      title: t("application.employee.form.essay.nomination"),
      value: data.nomination.name_ru,
    });
  }

  profile.push({
    title: data?.bin ? t("profile.bin") : t("profile.iin"),
    value: data?.bin ? data.bin : data?.iin || "010101010101",
  });
  profile.push({
    title: t("profile.region"),
    value: data?.work_region,
  });

  if (!data.bin) {
    profile.push({
      title: t("profile.work_experience"),
      value: data.work_experience,
    });
    profile.push({
      title: t("application.employee.form.work_place"),
      value: data.work_place,
    });
    profile.push({
      title: t("profile.position"),
      value: data.position,
    });
    profile.push({
      title: t("profile.education"),
      value: data.education,
    });
    profile.push({
      title: t("profile.languages"),
      value: data.languages,
    });
  } else {
    profile.push({
      title: t("application.project.form.project_name"),
      value: data.project_name,
    });
    profile.push({
      title: t("application.project.form.project_duration"),
      value: data.project_duration,
    });
    profile.push({
      title: t("application.project.form.project_direction"),
      value: data.project_direction,
    });
    profile.push({
      title: t("application.project.form.project_actuality"),
      value: data.project_actuality,
    });
    profile.push({
      title: t("application.project.form.project_results"),
      value: data.project_results,
    });
  }
  userInfo.value = profile;
};

onMounted(async () => {
  await axios.get(`${API_URL}/api/users/${id}?populate=*`).then((res) => {
    data.value = res.data;
    getProfile(res.data);
  });
  await getVoting();
  loading.value = false;
});

const handleVote = async () => {
  open.value = false;
  await createVoting();
  await getVoting();
};

const voting_array = () => {
  return Object.entries(votingForm.value)
    .sort((a, b) => +a[0].split("_")[1] - +b[0].split("_")[1])
    .map((v) => v[1]);
};

const getUUID = () => {
  if (check_commission.value) {
    return `${user.value.iin}${data.value.id}`;
  }
  if (data.value.bin) {
    return user.value.iin + 1;
  }
  return user.value.iin;
};

const createVoting = async () => {
  // if (user.value.workDistrictRu !== data.value.work_region) {
  //   message.error("Вы не можете голосовать в этом регионе");
  //   return;
  // }

  await axios
    .post(
      `${API_URL}/api/republic-votings`,
      {
        data: {
          count: voting_array().reduce((acc, v) => acc + +v, 0),
          user: {
            connect: [data.value],
          },
          uuid: getUUID(),
          fio: `${user.value.surname} ${user.value.firstname}`,
          iin: user.value.iin,
          voting: voting_array().join(","),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )
    .then(() => {
      message.success("Голосование успешно отправлено");
      router.push("/voting");
    })
    .catch((error) => {
      if (error.response.data.error.message.includes("unique")) {
        message.error("Вы уже голосовали");
        return;
      }
      message.error(error.response.data.error.message);
    });
};

const getVoting = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/votings?filters[user][id][$eq]=${id}&filters[voting][$in]=`
  );
  loading_voting.value = false;

  voting.value = data.meta.pagination.total;
};
</script>

<style lang="scss" scoped></style>
