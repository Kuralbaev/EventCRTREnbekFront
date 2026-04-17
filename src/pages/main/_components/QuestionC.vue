<template>
  <div
    class="application pt-10 md:pt-[128px] pb-20 md:pb-[200px] mx-auto rounded-t-[56px] md:rounded-t-[80px] p-0 md:p-14 bg-[#EAE6CD] relative z-10"
    id="questions"
  >
    <h2 class="text-[32px] md:text-[72px] font-semibold text-center mb-8">
      {{ $t("questions.title") }}
    </h2>

    <div class="list max-w-[984px] md:w-[90%] mx-auto space-y-2 md:space-y-6">
      <div
        class="rounded-[36px] md:rounded-[80px] p-6 md:p-12 grid grid-cols-[64px_1fr_auto] gap-4 md:gap-10"
        v-for="(item, idx) in questions"
        :key="item.title"
        :class="{
          'bg-white': activeTab === idx,
          'bg-[#ffffffb1]': activeTab !== idx,
        }"
        @click="activeTab === idx ? (activeTab = -1) : (activeTab = idx)"
      >
        <p class="text-[24px] md:text-[44px] font-bold">0{{ idx + 1 }}</p>
        <div class="row-span-2 col-span-3 md:col-span-1">
          <p class="text-[18px] md:text-[32px] font-bold cursor-pointer">
            {{ item.title }}
          </p>
          <div
            class="text-[14px] md:text-[20px] font-medium mt-3 md:mt-7"
            v-if="activeTab === idx"
            v-html="item.answer"
          />
        </div>
        <div
          class="flex items-center bg-white cursor-pointer rotate-0 transition-all row-1 col-3 md:col-none md:row-none duration-300 justify-center w-6 h-6 md:w-12 md:h-12 rounded-full text-[12px] md:text-[24px] font-bold"
          :class="{
            '!bg-[#34414A] text-white rotate-45': activeTab === idx,
            'text-[#34414A]': activeTab !== idx,
          }"
        >
          <PlusOutlined />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from "@ant-design/icons-vue";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const activeTab = ref(0);
const questions = computed(() => {
  return locale.value === "kk" ? questions_kk : questions_ru;
});

const questions_ru = [
  {
    title: "Кто может участвовать в конкурсе?",
    answer:
      "Социальные работники Центров оказания специальных социальных услуг, организации надомного обслуживания, социальные инспектора, работники медико-социальной экспертизы территориальных департаментов Комитета регулирования и контроля в сфере социальной защиты населения, специалисты оказывающие услуги ЦОССУ и РЦ, работники центра трудовой мобильности (карьерного центра) и НПО, ЧФ и др.",
  },
  {
    title: "Какие есть номинации?",
    answer: `
        1) «Лучший работник медико-социальной экспертизы»;</br></br>
        2) «Лучший работник центров трудовой мобильности карьерного центра»;</br></br>
        4) «Лучший социальный работник Центра оказания специальных социальных услуг»;</br></br>
        5) «Лучший социальный педагог» (в системе оказания ССУ);</br></br>
        6) «Лучший социальный инспектор»;</br></br>
        7) «Лучший социальный работник организации надомного обслуживания».
      `,
  },
  // {
  //   title: "Как подать заявку?",
  //   answer:
  //     "На сайте <a style='color: blue !important;' href='https://qamqor.enbek.kz' target='_blank'>qamqor.enbek.kz</a>.",
  // },
  // {
  //   title: "Какие материалы нужно прикрепить?",
  //   answer: "Видеоролик ",
  // },
  // {
  //   title: "Как проходит голосование?",
  //   answer: "Онлайн-голосования проводится на единой онлайн-платформе",
  // },
  // {
  //   title: "Как защищается голосование от накрутки?",
  //   answer: "ЦРТР",
  // },
  // {
  //   title: "Когда объявят результаты?",
  //   answer: "24.10.2025 года",
  // },
  {
    title: "Куда обращаться, если возникли вопросы?",
    answer:
      "Колл-центр АО «Центр развития трудовых ресурсов» по номеру <a style='color: blue !important;' href='tel:1414' target='_blank'>1414</a>;</br>МТСЗН – <a style='color: blue !important;' href='tel:743654' target='_blank'>74-36-54</a>.",
  },
];

const questions_kk = [
  {
    title: "Байқауға кім қатыса алады?",
    answer:
      "Арнаулы әлеуметтік қызметтер көрсету орталықтарының әлеуметтік қызметкерлері, үйде қызмет көрсетуді ұйымдастыру, әлеуметтік инспекторлар, Халықты әлеуметтік қорғау саласындағы реттеу және бақылау комитетінің аумақтық департаменттерінің медициналық-әлеуметтік сараптама қызметкерлері, ЦОССУ және РО қызметтерін көрсететін мамандар, еңбек ұтқырлығы орталығының (мансаптық орталықтың) және ҮЕҰ, ЖҚ және т. б. қызметкерлері.",
  },
  {
    title: "Номинациялар қандай?",
    answer: `
        1)«Медициналық-әлеуметтік сараптаманың үздік қызметкері»</br></br>
        2)«Мансап орталығының еңбек ұтқырлығы орталықтарының үздік қызметкері»</br></br>
        3)«Үздік әлеуметтік жоба»</br></br>
        4)«Арнаулы әлеуметтік қызметтер көрсету орталығының үздік әлеуметтік қызметкері»</br></br>
        5)«Үздік әлеуметтік педагог» (ССУ көрсету жүйесінде)</br></br>
        6)«Үздік әлеуметтік инспектор»</br></br>
        7)«Үйде қызмет көрсету ұйымының үздік әлеуметтік қызметкері»
      `,
  },
  // {
  //   title: "Как подать заявку?",
  //   answer:
  //     "На сайте <a style='color: blue !important;' href='https://qamqor.enbek.kz' target='_blank'>qamqor.enbek.kz</a>.",
  // },
  // {
  //   title: "Какие материалы нужно прикрепить?",
  //   answer: "Видеоролик ",
  // },
  // {
  //   title: "Как проходит голосование?",
  //   answer: "Онлайн-голосования проводится на единой онлайн-платформе",
  // },
  // {
  //   title: "Как защищается голосование от накрутки?",
  //   answer: "ЦРТР",
  // },
  // {
  //   title: "Когда объявят результаты?",
  //   answer: "24.10.2025 года",
  // },
  {
    title: "Егер сұрақтар туындаса, қайда жүгіну керек?",
    answer:
      "'Еңбек ресурстарын дамыту орталығы' АҚ Колл-орталығы <a style='color :blue!important; 'href=' tel: 1414'target='_blank'>1414</a>;</br>Еңбекмині – <a style= ' color: blue !important;' href='tel:743654' target='_blank'>74-36-54</a>.",
  },
];
</script>
