<template>
  <div class="container mx-auto">
    <Header />
    <div class="bg-white flex justify-between rounded-[64px] p-14 mx-auto">
      <div>
        <div class="flex items-center gap-4 mb-4">
          <div
            class="cursor-pointer w-10 h-10 rounded-full bg-[#34414A] flex items-center justify-center text-white"
            @click="router.back()"
          >
            <ArrowLeftOutlined class="text-[16px]" />
          </div>
          <p class="text-[24px] font-medium">
            {{ $t("profile.title") }} {{ check_commission ? "комиссии" : "" }}
          </p>
        </div>
        <p class="text-[32px] font-bold">
          {{ $t("profile.welcome") }}
          {{
            firstName
              ? firstName.charAt(0).toUpperCase() +
                firstName.slice(1).toLowerCase()
              : ""
          }}!
        </p>
      </div>

      <div
        class="flex gap-2 px-6 items-center h-18 rounded-[24px] bg-[#D82042] text-white font-bold text-[20px] cursor-pointer"
        @click="logout"
      >
        <img src="../../assets/images/icons/logout_white.png" class="w-6 h-6" />
        {{ $t("actions.logout") }}
      </div>
    </div>

    <div class="grid grid-cols-[360px_1fr] gap-8 mt-8">
      <div class="bg-[#ffffffae] justify-between rounded-[64px] p-10 h-max">
        <p class="text-[24px] font-bold">
          {{ $t("profile.my_data") }}
        </p>

        <div v-if="company && company.fullNameRu" class="mt-6">
          <p class="text-[20px] font-medium text-[#8C96A8] mb-1">
            {{ $t("profile.organization_name") }}
          </p>
          <p class="text-[20px] font-medium">
            {{ company.fullNameRu }}
          </p>
        </div>

        <div v-for="item in profile" :key="item.title" class="mt-6">
          <p class="text-[20px] font-medium text-[#8C96A8] mb-1">
            {{ item.title }}
          </p>
          <p class="text-[20px] font-medium">{{ item.value }}</p>
        </div>

        <!-- <a-divider />

        <a-button
          type="primary"
          @click="router.push('/voting')"
          size="large"
          class="w-full !bg-[#34414A] text-white"
        >
          Страница голосования
        </a-button> -->

        <!-- <template v-if="check_commission">
          <a-button
            type="primary"
            @click="router.push('/statistic-v5')"
            size="large"
            class="w-full !bg-[#34414A] text-white mt-2"
          >
            Статистика
          </a-button>
          <a-button
            type="primary"
            @click="router.push('/statistic-v3')"
            size="large"
            class="w-full !bg-[#34414A] text-white mt-2"
          >
            Статистика комиссии
          </a-button>

          <template v-if="protocol">
            <a-divider />
            <a
              :href="`${API_URL}${protocol.file?.url}`"
              download
              type="primary"
              size="large"
              class="w-full !bg-[#34414A] text-white mt-2 cursor-pointer p-3 rounded-[8px] flex items-center justify-center"
            >
              Протокол комиссии
            </a>
            <a-button
              v-if="!protocol.status_ecp"
              type="primary"
              size="large"
              class="w-full !bg-[#7AAB7A] text-white mt-2"
              @click="signProtocol"
            >
              Подписать протокол
            </a-button>
          </template>
        </template> -->
      </div>
      <div
        class="bg-[#ffffffae] justify-between rounded-[64px] p-10 h-max grid grid-cols-3 gap-4"
      >
        <template v-if="store.voting">
          <p class="text-[24px] font-bold col-span-3">Мои голоса</p>
          <div
            class="card p-6 rounded-[26px] relative bg-white pb-18"
            v-for="user in votingList"
            :key="user.id"
          >
            <p class="text-[20px] font-medium mb-3 w-[calc(100%-48px)]">
              {{ user.user.fio ? user.user.fio : user.user.author }}
            </p>
            <p class="text-[16px] font-medium mb-3">
              {{ user.user.work_region }}
            </p>
            <!-- <div>
              <template
                v-for="key in [
                  'project_name',
                  'work_region',
                  'languages',
                  'education',
                  'iin',
                ]"
                :key="key"
              >
                <div
                  v-if="user[key]"
                  class="inline-block mr-2 mb-1 bg-[#F0F2F4] p-2 px-3 rounded-[12px]"
                >
                  <p
                    class="text-[14px] font-medium text-[#656565] line-clamp-2"
                  >
                    {{ user[key] }}
                  </p>
                </div>
              </template>
            </div> -->
            <a-button
              class="w-[calc(100%-50px)] mt-4 !bg-[#7AAB7A] !border-0 !text-white !absolute bottom-4"
              size="large"
              color="green"
              @click="$router.push(`/voting/${user.user.id}`)"
              >Посмотреть</a-button
            >
          </div>
        </template>
        <!-- <template v-else>
          <div>
            <p class="text-[24px] font-bold">
              {{ votingList.length }}
            </p>
          </div>
        </template> -->
        <template v-else>
          <div
            class="bg-white justify-between rounded-[64px] p-10"
            v-if="user?.application_status"
          >
            <p class="text-[44px] font-medium">
              {{ user?.nomination?.name_ru || $t("profile.project") }}
            </p>

            <div class="grid grid-cols-2 gap-4 mt-6" v-if="!!user">
              <template
                v-for="item in [
                  'essay',
                  'achievements',
                  'plan',
                  'presentation',
                ]"
                :key="item"
              >
                <div
                  v-if="user[item]"
                  class="grid grid-cols-[48px_1fr_auto] gap-4 mb-4 bg-[#F0F2F4] p-6 rounded-[26px]"
                >
                  <div class="relative">
                    <img
                      src="../../assets/images/icons/upload.png"
                      alt=""
                      class="w-10"
                    />
                    <p
                      class="bg-[#D82042] absolute top-[15px] right-[25px] text-white p-1 rounded-md px-2"
                    >
                      {{ user[item].ext }}
                    </p>
                  </div>
                  <div>
                    <a
                      :href="`${API_URL}${user[item].url}`"
                      target="_blank"
                      download
                    >
                      <p
                        class="text-[20px] font-medium mb-1 hover:text-[#628BE4]"
                      >
                        {{ user[item].name }}
                      </p>
                    </a>
                  </div>
                </div>
              </template>
            </div>
            <!-- <router-link
              :to="!!user?.bin ? '/profile/edit-company' : '/profile/edit'"
            >
              <p class="text-[18px] text-[#8C96A8] mt-4 text-center">
                {{ $t("profile.edit_until") }}
                <span class="font-bold">{{
                  $t("profile.edit_until_date")
                }}</span>
              </p>
              <div
                class="flex justify-center gap-2 h-[56px] cursor-pointer text-white items-center bg-[#34414A] rounded-[16px] p-6 mt-3"
              >
                <EditOutlined class="text-[20px] -mt-1" />
                <p class="text-[16px] font-semibold">
                  {{ $t("profile.edit") }}
                </p>
              </div>
            </router-link>
            <div
              @click="isModalOpen = true"
              class="flex justify-center gap-2 h-[56px] cursor-pointer text-[#D82042] items-center bg-[#34414A1A] rounded-[16px] p-6 mt-2"
            >
              <DeleteOutlined class="text-[20px] -mt-1" />
              <p class="text-[16px] font-semibold">
                {{ $t("profile.delete") }}
              </p>
            </div> -->
          </div>

          <a :href="`/public_agreement_${locale}.pdf`" target="_blank">
            <p
              v-if="user?.application_status"
              class="bg-white justify-between rounded-[36px] p-10 mt-10 text-[20px] font-medium text-[#628BE4] cursor-pointer"
            >
              {{ $t("profile.public_agreement") }}
            </p>
          </a>
        </template>
      </div>
    </div>
    <a-modal
      v-model:open="isModalOpen"
      centered
      width="400px"
      :footer="null"
      :title="$t('profile.delete_application')"
    >
      <div class="flex justify-end gap-2 mt-4">
        <a-button @click="isModalOpen = false">
          {{ $t("profile.cancel") }}
        </a-button>
        <a-button danger type="primary" @click="deleteAccount">{{
          $t("profile.delete")
        }}</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../../store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { API_URL, ECP_PROTOCOL_TOKEN } from "../../env";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import Header from "../../components/Header.vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { connectAndSign } from "../../helpers/ecp";

