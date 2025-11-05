import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';
import { PrimaryButton } from './Button';

type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (payload: { reason: string; details?: string }) => void;
  title?: string;
};

const REASONS = ['Spam', 'Comportement inapproprie', 'Contenu faux', 'Autre'];

export function ReportModal({
  visible,
  onClose,
  onConfirm,
  title = 'Signaler la demande',
}: ReportModalProps) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');

  const closeAndReset = () => {
    setDetails('');
    setReason(REASONS[0]);
    onClose();
  };

  const confirm = () => {
    onConfirm({ reason, details: details.trim() || undefined });
    closeAndReset();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={closeAndReset}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: spacing.lg,
          backgroundColor: 'rgba(15, 23, 42, 0.55)',
        }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: radius.lg,
            padding: spacing.lg,
            gap: spacing.md,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.brand.text }}>
              {title}
            </Text>
            <Pressable onPress={closeAndReset} accessibilityRole="button">
              <Ionicons name="close" size={22} color={colors.brand.text} />
            </Pressable>
          </View>

          <Text style={{ color: colors.brand.muted }}>
            Merci de nous indiquer la raison. Les signalements aident a proteger la communaute.
          </Text>

          <View style={{ gap: spacing.sm }}>
            {REASONS.map((item) => {
              const selected = reason === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setReason(item)}
                  style={{
                    borderRadius: radius.md,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    borderWidth: selected ? 1.5 : 1,
                    borderColor: selected ? colors.semantic.danger : '#e5e7eb',
                    backgroundColor: selected ? '#fee2e2' : '#f8fafc',
                  }}
                >
                  <Text style={{ color: colors.brand.text, fontWeight: selected ? '700' : '500' }}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View>
            <Text style={{ fontWeight: '600', marginBottom: spacing.xs, color: colors.brand.text }}>
              Details (optionnel)
            </Text>
            <TextInput
              placeholder="Precise ce qu'il s'est passe"
              placeholderTextColor={colors.brand.muted}
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: radius.md,
                padding: spacing.md,
                minHeight: 120,
                textAlignVertical: 'top',
                color: colors.brand.text,
              }}
            />
          </View>

          <PrimaryButton title="Envoyer le signalement" variant="danger" onPress={confirm} />
          <PrimaryButton title="Annuler" variant="ghost" onPress={closeAndReset} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default ReportModal;
