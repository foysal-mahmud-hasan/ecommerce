import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { IconCheck } from '../Icons';
import { styles } from './Toast.styles';

export default function Toast({ bottomOffset = 110 }) {
  const t = useTheme();
  const { toast } = useStore();
  const opacity = useSharedValue(0);
  const ty = useSharedValue(8);

  useEffect(() => {
    if (toast) {
      opacity.value = withTiming(1, { duration: 160 });
      ty.value = withTiming(0, { duration: 180 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      ty.value = withTiming(8, { duration: 200 });
    }
  }, [toast, opacity, ty]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  if (!toast) return null;

  return (
    <View pointerEvents="none" style={[styles.wrap, { bottom: bottomOffset }]}>
      <Animated.View style={[styles.pill, { backgroundColor: t.ink }, aStyle]}>
        <IconCheck color={t.bg} size={14} />
        <Text style={[styles.text, { color: t.bg }]}>{toast.msg}</Text>
      </Animated.View>
    </View>
  );
}