const store = useStore();
const { user, company, check_commission, votingList } = storeToRefs(store);
const router = useRouter();
const isModalOpen = ref(false);
const protocol = ref();
const { t, locale } = useI18n();
const firstName =
  user?.value?.fullName?.split(" ")?.[1] || user?.value?.firstname || "";

const logout = () => {
  store.user = null;
  store.jwt = null;
  store.userType = "";
  store.company = null;
  store.certificate = [];
  router.push("/");
};

const deleteAccount = () => {
  isModalOpen.value = false;
  store.deleteAccount().then(() => {
    router.push("/");
  });
};

const profile = ref([
  {
    title: company.value ? t("profile.bin") : t("profile.iin"),
    value: company.value
      ? company.value.bin
      : user?.value?.iin || "010101010101",
  },
  {
    title: t("profile.fio"),
    value:
      user?.value?.fullName ||
      `${user?.value?.surname || ""} ${user?.value?.firstname?.[0] || ""} ${
        user?.value?.secondname?.[0] || ""
      }`.trim(),
  },
  {
    title: t("profile.region"),
    value: company.value
      ? `${company.value.districtRu}, ${company.value.regionRu}`
      : user?.value?.companyName ||
        user?.value?.work_region ||
        user?.value?.regionRu,
  },
]);

const getProtocol = async () => {
  const { data } = await axios.get(
    `${API_URL}/api/protocols?filters[iin][$eq]=${user?.value?.iin}&populate=file`,
  );

  if (data.data?.length) {
    return (protocol.value = data.data[0]);
  }
  message.error(
    "Протокол не найден или вы не являетесь председателем комиссии",
  );
};

const signProtocol = async () => {
  connectAndSign()
    .then(async () => {
      await axios.put(
        `${API_URL}/api/protocols/${protocol.value.documentId}`,
        {
          data: {
            status_ecp: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${ECP_PROTOCOL_TOKEN}`,
          },
        },
      );
      await getProtocol();
    })
    .catch(() => {
      message.error("Не удалось подписать протокол");
    });
};

onMounted(async () => {
  await getProtocol();
});

onMounted(() => {
  if (!user.value) {
    router.push("/");
  }
  if (!check_commission.value) {
    if (!company.value) {
      profile.value.push({
        title: t("profile.position"),
        value:
          user?.value?.establishedPost ||
          user?.value?.dpositionNameRu ||
          user?.value?.subContractEstablishedPost,
      });
      profile.value.push({
        title: t("profile.education"),
        value: user?.value?.education,
      });
      profile.value.push({
        title: t("profile.work_experience"),
        value: user?.value?.work_experience,
      });
      profile.value.push({
        title: t("profile.languages"),
        value: user?.value?.languages,
      });
    } else {
      profile.value.push({
        title: t("profile.employee_cnt"),
        value: company?.value?.employeeCnt,
      });
    }
  }
});
</script>
