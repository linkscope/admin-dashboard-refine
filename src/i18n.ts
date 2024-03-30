import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import cn from './locales/cn.json'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

i18n.use(initReactI18next).init({
  lng: 'cn',
  resources: {
    cn: {
      translation: cn,
    },
  },
  supportedLngs: ['cn'],
  fallbackLng: ['cn'],
})

export default i18n
