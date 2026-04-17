<template>
  <a-form
    :model="formState"
    layout="vertical"
    @finish="handleFinish"
    @finishFailed="message.error($t('application.form.error.message'))"
  >
    <p class="text-[20px] md:text-[32px] font-medium mb-4">
      {{ $t("application.employee.title") }}
    </p>

    <div class="grid md:grid-cols-2 gap-4 md:gap-6 gap-y-2">
      <a-form-item
        :label="$t('application.employee.form.fio')"
        name="fio"
        class="w-full input"
        :rules="[requiredRule]"
      >
        <a-input
          :disabled="true"
          v-model:value="formState.fio"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] disabled:!text-black !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6 !cursor-default"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.employee.form.iin')"
        name="iin"
        class="w-full input"
        :rules="[requiredRule, iinRule]"
      >
        <a-input
          :disabled="true"
          v-model:value="formState.iin"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] disabled:!text-black !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.employee.form.birthday')"
        name="birthday"
        class="w-full input"
        :rules="[requiredRule]"
      >
        <a-input
          v-model:value="formState.birthday"
          :placeholder="t('action.enter_data')"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.employee.form.address')"
        name="address"
        class="w-full input"
        :rules="[requiredRule]"
      >
        <a-input
          v-model:value="formState.address"
          :placeholder="t('action.enter_data')"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
    </div>

    <a-divider />
    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.video") }}
    </p>
    <a-form-item name="video" class="w-full input" :rules="[mediaRequiredRule]">
      <UploadC v-model:file="formState.video" id="field-video" />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.presentation.title") }}
    </p>
    <a-form-item
      name="presentation"
      class="w-full input"
      :rules="[mediaRequiredRule]"
    >
      <p class="text-[14px] md:text-[20px] font-medium mb-2">
        {{ $t("application.employee.form.presentation.description") }}
      </p>
      <UploadC v-model:file="formState.presentation" id="field-presentation" />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.recommendation.title") }}
    </p>
    <a-form-item
      name="letter_recommendation"
      class="w-full input"
      :rules="[mediaRequiredRule]"
    >
      <UploadC
        v-model:file="formState.letter_recommendation"
        id="field-letter_recommendation"
      />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.esutd") }}
    </p>
    <a-form-item name="esutd" class="w-full input" :rules="[multiMediaRule]">
      <UploadMulti v-model="formState.esutd" id="field-esutd" />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.employment_record") }}
    </p>
    <a-form-item
      name="employment_record"
      class="w-full input"
      :rules="[mediaRequiredRule]"
    >
      <UploadC
        v-model:file="formState.employment_record"
        id="field-employment_record"
      />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.additional_letter_recommendation") }}
    </p>
    <a-form-item
      name="additional_letter_recommendation"
      class="w-full input"
      :rules="[mediaRequiredRule]"
    >
      <UploadC
        v-model:file="formState.additional_letter_recommendation"
        id="field-additional_letter_recommendation"
      />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.awards") }}
    </p>
    <a-form-item name="awards" class="w-full input" :rules="[multiMediaRule]">
      <UploadMulti v-model="formState.awards" id="field-awards" />
    </a-form-item>

    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.employee.form.certificate.title") }}
    </p>
    <a-form-item
      name="certificate"
      class="w-full input"
      :rules="[multiMediaRule]"
    >
      <UploadMulti v-model="formState.certificate" id="field-certificate" />
    </a-form-item>

    <Button
      class="w-full mt-0 md:mt-10"
      :text="$t('application.employee.form.agreement.button')"
      color="green"
    />
  </a-form>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import UploadC from "./UploadC.vue";
import UploadMulti from "./UploadMulti.vue";
import { useStore } from "../../../store";
import { message, notification } from "ant-design-vue";
import axios from "axios";
import { API_URL, TOKEN } from "../../../env";
import Button from "../../../components/Button.vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

const store = useStore();
const { locale, t } = useI18n();
const { user } = storeToRefs(store);
const emit = defineEmits(["status"]);

const requiredRule = computed(() => ({
  required: true,
  message:
    locale.value === "ru"
      ? "Поле обязательно для заполнения"
      : "Поляны міндетті түрде толтырылу керек",
}));

const iinRule = {
  pattern: /^[0-9]{12}$/,
  message: "ИИН должен содержать 12 цифр",
};

const mediaRequiredRule = {
  required: true,
  validator: (_: unknown, value: number | null) => {
    if (value != null && value > 0) return Promise.resolve();
    return Promise.reject(
      locale.value === "ru"
        ? "Прикрепите файл"
        : "Файлды тіркеңіз"
    );
  },
};

const multiMediaRule = {
  required: true,
  validator: (_: unknown, value: number[]) => {
    if (Array.isArray(value) && value.length > 0) return Promise.resolve();
    return Promise.reject(
      locale.value === "ru"
        ? "Прикрепите хотя бы один файл"
        : "Кем дегенде бір файлды тіркеңіз"
    );
  },
};

const formState = reactive({
  iin: user.value?.iin != null ? String(user.value.iin) : "",
  fio: `${user.value?.surname ?? ""} ${user.value?.firstname ?? ""} ${user.value?.secondname ?? ""}`.trim(),
  birthday: "",
  address: "",
  video: null as number | null,
  presentation: null as number | null,
  letter_recommendation: null as number | null,
  esutd: [] as number[],
  employment_record: null as number | null,
  additional_letter_recommendation: null as number | null,
  awards: [] as number[],
  certificate: [] as number[],
});

const handleFinish = async () => {
  const payload = {
    iin: formState.iin,
    fio: formState.fio,
    birthday: formState.birthday,
    address: formState.address,
    video: formState.video,
    presentation: formState.presentation,
    letter_recommendation: formState.letter_recommendation,
    esutd: formState.esutd,
    employment_record: formState.employment_record,
    additional_letter_recommendation: formState.additional_letter_recommendation,
    awards: formState.awards,
    certificate: formState.certificate,
  };

  await axios
    .post(
      `${API_URL}/api/applications`,
      { data: payload },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )
    .then(() => {
      notification.success({
        message:
          locale.value === "ru"
            ? "Заявка успешно отправлена"
            : "Өтінім сәтті жіберілді",
        description:
          locale.value === "ru"
            ? "Спасибо за участие в конкурсе!"
            : "Байқауға қатысқаныңыз үшін рахмет!",
      });
      if (user.value?.id) {
        store.getUserById(String(user.value.id));
      }
      emit("status", 1);
    })
    .catch((err) => {
      const msg =
        err?.response?.data?.error?.message ??
        err?.response?.data?.message ??
        (locale.value === "ru" ? "Ошибка отправки" : "Жіберу қатесі");
      notification.error({
        message: locale.value === "ru" ? "Ошибка" : "Қате",
        description: typeof msg === "string" ? msg : JSON.stringify(msg),
      });
    });
};
</script>
