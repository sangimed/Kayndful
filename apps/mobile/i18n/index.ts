import React, { createContext, useContext, useMemo, useState } from "react";

type Dict = Record<string, string>;

  const en: Dict = {
    onboarding_step1_title: "Let’s get to know you.",
    first_name: "First Name",
    last_name: "Last Name",
    username: "Username",
    first_name_required: "First name is required",
    last_name_required: "Last name is required",
    username_required: "Username is required",
    name_preview_label: "Preview",
    toggle_initials: "Show last name initial",
    toggle_hide_last: "Hide last name",
    next: "Next",
  back: "Back",
  skip_for_now: "Skip for now",
};

  const fr: Dict = {
    onboarding_step1_title: "Apprenons à vous connaître.",
    first_name: "Prénom",
    last_name: "Nom",
    username: "Nom d’utilisateur",
    first_name_required: "Le prénom est requis",
    last_name_required: "Le nom est requis",
    username_required: "Le nom d’utilisateur est requis",
    name_preview_label: "Aperçu",
    toggle_initials: "Afficher l’initiale du nom",
    toggle_hide_last: "Masquer le nom de famille",
    next: "Suivant",
  back: "Retour",
  skip_for_now: "Passer pour l’instant",
};

type I18nCtx = { t: (k: string) => string; lang: "en" | "fr"; setLang: (l: "en" | "fr") => void };
const I18nContext = createContext<I18nCtx | undefined>(undefined);

export function I18nProvider({ children, defaultLang = "en" as const }) {
  const [lang, setLang] = useState<"en" | "fr">(defaultLang);
  const t = useMemo(() => {
    const dict = lang === "fr" ? fr : en;
    return (k: string) => dict[k] ?? k;
  }, [lang]);
  const value = useMemo(() => ({ t, lang, setLang }), [t, lang]);
  return React.createElement(I18nContext.Provider, { value }, children as any);
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
