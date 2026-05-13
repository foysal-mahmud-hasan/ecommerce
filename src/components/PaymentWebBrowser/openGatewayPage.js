import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

// Opens the SSLCommerz GatewayPageURL.
//
// Web: navigate the current tab via window.location.assign. We don't use
// window.open('_blank') because by the time we call it we've already
// awaited the session-init request, so it's outside the user-gesture
// window and the popup gets silently blocked. Same-tab redirect is the
// pattern Stripe Checkout / PayPal / etc. use anyway.
//
// Native: open expo-web-browser in-app tab. Resolves when user dismisses.

export async function openGatewayPage(url) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.assign(url);
    }
    return { type: 'redirecting' };
  }
  return WebBrowser.openBrowserAsync(url, {
    showTitle: true,
    dismissButtonStyle: 'close',
  });
}
