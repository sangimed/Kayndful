import React, { createContext, useContext, useMemo, useState } from "react";

type Dict = Record<string, string>;

const en: Dict = {
  onboarding_step1_title: "Let’s get to know you.",
  onboarding_step2_title: "Where can you offer or receive help?",
  onboarding_step3_title: "Add a personal touch.",
  first_name: "First Name",
  last_name: "Last Name",
  username: "Username",
  first_name_required: "First name is required",
  last_name_required: "Last name is required",
  username_required: "Username is required",
  postal_address: "Postal address",
  zip: "ZIP",
  city: "City",
  or: "or",
  use_current_location: "Use my current location",
  location_helper: "Your address helps us connect you with nearby people.",
  location_privacy_note: "Only an approximate location is used to respect your privacy.",
  address_or_zip_city_required: "Enter an address or ZIP + City",
  zip_required_unless_address: "ZIP is required unless you provide an address",
  city_required_unless_address: "City is required unless you provide an address",
  name_preview_label: "Preview",
  toggle_initials: "Show last name initial",
  toggle_hide_last: "Hide last name",
  next: "Next",
  back: "Back",
  skip_for_now: "Skip for now",
  upload_photo: "Upload photo",
  short_bio: "Short bio",
  short_bio_placeholder: "Tell others a bit about you (optional)",
  bio_helper: "Profiles with a bio are more likely to be noticed.",
};

const fr: Dict = {
  onboarding_step1_title: "Apprenons à vous connaître.",
  onboarding_step2_title: "Où pouvez‑vous offrir ou recevoir de l’aide ?",
  onboarding_step3_title: "Ajoutez une touche personnelle.",
  first_name: "Prénom",
  last_name: "Nom",
  username: "Nom d’utilisateur",
  first_name_required: "Le prénom est requis",
  last_name_required: "Le nom est requis",
  username_required: "Le nom d’utilisateur est requis",
  postal_address: "Adresse postale",
  zip: "Code postal",
  city: "Ville",
  or: "ou",
  use_current_location: "Utiliser ma position actuelle",
  location_helper: "Votre adresse nous aide à vous connecter avec des personnes à proximité.",
  location_privacy_note: "Seule une position approximative est utilisée pour respecter votre vie privée.",
  address_or_zip_city_required: "Saisissez une adresse ou bien Code postal + Ville",
  zip_required_unless_address: "Le code postal est requis sauf si vous indiquez une adresse",
  city_required_unless_address: "La ville est requise sauf si vous indiquez une adresse",
  name_preview_label: "Aperçu",
  toggle_initials: "Afficher l’initiale du nom",
  toggle_hide_last: "Masquer le nom de famille",
  next: "Suivant",
  back: "Retour",
  skip_for_now: "Passer pour l’instant",
  upload_photo: "Télécharger une photo",
  short_bio: "Courte bio",
  short_bio_placeholder: "Parlez un peu de vous (facultatif)",
  bio_helper: "Les profils avec une bio sont plus souvent remarqués.",
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
