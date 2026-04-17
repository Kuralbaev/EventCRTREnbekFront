<template>
  <div>
    <template v-if="upload && Object.keys(upload).length > 0">
      <div class="mt-2 p-6 pb-2 rounded-[26px] bg-[#F0F2F4]">
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
              {{ upload.ext }}
            </p>
          </div>
          <div>
            <p class="text-[20px] font-medium mb-1">{{ upload?.name }}</p>
            <p
              class="text-[20px] font-medium text-[#9DA9B1] flex items-center gap-4"
            >
              {{ (upload?.size / 1024).toFixed(2) }} MB
            </p>
          </div>
          <p
            class="text-[24px] font-semibold text-[#D82042] cursor-pointer"
            @click="removeFile(upload.id)"
          >
            <DeleteOutlined />
          </p>
        </div>
        <a-progress
          :percent="progress"
          :show-info="false"
          v-if="status === 'uploading'"
        />
      </div>
    </template>
    <template v-else>
      <label
        v-if="!file"
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
        :accept="accept"
        @change="handleFileChange"
      />

      <div v-if="file" class="mt-2 p-6 pb-2 rounded-[26px] bg-[#F0F2F4]">
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
              {{ file?.name.split(".").reverse()[0] }}
            </p>
          </div>
          <div>
            <p
              class="text-[20px] font-medium mb-1 grid gap-2"
              :class="{
                ' grid-cols-[24px_1fr]': !!video?.mime?.includes('video'),
              }"
            >
              <PlayCircleFilled
                v-if="!!video?.mime?.includes('video')"
                class="text-[24px] !text-blue-600 cursor-pointer"
                @click="open = true"
              />
              {{ file?.name }}
            </p>
            <p
              class="text-[20px] font-medium text-[#9DA9B1] flex items-center gap-4"
            >
              {{ (file?.size / 1024 / 1024).toFixed(2) }} MB
              <span
                class="text-[#34414A] flex items-center gap-2"
                v-if="status === 'uploaded'"
                ><CheckCircleFilled class="!text-green-600" />
                {{ $t("application.form.upload.success") }}</span
              >
              <span
                class="text-[#34414A] flex items-center gap-2"
                v-if="status === 'error'"
              >
                <CloseCircleFilled class="!text-red-600" @click="file = null" />
                {{ $t("application.form.upload.error") }}
              </span>
            </p>
          </div>
          <p
            v-if="status === 'uploaded'"
            class="text-[24px] font-semibold text-[#D82042] cursor-pointer"
            @click="removeFile(fileId)"
          >
            <DeleteOutlined />
          </p>
        </div>
        <a-progress
          :percent="progress"
          :show-info="false"
          v-if="status === 'uploading'"
        />
      </div>
    </template>
    <a-modal
      v-model:open="open"
      title=""
      :footer="false"
      class="max-w-[800px] w-[90%]"
    >
      <video width="100%" height="100%" controls>
        <source :src="`${API_URL}${video?.url}`" type="video/mp4" />
      </video>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  CheckCircleFilled,
  CloseCircleFilled,
  DeleteOutlined,
  PlayCircleFilled,
} from "@ant-design/icons-vue";
import { ref } from "vue";
import axios from "axios";
import { API_URL, TOKEN } from "../../../env";
import { message } from "ant-design-vue";

const open = ref(false);

const props = defineProps<{
  id: string;
  upload?: any;
  accept?: string;
}>();

const emit = defineEmits<{
  (e: "update:file", file: number | null): void;
}>();

const file = ref();
const video = ref();
const fileId = ref(null);
const status = ref<"uploading" | "uploaded" | "error" | null>(null);

const handleFileChange = (e: Event) => {
  const _file = (e.target as HTMLInputElement).files?.[0];
  if (_file) {
    const isVideo =
      props.accept?.includes("video") || _file.type.startsWith("video/");
    if (isVideo && _file.size / 1024 / 1024 > 15) {
      message.error("Размер файла не должен превышать 15MB");
      return;
    }
    if (!isVideo && _file.size / 1024 / 1024 > 5) {
      message.error("Размер файла не должен превышать 5MB");
      return;
    }
    file.value = _file;
    uploadFileProgress(_file);
  }
};

// progress upload file
const progress = ref(0);
const uploadFileProgress = async (file: File) => {
  const formData = new FormData();
  formData.append("files", file);
  await axios
    .post(`${API_URL}/api/upload/`, formData, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      onUploadProgress: (progressEvent) => {
        progress.value = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        status.value = "uploading";
      },
    })
    .then((response) => {
      fileId.value = response.data[0].id;
      video.value = response.data[0];
      status.value = "uploaded";
      emit("update:file", fileId.value);
    })
    .catch(() => {
      status.value = "error";
    });
};

const removeFile = async (id: string) => {
  await axios.delete(`${API_URL}/api/upload/files/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  file.value = null;
  fileId.value = null;
  status.value = null;
  emit("update:file", null);
};
</script>
