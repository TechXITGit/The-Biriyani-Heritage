import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Dish, PortionOption } from '@/types/menu';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { VegIndicator } from '@/components/common/VegIndicator';
import { useCartStore } from '@/store/cartStore';

interface PortionModalProps {
  visible: boolean;
  dish: Dish | null;
  onClose: () => void;
  onAdded?: () => void;
}

export const PortionModal: React.FC<PortionModalProps> = ({
  visible,
  dish,
  onClose,
  onAdded,
}) => {
  const [selectedPortion, setSelectedPortion] = useState<PortionOption>('full');
  const [qty, setQty] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!dish) return null;

  const halfPrice = dish.halfPrice;
  const fullPrice = dish.fullPrice;
  const currentPrice = selectedPortion === 'half' && halfPrice ? halfPrice : fullPrice;
  const totalPrice = currentPrice * qty;

  const handleConfirm = () => {
    addToCart(dish, selectedPortion, qty);
    setQty(1);
    setSelectedPortion('full');
    onClose();
    if (onAdded) onAdded();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Top handle */}
          <View style={styles.handle} />

          {/* Dish Header */}
          <View style={styles.dishHeader}>
            <Image source={{ uri: dish.image }} style={styles.dishImage} contentFit="cover" />
            <View style={styles.dishInfo}>
              <View style={styles.titleRow}>
                <VegIndicator isVeg={dish.isVeg} size={15} />
                <Text style={styles.dishName} numberOfLines={2}>
                  {dish.name}
                </Text>
              </View>
              <Text style={styles.dishDesc} numberOfLines={2}>
                {dish.description}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Portion Size Options */}
          <Text style={styles.sectionTitle}>SELECT PORTION SIZE</Text>

          {halfPrice && (
            <TouchableOpacity
              style={[
                styles.optionCard,
                selectedPortion === 'half' && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedPortion('half')}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    styles.radio,
                    selectedPortion === 'half' && styles.radioSelected,
                  ]}
                >
                  {selectedPortion === 'half' && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text style={styles.optionLabel}>Half Plate</Text>
                  <Text style={styles.optionPieces}>
                    {dish.pieces === '4 Pieces' ? '2 Pieces' : 'Serves 1'}
                  </Text>
                </View>
              </View>
              <Text style={styles.optionPrice}>₹{halfPrice}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedPortion === 'full' && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedPortion('full')}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.radio,
                  selectedPortion === 'full' && styles.radioSelected,
                ]}
              >
                {selectedPortion === 'full' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.optionLabel}>Full Plate</Text>
                <Text style={styles.optionPieces}>
                  {dish.pieces || 'Serves 1-2'}
                </Text>
              </View>
            </View>
            <Text style={styles.optionPrice}>₹{fullPrice}</Text>
          </TouchableOpacity>

          {/* Quantity Controls & Add Button */}
          <View style={styles.footerRow}>
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={18} color={Colors.royalMaroon} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQty((q) => q + 1)}
              >
                <Ionicons name="add" size={18} color={Colors.royalMaroon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Text style={styles.addButtonText}>Add to Cart • ₹{totalPrice}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(36, 32, 31, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    paddingBottom: 28,
    ...Shadows.lg,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD5CC',
    alignSelf: 'center',
    marginBottom: 14,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishImage: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: '#FAF4EC',
  },
  dishInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  dishName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    flex: 1,
  },
  dishDesc: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  closeBtn: {
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#EFE5D8',
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#EFE5D8',
    marginBottom: 10,
    backgroundColor: '#FFFDF9',
  },
  optionCardSelected: {
    borderColor: Colors.royalMaroon,
    backgroundColor: '#FDF6F8',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C4B9AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: Colors.royalMaroon,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.royalMaroon,
  },
  optionLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  optionPieces: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  optionPrice: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.royalMaroon,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: '#EFE5D8',
    paddingHorizontal: 4,
  },
  qtyBtn: {
    padding: 8,
  },
  qtyText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.royalMaroon,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.3,
  },
});
