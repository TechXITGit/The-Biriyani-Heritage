import { OrderAgainIcon } from '@/components/common/OrderAgainIcon';
import { VegIndicator } from '@/components/common/VegIndicator';
import { Palette, BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useCartStore } from '@/store/cartStore';
import { useAppTheme } from '@/store/dietStore';
import { useOrderStore } from '@/store/orderStore';
import { useUserStore } from '@/store/userStore';
import { Order } from '@/types/menu';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const theme = useAppTheme();
  const {
    items,
    appliedCoupon,
    couponDiscount,
    deliveryInstruction,
    setDeliveryInstruction,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    addToCart,
    getItemTotal,
    getDeliveryCharge,
    getTaxes,
    getGrandTotal,
    getItemCount,
  } = useCartStore();

  const { orders } = useOrderStore();
  const selectedAddress = useUserStore((state) => state.getSelectedAddress());

  // Active view tab: 'current' (active cart) or 'reorder' (previous orders)
  const [activeTab, setActiveTab] = useState<'current' | 'reorder'>(
    params.tab === 'reorder' ? 'reorder' : 'current'
  );
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [reorderSuccessMsg, setReorderSuccessMsg] = useState('');

  React.useEffect(() => {
    if (params.tab === 'reorder') {
      setActiveTab('reorder');
    } else if (params.tab === 'current') {
      setActiveTab('current');
    }
  }, [params.tab]);

  const itemTotal = getItemTotal();
  const deliveryCharge = getDeliveryCharge();
  const taxes = getTaxes();
  const grandTotal = getGrandTotal();
  const itemCount = getItemCount();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput.trim());
    if (ok) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon or minimum order value not reached.');
    }
  };

  const handleReorderOrder = (order: Order) => {
    order.items.forEach((it) => {
      addToCart(it.dish, it.portion, it.quantity);
    });
    setReorderSuccessMsg(`Added ${order.items.length} items from #${order.orderNumber} to cart!`);
    setActiveTab('current');
    setTimeout(() => setReorderSuccessMsg(''), 4000);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.primaryDark }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Your Feast & Orders</Text>
              <Text style={[styles.headerSubtitle, { color: theme.headerSubtext }]}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart • The Biryani Heritage
              </Text>
            </View>
          </View>

          {items.length > 0 && activeTab === 'current' && (
            <TouchableOpacity onPress={clearCart} style={[styles.clearBtn, { backgroundColor: 'rgba(255, 255, 255, 0.22)' }]}>
              <Text style={[styles.clearText, { color: '#FFFFFF' }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Switcher: Current Feast vs Reorder Past Orders */}
        <View style={[styles.tabSelectorBar, { borderBottomColor: Palette.border }]}>
          <TouchableOpacity
            style={[
              styles.tabSelectorItem,
              activeTab === 'current' && [
                styles.tabSelectorItemActive,
                { borderBottomColor: theme.primary },
              ],
            ]}
            onPress={() => setActiveTab('current')}
          >
            <MaterialCommunityIcons
              name="basket"
              size={18}
              color={activeTab === 'current' ? theme.primary : Palette.charcoal}
            />
            <Text
              style={[
                styles.tabSelectorText,
                activeTab === 'current'
                  ? [styles.tabSelectorTextActive, { color: theme.primary }]
                  : [styles.tabSelectorTextInactive, { color: Palette.text.secondary }],
              ]}
            >
              Current Feast ({itemCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSelectorItem,
              activeTab === 'reorder' && [
                styles.tabSelectorItemActive,
                { borderBottomColor: theme.primary },
              ],
            ]}
            onPress={() => setActiveTab('reorder')}
          >
            <MaterialCommunityIcons
              name="history"
              size={18}
              color={activeTab === 'reorder' ? theme.primary : Palette.charcoal}
            />
            <Text
              style={[
                styles.tabSelectorText,
                activeTab === 'reorder'
                  ? [styles.tabSelectorTextActive, { color: theme.primary }]
                  : [styles.tabSelectorTextInactive, { color: Palette.text.secondary }],
              ]}
            >
              Reorder Past Orders ({orders.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reorder Success Alert Banner */}
        {reorderSuccessMsg ? (
          <View style={styles.reorderBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#1B5E20" />
            <Text style={styles.reorderBannerText}>{reorderSuccessMsg}</Text>
          </View>
        ) : null}

        {/* TAB 1: CURRENT FEAST */}
        {activeTab === 'current' ? (
          items.length === 0 ? (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.emptyScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <MaterialCommunityIcons
                    name="pot-steam"
                    size={52}
                    color={theme.accentGold}
                  />
                </View>
                <Text style={styles.emptyTitle}>Your Royal Cart is Empty</Text>
                <Text style={styles.emptyDesc}>
                  Good food is always cooking at Biryani Heritage! Explore our
                  slow-cooked Dum Biryanis, juicy Kebabs and rich curries.
                </Text>
                <TouchableOpacity
                  style={[styles.exploreBtn, { backgroundColor: theme.primary }]}
                  onPress={() => router.push('/explore' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.exploreBtnText}>Explore Royal Menu</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Quick Reorder Section When Cart is Empty */}
              {orders.length > 0 && (
                <View style={styles.emptyReorderSection}>
                  <View style={styles.sectionHeaderRow}>
                    <View>
                      <Text style={styles.sectionTitle}>REORDER FROM PREVIOUS FEASTS</Text>
                      <Text style={styles.sectionSubtitle}>Repeat your favourite order in 1 tap</Text>
                    </View>
                  </View>

                  {orders.slice(0, 3).map((order) => (
                    <View key={order.id} style={styles.reorderCard}>
                      <View style={styles.reorderTopRow}>
                        <View>
                          <Text style={styles.reorderOrderNum}>Order #{order.orderNumber}</Text>
                          <Text style={styles.reorderDate}>{order.date}</Text>
                        </View>
                        <Text style={[styles.reorderAmount, { color: theme.primary }]}>
                          ₹{order.totalAmount}
                        </Text>
                      </View>

                      <View style={styles.reorderItemsList}>
                        {order.items.map((it, idx) => (
                          <View key={idx} style={styles.reorderItemRow}>
                            <VegIndicator isVeg={it.dish.isVeg} size={12} />
                            <Text style={styles.reorderItemName} numberOfLines={1}>
                              {it.quantity}x {it.dish.name} ({it.portion === 'half' ? 'Half' : 'Full'})
                            </Text>
                          </View>
                        ))}
                      </View>

                      <TouchableOpacity
                        style={[styles.reorderActionBtn, { backgroundColor: theme.primary }]}
                        onPress={() => handleReorderOrder(order)}
                        activeOpacity={0.85}
                      >
                        <OrderAgainIcon size={16} color="#FFFFFF" />
                        <Text style={styles.reorderActionBtnText}>Reorder This Feast</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Delivery Address Banner */}
              <View style={styles.addressBar}>
                <View style={styles.addressIconWrap}>
                  <Ionicons name="location" size={18} color={theme.primary} />
                </View>
                <View style={styles.addressTextWrap}>
                  <Text style={styles.addressHeading}>
                    Delivering to: {selectedAddress?.label || 'Home'}
                  </Text>
                  <Text style={styles.addressLine} numberOfLines={1}>
                    {selectedAddress?.addressLine}, {selectedAddress?.area}
                  </Text>
                </View>
                <View style={styles.etaBadge}>
                  <Text style={styles.etaText}>30m</Text>
                </View>
              </View>

              {/* Cart Items List */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>ITEMS IN YOUR ROYAL FEAST</Text>
                {items.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <View style={styles.nameRow}>
                        <VegIndicator isVeg={item.dish.isVeg} size={14} />
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.dish.name}
                        </Text>
                      </View>
                      <Text style={styles.itemPortion}>
                        {item.portion === 'half' ? 'Half Plate' : 'Full Plate'} • ₹
                        {item.unitPrice} each
                      </Text>
                    </View>

                    {/* Quantity Counter */}
                    <View style={styles.qtyControl}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={14} color={theme.primary} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={14} color={theme.primary} />
                      </TouchableOpacity>
                    </View>

                    {/* Item Subtotal */}
                    <Text style={styles.itemPrice}>
                      ₹{item.unitPrice * item.quantity}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Delivery Instructions */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>DELIVERY INSTRUCTIONS</Text>
                <View style={styles.instructionWrap}>
                  <MaterialCommunityIcons
                    name="note-text-outline"
                    size={18}
                    color={theme.accentGold}
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    style={styles.instructionInput}
                    placeholder="e.g. Leave with guard, ring bell, extra onions..."
                    placeholderTextColor="#9C938D"
                    value={deliveryInstruction}
                    onChangeText={setDeliveryInstruction}
                  />
                </View>
              </View>

              {/* Apply Coupon Section */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>OFFERS & PROMOTIONS</Text>

                {appliedCoupon ? (
                  <View style={styles.appliedCouponCard}>
                    <View style={styles.couponLeft}>
                      <MaterialCommunityIcons
                        name="ticket-percent"
                        size={22}
                        color={theme.primary}
                      />
                      <View style={{ marginLeft: 8 }}>
                        <Text style={[styles.appliedCode, { color: theme.primary }]}>
                          '{appliedCoupon}' APPLIED
                        </Text>
                        <Text style={styles.appliedSavings}>
                          You save ₹{couponDiscount} on this royal feast!
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={removeCoupon} style={styles.removeCouponBtn}>
                      <Text style={styles.removeCouponText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <View style={styles.couponInputRow}>
                      <TextInput
                        style={styles.couponInput}
                        placeholder="Enter coupon code (ROYAL50 / DUMFEAST)"
                        placeholderTextColor="#9C938D"
                        value={couponInput}
                        onChangeText={(t) => {
                          setCouponInput(t.toUpperCase());
                          setCouponError('');
                        }}
                        autoCapitalize="characters"
                      />
                      <TouchableOpacity
                        style={[styles.applyBtn, { backgroundColor: theme.primary }]}
                        onPress={handleApplyCoupon}
                      >
                        <Text style={styles.applyBtnText}>Apply</Text>
                      </TouchableOpacity>
                    </View>
                    {couponError ? (
                      <Text style={styles.couponErrorText}>{couponError}</Text>
                    ) : null}
                  </View>
                )}
              </View>

              {/* Bill Details Breakdown */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>ROYAL BILL BREAKDOWN</Text>

                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Item Total</Text>
                  <Text style={styles.billValue}>₹{itemTotal}</Text>
                </View>

                {couponDiscount > 0 && (
                  <View style={styles.billRow}>
                    <Text style={[styles.billLabel, { color: '#2E7D32' }]}>
                      Coupon Discount ({appliedCoupon})
                    </Text>
                    <Text style={[styles.billValue, { color: '#2E7D32' }]}>
                      -₹{couponDiscount}
                    </Text>
                  </View>
                )}

                <View style={styles.billRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    {deliveryCharge === 0 && (
                      <View style={styles.freeBadge}>
                        <Text style={styles.freeBadgeText}>FREE OVER ₹499</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.billValue}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </Text>
                </View>

                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Taxes & Restaurant Charges (5% GST)</Text>
                  <Text style={styles.billValue}>₹{taxes}</Text>
                </View>

                <View style={styles.billDivider} />

                <View style={styles.grandTotalRow}>
                  <View>
                    <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>
                    <Text style={styles.grandTotalSub}>Inclusive of all taxes</Text>
                  </View>
                  <Text style={[styles.grandTotalValue, { color: theme.primary }]}>
                    ₹{grandTotal}
                  </Text>
                </View>
              </View>


              {/* Bottom spacing for checkout bar */}
              <View style={{ height: 110 }} />
            </ScrollView>
          )
        ) : (
          /* TAB 2: REORDER PREVIOUS ORDERS */
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>PREVIOUS ROYAL ORDERS</Text>
                <Text style={styles.sectionSubtitle}>
                  Repeat any of your past Lucknow feasts with 1 tap
                </Text>
              </View>
            </View>

            {orders.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="receipt-text-outline"
                  size={52}
                  color="#D4C4B9"
                />
                <Text style={styles.emptyTitle}>No Past Orders Yet</Text>
                <Text style={styles.emptyDesc}>
                  Once you order our handi Dum Biryani or Galauti Kebabs, your order
                  will appear here for easy 1-click reordering!
                </Text>
                <TouchableOpacity
                  style={[styles.exploreBtn, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    setActiveTab('current');
                    router.push('/explore' as any);
                  }}
                >
                  <Text style={styles.exploreBtnText}>Browse Royal Menu</Text>
                </TouchableOpacity>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order.id} style={styles.reorderCardFull}>
                  <View style={styles.reorderCardHeader}>
                    <View>
                      <Text style={styles.orderNumberFull}>Order #{order.orderNumber}</Text>
                      <Text style={styles.orderDateFull}>{order.date}</Text>
                    </View>
                    <View style={styles.orderStatusBadge}>
                      <Text style={styles.orderStatusText}>{order.currentStage}</Text>
                    </View>
                  </View>

                  <View style={styles.reorderDivider} />

                  <View style={styles.reorderItemsBox}>
                    {order.items.map((it, idx) => (
                      <View key={idx} style={styles.reorderItemRowFull}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <VegIndicator isVeg={it.dish.isVeg} size={13} />
                          <Text style={styles.reorderItemTitle} numberOfLines={1}>
                            {it.dish.name}
                          </Text>
                        </View>
                        <Text style={styles.reorderItemQtyPrice}>
                          {it.quantity}x • ₹{it.unitPrice * it.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.reorderDivider} />

                  <View style={styles.reorderCardFooter}>
                    <View>
                      <Text style={styles.totalPaidLabel}>TOTAL PAID</Text>
                      <Text style={[styles.totalPaidAmount, { color: theme.primary }]}>
                        ₹{order.totalAmount}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.reorderBtnMain, { backgroundColor: theme.primary }]}
                      onPress={() => handleReorderOrder(order)}
                      activeOpacity={0.85}
                    >
                      <OrderAgainIcon size={16} color="#FFFFFF" />
                      <Text style={styles.reorderBtnMainText}>Reorder This Feast</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            <View style={{ height: 80 }} />
          </ScrollView>
        )}

        {/* Fixed Bottom Checkout Bar (only shown in active cart tab with items) */}
        {activeTab === 'current' && items.length > 0 && (
          <View style={styles.checkoutBar}>
            <View style={styles.checkoutBarLeft}>
              <Text style={styles.checkoutBarTotalLabel}>TOTAL PAYABLE</Text>
              <Text style={[styles.checkoutBarTotal, { color: theme.primary }]}>
                ₹{grandTotal}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.checkoutBtn, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/checkout' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    marginTop: 1,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  clearText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
  },
  tabSelectorBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFE5D8',
  },
  tabSelectorItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabSelectorItemActive: {},
  tabSelectorText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  tabSelectorTextActive: {},
  tabSelectorTextInactive: {
    color: '#8A827B',
  },
  reorderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  reorderBannerText: {
    fontSize: 12,
    fontWeight: Typography.weights.bold,
    color: '#1B5E20',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: 12,
  },
  emptyScrollContent: {
    padding: Spacing.lg,
    gap: 16,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Shadows.sm,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    ...Shadows.md,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  emptyReorderSection: {
    gap: 10,
  },
  sectionHeaderRow: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginTop: 2,
  },
  reorderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    gap: 10,
    ...Shadows.sm,
  },
  reorderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reorderOrderNum: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  reorderDate: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  reorderAmount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  reorderItemsList: {
    backgroundColor: '#FFF8F5',
    borderRadius: 10,
    padding: 8,
    gap: 4,
  },
  reorderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reorderItemName: {
    fontSize: 11.5,
    color: Palette.text.primary,
    flex: 1,
  },
  reorderActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    ...Shadows.sm,
  },
  reorderActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  reorderCardFull: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 12,
    ...Shadows.sm,
  },
  reorderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumberFull: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  orderDateFull: {
    fontSize: 11.5,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  orderStatusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  orderStatusText: {
    color: '#1B5E20',
    fontSize: 10.5,
    fontWeight: Typography.weights.bold,
  },
  reorderDivider: {
    height: 1,
    backgroundColor: Palette.divider,
    marginVertical: 12,
  },
  reorderItemsBox: {
    gap: 8,
  },
  reorderItemRowFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reorderItemTitle: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.primary,
    marginLeft: 6,
    flex: 1,
  },
  reorderItemQtyPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Palette.text.secondary,
  },
  reorderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPaidLabel: {
    fontSize: 9.5,
    fontWeight: Typography.weights.bold,
    color: Palette.text.secondary,
  },
  totalPaidAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  reorderBtnMain: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    ...Shadows.sm,
  },
  reorderBtnMainText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  addressIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressHeading: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  addressLine: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  etaBadge: {
    backgroundColor: Palette.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  etaText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    flex: 1,
  },
  itemPortion: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    marginRight: 12,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    minWidth: 18,
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    minWidth: 50,
    textAlign: 'right',
  },
  instructionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  instructionInput: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    outlineStyle: 'none' as any,
  },
  appliedCouponCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  couponLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appliedCode: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  appliedSavings: {
    fontSize: 10.5,
    color: '#2E7D32',
    marginTop: 1,
  },
  removeCouponBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeCouponText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: '#BA1A1A',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 42,
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    borderWidth: 1,
    borderColor: Palette.border,
    outlineStyle: 'none' as any,
  },
  applyBtn: {
    paddingHorizontal: 16,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  couponErrorText: {
    fontSize: 11,
    color: '#BA1A1A',
    marginTop: 4,
    marginLeft: 4,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
  },
  freeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    marginLeft: 6,
  },
  freeBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.extraBold,
    color: '#1B5E20',
  },
  billValue: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Palette.text.primary,
  },
  billDivider: {
    height: 1,
    backgroundColor: Palette.divider,
    marginVertical: 8,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  grandTotalLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  grandTotalSub: {
    fontSize: 10,
    color: Palette.text.secondary,
  },
  grandTotalValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.primaryLight,
  },
  policyText: {
    fontSize: 11,
    color: Palette.text.primary,
    lineHeight: 16,
    flex: 1,
  },
  checkoutBar: {
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
  checkoutBarLeft: {},
  checkoutBarTotalLabel: {
    fontSize: 9.5,
    fontWeight: Typography.weights.bold,
    color: Palette.text.secondary,
    letterSpacing: 0.5,
  },
  checkoutBarTotal: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    ...Shadows.md,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
