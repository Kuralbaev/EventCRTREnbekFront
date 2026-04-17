<template>
  <div
    id="application"
    class="application pt-10 md:pt-[128px] pb-20 md:pb-[200px] mx-auto rounded-t-[56px] md:rounded-t-[80px] p-0 md:p-14 bg-[#EAE6CD] relative z-10"
  >
    <h2
      class="text-[32px] md:text-[72px] font-semibold text-center mb-3 md:mb-6"
    >
      {{ $t("application.title") }}
    </h2>
    <p
      class="text-[14px] md:text-[24px] font-semibold text-center mb-6 md:mb-11 opacity-80"
    >
      {{ $t("application.subtitle") }}
    </p>

    <ApplicationForm v-if="status === 3 || !!user" />

    <div
      v-else
      class="bg-white rounded-[32px] md:rounded-[80px] p-6 md:p-14 max-w-[1236px] md:w-[90%] mx-auto"
    >
      <template v-if="status === 0">
        <p class="text-[14px] md:text-[24px] font-medium mb-5 text-center">
          {{ $t("application.description") }}
        </p>
        <a-checkbox
          size="large"
          v-model:checked="checked"
          class="flex items-center gap-2 input"
        >
          <p class="text-[14px] md:text-[20px] font-medium">
            {{ $t("application.employee.form.agreement.description") }}
            <br />
            <a
              :href="`/public_agreement_${locale}.pdf`"
              target="_blank"
              class="!text-[#628BE4]"
              >{{ $t("application.employee.form.agreement.link") }}</a
            >
          </p>
        </a-checkbox>
        <Button
          @click="handleSign"
          :disabled="!checked"
          class="w-full mb-10 mt-5"
          :text="$t('application.button.sign')"
          :loading="loading"
          :color="!checked ? 'grey' : 'green'"
        />

        <!-- <p
          @click="handleQrSign"
          class="text-[24px] font-semibold mb-10 text-[#7AAB7A] cursor-pointer text-center"
        >
          {{ $t("application.button.qr") }}
        </p> -->
      </template>
      <template v-if="status === 1">
        <p class="text-[24px] font-medium mb-10 cursor-pointer text-center">
          {{ $t("application.status.success") }}
          <CheckCircleFilled class="!text-[#7AAB7A] ml-2" />
        </p>
      </template>
      <template v-if="status === 2">
        <p class="text-[24px] font-medium mb-10 cursor-pointer text-center">
          {{ $t("application.status.error") }}
          <CloseCircleFilled @click="status = 0" class="!text-[#FF0000] ml-2" />
        </p>
      </template>
      <a
        href="https://egov.kz/cms/ru/services/reservation_for_busunesses/pass_onlineecp"
        target="_blank"
        class="text-[14px] text-gray-400 hover:text-[#628BE4] md:text-[24px] font-semibold cursor-pointer text-center w-full block"
      >
        {{ $t("application.button.instruction") }}
      </a>
    </div>
    <a-modal
      :centered="true"
      v-model:open="isModalOpen"
      :footer="null"
      width="900px"
      class="modal"
    >
      <img :src="qrImage" alt="qr" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { connectAndSign } from "../../../helpers/ecp";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons-vue";
import Button from "../../../components/Button.vue";
import ApplicationForm from "../../application/ApplicationForm.vue";
import { useStore } from "../../../store";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";

const store = useStore();
const { user, userType } = storeToRefs(store);
const { locale } = useI18n();

const status = ref(0);
const isModalOpen = ref(false);
const checked = ref(false);

const qrImage = ref("");
const loading = ref(false);

const getUser = async (signPayload: { xmlData: string }) => {
  // const { data } = await axios.post(
  //   `https://hr.enbek.kz/api/contract/free/externalAPI/contractList`,
  //   signPayload,
  // );
  const data = {
    status: "SUCCESS",
    message: null,
    content: [
      {
        bin: "990440000385",
        companyName: 'Акционерное общество "Центр развития трудовых ресурсов"',
        companyNameKaz:
          '"Еңбек ресурстарын дамыту орталығы" акционерлік қоғамы',
        iin: "951228301187",
        fullName: "ҚҰРАЛБАЕВ ТЕМІРЛАН РАХАТҰЛЫ",
        dpositionCode: "1122-3-015",
        dpositionNameRu: "ГЛАВНЫЙ ЭКСПЕРТ, КАТЕГОРИЯ С-4",
        dpositionNameKz: "БАС САРАПШЫ, С-4 САНАТЫ",
        establishedPost:
          "Главный эксперт - программист (1 ур) Управление по вопросам социальной карты семьи Департамент цифровых решений в сфере адресной поддержки",
      },
    ],
  };

  message.success("success");

  store.fetchUser({
    ...data.content[0],
  });
};

const handleSign = () => {
  loading.value = true;
  connectAndSign()
    .then(async (payload) => {
      await getUser(payload);
    })
    .catch(() => {
      status.value = 2;
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
