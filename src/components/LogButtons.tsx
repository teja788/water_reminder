import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Theme } from '../theme';
import { Units } from '../types';
import { formatAmount } from '../logic/hydration';

const ML_PER_OZ = 29.5735;

/** Multiply each channel of a #rrggbb colour, for the pressed state. */
function darken(hex: string, factor: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return hex;
  }
  const channel = (start: number): string => {
    const value = Math.round(parseInt(hex.slice(start, start + 2), 16) * factor);
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0');
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

export default function LogButtons(props: {
  theme: Theme;
  cupSizesMl: number[];
  units: Units;
  canUndo: boolean;
  onLog: (ml: number) => void;
  onUndo: () => void;
}): React.JSX.Element {
  const { theme, cupSizesMl, units, canUndo, onLog, onUndo } = props;
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const parsed = Number(customText.trim());
  const customValid =
    customText.trim().length > 0 && Number.isFinite(parsed) && parsed > 0;

  const closeCustom = (): void => {
    setCustomOpen(false);
    setCustomText('');
  };

  const submitCustom = (): void => {
    if (!customValid) {
      return;
    }
    onLog(units === 'oz' ? Math.round(parsed * ML_PER_OZ) : Math.round(parsed));
    closeCustom();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {cupSizesMl.map((size, index) => (
          <Pressable
            key={`${size}-${index}`}
            onPress={() => onLog(size)}
            accessibilityRole="button"
            accessibilityLabel={`Log ${formatAmount(size, units)}`}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: pressed
                  ? darken(theme.accentSoft, 0.85)
                  : theme.accentSoft,
              },
            ]}
          >
            <Text numberOfLines={1} style={[styles.buttonLabel, { color: theme.accent }]}>
              {formatAmount(size, units)}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setCustomOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Log a custom amount"
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: pressed
                ? darken(theme.accentSoft, 0.85)
                : theme.accentSoft,
            },
          ]}
        >
          <Text numberOfLines={1} style={[styles.buttonLabel, { color: theme.accent }]}>
            Custom…
          </Text>
        </Pressable>
      </View>

      {canUndo && (
        <Pressable
          onPress={onUndo}
          accessibilityRole="button"
          accessibilityLabel="Undo last drink"
          style={({ pressed }) => [styles.undo, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={[styles.undoLabel, { color: theme.danger }]}>Undo last</Text>
        </Pressable>
      )}

      <Modal
        visible={customOpen}
        transparent
        animationType="fade"
        onRequestClose={closeCustom}
      >
        <View style={styles.backdrop}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Custom amount
            </Text>
            <Text style={[styles.modalHint, { color: theme.textSecondary }]}>
              {units === 'oz' ? 'Amount in ounces' : 'Amount in millilitres'}
            </Text>
            <TextInput
              value={customText}
              onChangeText={setCustomText}
              keyboardType={units === 'oz' ? 'decimal-pad' : 'number-pad'}
              placeholder={units === 'oz' ? '12' : '300'}
              placeholderTextColor={theme.textSecondary}
              autoFocus
              accessibilityLabel={
                units === 'oz' ? 'Amount in ounces' : 'Amount in millilitres'
              }
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            />
            <View style={styles.modalActions}>
              <Pressable
                onPress={closeCustom}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                style={({ pressed }) => [
                  styles.modalButton,
                  { borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={[styles.modalButtonLabel, { color: theme.textSecondary }]}>
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                onPress={submitCustom}
                disabled={!customValid}
                accessibilityRole="button"
                accessibilityLabel="Log custom amount"
                accessibilityState={{ disabled: !customValid }}
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalPrimary,
                  {
                    backgroundColor: pressed ? darken(theme.accent, 0.85) : theme.accent,
                    opacity: customValid ? 1 : 0.4,
                  },
                ]}
              >
                <Text style={[styles.modalButtonLabel, styles.modalPrimaryLabel]}>
                  Log
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center', gap: 14 },
  row: { flexDirection: 'row', gap: 10, width: '100%' },
  button: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: { fontSize: 15, fontWeight: '700' },
  undo: { paddingVertical: 6, paddingHorizontal: 12 },
  undoLabel: { fontSize: 15, fontWeight: '600' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 22,
    gap: 10,
  },
  modalTitle: { fontSize: 19, fontWeight: '700' },
  modalHint: { fontSize: 13, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 2,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  modalButtonLabel: { fontSize: 16, fontWeight: '700' },
  modalPrimary: { borderColor: 'transparent' },
  modalPrimaryLabel: { color: '#FFFFFF' },
});
