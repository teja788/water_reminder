import { useState } from 'react';
import {
  KeyboardAvoidingView,
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
/** Upper bound for a single custom entry; anything larger is a typo. */
const MAX_CUSTOM_ML = 5000;

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

  const trimmed = customText.trim();
  // decimal-pad shows "," as the separator in many locales.
  const parsed = Number(trimmed.replace(',', '.'));
  const customMl =
    units === 'oz' ? Math.round(parsed * ML_PER_OZ) : Math.round(parsed);
  const customValid =
    trimmed.length > 0 &&
    Number.isFinite(parsed) &&
    parsed > 0 &&
    customMl > 0 &&
    customMl <= MAX_CUSTOM_ML;

  const closeCustom = (): void => {
    setCustomOpen(false);
    setCustomText('');
  };

  const submitCustom = (): void => {
    if (!customValid) {
      return;
    }
    onLog(customMl);
    closeCustom();
  };

  const amountLabel =
    units === 'oz' ? 'Amount in ounces' : 'Amount in millilitres';

  const pressedBackground = (pressed: boolean): string =>
    pressed ? theme.accentSoftPressed : theme.accentSoft;

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
              { backgroundColor: pressedBackground(pressed) },
            ]}
          >
            <Text
              numberOfLines={1}
              maxFontSizeMultiplier={1.5}
              style={[styles.buttonLabel, { color: theme.accent }]}
            >
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
            { backgroundColor: pressedBackground(pressed) },
          ]}
        >
          <Text
            numberOfLines={1}
            maxFontSizeMultiplier={1.5}
            style={[styles.buttonLabel, { color: theme.accent }]}
          >
            Custom…
          </Text>
        </Pressable>
      </View>

      {canUndo && (
        <Pressable
          onPress={onUndo}
          accessibilityRole="button"
          accessibilityLabel="Undo last drink"
          hitSlop={8}
          style={({ pressed }) => [styles.undo, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Text
            maxFontSizeMultiplier={1.5}
            style={[styles.undoLabel, { color: theme.danger }]}
          >
            Undo last
          </Text>
        </Pressable>
      )}

      <Modal
        visible={customOpen}
        transparent
        animationType="fade"
        onRequestClose={closeCustom}
      >
        <KeyboardAvoidingView behavior="padding" style={styles.modalRoot}>
          {/* iOS number pads have no return key, so tapping outside is the
              reliable way to dismiss both the keyboard and the modal. */}
          <Pressable
            style={styles.backdrop}
            onPress={closeCustom}
            accessibilityRole="button"
            accessibilityLabel="Close custom amount"
          >
            <Pressable
              onPress={() => {}}
              accessible={false}
              style={[
                styles.modalCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text
                maxFontSizeMultiplier={1.5}
                style={[styles.modalTitle, { color: theme.text }]}
              >
                Custom amount
              </Text>
              <Text
                maxFontSizeMultiplier={1.5}
                style={[styles.modalHint, { color: theme.textSecondary }]}
              >
                {amountLabel}
              </Text>
              <TextInput
                value={customText}
                onChangeText={setCustomText}
                keyboardType={units === 'oz' ? 'decimal-pad' : 'number-pad'}
                maxLength={5}
                maxFontSizeMultiplier={1.5}
                placeholder={units === 'oz' ? '12' : '300'}
                placeholderTextColor={theme.textSecondary}
                autoFocus
                accessibilityLabel={amountLabel}
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
                  <Text
                    maxFontSizeMultiplier={1.5}
                    style={[styles.modalButtonLabel, { color: theme.textSecondary }]}
                  >
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
                    {
                      backgroundColor: theme.accent,
                      opacity: !customValid ? 0.4 : pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text
                    maxFontSizeMultiplier={1.5}
                    style={[styles.modalButtonLabel, styles.modalPrimaryLabel]}
                  >
                    Log
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center', gap: 10 },
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
  undo: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoLabel: { fontSize: 15, fontWeight: '600' },
  modalRoot: { flex: 1 },
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
    justifyContent: 'center',
    minHeight: 44,
  },
  modalButtonLabel: { fontSize: 16, fontWeight: '700' },
  modalPrimaryLabel: { color: '#FFFFFF' },
});
