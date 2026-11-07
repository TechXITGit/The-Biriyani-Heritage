import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import { useAppTheme } from '@/store/dietStore';
import { DeliveryAddress } from '@/types/menu';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function CheckoutScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const {
    items,
    getItemTotal,
    getDeliveryCharge,
    getTaxes,
    couponDiscount,
    getGrandTotal,
    deliveryInstruction,
    clearCart,
  } = useCartStore();

  const { profile, addresses, selectedAddressId, selectAddress, addAddress } =
    useUserStore();
  const { createOrder } = useOrderStore();

  // Form states
  const [customerName, setCustomerName] = useState(profile.name || 'Aamir Nawab');
  const [customerPhone, setCustomerPhone] = useState(
    profile.phone.replace('+91 ', '') || '9919121513'
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'Cash on Delivery' | 'UPI / Online' | 'Credit/Debit Card'
  >('UPI / Online');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedAddr =
    addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const itemTotal = getItemTotal();
  const deliveryCharge = getDeliveryCharge();
  const taxes = getTaxes();
  const grandTotal = getGrandTotal();

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
      setErrorMsg('Please enter customer name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!selectedAddr) {
      setErrorMsg('Please select a delivery address');
      return;
    }

    setErrorMsg('');
    setIsPlacingOrder(true);

    setTimeout(() => {
      const placedOrder = createOrder({
        items,
        itemTotal,
        deliveryCharge,
        tax: taxes,
        discount: couponDiscount,
        totalAmount: grandTotal,
        deliveryAddress: selectedAddr,
        paymentMethod,
        deliveryInstruction,
      });

      // Clear the cart
      clearCart();
      setIsPlacingOrder(false);

      // Navigate to live order tracking screen
      router.replace({
        pathname: '/tracking/[orderId]',
        params: { orderId: placedOrder.id },
      } as any);
    }, 700);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.primaryDark }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Review & Checkout</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Contact Details */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons
                name="account-check-outline"
                size={18}
                color={theme.primary}
              />
              <Text style={styles.cardTitle}>CUSTOMER DETAILS</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Enter your name"
                placeholderTextColor="#9C938D"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile Number (for delivery updates)</Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBadge}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  placeholder="10-digit number"
                  placeholderTextColor="#9C938D"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="location-outline" size={18} color={theme.primary} />
              <Text style={styles.cardTitle}>DELIVERY ADDRESS</Text>
            </View>

            {addresses.map((addr) => {
              const isSelected = addr.id === selectedAddressId;
              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[
                    styles.addressOption,
                    isSelected && [
                      styles.addressOptionSelected,
                      { borderColor: theme.primary },
                    ],
                  ]}
                  onPress={() => selectAddress(addr.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.radio}>
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: theme.primary },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.addressInfo}>
                    <View style={styles.labelRow}>
                      <Text style={styles.addressLabel}>{addr.label}</Text>
                      {addr.landmark ? (
                        <Text style={styles.landmarkText}>• {addr.landmark}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.addressText} numberOfLines={2}>
                      {addr.addressLine}, {addr.area}, {addr.city} - {addr.pincode}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => router.push('/addresses' as any)}
            >
              <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
              <Text style={[styles.addAddressText, { color: theme.primary }]}>
                Add or Manage Addresses
              </Text>
            </TouchableOpacity>
          </View>

          {/* Payment Method Selector */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons
                name="credit-card-outline"
                size={18}
                color={theme.primary}
              />
              <Text style={styles.cardTitle}>PAYMENT METHOD</Text>
            </View>

            {/* UPI Option */}
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'UPI / Online' && [
                  styles.paymentOptionSelected,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setPaymentMethod('UPI / Online')}
              activeOpacity={0.8}
            >
              <View style={styles.radio}>
                {paymentMethod === 'UPI / Online' && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                )}
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentTitleRow}>
                  <Text style={styles.paymentTitle}>UPI (GPay / PhonePe / Paytm)</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>INSTANT</Text>
                  </View>
                </View>
                <Text style={styles.paymentSubtitle}>
                  Pay via any UPI app or Net Banking
                </Text>
              </View>
              <MaterialCommunityIcons
                name="integrated-circuit-chip"
                size={22}
                color={theme.accentGold}
              />
            </TouchableOpacity>

            {/* Cash on Delivery */}
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'Cash on Delivery' && [
                  styles.paymentOptionSelected,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setPaymentMethod('Cash on Delivery')}
              activeOpacity={0.8}
            >
              <View style={styles.radio}>
                {paymentMethod === 'Cash on Delivery' && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                )}
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentSubtitle}>
                  Pay cash or UPI to delivery valet at doorstep
                </Text>
              </View>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={22}
                color={Colors.textMuted}
              />
            </TouchableOpacity>

            {/* Credit / Debit Card */}
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === 'Credit/Debit Card' && [
                  styles.paymentOptionSelected,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setPaymentMethod('Credit/Debit Card')}
              activeOpacity={0.8}
            >
              <View style={styles.radio}>
                {paymentMethod === 'Credit/Debit Card' && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: theme.primary },
                    ]}
                  />
                )}
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentTitle}>Credit / Debit Card</Text>
                <Text style={styles.paymentSubtitle}>Visa, Mastercard, RuPay cards</Text>
              </View>
              <MaterialCommunityIcons
                name="credit-card"
                size={22}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Order Summary & Final Bill */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons
                name="receipt-text-outline"
                size={18}
                color={theme.primary}
              />
              <Text style={styles.cardTitle}>ORDER SUMMARY</Text>
            </View>

            {items.map((item) => (
              <View key={item.id} style={styles.summaryItemRow}>
                <Text style={styles.summaryItemName} numberOfLines={1}>
                  {item.quantity}x {item.dish.name} ({item.portion})
                </Text>
                <Text style={styles.summaryItemPrice}>
                  ₹{item.unitPrice * item.quantity}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item Subtotal</Text>
              <Text style={styles.billValue}>₹{itemTotal}</Text>
            </View>

            {couponDiscount > 0 && (
              <View style={styles.billRow}>
                <Text style={[styles.billLabel, { color: '#2E7D32' }]}>
                  Coupon Savings
                </Text>
                <Text style={[styles.billValue, { color: '#2E7D32' }]}>
                  -₹{couponDiscount}
                </Text>
              </View>
            )}

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery Fee</Text>
              <Text style={styles.billValue}>
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </Text>
            </View>

            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (5%)</Text>
              <Text style={styles.billValue}>₹{taxes}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={[styles.totalAmount, { color: theme.primary }]}>
                ₹{grandTotal}
              </Text>
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorBanner}>{errorMsg}</Text> : null}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Place Order CTA */}
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomPayLabel}>AMOUNT PAYABLE</Text>
            <Text style={[styles.bottomPayAmount, { color: theme.primary }]}>
              ₹{grandTotal}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.placeOrderBtn,
              { backgroundColor: theme.primary },
              isPlacingOrder && styles.placeOrderBtnDisabled,
            ]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
            activeOpacity={0.85}
          >
            <Text style={styles.placeOrderText}>
              {isPlacingOrder ? 'Confirming Feast...' : 'Place Royal Order'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.md,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    fontWeight: Typography.weights.semibold,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: Typography.sizes.sm,
    color: Palette.text.primary,
    borderWidth: 1,
    borderColor: Palette.border,
    outlineStyle: 'none' as any,
  },
  phoneInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeBadge: {
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  countryCodeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  phoneInput: {
    flex: 1,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Palette.border,
    marginBottom: 10,
  },
  addressOptionSelected: {
    backgroundColor: '#FFF8F5',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Palette.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addressInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  landmarkText: {
    fontSize: 11,
    color: Palette.text.secondary,
  },
  addressText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    marginTop: 4,
  },
  addAddressText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: Palette.border,
    marginBottom: 10,
  },
  paymentOptionSelected: {
    backgroundColor: '#FFF8F5',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  recommendedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  recommendedText: {
    fontSize: 8.5,
    fontWeight: Typography.weights.extraBold,
    color: '#1B5E20',
  },
  paymentSubtitle: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryItemName: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    flex: 1,
    marginRight: 8,
  },
  summaryItemPrice: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.divider,
    marginVertical: 10,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  billLabel: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
  },
  billValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Palette.text.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  totalAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    color: Colors.nonVegRed,
    padding: 10,
    borderRadius: 14,
    fontSize: Typography.sizes.xs,
    textAlign: 'center',
    fontWeight: Typography.weights.semibold,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.lg,
  },
  bottomPayLabel: {
    fontSize: 9,
    fontWeight: Typography.weights.bold,
    color: Palette.text.secondary,
    letterSpacing: 0.5,
  },
  bottomPayAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    ...Shadows.md,
  },
  placeOrderBtnDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
