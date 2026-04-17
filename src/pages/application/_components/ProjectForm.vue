<template>
  <a-form
    :model="formState"
    layout="vertical"
    @finish="handleFinish"
    @finishFailed="message.error($t('application.form.error.message'))"
  >
    <p class="text-[20px] md:text-[32px] font-medium mb-4">
      {{ $t("application.project.title") }}
    </p>

    <div class="">
      <a-form-item
        :label="$t('application.project.form.author')"
        name="author"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.author"
          :disabled="true"
          :placeholder="$t('application.project.form.author_placeholder')"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] disabled:!text-black !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>

      <a-form-item
        :label="$t('application.project.form.region')"
        name="region"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.region"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] disabled:!text-black !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
    </div>
    <div>
      <p
        class="text-[14px] md:text-[20px] font-normal mb-2 flex items-center gap-2"
      >
        <span class="text-[#ff4d4f] text-[14px] font-light">*</span>
        {{ $t("application.project.form.author_annotation") }}
      </p>
      <a-form-item
        name="author_annotation"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-textarea
          :rows="4"
          v-model:value="formState.author_annotation"
          :placeholder="
            $t('application.project.form.author_annotation_placeholder')
          "
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6 !py-4"
        />
      </a-form-item>
    </div>

    <a-divider />
    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.project.form.project_name") }}
    </p>
    <div>
      <a-form-item
        :label="$t('application.project.form.project_name')"
        name="project_name"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.project_name"
          :placeholder="$t('application.project.form.project_name_placeholder')"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>

      <a-form-item
        name="logo"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <div class="">
          <p
            class="text-[14px] md:text-[20px] font-medium mb-2 flex items-center gap-2"
          >
            <span class="text-[#ff4d4f] text-[14px] font-light">*</span>
            {{ $t("application.project.form.logo") }}
          </p>
          <p
            class="text-[14px] md:text-[20px] font-light italic mb-2 text-[#9DA9B1]"
          >
            {{ $t("application.project.form.logo_description") }}
          </p>
          <UploadC
            v-model:file="formState.logo"
            :id="'logo'"
            accept="image/*"
          />
        </div>
      </a-form-item>
      <a-form-item
        :label="$t('application.project.form.project_direction')"
        name="project_direction"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.project_direction"
          :placeholder="
            $t('application.project.form.project_direction_placeholder')
          "
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.project.form.project_duration')"
        name="project_duration"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.project_duration"
          :placeholder="
            $t('application.project.form.project_duration_placeholder')
          "
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
    </div>

    <a-divider />
    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.project.form.project_actuality") }}
    </p>
    <div>
      <a-form-item
        :label="$t('application.project.form.project_actuality')"
        name="project_actuality"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.project_actuality"
          :placeholder="
            $t('application.project.form.project_actuality_placeholder')
          "
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.project.form.project_results')"
        name="project_results"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.project_results"
          :placeholder="
            $t('application.project.form.project_results_placeholder')
          "
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.project.form.project_funding')"
        name="project_funding"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.project_funding"
          :placeholder="
            $t('application.project.form.project_funding_placeholder')
          "
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
    </div>

    <a-divider />
    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.project.form.presentation") }}
    </p>

    <div>
      <a-form-item
        name="logo"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <div class="">
          <p
            class="text-[14px] md:text-[20px] font-medium mb-2 flex items-center gap-2"
          >
            <span class="text-[#ff4d4f] text-[14px] font-light">*</span>
            {{ $t("application.project.form.presentation_description") }}
          </p>
          <UploadC
            v-model:file="formState.presentation"
            :id="'presentation'"
            accept="video/*, application/pdf"
          />
        </div>
      </a-form-item>
    </div>

    <a-divider />
    <p class="text-[20px] md:text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.project.form.contact") }}
    </p>

    <div class="grid md:grid-cols-2 gap-4 md:gap-6 gap-y-2">
      <a-form-item
        :label="$t('application.project.form.phone')"
        name="phone"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <MaskInput
          v-model="formState.phone"
          :value="formState.phone"
          placeholder="+7"
          mask="+7 (###) ###-##-##"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] border !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.project.form.email')"
        name="email"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
          {
            type: 'email',
            message:
              locale === 'ru' ? 'Неверный формат email' : 'Email формат қате',
          },
        ]"
      >
        <a-input
          v-model:value="formState.email"
          placeholder="почта"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <a-form-item
        :label="$t('application.project.form.social_networks')"
        name="social_networks"
        class="w-full input"
        :rules="[
          {
            required: true,
            message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек',
          },
        ]"
      >
        <a-input
          v-model:value="formState.social_networks"
          placeholder="Ссылки на соцсети проекта или автора"
          class="h-[62px] md:h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[14px] md:!text-[20px] !font-medium !px-6"
        />
      </a-form-item>
      <!-- <a-form-item
        label="Дата подачи заявки"
        name="date"
        class="w-full input"
        :rules="[
          { required: true, message:
              locale === 'ru'
                ? 'Поле обязательно для заполнения'
                : 'Поляны міндетті түрде толтырылу керек', },
        ]"
      >
        <a-date-picker
          v-model:value="formState.date"
          placeholder=""
          class="h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[20px] !font-medium !px-6"
        />
      </a-form-item> -->
    </div>

    <!-- <a-divider />
    <p class="text-[32px] font-medium mb-4 mt-10">
      {{ $t("application.project.form.agreement") }}
    </p>
    <a-checkbox
      size="large"
      v-model:checked="checked"
      class="flex items-center gap-2 input"
    >
      <p class="text-[20px] font-medium">
        {{ $t("application.project.form.agreement_description") }}
        <br />
        <a href="#" class="!text-[#628BE4]">{{
          $t("application.project.form.agreement_link")
        }}</a>
      </p>
    </a-checkbox> -->

    <Button
      class="w-full mt-0 md:mt-10"
      :text="$t('application.project.form.agreement_button')"
      color="green"
    />
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import UploadC from "./UploadC.vue";
import { useStore } from "../../../store";
import { message, notification } from "ant-design-vue";
import axios from "axios";
import { API_URL, TOKEN } from "../../../env";
import Button from "../../../components/Button.vue";
import { storeToRefs } from "pinia";
import { MaskInput } from "vue-3-mask";
import { useI18n } from "vue-i18n";

