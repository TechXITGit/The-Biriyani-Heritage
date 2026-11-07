import React, { useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrderStore } from '@/store/orderStore';
import { useAppTheme } from '@/store/dietStore';
import { OrderStage } from '@/types/menu';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { VegIndicator } from '@/components/common/VegIndicator';

const stages: OrderStage[] = [
  'Order Placed',
  'Order Confirmed',
  'Preparing Your Food',
  'Out for Delivery',
  'Delivered',
];

export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const theme = useAppTheme();
  const { getOrder, updateOrderStage } = useOrderStore();

  const order = getOrder(orderId || 'ord-1029');

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Order not found</Text>
          <TouchableOpacity
            style={[styles.backHomeBtn, { backgroundColor: theme.primary }]}
            onPress={() => router.replace('/' as any)}
          >
            <Text style={styles.backHomeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStageIndex = stages.indexOf(order.currentStage);

  const handleAdvanceStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];
      updateOrderStage(order.id, nextStage);
    }
  };

  const handleCallValet = () => {
    if (order.deliveryPartner?.phone) {
      Linking.openURL(`tel:${order.deliveryPartner.phone}`).catch(() => {});
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.headerBg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top Header */}
        <View style={[styles.header, { backgroundColor: theme.headerBg, borderBottomWidth: 1, borderBottomColor: theme.primaryDark }]}>
          <TouchableOpacity onPress={() => router.push('/orders' as any)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Order #{order.orderNumber}</Text>
            <Text style={[styles.headerSubtitle, { color: theme.headerSubtext }]}>{order.date}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/' as any)}
            style={styles.homeBtn}
          >
            <Ionicons name="home-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ETA & Status Hero Banner */}
          <View style={[styles.heroCard, { backgroundColor: theme.primary }]}>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroStatusLabel}>CURRENT STATUS</Text>
                <Text style={styles.heroStatusTitle}>{order.currentStage}</Text>
              </View>
              <View style={styles.etaPill}>
                <MaterialCommunityIcons
                  name="clock-fast"
                  size={16}
                  color={theme.accentGold}
                />
                <Text style={styles.etaPillText}>{order.estimatedDeliveryTime}</Text>
              </View>
            </View>

            <Text style={styles.heroSubText}>
              {order.currentStage === 'Delivered'
                ? 'Your royal feast was successfully delivered. Enjoy your meal!'
                : 'Our Master Ustad and royal valets are ensuring your food arrives piping hot and fresh.'}
            </Text>

            {/* Real-time simulation control for review testing */}
            {order.currentStage !== 'Delivered' && (
              <TouchableOpacity
                style={styles.advanceStageBtn}
                onPress={handleAdvanceStage}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="fast-forward"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.advanceStageText}>
                  Simulate Next Kitchen Stage →
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Timeline Progress Stages */}
          <View style={styles.timelineCard}>
            <Text style={styles.cardHeaderTitle}>ROYAL ORDER PROGRESS</Text>

            <View style={styles.timelineWrap}>
              {order.timeline.map((item, idx) => {
                const isCompleted = item.isCompleted;
                const isCurrent = item.isCurrent;
                const isPending = !isCompleted && !isCurrent;

                return (
                  <View key={idx} style={styles.timelineStep}>
                    {/* Circle Indicator with connecting line */}
                    <View style={styles.stepIndicatorCol}>
                      <View
                        style={[
                          styles.stepCircle,
                          isCompleted && [styles.stepCircleCompleted, { backgroundColor: theme.primary }],
                          isCurrent && [
                            styles.stepCircleCurrent,
                            { borderColor: theme.primary, backgroundColor: theme.primary },
                          ],
                          isPending && styles.stepCirclePending,
                        ]}
                      >
                        {isCompleted ? (
                          <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                        ) : isCurrent ? (
                          <View style={styles.pulsingDot} />
                        ) : (
                          <View style={styles.pendingDot} />
                        )}
                      </View>

                      {idx < order.timeline.length - 1 && (
                        <View
                          style={[
                            styles.stepLine,
                            isCompleted && [styles.stepLineCompleted, { backgroundColor: theme.primary }],
                          ]}
                        />
                      )}
                    </View>

                    {/* Step Details */}
                    <View style={styles.stepContent}>
                      <View style={styles.stepHeaderRow}>
                        <Text
                          style={[
                            styles.stepTitle,
                            (isCompleted || isCurrent) && [
                              styles.stepTitleActive,
                              { color: isCurrent ? theme.primary : Colors.text },
                            ],
                          ]}
                        >
                          {item.stage}
                        </Text>
                        <Text style={styles.stepTime}>{item.time}</Text>
                      </View>
                      <Text style={styles.stepDescription}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Delivery Valet Card */}
          {order.deliveryPartner && (
            <View style={styles.partnerCard}>
              <View style={styles.partnerLeft}>
                <View style={styles.partnerAvatar}>
                  <MaterialCommunityIcons name="moped" size={24} color={theme.primary} />
                </View>
                <View style={styles.partnerInfo}>
                  <Text style={styles.partnerRole}>DELIVERY PARTNER</Text>
                  <Text style={styles.partnerName}>
                    {order.deliveryPartner.name}
                  </Text>
                  <Text style={styles.partnerVehicle}>
                    Vehicle: {order.deliveryPartner.vehicleNumber}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.callBtn, { backgroundColor: '#E8F5E9' }]}
                onPress={handleCallValet}
                activeOpacity={0.8}
              >
                <Ionicons name="call" size={16} color="#1B5E20" />
                <Text style={[styles.callBtnText, { color: '#1B5E20' }]}>Call</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Order Summary Card */}
          <View style={styles.itemsCard}>
            <Text style={styles.cardHeaderTitle}>ORDER ITEMS</Text>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemRowLeft}>
                  <VegIndicator isVeg={item.dish.isVeg} size={12} />
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.quantity}x {item.dish.name}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  ₹{item.unitPrice * item.quantity}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Paid ({order.paymentMethod})</Text>
              <Text style={[styles.summaryValue, { color: theme.primary }]}>
                ₹{order.totalAmount}
              </Text>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={styles.addressCard}>
            <Text style={styles.cardHeaderTitle}>DELIVERY ADDRESS</Text>
            <Text style={styles.addressName}>
              {order.deliveryAddress.name} ({order.deliveryAddress.label})
            </Text>
            <Text style={styles.addressText}>
              {order.deliveryAddress.addressLine}, {order.deliveryAddress.area},{' '}
              {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
            </Text>
            <Text style={styles.addressPhone}>Phone: {order.deliveryAddress.phone}</Text>
          </View>

          <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.md,
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.xs,
    marginTop: 1,
  },
  homeBtn: {
    padding: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: 14,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: 18,
    ...Shadows.md,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  heroStatusLabel: {
    fontSize: 9.5,
    fontWeight: Typography.weights.extraBold,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.8,
  },
  heroStatusTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    marginTop: 2,
  },
  etaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    gap: 6,
  },
  etaPillText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  heroSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: Typography.sizes.xs,
    lineHeight: 18,
    marginBottom: 12,
  },
  advanceStageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 9,
    borderRadius: BorderRadius.pill,
    marginTop: 4,
  },
  advanceStageText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: Typography.weights.bold,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  cardHeaderTitle: {
    fontSize: 10.5,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  timelineWrap: {
    paddingLeft: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    minHeight: 56,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 24,
    marginRight: 12,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  stepCircleCompleted: {},
  stepCircleCurrent: {
    borderWidth: 2,
  },
  stepCirclePending: {
    backgroundColor: '#FFF8F5',
    borderWidth: 2,
    borderColor: Palette.border,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4C4B9',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  stepLineCompleted: {},
  stepContent: {
    flex: 1,
    paddingBottom: 14,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Palette.text.secondary,
  },
  stepTitleActive: {
    fontWeight: Typography.weights.bold,
  },
  stepTime: {
    fontSize: 11,
    color: Palette.text.secondary,
  },
  stepDescription: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  partnerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  partnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerRole: {
    fontSize: 9,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.6,
  },
  partnerName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginTop: 1,
  },
  partnerVehicle: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 6,
  },
  callBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  itemName: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    flex: 1,
  },
  itemPrice: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.divider,
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
  },
  summaryValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  addressName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginBottom: 2,
  },
  addressText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    lineHeight: 18,
  },
  addressPhone: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: Typography.sizes.md,
    color: Palette.text.secondary,
    marginBottom: 16,
  },
  backHomeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  backHomeBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.bold,
  },
});
