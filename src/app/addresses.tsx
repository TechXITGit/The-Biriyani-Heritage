import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '@/store/userStore';
import { useAppTheme } from '@/store/dietStore';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function SavedAddressesScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const { addresses, selectedAddressId, selectAddress, addAddress, removeAddress } =
    useUserStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [addressLine, setAddressLine] = useState('');
  const [area, setArea] = useState('LDA Colony');
  const [city, setCity] = useState('Lucknow');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('226012');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = () => {
    if (!addressLine.trim()) {
      setErrorMsg('Please enter flat/house and street');
      return;
    }
    setErrorMsg('');

    addAddress({
      name: 'Aamir Nawab',
      phone: '+91 99191 21513',
      label,
      addressLine: addressLine.trim(),
      area: area.trim(),
      city: city.trim(),
      landmark: landmark.trim(),
      pincode: pincode.trim(),
      isDefault: true,
    });

    setAddressLine('');
    setLandmark('');
    setShowAddForm(false);
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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Saved Addresses</Text>
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            style={[styles.addBtn, { backgroundColor: 'rgba(255, 255, 255, 0.22)' }]}
          >
            <Text style={[styles.addBtnText, { color: '#FFFFFF' }]}>{showAddForm ? 'Cancel' : '+ Add New'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Add New Address Form Modal/Collapsible */}
          {showAddForm && (
            <View style={styles.addCard}>
              <Text style={styles.formTitle}>ADD NEW DELIVERY ADDRESS</Text>

              {/* Label Chips */}
              <View style={styles.labelChips}>
                {(['Home', 'Office', 'Other'] as const).map((l) => (
                  <TouchableOpacity
                    key={l}
                    style={[
                      styles.labelChip,
                      label === l && [
                        styles.labelChipActive,
                        { backgroundColor: theme.primary, borderColor: theme.primary },
                      ],
                    ]}
                    onPress={() => setLabel(l)}
                  >
                    <Text
                      style={[
                        styles.labelChipText,
                        label === l && styles.labelChipTextActive,
                      ]}
                    >
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>House / Flat / Building No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Flat 301, Royal Heights"
                  placeholderTextColor="#9C938D"
                  value={addressLine}
                  onChangeText={setAddressLine}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Area / Sector</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sector G, LDA Colony / Ashiyana"
                  placeholderTextColor="#9C938D"
                  value={area}
                  onChangeText={setArea}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Landmark</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Near Shakuntalam Hotel"
                    placeholderTextColor="#9C938D"
                    value={landmark}
                    onChangeText={setLandmark}
                  />
                </View>
                <View style={[styles.inputGroup, { width: 100 }]}>
                  <Text style={styles.inputLabel}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="226012"
                    placeholderTextColor="#9C938D"
                    value={pincode}
                    onChangeText={setPincode}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveBtnText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Saved Addresses List */}
          <Text style={styles.sectionTitle}>DELIVERY LOCATIONS IN LUCKNOW</Text>

          {addresses.map((addr) => {
            const isSelected = addr.id === selectedAddressId;

            return (
              <View
                key={addr.id}
                style={[
                  styles.addressCard,
                  isSelected && [
                    styles.addressCardSelected,
                    { borderColor: theme.primary },
                  ],
                ]}
              >
                <TouchableOpacity
                  style={styles.addressMain}
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

                  <View style={styles.addressDetails}>
                    <View style={styles.titleRow}>
                      <Text style={styles.label}>{addr.label}</Text>
                      {isSelected && (
                        <View style={[styles.defaultBadge, { backgroundColor: '#E8F5E9' }]}>
                          <Text style={[styles.defaultBadgeText, { color: '#1B5E20' }]}>
                            ACTIVE
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.addressLine}>
                      {addr.addressLine}, {addr.area}
                    </Text>
                    {addr.landmark ? (
                      <Text style={styles.landmark}>Landmark: {addr.landmark}</Text>
                    ) : null}
                    <Text style={styles.cityPincode}>
                      {addr.city} - {addr.pincode}
                    </Text>
                  </View>
                </TouchableOpacity>

                {addresses.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => removeAddress(addr.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#BA1A1A" />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  addBtnText: {
    color: Colors.warmCream,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
    marginVertical: 4,
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.border,
    marginBottom: 8,
    ...Shadows.sm,
  },
  formTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  labelChips: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  labelChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFF8F5',
    borderWidth: 1,
    borderColor: Palette.border,
  },
  labelChipActive: {},
  labelChipText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    fontWeight: Typography.weights.semibold,
  },
  labelChipTextActive: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    color: Palette.text.secondary,
    fontWeight: Typography.weights.semibold,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: Typography.sizes.sm,
    color: Palette.text.primary,
    borderWidth: 1,
    borderColor: Palette.border,
    outlineStyle: 'none' as any,
  },
  errorText: {
    fontSize: 11,
    color: '#BA1A1A',
    marginBottom: 8,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
    ...Shadows.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  addressCardSelected: {
    backgroundColor: '#FFF8F5',
  },
  addressMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
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
    marginTop: 2,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  addressDetails: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  defaultBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: Typography.weights.extraBold,
  },
  addressLine: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    marginTop: 2,
  },
  landmark: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  cityPincode: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 6,
  },
});
