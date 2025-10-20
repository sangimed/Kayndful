import React from "react";
import { Stack } from "expo-router";
import { OnboardingProvider } from "../../store/onboarding";
import { I18nProvider } from "../../i18n";

export default function OnboardingLayout() {
  return (
    <I18nProvider>
      <OnboardingProvider>
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
      </OnboardingProvider>
    </I18nProvider>
  );
}

