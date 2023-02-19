import { defineNuxtPlugin } from '#app'
import { LocaleObject, setLocale } from 'yup'
import { ru } from 'yup-locales'
import en from '~/services/utils/yup-default-locale'

const locales = { ru, en }
export default defineNuxtPlugin(({ $i18n }) => {
  setLocale(locales[unref($i18n.locale) as keyof typeof locales] as LocaleObject)
})
