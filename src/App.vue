<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "./store";
import { useI18n } from "vue-i18n";

const store = useStore();
const { locale } = useI18n();

onMounted(async () => {
  // await store.fetchRegions();
  await store.fetchNominations();
  // await store.fetchCommission();
  store.voting = true;

  if (store.user) {
    await store.getUserByIin(store.user.iin);
  }

  locale.value = store.language;
});
</script>

<template>
  <div :class="{ kk: locale === 'kk' }">
    <router-view />
  </div>
</template>
