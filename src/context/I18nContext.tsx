import { createContext, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import i18nInstance from "@/i18n/init";

export type I18nContextType = NonNullable<unknown>;

export const I18nContext = createContext<I18nContextType | null>(null);

export function I18nContextCmp(props: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18nInstance} defaultNS={"common"}>
      <I18nContext.Provider value={{}}>{props.children}</I18nContext.Provider>
    </I18nextProvider>
  );
}