const store = useStore();
const { locale } = useI18n();
const { user, company } = storeToRefs(store);
const emit = defineEmits(["status"]);

const formState = reactive({
  author: company.value.fullNameRu,
  region: `${company.value.districtRu}, ${company.value.regionRu}`,
  work_region: user.value?.districtRu,
  author_annotation: "",
  project_name: "",
  logo: "",
  project_direction: "",
  project_duration: "",
  project_actuality: "",
  project_results: "",
  project_funding: "",
  presentation: "",
  phone: user.value?.phone,
  email: "",
  social_networks: "",
  date: "",
  bin: company.value.bin,
  bin_str: company.value?.bin?.toString(),
  iin: user.value.iin,
  nomination: null,
});

const handleFinish = async () => {
  await axios
    .post(
      `${API_URL}/api/users`,
      {
        ...formState,
        nomination: {
          connect: 8,
        },
        username: formState.email,
        confirmed: true,
        role: 1,
        password: "Aa123456.",
        code: +formState.iin + +formState.bin,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    )
    .then((res) => {
      emit("status", 1);
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

      store.getUserById(res.data.id);
    })
    .catch(({ response }) => {
      if (response.data.error.message.toLowerCase().includes("email")) {
        notification.error({
          message: locale.value === "ru" ? "Ошибка" : "Қате",
          description:
            locale.value === "ru" ? "Email уже занят" : "Email бос емес",
        });
      } else {
        notification.error({
          message: locale.value === "ru" ? "Ошибка" : "Қате",
          description: response.data.error.message,
        });
      }
    });
};
</script>
