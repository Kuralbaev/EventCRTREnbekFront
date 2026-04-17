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
            {{ $t("profile.title") }}
          </p>
        </div>
        <p class="text-[32px] font-bold">
          {{ $t("profile.welcome") }}
          {{
            user?.firstname.charAt(0).toUpperCase() +
            user?.firstname.slice(1).toLowerCase()
          }}!
        </p>
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
      </div>
      <div class="bg-[#ffffffae] justify-between rounded-[64px] p-14 h-max">
        <div class="bg-white justify-between rounded-[64px] p-10">
          <a-form
            :model="formState"
            layout="vertical"
            @finish="handleFinish"
            @finishFailed="
              message.error(
                'Пожалуйста, заполните все поля, прежде чем отправить заявку'
              )
            "
          >
            <div>
              <p class="text-[20px] font-normal mb-2 flex items-center gap-2">
                <span class="text-[#ff4d4f] text-[14px] font-light">*</span>
                {{ $t("profile_edit.recommendation") }}
              </p>
              <a-form-item
                name="recommendation"
                class="w-full input"
                :rules="[
                  {
                    required: true,
                    message: 'Поле обязательно для заполнения',
                  },
                ]"
              >
                <div class="">
                  <UploadC
                    accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    :upload="formState.recommendation"
                    v-model:file="formState.recommendation"
                    :id="'recommendation'"
                  />
                </div>
              </a-form-item>
            </div>

            <a-divider />
            <p class="text-[32px] font-medium mb-4 mt-10">
              {{ $t("profile_edit.essay") }}
            </p>
            <!-- <a-form-item
              label="Номинация"
              name="nomination"
              class="w-full input"
              :rules="[
                { required: true, message: 'Поле обязательно для заполнения' },
              ]"
            >
              <a-select
                v-model:value="formState.nomination"
                class="h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[20px] !font-medium"
              >
                <a-select-option
                  v-for="nomination in store.nominations"
                  :value="nomination.id"
                >
                  {{ nomination[`name_${locale}`] }}
                </a-select-option>
              </a-select>
            </a-form-item> -->

            <a-form-item
              name="essay"
              class="w-full input"
              :rules="[
                { required: true, message: 'Поле обязательно для заполнения' },
              ]"
            >
              <div class="">
                <p class="text-[20px] font-medium mb-2 flex items-center gap-2">
                  <InfoCircleOutlined class="text-[20px]" />
                  {{ $t("profile_edit.essay_description") }}
                </p>
                <p class="text-[20px] font-light italic mb-2 text-[#9DA9B1]">
                  {{ $t("profile_edit.essay_description_2") }}
                </p>
                <UploadC
                  v-model:file="formState.essay"
                  :id="'essay'"
                  :upload="formState.essay"
                  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </div>
            </a-form-item>
            <a-divider />
            <p class="text-[32px] font-medium mb-4 mt-10">
              {{ $t("profile_edit.achievements") }}
            </p>

            <a-form-item
              name="achievements"
              class="w-full input"
              :rules="[
                { required: true, message: 'Поле обязательно для заполнения' },
              ]"
            >
              <div class="">
                <p class="text-[20px] font-medium mb-2 flex items-center gap-2">
                  {{ $t("profile_edit.achievements_description") }}
                </p>
                <UploadC
                  v-model:file="formState.achievements"
                  :id="'achievements'"
                  :upload="formState.achievements"
                  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </div>
            </a-form-item>
            <a-divider />
            <p class="text-[32px] font-medium mb-4 mt-10">
              {{ $t("profile_edit.plan") }}
            </p>
            <a-form-item
              name="plan"
              class="w-full input"
              :rules="[
                { required: true, message: 'Поле обязательно для заполнения' },
              ]"
            >
              <div class="">
                <p class="text-[20px] font-medium mb-2 flex items-center gap-2">
                  <InfoCircleOutlined class="text-[20px]" />
                  {{ $t("profile_edit.plan_description") }}
                </p>
                <p class="text-[20px] font-light italic mb-2 text-[#9DA9B1]">
                  {{ $t("profile_edit.plan_description_2") }}
                </p>
                <UploadC
                  v-model:file="formState.plan"
                  :id="'plan'"
                  :upload="formState.plan"
                  accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                />
              </div>
            </a-form-item>

            <a-divider />
            <p class="text-[32px] font-medium mb-4 mt-10">
              {{ $t("profile_edit.presentation") }}
            </p>
            <a-form-item
              name="presentation"
              class="w-full input"
              :rules="[
                { required: true, message: 'Поле обязательно для заполнения' },
              ]"
            >
              <p class="text-[20px] font-medium mb-2 flex items-center gap-2">
                {{ $t("profile_edit.presentation_description") }}
              </p>
              <UploadC
                v-model:file="formState.presentation"
                :id="'video'"
                :upload="formState.presentation"
                accept="video/*, application/pdf"
              />
            </a-form-item>

            <a-divider />
            <p class="text-[32px] font-medium mb-4 mt-10">
              {{ $t("profile_edit.contact_data") }}
            </p>

            <div class="grid grid-cols-2 gap-6 gap-y-2">
              <a-form-item
                :label="$t('profile_edit.phone')"
                name="phone"
                class="w-full input"
                :rules="[
                  {
                    required: true,
                    message: 'Поле обязательно для заполнения',
                  },
                ]"
              >
                <MaskInput
                  v-model="formState.phone"
                  :value="formState.phone"
                  placeholder="+7"
                  mask="+7 (###) ###-##-##"
                  class="h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] border !bg-[#F0F2F4] !text-[20px] !font-medium !px-6"
                />
              </a-form-item>
              <a-form-item
                :label="$t('profile_edit.email')"
                name="email"
                class="w-full input"
                :rules="[
                  {
                    required: true,
                    message: 'Поле обязательно для заполнения',
                  },
                  {
                    type: 'email',
                    message: 'Неверный формат email',
                  },
                ]"
              >
                <a-input
                  v-model:value="formState.email"
                  placeholder="почта"
                  class="h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[20px] !font-medium !px-6"
                />
              </a-form-item>
              <a-form-item
                :label="$t('profile_edit.social_networks')"
                name="social_networks"
                class="w-full input"
                :rules="[
                  {
                    required: true,
                    message: 'Поле обязательно для заполнения',
                  },
                ]"
              >
                <a-input
                  v-model:value="formState.social_networks"
                  :placeholder="$t('profile_edit.social_networks_placeholder')"
                  class="h-[70px] w-full !rounded-[24px] !border-[#E0E5EA] !bg-[#F0F2F4] !text-[20px] !font-medium !px-6"
                />
              </a-form-item>
            </div>

            <Button
              class="w-full mt-10"
              :disabled="!updated"
              :text="$t('profile_edit.save')"
              :color="!updated ? 'grey' : 'green'"
            />
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted } from "vue";
import { useStore } from "../../store";
import { storeToRefs } from "pinia";
import { InfoCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import UploadC from "../application/_components/UploadC.vue";
import Button from "../../components/Button.vue";
import { MaskInput } from "vue-3-mask";
import { notification, message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Header from "../../components/Header.vue";

const { t, locale } = useI18n();
const store = useStore();
const { user, company } = storeToRefs(store);
const updated = ref(false);
const router = useRouter();

const formState = reactive({
  // nomination: user?.value?.nomination?.id,
  essay: user?.value?.essay,
  achievements: user?.value?.achievements,
  plan: user?.value?.plan,
  presentation: user?.value?.presentation,
  recommendation: user?.value?.recommendation,
  phone: user?.value?.phone,
  email: user?.value?.email,
  social_networks: user?.value?.social_networks,
});

watch(formState, () => {
  updated.value = true;
});

const profile = ref([
  {
    title: company.value ? t("profile.bin") : t("profile.iin"),
    value: company.value
      ? company.value.bin
      : user?.value?.iin || "010101010101",
  },
  {
    title: t("profile.fio"),
    value: `${user?.value?.surname} ${user?.value?.firstname[0]} ${
      user?.value?.secondname?.[0] || ""
    }`,
  },
  {
    title: t("profile.region"),
    value: company.value
      ? `${company.value.districtRu}, ${company.value.regionRu}`
      : user?.value?.regionRu,
  },
]);

onMounted(() => {
  if (!user.value) {
    router.push("/");
  }
  if (!company.value) {
    profile.value.push({
      title: t("profile.position"),
      value: user?.value?.subContractEstablishedPost,
    });
    profile.value.push({
      title: t("profile.education"),
      value: !!user?.value?.education
        ? user?.value?.education
        : user?.value?.additional_education,
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
});

const isObject = (value: any) => {
  return typeof value === "object" && value !== null;
};

const handleFinish = (values: any) => {
  if (isObject(values.recommendation)) {
    delete values.recommendation;
  }
  if (isObject(values.essay)) {
    delete values.essay;
  }
  if (isObject(values.achievements)) {
    delete values.achievements;
  }
  if (isObject(values.plan)) {
    delete values.plan;
  }
  if (isObject(values.presentation)) {
    delete values.presentation;
  }

  store.updateUser(values).then(() => {
    notification.success({
      message: "Данные успешно изменены",
    });
    router.push("/profile");
  });
};
</script>
