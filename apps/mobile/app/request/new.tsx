import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../../theme';
import { PrimaryButton } from '../../components/Button';
import { REQUEST_CATEGORIES } from '../../constants/requests';
import { NEIGHBORHOODS, createRequest } from '../../services/mockApi';
import { useAuthStore } from '../../store/auth';
import { RequestDraft, useRequestStore } from '../../store/requests';
import ZoneSelector from '../../components/ZoneSelector';
import { showErrorToast, showSuccessToast } from '../../utils/toast';

const createDraftId = () => `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export default function CreateRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ draftId?: string }>();
  const currentUser = useAuthStore((state) => state.currentUser);
  const { drafts, saveDraft, deleteDraft } = useRequestStore((state) => ({
    drafts: state.drafts,
    saveDraft: state.saveDraft,
    deleteDraft: state.deleteDraft,
  }));

  const initialDraftId = params.draftId && drafts[params.draftId] ? params.draftId : createDraftId();
  const [draftId] = useState(initialDraftId);
  const existingDraft: RequestDraft | undefined = drafts[draftId];

  const [title, setTitle] = useState(existingDraft?.title ?? '');
  const [category, setCategory] = useState<string | undefined>(existingDraft?.category);
  const [eta, setEta] = useState(existingDraft?.eta ? String(existingDraft.eta) : '');
  const [area, setArea] = useState(existingDraft?.area ?? '');
  const [description, setDescription] = useState(existingDraft?.description ?? '');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string | undefined>(existingDraft?.neighborhoodId);
  const [selectedRadius, setSelectedRadius] = useState<number | undefined>(existingDraft?.radiusMeters);
  const [submitting, setSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    if (!existingDraft) return;
    setTitle(existingDraft.title);
    setCategory(existingDraft.category);
    setEta(existingDraft.eta ? String(existingDraft.eta) : '');
    setArea(existingDraft.area ?? '');
    setDescription(existingDraft.description ?? '');
    setSelectedNeighborhoodId(existingDraft.neighborhoodId);
    setSelectedRadius(existingDraft.radiusMeters);
  }, [draftId, existingDraft]);

  const etaValue = useMemo(() => {
    const parsed = parseInt(eta, 10);
    return Number.isFinite(parsed) ? parsed : undefined;
  }, [eta]);

  const hasContent = useMemo(() => {
    return (
      title.trim().length > 0 ||
      !!category ||
      !!etaValue ||
      area.trim().length > 0 ||
      description.trim().length > 0
    );
  }, [title, category, etaValue, area, description]);

  useEffect(() => {
    if (!hasContent) {
      return;
    }
    const timeout = setTimeout(() => {
      const payload: RequestDraft = {
        id: draftId,
        title,
        category,
        eta: etaValue,
        area,
        description,
        neighborhoodId: selectedNeighborhoodId,
        radiusMeters: selectedRadius,
        updatedAt: new Date().toISOString(),
      };
      saveDraft(payload);
    }, 500);
    return () => clearTimeout(timeout);
  }, [draftId, title, category, etaValue, area, description, selectedNeighborhoodId, selectedRadius, hasContent, saveDraft]);

  const isValid = useMemo(() => {
    return (
      title.trim().length > 3 &&
      Boolean(category) &&
      typeof etaValue === 'number' &&
      (etaValue ?? 0) > 0 &&
      area.trim().length > 3
    );
  }, [title, category, etaValue, area]);

  const handleZoneChange = ({ neighborhoodId, radiusMeters }: { neighborhoodId: string; radiusMeters: number }) => {
    setSelectedNeighborhoodId(neighborhoodId);
    setSelectedRadius(radiusMeters);
    const hood = NEIGHBORHOODS.find((item) => item.id === neighborhoodId);
    if (hood) {
      const km = Math.round((radiusMeters / 1000) * 10) / 10;
      setArea(`${hood.name} (~${km} km)`);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory(undefined);
    setEta('');
    setArea('');
    setDescription('');
    setSelectedNeighborhoodId(undefined);
    setSelectedRadius(undefined);
    setAttemptedSubmit(false);
  };

  const onSubmit = async () => {
    setAttemptedSubmit(true);
    if (!isValid) {
      showErrorToast('Merci de remplir les champs requis.');
      return;
    }
    try {
      setSubmitting(true);
      const request = await createRequest({
        title,
        category: category as string,
        eta: etaValue as number,
        area,
        description,
        authorId: currentUser?.id ?? 'me',
        neighborhoodId: selectedNeighborhoodId,
      });
      deleteDraft(draftId);
      resetForm();
      showSuccessToast('Demande creee et publiee.');
      router.replace({ pathname: '/request/[id]', params: { id: request.id } });
    } catch (error) {
      if (error instanceof Error && error.message === 'offline') {
        showErrorToast('Hors ligne - impossible de publier pour le moment.');
      } else {
        showErrorToast('Impossible de creer la demande pour le moment.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const etaInvalid = !eta.trim() || typeof etaValue !== 'number' || (etaValue ?? 0) <= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
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
            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.brand.text }}>Nouvelle demande</Text>
            <View style={{ width: 44 }} />
          </View>

          <Text style={{ color: colors.brand.muted }}>
            Donne un maximum de details pour que les voisins puissent aider rapidement.
          </Text>

          <View style={{ gap: spacing.xs }}>
            <View style={{ gap: spacing.xs }}>
              <Text style={{ fontWeight: '600', color: colors.brand.text }}>Titre</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Cherche perceuse pour 10 min"
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
            {!title.trim() && attemptedSubmit ? (
              <Text style={{ color: colors.semantic.danger, fontSize: 12 }}>
                Ajoute un titre clair (4 caracteres minimum).
              </Text>
            ) : null}
          </View>

          <View style={{ gap: spacing.xs }}>
            <Text style={{ fontWeight: '600', color: colors.brand.text }}>Categorie</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {REQUEST_CATEGORIES.map((cat) => {
                const selected = category === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(selected ? undefined : cat)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      backgroundColor: selected ? colors.brand.surfaceStrong : colors.brand.surfaceMuted,
                      borderWidth: selected ? 1 : 0,
                      borderColor: selected ? colors.brand.text : 'transparent',
                    }}
                  >
                    <Text style={{ color: colors.brand.text }}>{cat}</Text>
                  </Pressable>
                );
              })}
            </View>
            {!category && attemptedSubmit ? (
              <Text style={{ color: colors.semantic.danger, fontSize: 12 }}>
                Choisis une categorie pour cibler les bons voisins.
              </Text>
            ) : null}
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={{ fontWeight: '600', color: colors.brand.text }}>Temps estime</Text>
              <TextInput
                value={eta}
                onChangeText={(value) => setEta(value.replace(/[^0-9]/g, ''))}
                placeholder="15"
                keyboardType="number-pad"
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
              {etaInvalid && attemptedSubmit ? (
                <Text style={{ color: colors.semantic.danger, fontSize: 12 }}>
                  Indique une duree en minutes (valeur positive).
                </Text>
              ) : null}
            </View>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={{ fontWeight: '600', color: colors.brand.text }}>Zone approx.</Text>
              <TextInput
                value={area}
                onChangeText={setArea}
                placeholder="Ex: Belleville (0.8 km)"
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
              {!area.trim() && attemptedSubmit ? (
                <Text style={{ color: colors.semantic.danger, fontSize: 12 }}>
                  Precise ton quartier ou un rayon pour guider les voisins.
                </Text>
              ) : null}
            </View>
          </View>

          <ZoneSelector
            selectedNeighborhoodId={selectedNeighborhoodId}
            selectedRadius={selectedRadius}
            onChange={handleZoneChange}
          />

          <View style={{ gap: spacing.sm }}>
            <Text style={{ fontWeight: '600', color: colors.brand.text }}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Details pratiques, horaires, materiel a prevoir..."
              placeholderTextColor={colors.brand.muted}
              multiline
              numberOfLines={5}
              style={{
                backgroundColor: colors.brand.surface,
                borderRadius: radius.lg,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
                fontSize: 16,
                color: colors.brand.text,
                borderWidth: 1,
                borderColor: colors.brand.border,
                minHeight: 140,
                textAlignVertical: 'top',
              }}
            />
          </View>

          <PrimaryButton
            title={submitting ? 'Publication...' : 'Publier la demande'}
            variant='success'
            onPress={onSubmit}
            disabled={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
