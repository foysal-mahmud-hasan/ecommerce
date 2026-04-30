import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconChevR, IconUpload } from '../Icons';

// CTA card on pharma home — taps open the PrescriptionSheet via store action.
export default function PrescriptionUploadCard({ onPress }) {
  const t = useTheme();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 18 }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Upload prescription and order"
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.92 : 1,
            backgroundColor: t.surface,
            borderColor: t.line,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
          },
        ]}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: t.surfaceDeep,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconUpload color={t.ink} size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 10,
              letterSpacing: 1.4,
              color: t.ink3,
              marginBottom: 4,
            }}
          >
            FAST · PHARMACIST CHECKED
          </Text>
          <Text
            style={{
              fontFamily: t.fonts.sansSemiBold,
              fontSize: 16,
              color: t.ink,
              marginBottom: 2,
            }}
          >
            Upload prescription and order
          </Text>
          <Text
            style={{
              fontFamily: t.fonts.sans,
              fontSize: 12,
              color: t.ink3,
              lineHeight: 16,
            }}
            numberOfLines={2}
          >
            Send a photo — we'll read your meds and confirm before delivery.
          </Text>
        </View>
        <IconChevR color={t.ink3} size={16} />
      </Pressable>
    </View>
  );
}
