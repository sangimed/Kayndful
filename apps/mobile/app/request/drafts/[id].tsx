import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../../../theme';
import { useRequestStore } from '../../../store/requests';
import { RequestFormComponent } from '../../../components/RequestFormComponent';
import type { RequestFormData } from '../../../utils/requestValidation';

export default function EditRequestDraftScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const params = useLocalSearchParams<{ id?: string }>();
  const draftId = params.id;

  const drafts = useRequestStore((state) => state.drafts);
  const saveDraft = useRequestStore((state) => state.saveDraft);

  const existingDraft = draftId ? drafts[draftId] : undefined;

  const handleSaveDraft = (data: Partial<RequestFormData>) => {
    const draft = {
      ...data,
      id: draftId || data.id,
      updatedAt: new Date().toISOString(),
      published: false,
    };
    saveDraft(draft as any);

    router.replace({
      pathname: '/request/confirmation',
      params: {
        title: draft.title || '',
        category: draft.category || '',
        duration: draft.estimatedMinutes?.toString() || '',
        volunteers: draft.maxVolunteers?.toString() || '',
        isDraft: 'true',
      },
    });
  };

  const handlePublish = (data: Partial<RequestFormData>) => {
    const draft = {
      ...data,
      id: draftId || data.id,
      updatedAt: new Date().toISOString(),
      published: true,
    };
    saveDraft(draft as any);

    router.replace({
      pathname: '/request/confirmation',
      params: {
        title: draft.title || '',
        category: draft.category || '',
        duration: draft.estimatedMinutes?.toString() || '',
        volunteers: draft.maxVolunteers?.toString() || '',
        isDraft: 'false',
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.app.backgroundDark : colors.app.backgroundLight,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <RequestFormComponent
          initialData={existingDraft}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isEdit={true}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
