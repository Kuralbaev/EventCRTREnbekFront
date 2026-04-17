import { createI18n } from 'vue-i18n'
import ru from './ru'
import kk from './kk'

export const i18n = createI18n({
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: {
      ru,
      kk
    }
  })