import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { restaurantInfo } from '@/data/restaurantInfo';
import { useAppTheme } from '@/store/dietStore';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function ContactScreen() {
  const router = useRouter();
  const theme = useAppTheme();

  // Inquiry form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('25');
  const [eventType, setEventType] = useState('Family Gathering');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${restaurantInfo.phone}`).catch(() => {});
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${restaurantInfo.email}`).catch(() => {});
  };

  const handleOpenMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      'Power House Chauraha opposite Shakuntalam Hotel Sector G LDA Colony Lucknow'
    )}`;
    Linking.openURL(mapUrl).catch(() => {});
  };

  const handleSubmitInquiry = () => {
    if (!name.trim() || !phone.trim()) {
      if (Platform.OS === 'web') {
        alert('Please provide your name and phone number');
      } else {
        Alert.alert('Missing Details', 'Please provide your name and phone number');
      }
      return;
    }
    setSubmitted(true);
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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Contact & Catering</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Restaurant Contact Cards */}
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>RESTAURANT OUTLET DETAILS</Text>

            {/* Address */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleOpenMap}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="location" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>{restaurantInfo.address}</Text>
                <Text style={styles.contactSub}>
                  {restaurantInfo.area}, {restaurantInfo.city} - {restaurantInfo.pincode}
                </Text>
                <Text style={[styles.mapLink, { color: theme.primary }]}>
                  Open in Google Maps →
                </Text>
              </View>
            </TouchableOpacity>

            {/* Operating Hours */}
            <View style={styles.contactItem}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="clock-time-four"
                  size={20}
                  color={theme.accentGold}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Operating Timings</Text>
                <Text style={styles.contactValue}>{restaurantInfo.openingHours}</Text>
                <Text style={styles.contactSub}>Open 7 Days • Morning to Late Night</Text>
              </View>
            </View>

            {/* Phone */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleCall}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="call" size={20} color="#2E7D32" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Telephone Direct</Text>
                <Text style={styles.contactValue}>{restaurantInfo.phone}</Text>
                <Text style={styles.contactSub}>Tap to call kitchen directly</Text>
              </View>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmail}
              activeOpacity={0.7}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="mail" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Email Inquiries</Text>
                <Text style={styles.contactValue}>{restaurantInfo.email}</Text>
                <Text style={styles.contactSub}>For catering & business collaborations</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Bulk Orders & Royal Catering Form */}
          <View style={styles.card}>
            <Text style={styles.sectionHeading}>BULK CATERING & DAWAT INQUIRY</Text>
            <Text style={styles.cateringDesc}>
              Hosting a wedding, dawat, anniversary or family get-together in Lucknow?
              Let Biryani Heritage prepare authentic Awadhi Dum Biryanis and Galauti Kebabs.
            </Text>

            {submitted ? (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle" size={44} color={Colors.vegGreen} />
                <Text style={styles.successTitle}>Inquiry Sent to Royal Kitchen!</Text>
                <Text style={styles.successSub}>
                  Thank you, {name}! Our catering manager will contact you at {phone} within 2 hours with customized dawat menus and quotes.
                </Text>
                <TouchableOpacity
                  style={[styles.resetBtn, { backgroundColor: theme.primary }]}
                  onPress={() => setSubmitted(false)}
                >
                  <Text style={styles.resetBtnText}>Send Another Inquiry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Your Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor="#9C938D"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mobile Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#9C938D"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.inputLabel}>No. of Guests</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 50"
                      placeholderTextColor="#9C938D"
                      keyboardType="number-pad"
                      value={guests}
                      onChangeText={setGuests}
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.inputLabel}>Event Occasion</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Dawat / Wedding"
                      placeholderTextColor="#9C938D"
                      value={eventType}
                      onChangeText={setEventType}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Special Menu Preferences</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="e.g. Awadhi Mutton Biryani, Veg Dum Handis, Galauti Kebabs..."
                    placeholderTextColor="#9C938D"
                    multiline
                    numberOfLines={3}
                    value={message}
                    onChangeText={setMessage}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSubmitInquiry}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons name="send" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.submitBtnText}>Submit Catering Inquiry</Text>
                </TouchableOpacity>
              </View>
            )}
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
    backgroundColor: '#FFF8F5',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.sm,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 110,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  cateringDesc: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Palette.divider,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Palette.text.secondary,
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
    marginTop: 1,
  },
  contactSub: {
    fontSize: 11,
    color: Palette.text.secondary,
    marginTop: 1,
  },
  mapLink: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    marginTop: 3,
  },
  form: {
    gap: 10,
  },
  inputGroup: {
    marginBottom: 4,
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
    borderWidth: 1,
    borderColor: Palette.border,
    paddingHorizontal: 12,
    height: 42,
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    outlineStyle: 'none' as any,
  },
  textArea: {
    height: 70,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    marginTop: 8,
    ...Shadows.md,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  successBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  successTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.vegGreen,
    marginTop: 8,
  },
  successSub: {
    fontSize: Typography.sizes.xs,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  resetBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
