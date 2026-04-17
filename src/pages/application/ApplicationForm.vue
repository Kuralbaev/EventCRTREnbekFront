<template>
  <div class="application">
    <div
      v-if="status === 0"
      class="bg-white rounded-[56px] md:rounded-[80px] p-6 md:p-14 max-w-[1236px] md:w-[90%] mx-auto"
    >
      <EmployeeForm @status="handleStatus" />
    </div>

    <div
      v-if="status === 1"
      class="bg-[#ffffff83] rounded-[80px] p-14 max-w-[1236px] w-[90%] mx-auto"
    >
      <img
        src="../../assets/images/icons/form_success.png"
        alt="check"
        class="w-[100px] h-[100px] mx-auto"
      />
      <p class="text-[24px] font-medium mb-4 mt-10 text-center">
        {{ $t("application.form.success.title") }} {{ user.firstname }}! <br />
        {{ $t("application.form.success.description") }}
      </p>

      <Button
        @click="$router.push('/profile')"
        color="green"
        :text="$t('application.form.success.button')"
        class="mt-10 w-full cursor-pointer shadow-[0px_24px_32px_0px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-b-[16px] border-[#6E9A6E] h-[154px] rounded-[56px] bg-[#7AAB7A] flex items-center justify-center text-[32px] font-medium text-white"
      />
    </div>

    <div
      v-if="status === 2"
      class="bg-[#ffffff83] rounded-[80px] p-14 max-w-[1236px] w-[90%] mx-auto"
    >
      <img
        src="../../assets/images/icons/form_failed.png"
        alt="check"
        class="w-[100px] h-[100px] mx-auto"
      />
      <p class="text-[24px] font-medium mb-4 mt-10 text-center">
        {{ $t("application.form.error.title") }} <br />
        {{ $t("application.form.error.description") }}
      </p>

      <Button
        :text="$t('application.form.error.button')"
        color="black"
        class="mt-10 w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import EmployeeForm from "./_components/EmployeeForm.vue";
import ProjectForm from "./_components/ProjectForm.vue";
import { onMounted, ref, watch } from "vue";
import { useStore } from "../../store";
import { storeToRefs } from "pinia";
import Button from "../../components/Button.vue";

const store = useStore();
const { userType, user } = storeToRefs(store);
const status = ref(0);

onMounted(() => {
  if (user.value?.application_status) {
    status.value = 1;
  }
});

watch(user, () => {
  if (user.value?.application_status) {
    status.value = 1;
  }
});

const handleStatus = (value: any) => {
  status.value = value;
};
</script>
