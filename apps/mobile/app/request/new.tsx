import React from 'react';
import { KeyboardAvoidingView, Platform, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../theme';
import { useRequestStore } from '../../store/requests';
import { RequestFormComponent } from '../../components/RequestFormComponent';
import { generateDraftId, type RequestFormData } from '../../utils/requestValidation';

export default function CreateRequestScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const saveDraft = useRequestStore((state) => state.saveDraft);

  const handleSaveDraft = (data: Partial<RequestFormData>) => {
    const draft = {
      ...data,
      id: data.id || generateDraftId(),
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
      id: data.id || generateDraftId(),
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
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.app.backgroundDark : colors.app.backgroundLight,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <RequestFormComponent
          initialData={{ id: generateDraftId() }}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          isEdit={false}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
