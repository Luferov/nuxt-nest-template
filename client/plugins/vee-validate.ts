import { unref } from 'vue'
import { configure } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import ru from '@vee-validate/i18n/dist/locale/ru.json'

import { defineNuxtPlugin } from '#app'

configure({
  generateMessage: localize({ ru, en }),
})

export default defineNuxtPlugin(({ $i18n }) => {
  setLocale(unref($i18n.locale))
})
