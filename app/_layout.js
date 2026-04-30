import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium,
} from '@expo-google-fonts/playfair-display';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from '../src/components/Toast';
import QuickViewSheet from '../src/components/QuickViewSheet';
import CartSheet from '../src/components/CartSheet';
import CartFab from '../src/components/CartFab';
import PrescriptionSheet from '../src/components/PrescriptionSheet';
import { StoreProvider } from '../src/store/StoreContext';
import BootstrapProvider from '../src/bootstrap/BootstrapProvider';
import { useTheme } from '../src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedShell() {
  const t = useTheme();
  // On web, cap the absolute maximum width so the app doesn't stretch on huge
  // monitors. Per-screen `<ResponsiveScreen>` wrappers further constrain to
  // phone-shape (480pt) for most screens; ProductsScreen and PDP take the
  // full width of this wrapper for their wide layouts.
  const isWeb = Platform.OS === 'web';
  return (
    <View
      style={[
        { flex: 1, backgroundColor: t.bg },
        isWeb && { alignItems: 'center' },
      ]}
    >
      <View style={[{ flex: 1, width: '100%' }, isWeb && { maxWidth: 1280 }]}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: t.bg },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="category/[id]" />
          {/* COMBOS-DISABLED-V1 — combo route registration kept on disk, unwired:
          <Stack.Screen name="combo/[id]" />
          */}
          <Stack.Screen name="checkout" />
          <Stack.Screen name="orders" />
          <Stack.Screen name="tenant-switch" options={{ presentation: 'modal' }} />
        </Stack>
        <QuickViewSheet />
        <CartSheet />
        <PrescriptionSheet />
        <CartFab />
        <Toast bottomOffset={100} />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <BootstrapProvider>
            <BottomSheetModalProvider>
              <ThemedShell />
            </BottomSheetModalProvider>
          </BootstrapProvider>
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
