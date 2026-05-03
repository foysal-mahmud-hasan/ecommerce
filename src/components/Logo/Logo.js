import React from 'react';
import { Text, View } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { IconLeaf } from '../Icons';

// Renders the tenant name (from the API splash payload, e.g. "Epharma") as
// a green pill with a leaf icon. Falls back to "Store" only if the tenant
// hasn't loaded yet.
export default function Logo({ size = 'md', name }) {
  const t = useTheme();
  const { tenant } = useStore();
  const displayName = name || tenant?.name || 'Store';
  const fontSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: t.terra,
      }}
    >
      <IconLeaf size={iconSize} color="#FFFFFF" />
      <Text
        style={{
          fontFamily: t.fonts.sansSemiBold,
          fontSize,
          color: '#FFFFFF',
          letterSpacing: 0.3,
        }}
        numberOfLines={1}
      >
        {displayName}
      </Text>
    </View>
  );
}
