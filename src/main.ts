import { createApp } from 'vue'
import App from './App.vue'
import antd from 'ant-design-vue';
import router from './router';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { i18n } from './locale'

import './assets/tailwind.css'
import './assets/index.scss'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

createApp(App).use(antd).use(router).use(pinia).use(i18n).mount('#app')
