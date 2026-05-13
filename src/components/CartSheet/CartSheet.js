import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { placeOrder } from '../../api/orders';
import { initSslcSession, makeSslcTransactionId } from '../../api/payments/sslcommerz';
import { gatewaysForCurrency } from '../../config/payments';
import { fragCartCount, fragCartTotal, useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import CheckoutForm, { filterPaymentOptions, validateAddress } from '../CheckoutForm';
import { IconCheck, IconMinus, IconPlus, IconX } from '../Icons';
import { openGatewayPage } from '../PaymentWebBrowser/openGatewayPage';
import RemoteImage from '../RemoteImage';
import StripeCardSheet from '../StripeCardSheet';
import { styles } from './CartSheet.styles';

const STEP_LABELS = ['Review', 'Address', 'Payment', 'Done'];

// Multi-step checkout sheet. Mounted at root next to QuickViewSheet.
// Driven by store: cartSheetOpen, cartSheetStep, openCartSheet, closeCartSheet,
// setCartSheetStep.
export default function CartSheet() {
  const t = useTheme();
  const router = useRouter();
  const {
    cart,
    productsCache,
    currency,
    cartSheetOpen,
    cartSheetStep,
    setCartSheetStep,
    closeCartSheet,
    updateQty,
    removeFromCart,
    clearCart,
    showToast,
    auth,
    recordOrder,
  } = useStore();

  const sheetRef = useRef(null);
  const productMap = productsCache?.byId || {};
  const total = fragCartTotal(cart, productMap);
  const count = fragCartCount(cart);

  const paymentOptions = useMemo(
    () => filterPaymentOptions(gatewaysForCurrency(currency?.code)),
    [currency?.code],
  );

  const [busy, setBusy] = useState(false);
  const [stripeOpen, setStripeOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    name: auth?.user?.name || '',
    phone: auth?.phone || '',
    line1: '',
    city: '',
    zip: '',
    payment: paymentOptions[0]?.id || 'cod',
  });

  // Re-sync the form's payment default if the option list changes (currency
  // loads after first render).
  useEffect(() => {
    setForm((f) => {
      if (paymentOptions.some((o) => o.id === f.payment)) return f;
      return { ...f, payment: paymentOptions[0]?.id || 'cod' };
    });
  }, [paymentOptions]);

  const onChange = useCallback(
    (k) => (v) => setForm((f) => ({ ...f, [k]: v })),
    [],
  );

  // Re-prime form from auth when sheet opens.
  useEffect(() => {
    if (cartSheetOpen) {
      setForm((f) => ({
        ...f,
        name: f.name || auth?.user?.name || '',
        phone: f.phone || auth?.phone || '',
      }));
      setErrors({});
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [cartSheetOpen, auth]);

  // Bail if user empties their cart while reviewing.
  useEffect(() => {
    if (cartSheetOpen && count === 0 && cartSheetStep < 3) {
      closeCartSheet();
    }
  }, [cartSheetOpen, count, cartSheetStep, closeCartSheet]);

  const buildItems = useCallback(
    () =>
      cart.map((c) => {
        const p = productMap[c.id];
        return {
          productId: c.id,
          name: p?.name || 'Item',
          qty: c.qty,
          price: p?.price || 0,
          unit: c.variant?.unit || p?.unit || '',
          image: p?.image || null,
        };
      }),
    [cart, productMap],
  );

  const buildAddress = useCallback(
    () => ({
      name: form.name,
      phone: form.phone,
      line1: form.line1,
      city: form.city,
      zip: form.zip,
    }),
    [form],
  );

  const finalizeOrder = useCallback(
    async ({ gateway, paymentStatus, transactionId, id } = {}) => {
      const order = await placeOrder({
        id,
        items: buildItems(),
        address: buildAddress(),
        payment: form.payment,
        gateway,
        paymentStatus,
        transactionId,
        currency,
      });
      recordOrder(order);
      clearCart();
      setOrderId(order.id);
      setCartSheetStep(3);
      return order;
    },
    [buildItems, buildAddress, form.payment, currency, recordOrder, clearCart, setCartSheetStep],
  );

  const onContinue = useCallback(async () => {
    if (cartSheetStep === 0) {
      setCartSheetStep(1);
      return;
    }
    if (cartSheetStep === 1) {
      const { ok, errors: e } = validateAddress(form);
      setErrors(e);
      if (!ok) return;
      setCartSheetStep(2);
      return;
    }
    if (cartSheetStep !== 2) return;

    if (form.payment === 'cod') {
      setBusy(true);
      try {
        await finalizeOrder({ gateway: 'cod', paymentStatus: 'placed' });
      } catch (e) {
        showToast(e.message || 'Could not place order');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (form.payment === 'stripe') {
      setStripeOpen(true);
      return;
    }

    if (form.payment === 'sslcommerz') {
      setBusy(true);
      try {
        const tranId = makeSslcTransactionId();
        const { gatewayPageUrl } = await initSslcSession({
          tran_id: tranId,
          amount: total.toFixed(2),
          currency: currency?.code || 'BDT',
          cus_name: form.name,
          cus_phone: form.phone,
          cus_add1: form.line1,
          cus_city: form.city,
          product_name: `${count} item(s)`,
        });
        await finalizeOrder({
          id: tranId,
          gateway: 'sslcommerz',
          paymentStatus: 'pending_payment',
          transactionId: tranId,
        });
        showToast('Opening secure checkout…');
        await openGatewayPage(gatewayPageUrl);
        // On web the page is leaving the SPA already. On native the in-app
        // browser closed and we route to /payment-result for manual confirm.
        if (Platform.OS !== 'web') {
          closeCartSheet();
          router.replace(`/payment-result?tran_id=${tranId}`);
        }
      } catch (e) {
        showToast(e.message || 'Could not start SSLCommerz checkout');
      } finally {
        setBusy(false);
      }
    }
  }, [
    cartSheetStep,
    setCartSheetStep,
    form,
    total,
    count,
    currency,
    finalizeOrder,
    showToast,
    closeCartSheet,
    router,
  ]);

  const onStripeComplete = useCallback(
    async ({ transactionId }) => {
      setStripeOpen(false);
      setBusy(true);
      try {
        await finalizeOrder({
          gateway: 'stripe',
          paymentStatus: 'paid',
          transactionId,
        });
      } catch (e) {
        showToast(e.message || 'Payment failed');
      } finally {
        setBusy(false);
      }
    },
    [finalizeOrder, showToast],
  );

  const onBack = useCallback(() => {
    if (cartSheetStep === 0) return closeCartSheet();
    setCartSheetStep(Math.max(0, cartSheetStep - 1));
  }, [cartSheetStep, setCartSheetStep, closeCartSheet]);

  const onViewOrders = useCallback(() => {
    closeCartSheet();
    setTimeout(() => router.push('/orders'), 80);
  }, [closeCartSheet, router]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={cartSheetStep === 3 ? 'close' : 'none'}
        opacity={0.5}
      />
    ),
    [cartSheetStep],
  );

  const snapPoints = useMemo(() => ['90%'], []);

  const continueLabel = useMemo(() => {
    if (busy) return 'Placing…';
    if (cartSheetStep === 0) return 'Continue';
    if (cartSheetStep === 1) return 'Continue to payment';
    if (cartSheetStep === 2) return `Place order · ${formatPrice(total, currency)}`;
    return 'Done';
  }, [busy, cartSheetStep, total, currency]);

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <View style={[styles.footerBar, { borderTopColor: t.line, backgroundColor: t.bg }]}>
          {cartSheetStep === 3 ? (
            <>
              <Pressable
                onPress={closeCartSheet}
                style={[styles.footerBtn, { borderWidth: 1, borderColor: t.line }]}
              >
                <Text style={[styles.footerBtnText, { color: t.ink }]}>Keep shopping</Text>
              </Pressable>
              <Pressable
                onPress={onViewOrders}
                style={[styles.footerBtn, { backgroundColor: t.ink }]}
              >
                <Text style={[styles.footerBtnText, { color: t.bg }]}>View orders</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={onBack}
                style={[styles.footerBtn, { borderWidth: 1, borderColor: t.line }]}
              >
                <Text style={[styles.footerBtnText, { color: t.ink }]}>
                  {cartSheetStep === 0 ? 'Close' : 'Back'}
                </Text>
              </Pressable>
              <Pressable
                onPress={onContinue}
                disabled={busy || count === 0}
                style={[
                  styles.footerBtn,
                  { backgroundColor: busy || count === 0 ? t.ink3 : t.ink, flex: 1.4 },
                ]}
              >
                <Text style={[styles.footerBtnText, { color: t.bg }]}>{continueLabel}</Text>
              </Pressable>
            </>
          )}
        </View>
      </BottomSheetFooter>
    ),
    [cartSheetStep, t, closeCartSheet, onViewOrders, onBack, onContinue, busy, count, continueLabel],
  );

  return (
    <>
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={closeCartSheet}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      handleIndicatorStyle={{ backgroundColor: t.ink4 }}
      backgroundStyle={{ backgroundColor: t.bg }}
      enablePanDownToClose
      keyboardBehavior="interactive"
    >
      <BottomSheetScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: t.ink3 }]}>
              {STEP_LABELS[cartSheetStep] || ''}
            </Text>
            <Text style={[styles.title, { color: t.ink }]}>
              {cartSheetStep === 0 && 'Your cart'}
              {cartSheetStep === 1 && 'Delivery address'}
              {cartSheetStep === 2 && 'Payment'}
              {cartSheetStep === 3 && 'Order placed'}
            </Text>
          </View>
        </View>

        {cartSheetStep < 3 ? (
          <View style={styles.stepperRow}>
            {[0, 1, 2].map((s) => (
              <View
                key={s}
                style={[styles.stepBar, { backgroundColor: s <= cartSheetStep ? t.ink : t.line }]}
              />
            ))}
          </View>
        ) : null}

        {cartSheetStep === 0 ? (
          <ReviewStep
            cart={cart}
            productMap={productMap}
            currency={currency}
            t={t}
            updateQty={updateQty}
            removeFromCart={removeFromCart}
            total={total}
            count={count}
          />
        ) : null}

        {(cartSheetStep === 1 || cartSheetStep === 2) ? (
          <CheckoutForm
            step={cartSheetStep === 1 ? 0 : 1}
            form={form}
            onChange={onChange}
            errors={errors}
            paymentOptions={paymentOptions}
          />
        ) : null}

        {cartSheetStep === 3 ? (
          <View style={styles.successWrap}>
            <View style={[styles.successCheck, { backgroundColor: t.ink }]}>
              <IconCheck color={t.bg} size={28} />
            </View>
            <Text style={[styles.successTitle, { color: t.ink }]}>Order placed</Text>
            <Text style={[styles.successSub, { color: t.ink3 }]}>
              {orderId ? `Confirmation: ${orderId.toUpperCase()}.` : ''} We'll text you delivery
              updates as it ships.
            </Text>
          </View>
        ) : null}
      </BottomSheetScrollView>
    </BottomSheetModal>
    {/* StripeCardSheet must live OUTSIDE BottomSheetModal — the bottom-sheet
        renders through a Portal/FullWindowOverlay which doesn't propagate
        StripeProvider context to descendants. Nesting StripeCardSheet inside
        causes useStripe() to throw and the inner Modal renders blank, leaving
        only the overlay visible. */}
    <StripeCardSheet
      open={stripeOpen}
      amountLabel={formatPrice(total, currency)}
      itemsCount={count}
      onComplete={onStripeComplete}
      onCancel={() => setStripeOpen(false)}
    />
    </>
  );
}

