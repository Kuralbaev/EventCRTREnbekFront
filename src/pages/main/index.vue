<template>
  <div class="mx-auto">
    <!-- Header -->
    <HeaderC />

    <!-- About -->
    <AboutC />

    <!-- Nominations -->
    <NominationC />

    <!-- Application -->
    <ApplicationC />

    <!-- Questions -->
    <QuestionsC />

    <!-- Timer -->
    <TimerC />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import HeaderC from "./_components/HeaderC.vue";
import AboutC from "./_components/AboutC.vue";
import NominationC from "./_components/NominationC.vue";
import ApplicationC from "./_components/ApplicationC.vue";
import QuestionsC from "./_components/QuestionC.vue";
import TimerC from "./_components/TimerC.vue";
import Footer from "../../components/Footer.vue";
</script>

<style lang="scss" scoped></style>
