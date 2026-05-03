import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { IconCheck } from '../Icons';

const ABOUT_LINKS = ['About Us', 'Our Team', 'Careers'];
const QUICK_LINKS = [
  { label: 'Upload Prescription', target: '/(tabs)/me' },
  { label: 'Track Order', target: '/orders' },
  { label: 'FAQ', target: '/(tabs)/me' },
];
const BADGES = ['SSL Secured', 'Cash on Delivery', 'Free delivery over ৳500'];

export default function Footer() {
  const t = useTheme();
  const router = useRouter();
  const { tenant } = useStore();
  const tenantName = tenant?.name || 'Store';
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return null;

  const isStacked = width < 768;
  const colDir = isStacked ? 'column' : 'row';
  const colGap = isStacked ? 24 : 48;

  return (
    <View
      style={{
        backgroundColor: t.footerBg,
        paddingHorizontal: 24,
        paddingTop: 36,
        paddingBottom: 20,
        marginTop: 32,
        // Bleed to the parent screen edges. Most screens don't horizontally
        // pad their root <ScrollView> so 0 is correct; for screens that do
        // (Wishlist), pass `bleed={false}` later if needed.
        marginHorizontal: 0,
        width: '100%',
      }}
    >
      <View
        style={{
          flexDirection: colDir,
          gap: colGap,
          maxWidth: 1240,
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <Column
          title="About"
          items={ABOUT_LINKS.map((label) => ({ label }))}
          t={t}
        />
        <Column
          title="Quick Links"
          items={QUICK_LINKS}
          t={t}
          onItemPress={(target) => target && router.push(target)}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: t.fonts.sansSemiBold,
              color: t.footerInkStrong,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            Contact
          </Text>
          <Text style={{ fontFamily: t.fonts.sans, color: t.footerInk, fontSize: 13, marginBottom: 6 }}>
            Dhaka, Bangladesh
          </Text>
          <Text style={{ fontFamily: t.fonts.sans, color: t.footerInk, fontSize: 13, marginBottom: 6 }}>
            Phone: +880 1234 567890
          </Text>
          <Text style={{ fontFamily: t.fonts.sans, color: t.footerInk, fontSize: 13 }}>
            Email: support@medmart.bd
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 28,
          paddingTop: 18,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.08)',
          flexDirection: isStacked ? 'column' : 'row',
          alignItems: isStacked ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 12,
          maxWidth: 1240,
          alignSelf: 'center',
          width: '100%',
        }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {BADGES.map((b) => (
            <View key={b} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: t.terra,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconCheck size={10} color="#FFFFFF" />
              </View>
              <Text style={{ fontFamily: t.fonts.sans, color: t.footerInk, fontSize: 12 }}>{b}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontFamily: t.fonts.sans, color: t.footerInk, fontSize: 12 }}>
          © {new Date().getFullYear()} {tenantName}. Licensed Pharmacy · All rights reserved.
        </Text>
      </View>
    </View>
  );
}

function Column({ title, items, t, onItemPress }) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: t.fonts.sansSemiBold,
          color: t.footerInkStrong,
          fontSize: 14,
          marginBottom: 12,
        }}
      >
        {title}
      </Text>
      {items.map((it) => (
        <Pressable
          key={it.label}
          onPress={() => onItemPress?.(it.target)}
          style={({ pressed }) => ({ marginBottom: 8, opacity: pressed ? 0.7 : 1 })}
        >
          <Text style={{ fontFamily: t.fonts.sans, color: t.footerInk, fontSize: 13 }}>
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
