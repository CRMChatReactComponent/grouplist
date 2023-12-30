import { I18nResourceInterface } from "@/i18n/genI18n.resources";
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: I18nResourceInterface;
  }
}
