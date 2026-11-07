import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';
import { useOrderStore } from '@/store/orderStore';
import { useAppTheme } from '@/store/dietStore';
import { restaurantInfo } from '@/data/restaurantInfo';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { profile } = useUserStore();
  const { orders } = useOrderStore();
  const recentOrder = orders && orders.length > 0 ? orders[0] : null;

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.primaryDark }]}>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Royal Profile</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Card */}
          <View style={styles.userCard}>
            <View style={[styles.avatarWrap, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userNameRow}>
                <Text style={styles.userName}>{profile.name}</Text>
                <View style={[styles.royalMemberTag, { backgroundColor: theme.accentGold }]}>
                  <MaterialCommunityIcons name="crown" size={11} color="#FFFFFF" />
                  <Text style={styles.royalMemberText}>ROYAL PATRON</Text>
                </View>
              </View>
              <Text style={styles.userPhone}>{profile.phone}</Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>
          </View>

          {/* Dedicated My Orders & Reorder Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>MY ORDERS & REORDER</Text>
              <TouchableOpacity onPress={() => router.push('/orders' as any)}>
                <Text style={[styles.viewAllText, { color: theme.primary }]}>
                  View All ({orders.length}) →
                </Text>
              </TouchableOpacity>
            </View>

            {recentOrder && (
              <View style={styles.recentOrderCard}>
                <View style={styles.orderTopRow}>
                  <View>
                    <Text style={styles.orderNumberText}>Order #{recentOrder.orderNumber}</Text>
                    <Text style={styles.orderDateText}>{recentOrder.date}</Text>
                  </View>
                  <View style={[styles.orderStatusBadge, { backgroundColor: Palette.primarySoft }]}>
                    <Text style={[styles.orderStatusText, { color: theme.primary }]}>
                      {recentOrder.currentStage}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderItemsRow}>
                  <Ionicons name="restaurant-outline" size={14} color={Palette.text.secondary} />
                  <Text style={styles.orderItemsText} numberOfLines={1}>
                    {recentOrder.items.map((i) => `${i.dish.name} (x${i.quantity})`).join(', ')}
                  </Text>
                </View>

                <View style={styles.orderFooterRow}>
                  <Text style={styles.orderTotalText}>₹{recentOrder.totalAmount}</Text>
                  <View style={styles.orderActionsRow}>
                    {recentOrder.currentStage !== 'Delivered' ? (
                      <TouchableOpacity
                        style={[styles.trackBtn, { backgroundColor: theme.primary }]}
                        onPress={() => router.push(`/tracking/${recentOrder.id}` as any)}
                        activeOpacity={0.85}
                      >
                        <MaterialCommunityIcons name="moped" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                        <Text style={styles.trackBtnText}>Track</Text>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity
                      style={[styles.reorderSmallBtn, { borderColor: theme.primary, backgroundColor: Palette.primarySoft }]}
                      onPress={() => router.push('/orders' as any)}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="repeat" size={13} color={theme.primary} style={{ marginRight: 4 }} />
                      <Text style={[styles.reorderSmallText, { color: theme.primary }]}>Reorder</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/orders' as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name="receipt-outline" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Complete Order History</Text>
                  <Text style={styles.menuItemSub}>Past feasts, invoices & receipts</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4C4B9" />
            </TouchableOpacity>
          </View>

          {/* Quick Account Links */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>ACCOUNT & PREFERENCES</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/addresses' as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name="location-outline" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Saved Addresses</Text>
                  <Text style={styles.menuItemSub}>Home, Office & favourite drop points</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4C4B9" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/cart' as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name="bag-handle-outline" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>My Cart</Text>
                  <Text style={styles.menuItemSub}>Review selected items & checkout</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4C4B9" />
            </TouchableOpacity>
          </View>

          {/* Restaurant & Heritage Info */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>THE BIRYANI HERITAGE</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/about' as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: `${theme.primary}15` }]}>
                  <MaterialCommunityIcons
                    name="book-open-page-variant"
                    size={18}
                    color={theme.primary}
                  />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Our Nawabi Heritage</Text>
                  <Text style={styles.menuItemSub}>The 200-year Dum Pukht culinary story</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4C4B9" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/contact' as any)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: `${theme.primary}15` }]}>
                  <Ionicons name="call-outline" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Contact & Catering</Text>
                  <Text style={styles.menuItemSub}>Address, phone & bulk event orders</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4C4B9" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() =>
                handleOpenLink('https://clinquant-shortbread-e4c92f.netlify.app/')
              }
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconWrap, { backgroundColor: `${theme.primary}15` }]}>
                  <Ionicons name="globe-outline" size={18} color={theme.primary} />
                </View>
                <View>
                  <Text style={styles.menuItemTitle}>Official Website</Text>
                  <Text style={styles.menuItemSub}>clinquant-shortbread-e4c92f.netlify.app</Text>
                </View>
              </View>
              <Ionicons name="open-outline" size={16} color="#D4C4B9" />
            </TouchableOpacity>
          </View>

          {/* Verified Restaurant Hours & Location Banner */}
          <View style={styles.infoBanner}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.primary} />
              <Text style={styles.infoText}>
                Operating Hours: {restaurantInfo.openingHours} (Open 7 Days)
              </Text>
            </View>
            <View style={[styles.infoRow, { marginTop: 8 }]}>
              <Ionicons name="location-outline" size={16} color={theme.primary} />
              <Text style={styles.infoText}>
                {restaurantInfo.address}, {restaurantInfo.city} - {restaurantInfo.pincode}
              </Text>
            </View>

            {/* Social Links */}
            <View style={styles.socialsRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOpenLink(restaurantInfo.socials.instagram)}
              >
                <Ionicons name="logo-instagram" size={16} color="#E1306C" />
                <Text style={styles.socialBtnText}>Instagram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOpenLink(restaurantInfo.socials.facebook)}
              >
                <Ionicons name="logo-facebook" size={16} color="#1877F2" />
                <Text style={styles.socialBtnText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOpenLink(`tel:${restaurantInfo.phone}`)}
              >
                <Ionicons name="call" size={16} color="#2E7D32" />
                <Text style={styles.socialBtnText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version Info */}
          <Text style={styles.versionText}>
            Biryani Heritage App v1.0.0 • Royal Food-Tech Edition
          </Text>

          <View style={{ height: 90 }} />
        </ScrollView>
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
    ...Shadows.md,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 110,
    gap: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    ...Shadows.sm,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  userInfo: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  royalMemberTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    gap: 3,
  },
  royalMemberText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: Typography.weights.extraBold,
    letterSpacing: 0.5,
  },
  userPhone: {
    fontSize: 12,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  recentOrderCard: {
    backgroundColor: '#FFF8F5',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 8,
    marginTop: 4,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  orderNumberText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  orderDateText: {
    fontSize: 10.5,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  orderStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: Typography.weights.extraBold,
  },
  orderItemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  orderItemsText: {
    fontSize: 11,
    color: Palette.text.secondary,
    flex: 1,
  },
  orderFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.divider,
  },
  orderTotalText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  orderActionsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  reorderSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  reorderSmallText: {
    fontSize: 10.5,
    fontWeight: Typography.weights.bold,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  trackBtnText: {
    fontSize: 10.5,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
    marginVertical: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  menuItemSub: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  infoBanner: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.primaryLight,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    flex: 1,
    lineHeight: 18,
  },
  socialsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  socialBtnText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  versionText: {
    fontSize: 11,
    color: Palette.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
