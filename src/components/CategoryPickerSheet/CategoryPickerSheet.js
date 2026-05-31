import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { IconCheck, IconSearch, IconX } from '../Icons';

// Bottom-sheet (mobile) / centered-card (desktop) picker that lets the
// user scope a search to one category. Used by:
//   - ProductsScreen: the slider icon next to the search input.
//   - ShopScreen:     the filter icon next to the home search button.
//
// Stateless: caller owns the open/close flag and the current selection.
// `selectedId` of `null` means "All categories".
export default function CategoryPickerSheet({
  visible,
  onClose,
  onSelect,
  selectedId = null,
}) {
  const t = useTheme();
  const { categories } = useStore();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const accent = t.terra;
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const base = [{ id: null, name: 'All categories' }, ...(categories || [])];
    if (!query.trim()) return base;
    const q = query.toLowerCase().trim();
    return base.filter((c) => (c.name || '').toLowerCase().includes(q));
  }, [categories, query]);

  const handleSelect = (id) => {
    onSelect?.(id);
    onClose?.();
    setQuery('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile ? 'slide' : 'fade'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
          padding: isMobile ? 0 : 24,
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            width: '100%',
            maxWidth: isMobile ? undefined : 480,
            height: isMobile ? '78%' : undefined,
            maxHeight: isMobile ? '78%' : '80%',
            backgroundColor: t.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: isMobile ? 0 : 20,
            borderBottomRightRadius: isMobile ? 0 : 20,
            overflow: 'hidden',
            ...(Platform.OS === 'web'
              ? { boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }
              : { elevation: 24 }),
          }}
        >
          {isMobile ? (
            <View pointerEvents="none" style={{ alignItems: 'center', paddingTop: 8 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: t.line,
                }}
              />
            </View>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingTop: 14,
              paddingBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: t.fonts.sansSemiBold,
                fontSize: 16,
                color: t.ink,
              }}
            >
              Scope search to…
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={layout.hitSlop}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: t.surfaceAlt,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              accessibilityLabel="Close"
            >
              <IconX size={14} color={t.ink} />
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                height: 42,
                paddingHorizontal: 14,
                borderRadius: 21,
                borderWidth: 1,
                borderColor: t.line,
                backgroundColor: t.surface,
              }}
            >
              <IconSearch size={16} color={t.ink3} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Find a category"
                placeholderTextColor={t.ink3}
                style={{
                  flex: 1,
                  fontFamily: t.fonts.sans,
                  fontSize: 14,
                  color: t.ink,
                  padding: 0,
                  ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {}),
                }}
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={layout.hitSlop}>
                  <IconX size={12} color={t.ink3} />
                </Pressable>
              ) : null}
            </View>
          </View>

          <FlatList
            data={items}
            keyExtractor={(c) => String(c.id ?? 'all')}
            contentContainerStyle={{ paddingBottom: insets.bottom + 12 }}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const selected = (item.id ?? null) === (selectedId ?? null);
              return (
                <Pressable
                  onPress={() => handleSelect(item.id)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: pressed ? t.surfaceAlt : 'transparent',
                    borderBottomWidth: 1,
                    borderBottomColor: t.line,
                  })}
                >
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: selected ? t.fonts.sansSemiBold : t.fonts.sans,
                      fontSize: 14,
                      color: selected ? accent : t.ink,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {selected ? <IconCheck size={16} color={accent} /> : null}
                </Pressable>
              );
            }}
            ListEmptyComponent={
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.ink3 }}>
                  No categories match “{query}”.
                </Text>
              </View>
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
