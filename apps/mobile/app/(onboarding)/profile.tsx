import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, radius } from '../../theme';
import ProgressHeader from '../../components/ProgressHeader';
import FormInput from '../../components/FormInput';
import StepFooter from '../../components/StepFooter';
import BackButton from '../../components/BackButton';
import { useOnboarding } from '../../store/onboarding';
import { useI18n } from '../../i18n';

const BG = '#FFF6EF';

export default function ProfileStep() {
  const router = useRouter();
  const { state, dispatch } = useOnboarding();
  const { t } = useI18n();

  const initial = (state.identity.firstName?.[0] || '').toUpperCase();

  const onUpload = async () => {
    // Placeholder implementation: set a bundled icon as avatar.
    // To enable real picking, install expo-image-picker and wire it here.
    try {
      dispatch({
        type: 'profile/update',
        payload: { avatarUri: Image.resolveAssetSource(require('../../assets/icon.png')).uri },
      });
    } catch {
      // If asset resolution fails for any reason, clear the avatar
      dispatch({ type: 'profile/update', payload: { avatarUri: undefined } });
    }
  };

  const onNext = () => {
    router.push('/skills');
  };

  const onSkip = () => {
    router.push('/skills');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BackButton style={{ marginBottom: spacing.lg }} />

          <ProgressHeader step={3} total={6} title={t('onboarding_step3_title')} />

          <View style={styles.avatarRow}>
            {state.profile.avatarUri ? (
              <Image source={{ uri: state.profile.avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{initial || '🙂'}</Text>
              </View>
            )}
            <Pressable accessibilityRole="button" onPress={onUpload} style={styles.uploadBtn}>
              <Text style={styles.uploadText}>{t('upload_photo')}</Text>
            </Pressable>
          </View>

          <FormInput
            label={t('short_bio')}
            placeholder={t('short_bio_placeholder')}
            value={state.profile.bio || ''}
            onChangeText={(bio) => dispatch({ type: 'profile/update', payload: { bio } })}
            accessibilityLabel={t('short_bio')}
            multiline
          />

          <Text style={styles.helper}>{t('bio_helper')}</Text>

          <View style={{ flex: 1 }} />

          <StepFooter
            onNext={onNext}
            onBack={router.back}
            onSkip={onSkip}
            skipLabel={t('skip_for_now')}
            nextLabel={t('next')}
            backLabel={t('back')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + 8,
    paddingBottom: spacing.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: { width: 88, height: 88, borderRadius: 88 / 2 },
  avatarPlaceholder: { backgroundColor: '#F2E7DF', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 28, fontWeight: '700', color: colors.brand.text },
  uploadBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.shadow.brand.color,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  uploadText: { color: colors.brand.text, fontWeight: '600' },
  helper: { color: colors.brand.muted, marginTop: spacing.sm },
});
