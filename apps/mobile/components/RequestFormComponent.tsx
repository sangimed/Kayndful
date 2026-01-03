// Composant de formulaire complet pour la création/édition de demandes
// Utilisé par new.tsx et [id].tsx

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Image,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import type { RequestDraft } from '../store/requests';
import { validateForm, formatDuration, type RequestFormData } from '../utils/requestValidation';

const CATEGORIES = [
  'Courses',
  'Aide à domicile',
  'Déplacements',
  'Informatique',
  'Administratif',
  'Autre',
];
const DURATION_OPTIONS = [30, 45, 60, 90, 120] as const;
const LANGUAGES = ['Français', 'Anglais'];
const CONSTRAINTS = ['Sans ascenseur', 'Objets lourds', 'Animaux présents'];
const EQUIPMENT = ['Voiture', 'Perceuse', 'Chariot', 'Gants'];
const URGENCY_OPTIONS = ['Faible', 'Modérée', 'Élevée'] as const;

type Props = {
  initialData?: Partial<RequestDraft>;
  onSaveDraft: (data: Partial<RequestFormData>) => void;
  onPublish: (data: Partial<RequestFormData>) => void;
  isEdit?: boolean;
};

export function RequestFormComponent({
  initialData,
  onSaveDraft,
  onPublish,
  isEdit = false,
}: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);

  const [formData, setFormData] = useState<Partial<RequestFormData>>({
    title: '',
    category: undefined,
    description: '',
    estimatedMinutes: 60 as any,
    maxVolunteers: 1,
    availabilityStart: undefined,
    availabilityEnd: undefined,
    languages: [],
    constraints: [],
    requiredEquipment: [],
    urgency: 'Modérée' as any,
    thumbnailUri: undefined,
    acceptedRules: false,
    area: '12 rue des Lilas, Rennes',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [validating, setValidating] = useState(false);

  const updateField = <K extends keyof RequestFormData>(field: K, value: RequestFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const pickImage = async () => {
    // Placeholder pour le sélecteur d'image
    // TODO: Implémenter avec expo-image-picker une fois installé
    Alert.alert(
      "Sélection d'image",
      "Fonctionnalité de sélection d'image à implémenter (nécessite expo-image-picker).",
      [{ text: 'OK' }],
    );
  };

  const handleSaveDraft = () => {
    onSaveDraft(formData);
  };

  const handlePublish = () => {
    setValidating(true);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setValidating(false);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    setValidating(false);
    onPublish(formData);
  };

  const titleChars = formData.title?.length || 0;
  const descChars = formData.description?.length || 0;
  const cardBg = isDark ? colors.app.cardDark : colors.app.cardLight;
  const textPrimary = isDark ? '#E5E7EB' : colors.brand.text;
  const textMuted = isDark ? '#9CA3AF' : colors.brand.muted;

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section 1: Informations principales */}
        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            Informations principales
          </Text>

          {/* Titre */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: textPrimary }]}>
                Titre de la demande <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <Text
                style={[styles.charCounter, { color: titleChars > 80 ? '#EF4444' : textMuted }]}
              >
                {titleChars}/80
              </Text>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#1C2227' : colors.brand.surfaceStrong,
                  color: textPrimary,
                },
                errors.title && touched.title && styles.inputError,
              ]}
              placeholder="Ex: Courses rapides au supermarché"
              placeholderTextColor={textMuted}
              value={formData.title}
              onChangeText={(value) => updateField('title', value)}
              onBlur={() => markTouched('title')}
              maxLength={80}
            />
            {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <Text style={[styles.hint, { color: textMuted }]}>
              Un titre clair et précis. Évitez les coordonnées personnelles.
            </Text>
          </View>

          {/* Localisation (lecture seule) */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>Localisation</Text>
            <View
              style={[
                styles.readOnlyField,
                { backgroundColor: isDark ? '#1C2227' : colors.brand.surfaceMuted },
              ]}
            >
              <Ionicons name="location-outline" size={18} color={textMuted} />
              <Text style={[styles.readOnlyText, { color: textMuted }]}>{formData.area}</Text>
            </View>
            <View style={styles.hintWithIcon}>
              <Ionicons name="information-circle-outline" size={16} color={textMuted} />
              <Text style={[styles.hint, { color: textMuted, marginLeft: 4 }]}>
                Votre adresse exacte n'est visible que par les volontaires que vous acceptez.
              </Text>
            </View>
          </View>

          {/* Catégorie */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>
              Catégorie <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={styles.chipGroup}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => updateField('category', cat)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        formData.category === cat
                          ? colors.brand.text
                          : isDark
                            ? '#1C2227'
                            : colors.brand.surfaceStrong,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: formData.category === cat ? colors.brand.surface : textPrimary,
                        fontWeight: formData.category === cat ? '600' : '500',
                      },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.category && touched.category && (
              <Text style={styles.errorText}>{errors.category}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: textPrimary }]}>
                Description de la demande <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <Text
                style={[styles.charCounter, { color: descChars > 1000 ? '#EF4444' : textMuted }]}
              >
                {descChars}/1000
              </Text>
            </View>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: isDark ? '#1C2227' : colors.brand.surfaceStrong,
                  color: textPrimary,
                },
                errors.description && touched.description && styles.inputError,
              ]}
              placeholder="Décrivez votre besoin en détail..."
              placeholderTextColor={textMuted}
              value={formData.description}
              onChangeText={(value) => updateField('description', value)}
              onBlur={() => markTouched('description')}
              multiline
              numberOfLines={6}
              maxLength={1000}
              textAlignVertical="top"
            />
            {errors.description && touched.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
            <Text style={[styles.hint, { color: textMuted }]}>
              Décrivez votre besoin sans informations sensibles (téléphone, email, adresse exacte…).
            </Text>
          </View>

          {/* Photo */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>Photo (optionnelle)</Text>
            {formData.thumbnailUri ? (
              <View>
                <Image source={{ uri: formData.thumbnailUri }} style={styles.thumbnail} />
                <Pressable
                  onPress={() => updateField('thumbnailUri', undefined)}
                  style={styles.removeImageBtn}
                >
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={pickImage}
                style={[
                  styles.imagePicker,
                  { borderColor: isDark ? '#374151' : colors.brand.border },
                ]}
              >
                <Ionicons name="camera-outline" size={32} color={textMuted} />
                <Text style={[styles.imagePickerText, { color: textMuted }]}>
                  Ajouter une photo (max 4 Mo)
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Section 2: Organisation */}
        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Organisation</Text>

          {/* Durée estimée */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>
              Durée estimée <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={styles.chipGroup}>
              {DURATION_OPTIONS.map((duration) => (
                <Pressable
                  key={duration}
                  onPress={() => updateField('estimatedMinutes', duration)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        formData.estimatedMinutes === duration
                          ? '#3B82F6'
                          : isDark
                            ? '#1C2227'
                            : colors.brand.surfaceStrong,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color:
                          formData.estimatedMinutes === duration
                            ? colors.brand.surface
                            : textPrimary,
                        fontWeight: formData.estimatedMinutes === duration ? '600' : '500',
                      },
                    ]}
                  >
                    {formatDuration(duration)}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors.estimatedMinutes && (
              <Text style={styles.errorText}>{errors.estimatedMinutes}</Text>
            )}
            <Text style={[styles.hint, { color: textMuted }]}>
              Estimation indicative, pas un engagement.
            </Text>
          </View>

          {/* Nombre de volontaires */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>
              Nombre maximum de volontaires <Text style={{ color: '#EF4444' }}>*</Text>
            </Text>
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() =>
                  updateField('maxVolunteers', Math.max(1, (formData.maxVolunteers || 1) - 1))
                }
                style={[
                  styles.stepperBtn,
                  { backgroundColor: isDark ? '#1C2227' : colors.brand.surfaceStrong },
                ]}
              >
                <Ionicons name="remove" size={20} color={textPrimary} />
              </Pressable>
              <Text style={[styles.stepperValue, { color: textPrimary }]}>
                {formData.maxVolunteers || 1}
              </Text>
              <Pressable
                onPress={() =>
                  updateField('maxVolunteers', Math.min(5, (formData.maxVolunteers || 1) + 1))
                }
                style={[
                  styles.stepperBtn,
                  { backgroundColor: isDark ? '#1C2227' : colors.brand.surfaceStrong },
                ]}
              >
                <Ionicons name="add" size={20} color={textPrimary} />
              </Pressable>
            </View>
            {errors.maxVolunteers && <Text style={styles.errorText}>{errors.maxVolunteers}</Text>}
          </View>
        </View>

        {/* Section 3: Sécurité & préférences */}
        <View style={[styles.section, { backgroundColor: cardBg }]}>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Sécurité & préférences</Text>

          {/* Langues */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>Langue(s) préférée(s)</Text>
            <View style={styles.chipGroup}>
              {LANGUAGES.map((lang) => {
                const selected = formData.languages?.includes(lang);
                return (
                  <Pressable
                    key={lang}
                    onPress={() => {
                      const current = formData.languages || [];
                      updateField(
                        'languages',
                        selected ? current.filter((l) => l !== lang) : [...current, lang],
                      );
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected
                          ? colors.semantic.success
                          : isDark
                            ? '#1C2227'
                            : colors.brand.surfaceStrong,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: selected ? colors.brand.surface : textPrimary,
                          fontWeight: selected ? '600' : '500',
                        },
                      ]}
                    >
                      {lang}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Contraintes */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>Contraintes (optionnel)</Text>
            <View style={styles.checkboxGroup}>
              {CONSTRAINTS.map((constraint) => {
                const selected = formData.constraints?.includes(constraint);
                return (
                  <Pressable
                    key={constraint}
                    onPress={() => {
                      const current = formData.constraints || [];
                      updateField(
                        'constraints',
                        selected
                          ? current.filter((c) => c !== constraint)
                          : [...current, constraint],
                      );
                    }}
                    style={styles.checkboxRow}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          borderColor: isDark ? '#374151' : colors.brand.border,
                          backgroundColor: selected ? colors.semantic.success : 'transparent',
                        },
                      ]}
                    >
                      {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                    <Text style={[styles.checkboxLabel, { color: textPrimary }]}>{constraint}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Équipement */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>
              Équipement nécessaire (optionnel)
            </Text>
            <View style={styles.chipGroup}>
              {EQUIPMENT.map((equip) => {
                const selected = formData.requiredEquipment?.includes(equip);
                return (
                  <Pressable
                    key={equip}
                    onPress={() => {
                      const current = formData.requiredEquipment || [];
                      updateField(
                        'requiredEquipment',
                        selected ? current.filter((e) => e !== equip) : [...current, equip],
                      );
                    }}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: selected
                          ? '#3B82F6'
                          : isDark
                            ? '#1C2227'
                            : colors.brand.surfaceStrong,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: selected ? colors.brand.surface : textPrimary,
                          fontWeight: selected ? '600' : '500',
                        },
                      ]}
                    >
                      {equip}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Niveau d'urgence */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: textPrimary }]}>Niveau d'urgence</Text>
            <View style={styles.chipGroup}>
              {URGENCY_OPTIONS.map((urg) => (
                <Pressable
                  key={urg}
                  onPress={() => updateField('urgency', urg)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor:
                        formData.urgency === urg
                          ? '#EF4444'
                          : isDark
                            ? '#1C2227'
                            : colors.brand.surfaceStrong,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      {
                        color: formData.urgency === urg ? colors.brand.surface : textPrimary,
                        fontWeight: formData.urgency === urg ? '600' : '500',
                      },
                    ]}
                  >
                    {urg}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Acceptation des règles */}
          <View style={styles.fieldGroup}>
            <Pressable
              onPress={() => updateField('acceptedRules', !formData.acceptedRules)}
              style={styles.checkboxRow}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: errors.acceptedRules
                      ? '#EF4444'
                      : isDark
                        ? '#374151'
                        : colors.brand.border,
                    backgroundColor: formData.acceptedRules
                      ? colors.semantic.success
                      : 'transparent',
                  },
                ]}
              >
                {formData.acceptedRules && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: textPrimary, flex: 1 }]}>
                J'ai lu et j'accepte les règles de la communauté et les conseils de sécurité.{' '}
                <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
            </Pressable>
            {errors.acceptedRules && <Text style={styles.errorText}>{errors.acceptedRules}</Text>}
          </View>
        </View>
      </ScrollView>

      {/* CTA sticky */}
      <View
        style={[
          styles.stickyFooter,
          { backgroundColor: isDark ? colors.app.cardDark : colors.app.cardLight },
        ]}
      >
        <Pressable
          onPress={handleSaveDraft}
          style={[
            styles.footerBtn,
            { backgroundColor: isDark ? '#1C2227' : colors.brand.surfaceStrong },
          ]}
        >
          <Text style={[styles.footerBtnText, { color: textPrimary }]}>
            {isEdit ? 'Mettre à jour le brouillon' : 'Enregistrer en brouillon'}
          </Text>
        </Pressable>
        <Pressable
          onPress={handlePublish}
          disabled={validating}
          style={[
            styles.footerBtn,
            { backgroundColor: colors.semantic.success, opacity: validating ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.footerBtnText, { color: '#fff' }]}>Publier ma demande</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  charCounter: {
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 15,
    minHeight: 120,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
  },
  hintWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
  },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: 12,
    padding: spacing.md,
  },
  readOnlyText: {
    fontSize: 14,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 14,
  },
  imagePicker: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  imagePickerText: {
    fontSize: 14,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  removeImageBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    fontSize: 20,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  checkboxGroup: {
    gap: spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    paddingBottom: spacing.md + spacing.safeBottom,
    borderTopWidth: 1,
    borderTopColor: colors.brand.border,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
