import { GenI18nEnum } from "@/i18n/genI18nEnum";
import { localeTransitions } from "@/i18n/langs";
import i18n from "i18next";

const i18nInstance = i18n.createInstance();

i18nInstance.init({
  lng: GenI18nEnum.ZH_CN,
  debug: import.meta.env.DEV,
  ns: Object.keys(localeTransitions),
  resources: localeTransitions,
});

export default i18nInstance;
