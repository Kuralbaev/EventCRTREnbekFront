<template>
  <div class="pt-10">
    <a-textarea
      v-model:value="comment"
      class="w-full !rounded-[26px] !text-[16px] !py-3 !border-[#E0E5EA] !bg-[#F0F2F4] !font-medium"
      :rows="2"
      placeholder="Комментарий"
    />
    <a-button
      v-if="comment.trim() !== ''"
      type="primary"
      @click="handleComment"
      size="large"
      class="w-full !bg-[#34414A] text-white mt-2 !rounded-[10px]"
      >Отправить</a-button
    >
    <div class="comment pt-10">
      <p class="text-[16px] font-bold">Комментарий</p>

      <div
        class="bg-[#FFEFC8] w-full mt-4 rounded-[26px] p-6 cursor-pointer font-semibold"
        v-for="comment in comments"
        :key="comment.documentId"
      >
        <p class="text-[14px]">💬 {{ comment.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import axios from "axios";
import { API_URL } from "../../../env";
import { useRoute } from "vue-router";
import { useStore } from "../../../store";
import { storeToRefs } from "pinia";

const comment = ref("");
const route = useRoute();
const comments = ref<{ documentId: string; text: string }[]>([]);
const store = useStore();
const { user } = storeToRefs(store);

const getComments = () => {
  axios
    .get(`${API_URL}/api/comments?filters[user][id][$eq]=${route.params.id}`)
    .then((res) => {
      comments.value = res.data.data;
    });
};

const handleComment = () => {
  if (comment.value.trim() === "") {
    message.error("Комментарий не может быть пустым");
    return;
  }
  axios.post(`${API_URL}/api/comments`, {
    data: {
      text: comment.value,
      iin: user.value.iin,
      fio: `${user.value.surname} ${user.value.firstname}`,
      user: {
        connect: [+route.params.id],
      },
    },
  });
  getComments();
};
onMounted(() => {
  getComments();
});
</script>

<style lang="scss" scoped></style>
