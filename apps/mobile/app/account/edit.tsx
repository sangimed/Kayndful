import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { useAuthStore } from '../../store/auth';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const SKILLS = [
  'Bricolage',
  'Courses',
  'Conseil',
  'Services',
  'Discussion',
  'Mentorat',
  'Livraison',
];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, updateProfile } = useAuthStore();
  const base = currentUser ?? {
    name: 'Alex Martin',
    bio: '',
    area: 'Belleville (~800 m)',
    skills: [] as string[],
  };

  const [name, setName] = useState(base.name);
  const [bio, setBio] = useState(base.bio ?? '');
  const [area, setArea] = useState(base.area);
  const [skills, setSkills] = useState<string[]>(base.skills ?? []);
  const [saving, setSaving] = useState(false);

  const isValid = useMemo(() => name.trim().length > 1 && area.trim().length > 3, [name, area]);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill],
    );
  };

  const onSave = async () => {
    if (!isValid) return;
    try {
      setSaving(true);
      await updateProfile({
        name: name.trim(),
        bio: bio.trim() || undefined,
        area: area.trim(),
        skills,
      });
      showSuccessToast('Profil mis a jour.');
      router.back();
    } catch (error) {
      showErrorToast('Impossible de mettre a jour le profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.gray,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={{
            padding: spacing.lg,
            gap: spacing.lg,
            paddingBottom: spacing.xl + spacing.safeBottom,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.brand.surface,
                borderWidth: 1,
                borderColor: colors.brand.border,
              }}
            >
              <Ionicons name="chevron-back" size={22} color={colors.brand.text} />
            </Pressable>
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>
              Editer le profil
            </Text>
            <View style={{ width: 44 }} />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontWeight: '600', color: colors.brand.text }}>Nom</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ton nom"
              placeholderTextColor={colors.brand.muted}
              style={{
                backgroundColor: colors.brand.surface,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                fontSize: 16,
                color: colors.brand.text,
                borderWidth: 1,
                borderColor: colors.brand.border,
              }}
            />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontWeight: '600', color: colors.brand.text }}>Zone approx.</Text>
            <TextInput
              value={area}
              onChangeText={setArea}
              placeholder="Ex: Belleville (~800 m)"
              placeholderTextColor={colors.brand.muted}
              style={{
                backgroundColor: colors.brand.surface,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                fontSize: 16,
                color: colors.brand.text,
                borderWidth: 1,
                borderColor: colors.brand.border,
              }}
            />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontWeight: '600', color: colors.brand.text }}>Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Quelques mots sur toi"
              placeholderTextColor={colors.brand.muted}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: colors.brand.surface,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                fontSize: 16,
                color: colors.brand.text,
                borderWidth: 1,
                borderColor: colors.brand.border,
                textAlignVertical: 'top',
                minHeight: 110,
              }}
            />
          </View>

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontWeight: '600', color: colors.brand.text }}>Competences</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {SKILLS.map((skill) => {
                const selected = skills.includes(skill);
                return (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    style={{
                      paddingHorizontal: spacing.sm,
                      paddingVertical: spacing.xs,
                      borderRadius: 999,
                      backgroundColor: selected ? '#dcfce7' : colors.brand.surfaceStrong,
                      borderWidth: selected ? 1 : 0,
                      borderColor: selected ? colors.semantic.success : 'transparent',
                    }}
                  >
                    <Text style={{ color: selected ? colors.semantic.success : colors.brand.text }}>
                      {skill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <PrimaryButton
            title="Sauvegarder"
            variant="success"
            disabled={!isValid || saving}
            onPress={onSave}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
