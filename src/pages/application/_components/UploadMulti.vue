<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="item in items"
      :key="item.id"
      class="mt-2 p-6 pb-2 rounded-[26px] bg-[#F0F2F4]"
    >
      <div class="grid grid-cols-[48px_1fr_auto] gap-4 mb-4">
        <div class="relative">
          <img
            src="../../../assets/images/icons/upload.png"
            alt=""
            class="w-10"
          />
          <p
            class="bg-[#D82042] absolute top-1/2 -translate-y-1/2 right-1/2 text-white p-1 rounded-md px-2"
          >
            {{ item.ext }}
          </p>
        </div>
        <div>
          <p class="text-[20px] font-medium mb-1">{{ item.name }}</p>
          <p class="text-[20px] font-medium text-[#9DA9B1]">
            {{ (item.size / 1024).toFixed(2) }} KB
          </p>
        </div>
        <p
          class="text-[24px] font-semibold text-[#D82042] cursor-pointer"
          @click="removeFile(item.id)"
        >
          <DeleteOutlined />
        </p>
      </div>
    </div>
    <label
      :for="id"
      class="bg-[#DEEEFF] hover:bg-[#D1E7FF] transition-all duration-300 h-14 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer text-[14px] md:text-[16px] font-semibold"
    >
      <img
        src="../../../assets/images/icons/file.png"
        alt="file"
        class="w-4 md:w-6 h-4 md:h-6"
      />
      {{ $t("application.form.upload.button") }}
    </label>
    <input
      type="file"
      :id="id"
      class="hidden"
      hidden
      multiple
      v-bind="accept ? { accept } : {}"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { DeleteOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import axios from "axios";
import { API_URL, TOKEN } from "../../../env";
import { message } from "ant-design-vue";

const props = defineProps<{
  id: string;
  accept?: string;
}>();

const model = defineModel<number[]>({ default: () => [] });

const items = ref<
  Array<{
    id: number;
    name: string;
    ext: string;
    size: number;
  }>
>([]);

const validateSize = (file: File) => {
  const isVideo =
    props.accept?.includes("video") || file.type.startsWith("video/");
  if (isVideo && file.size / 1024 / 1024 > 15) {
    message.error("Размер файла не должен превышать 15MB");
    return false;
  }
  if (!isVideo && file.size / 1024 / 1024 > 5) {
    message.error("Размер файла не должен превышать 5MB");
    return false;
  }
  return true;
};

const uploadOne = async (file: File) => {
  if (!validateSize(file)) return;
  const formData = new FormData();
  formData.append("files", file);
  try {
    const { data } = await axios.post(`${API_URL}/api/upload/`, formData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    const uploaded = data[0];
    items.value.push({
      id: uploaded.id,
      name: uploaded.name,
      ext: uploaded.ext,
      size: uploaded.size,
    });
    model.value = [...model.value, uploaded.id];
  } catch {
    message.error("Ошибка загрузки");
  }
};

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const list = input.files;
  if (!list?.length) return;
  for (const f of Array.from(list)) {
    await uploadOne(f);
  }
  input.value = "";
};

const removeFile = async (id: number) => {
  await axios.delete(`${API_URL}/api/upload/files/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  items.value = items.value.filter((x) => x.id !== id);
  model.value = model.value.filter((x) => x !== id);
};
</script>