function ReviewStep({ cart, productMap, currency, t, updateQty, removeFromCart, total, count }) {
  if (count === 0) {
    return (
      <View style={styles.empty}>
        <Text style={[styles.emptyTitle, { color: t.ink, fontFamily: t.fonts.display }]}>
          Your bag is empty
        </Text>
        <Text style={[styles.emptySub, { color: t.ink3, fontFamily: t.fonts.sans }]}>
          Add a few items to get started.
        </Text>
      </View>
    );
  }
  return (
    <View>
      {cart.map((item, i) => {
        const p = productMap[item.id];
        if (!p) return null;
        return (
          <View
            key={`${item.id}-${i}`}
            style={[styles.lineCard, { borderColor: t.line, backgroundColor: t.surface }]}
          >
            <View style={styles.lineImage}>
              <RemoteImage product={p} aspectRatio={1} radius={8} />
            </View>
            <View style={styles.lineInfo}>
              {p.brand ? (
                <Text style={[styles.lineBrand, { color: t.ink3 }]} numberOfLines={1}>
                  {p.brand}
                </Text>
              ) : null}
              <Text style={[styles.lineName, { color: t.ink }]} numberOfLines={1}>
                {p.name}
              </Text>
              {item.variant?.unit || p.unit ? (
                <Text style={[styles.lineUnit, { color: t.ink3 }]} numberOfLines={1}>
                  {item.variant?.unit || p.unit}
                </Text>
              ) : null}
              <View style={styles.lineFooter}>
                <View style={[styles.qtyRow, { borderColor: t.line }]}>
                  <Pressable onPress={() => updateQty(i, item.qty - 1)} hitSlop={8}>
                    <IconMinus color={t.ink} size={12} />
                  </Pressable>
                  <Text style={[styles.qtyText, { color: t.ink }]}>{item.qty}</Text>
                  <Pressable onPress={() => updateQty(i, item.qty + 1)} hitSlop={8}>
                    <IconPlus color={t.ink} size={12} />
                  </Pressable>
                </View>
                <Text style={[styles.lineTotal, { color: t.ink }]}>
                  {formatPrice(p.price * item.qty, currency)}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => removeFromCart(i)}
              hitSlop={8}
              style={styles.removeBtn}
              accessibilityLabel="Remove from cart"
            >
              <IconX color={t.ink3} size={14} />
            </Pressable>
          </View>
        );
      })}

      <View style={[styles.totals, { backgroundColor: t.surfaceAlt }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: t.ink2 }]}>Subtotal</Text>
          <Text style={[styles.totalValue, { color: t.ink2 }]}>
            {formatPrice(total, currency)}
          </Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: t.ink2 }]}>Shipping</Text>
          <Text style={[styles.totalValue, { color: t.ink2 }]}>At checkout</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: t.line }]} />
        <View style={styles.totalRow}>
          <Text style={[styles.grandLabel, { color: t.ink }]}>Total</Text>
          <Text style={[styles.grandValue, { color: t.ink }]}>{formatPrice(total, currency)}</Text>
        </View>
      </View>
    </View>
  );
}
