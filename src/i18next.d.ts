import { I18nResourceInterface } from "@/i18n/genI18n.resources";
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: I18nResourceInterface;
  }
}
