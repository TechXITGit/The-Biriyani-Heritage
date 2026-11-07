import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { restaurantInfo } from '@/data/restaurantInfo';
import { useAppTheme } from '@/store/dietStore';
import { Palette, Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function AboutScreen() {
  const router = useRouter();
  const theme = useAppTheme();

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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>About Biryani Heritage</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Brand Header */}
          <View style={styles.heroBanner}>
            <Image
              source={{
                uri: 'https://clinquant-shortbread-e4c92f.netlify.app/images/hero-bg.jpg',
              }}
              style={styles.heroBg}
              contentFit="cover"
            />
            <View style={[styles.heroOverlay, { backgroundColor: theme.heroOverlay }]} />
            <View style={styles.heroContent}>
              <View style={styles.logoCircle}>
                <Image
                  source={{
                    uri: 'https://clinquant-shortbread-e4c92f.netlify.app/images/logo.png',
                  }}
                  style={styles.logoImg}
                  contentFit="contain"
                />
              </View>
              <Text style={styles.heroTitle}>{restaurantInfo.name}</Text>
              <Text style={styles.heroTagline}>{restaurantInfo.tagline}</Text>
            </View>
          </View>

          {/* Our Story Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons
                name="crown"
                size={20}
                color={theme.accentGold}
              />
              <Text style={styles.cardTitle}>THE AWADHI ROYAL LEGACY</Text>
            </View>

            <Text style={styles.paragraph}>{restaurantInfo.story}</Text>

            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>
                "In our kitchen, time is the secret spice. Slow steam, sealed
                handis and charcoal warmth preserve the authentic fragrance of
                Lucknow's Nawabi darbars."
              </Text>
            </View>
          </View>

          {/* Pillars of Culinary Excellence */}
          <View style={styles.card}>
            <Text style={styles.pillarsHeader}>THE FOUR PILLARS OF OUR KITCHEN</Text>

            <View style={styles.pillarItem}>
              <View style={styles.pillarIcon}>
                <MaterialCommunityIcons name="pot-steam" size={22} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pillarTitle}>1. True Dum Pukht Slow-Cooking</Text>
                <Text style={styles.pillarDesc}>
                  Slow cooked in sealed clay handis with purdah of wheat dough,
                  trapping aroma and natural juices.
                </Text>
              </View>
            </View>

            <View style={styles.pillarItem}>
              <View style={styles.pillarIcon}>
                <MaterialCommunityIcons name="grain" size={22} color={theme.accentGold} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pillarTitle}>2. Aged Royal Basmati & Pure Ghee</Text>
                <Text style={styles.pillarDesc}>
                  Extra-long grain basmati aged over 2 years, cooked in pure desi
                  ghee and whole aromatic spices.
                </Text>
              </View>
            </View>

            <View style={styles.pillarItem}>
              <View style={styles.pillarIcon}>
                <MaterialCommunityIcons name="fire" size={22} color={Colors.spicyRed} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pillarTitle}>3. Live Charcoal Clay Oven Tandoor</Text>
                <Text style={styles.pillarDesc}>
                  Galauti kebabs and tikkas seared over natural coal fire for that
                  signature melt-in-mouth texture.
                </Text>
              </View>
            </View>

            <View style={styles.pillarItem}>
              <View style={styles.pillarIcon}>
                <MaterialCommunityIcons name="shield-check" size={22} color={Colors.vegGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pillarTitle}>4. 100% Fresh Daily Preparation</Text>
                <Text style={styles.pillarDesc}>
                  No frozen gravies or reused marinades. Freshly prepped every
                  morning starting at 6:00 AM.
                </Text>
              </View>
            </View>
          </View>

          {/* Verified Lucknow Location & Timings */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="location" size={18} color={theme.primary} />
              <Text style={styles.cardTitle}>VISIT OUR LUCKNOW KITCHEN</Text>
            </View>

            <Text style={styles.locationMain}>
              {restaurantInfo.address}, {restaurantInfo.area}
            </Text>
            <Text style={styles.locationSub}>
              {restaurantInfo.city} - {restaurantInfo.pincode} (Opp. Shakuntalam Hotel)
            </Text>

            <View style={styles.timingRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.primary} />
              <Text style={styles.timingText}>
                Daily: {restaurantInfo.openingHours} • All 7 Days
              </Text>
            </View>

            <View style={styles.timingRow}>
              <Ionicons name="call-outline" size={16} color={theme.primary} />
              <Text style={styles.timingText}>Kitchen Direct: {restaurantInfo.phone}</Text>
            </View>
          </View>

          {/* Explore Menu CTA */}
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push('/explore' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>Explore the Royal Menu</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: 14,
  },
  heroBanner: {
    height: 190,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.md,
  },
  heroBg: {
    ...StyleSheet.absoluteFill,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.sm,
  },
  logoImg: {
    width: 44,
    height: 44,
  },
  heroTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.warmCream,
    letterSpacing: 0.5,
  },
  heroTagline: {
    fontSize: Typography.sizes.xs,
    color: Colors.goldLight,
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
  },
  paragraph: {
    fontSize: Typography.sizes.sm,
    color: Palette.text.primary,
    lineHeight: 22,
  },
  quoteBox: {
    backgroundColor: Palette.primarySoft,
    borderLeftWidth: 3,
    borderLeftColor: Palette.primary,
    padding: 12,
    borderRadius: 14,
    marginTop: 14,
  },
  quoteText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  pillarsHeader: {
    fontSize: 11,
    fontWeight: Typography.weights.extraBold,
    color: Palette.text.secondary,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  pillarItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  pillarIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  pillarTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  pillarDesc: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    lineHeight: 16,
    marginTop: 2,
  },
  locationMain: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Palette.text.primary,
  },
  locationSub: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.secondary,
    marginTop: 2,
    marginBottom: 12,
  },
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  timingText: {
    fontSize: Typography.sizes.xs,
    color: Palette.text.primary,
    fontWeight: Typography.weights.medium,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginTop: 6,
    ...Shadows.md,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
});
