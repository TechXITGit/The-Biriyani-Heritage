import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Palette, Typography, BorderRadius, Shadows } from '@/constants/theme';
import { useUserStore } from '@/store/userStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashOverlayProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashOverlay: React.FC<SplashOverlayProps> = ({
  onFinish,
  durationMs = 5000,
}) => {
  const [visible, setVisible] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected'>('detecting');
  const [detectedCity, setDetectedCity] = useState('Detecting...');
  const [detectedArea, setDetectedArea] = useState('Locating nearest royal kitchen...');

  const selectedAddress = useUserStore((state) => state.getSelectedAddress());
  const setCurrentLocationAddress = useUserStore((state) => state.setCurrentLocationAddress);

  // Master exit animations
  const masterOpacity = useSharedValue(1);
  const masterScale = useSharedValue(1);

  // Location Entrance & Pulse
  const locationTranslateY = useSharedValue(-40);
  const locationOpacity = useSharedValue(0);
  const detectingPulse = useSharedValue(1);
  const radarRotation = useSharedValue(0);
  const detectedFade = useSharedValue(0);
  const detectedScale = useSharedValue(0.85);

  // Center Emblem Entrance
  const emblemScale = useSharedValue(0.7);
  const emblemOpacity = useSharedValue(0);

  // Typography Entrance
  const textTranslateY = useSharedValue(30);
  const textOpacity = useSharedValue(0);

  // Bottom Branding & Progress
  const bottomOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  // Floating Particles
  const petal1Y = useSharedValue(0);
  const petal1Rotate = useSharedValue(0);
  const petal2Y = useSharedValue(0);
  const petal2Rotate = useSharedValue(0);
  const cashew1Y = useSharedValue(0);
  const cashew2Y = useSharedValue(0);

  const auraPulse = useSharedValue(1);

  const hideOverlay = () => {
    setVisible(false);
    if (onFinish) onFinish();
  };

  // 1. Live Location Detection Lifecycle
  useEffect(() => {
    let isMounted = true;

    // Start radar rotation & pulse for detecting state
    detectingPulse.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.92, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    radarRotation.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.linear }),
      -1,
      false
    );

    const performLocationDetection = async () => {
      try {
        // Enforce a 1400ms race timeout so the splash screen never stalls
        const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
          setTimeout(() => resolve({ timeout: true }), 1400)
        );

        const fetchPromise = (async () => {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return null;

            const position = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });

            const reverse = await Location.reverseGeocodeAsync({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });

            return { reverse, coords: position.coords };
          } catch (err) {
            return null;
          }
        })();

        const result = await Promise.race([fetchPromise, timeoutPromise]);

        if (!isMounted) return;

        if (result && !('timeout' in result) && result.reverse && result.reverse.length > 0) {
          const place = result.reverse[0];
          const area =
            place.district ||
            place.subregion ||
            place.name ||
            place.city ||
            'LDA Colony';
          const street =
            [place.streetNumber, place.street, place.name]
              .filter(Boolean)
              .join(' ') || `Near ${area}`;
          const city = place.city || 'Lucknow';
          const pin = place.postalCode || '226012';

          setCurrentLocationAddress({
            area,
            addressLine: street,
            city,
            pincode: pin,
            landmark: 'GPS Detected Live Location',
            label: 'Home',
          });

          setDetectedCity(city);
          setDetectedArea(`${area} • ${city}`);
        } else {
          // Graceful fallback to default Lucknow Heritage
          const fallbackCity = selectedAddress?.city || 'Lucknow';
          const fallbackArea = selectedAddress
            ? `${selectedAddress.area} • ${selectedAddress.city}`
            : 'Raj Bhavan Colony, The Mall Avenue • Lucknow';

          setDetectedCity(fallbackCity);
          setDetectedArea(fallbackArea);
        }
      } catch (e) {
        if (!isMounted) return;
        const fallbackCity = selectedAddress?.city || 'Lucknow';
        const fallbackArea = selectedAddress
          ? `${selectedAddress.area} • ${selectedAddress.city}`
          : 'Raj Bhavan Colony, The Mall Avenue • Lucknow';

        setDetectedCity(fallbackCity);
        setDetectedArea(fallbackArea);
      } finally {
        if (isMounted) {
          setLocationStatus('detected');
          detectedFade.value = withTiming(1, { duration: 400 });
          detectedScale.value = withSpring(1, { damping: 14, stiffness: 110 });
        }
      }
    };

    const detectTimer = setTimeout(() => {
      performLocationDetection();
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(detectTimer);
    };
  }, []);

  // 2. Entrance & Idle Ambient Animations
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    // Location badge entrance
    locationTranslateY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.back(1.4)),
    });
    locationOpacity.value = withTiming(1, { duration: 500 });

    // Centerpiece emblem entrance with spring bounce
    emblemScale.value = withSpring(1, {
      damping: 12,
      stiffness: 90,
    });
    emblemOpacity.value = withTiming(1, { duration: 700 });

    // Subtle soft pink aura glow pulse
    auraPulse.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1300, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1300, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Floating Rose Petals & Cashews
    petal1Y.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(8, { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    petal1Rotate.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-10, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    petal2Y.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(-14, { duration: 1700, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    petal2Rotate.value = withRepeat(
      withSequence(
        withTiming(-18, { duration: 1900, easing: Easing.inOut(Easing.ease) }),
        withTiming(12, { duration: 2100, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    cashew1Y.value = withRepeat(
      withSequence(
        withTiming(-9, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
        withTiming(9, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    cashew2Y.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(-10, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );

    // Brand Typography entrance
    textTranslateY.value = withDelay(
      350,
      withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) })
    );
    textOpacity.value = withDelay(350, withTiming(1, { duration: 600 }));

    // Bottom Branding & Progress Bar
    bottomOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    progressWidth.value = withTiming(100, {
      duration: durationMs - 500,
      easing: Easing.inOut(Easing.quad),
    });

    // Auto-dismiss transition into app after durationMs
    const timer = setTimeout(() => {
      masterScale.value = withTiming(1.08, {
        duration: 450,
        easing: Easing.in(Easing.cubic),
      });
      masterOpacity.value = withTiming(
        0,
        { duration: 450, easing: Easing.out(Easing.ease) },
        (finished) => {
          if (finished) {
            runOnJS(hideOverlay)();
          }
        }
      );
    }, durationMs);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    masterOpacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(hideOverlay)();
      }
    });
  };

  // Animated Styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: masterOpacity.value,
    transform: [{ scale: masterScale.value }],
  }));

  const locationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: locationTranslateY.value }],
    opacity: locationOpacity.value,
  }));

  const detectingIconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: detectingPulse.value },
      { rotateZ: `${radarRotation.value}deg` },
    ],
  }));

  const detectedWrapperStyle = useAnimatedStyle(() => ({
    opacity: detectedFade.value,
    transform: [{ scale: detectedScale.value }],
  }));

  const emblemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emblemScale.value }],
    opacity: emblemOpacity.value,
  }));

  const auraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: auraPulse.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const bottomStyle = useAnimatedStyle(() => ({
    opacity: bottomOpacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const petal1Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: petal1Y.value },
      { rotateZ: `${petal1Rotate.value}deg` },
    ],
  }));

  const petal2Style = useAnimatedStyle(() => ({
    transform: [
      { translateY: petal2Y.value },
      { rotateZ: `${petal2Rotate.value}deg` },
    ],
  }));

  const cashew1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: cashew1Y.value }, { rotateZ: '-12deg' }],
  }));

  const cashew2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: cashew2Y.value }, { rotateZ: '22deg' }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]} pointerEvents="box-none">
      <Pressable style={styles.pressableBackdrop} onPress={handleSkip}>
        {/* Soft Warm Background (#FFF8F5 with subtle Pink Soft wash) */}
        <LinearGradient
          colors={['#FFFFFF', '#FFF8F5', '#FCE8F0', '#FFF8F5']}
          locations={[0, 0.4, 0.75, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* Ambient Soft Pink Glow in Center */}
        <Animated.View style={[styles.ambientGlow, auraStyle]} />

        {/* ========================================================= */}
        {/* TOP SECTION: Dynamic Live Location Detection Header */}
        {/* ========================================================= */}
        <Animated.View style={[styles.topLocationContainer, locationStyle]}>
          {locationStatus === 'detecting' ? (
            // STAGE 1: Detecting Location State (Pulsing Radar & Status)
            <View style={styles.detectingBox}>
              <Animated.View style={[styles.detectingIconWrapper, detectingIconStyle]}>
                <Ionicons name="compass-outline" size={24} color={Palette.primary} />
              </Animated.View>
              <View style={styles.detectingPill}>
                <View style={styles.pulseDot} />
                <Text style={styles.detectingTitleText}>DETECTING YOUR LOCATION...</Text>
              </View>
              <Text style={styles.detectingSubText}>
                Connecting to nearest Royal Awadhi Kitchen
              </Text>
            </View>
          ) : (
            // STAGE 2: Loaded & Detected Location State
            <Animated.View style={[styles.detectedBox, detectedWrapperStyle]}>
              <View style={styles.detectedBadgeRow}>
                <View style={styles.navIconBox}>
                  <Ionicons name="navigate" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.livePill}>
                  <View style={styles.greenLiveDot} />
                  <Text style={styles.livePillText}>LIVE LOCATION DETECTED</Text>
                </View>
              </View>

              <Text style={styles.locationCityText}>{detectedCity}</Text>
              <Text style={styles.locationSubtitleText} numberOfLines={1}>
                {detectedArea}
              </Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* ========================================================= */}
        {/* CENTER SECTION: Circle containing ONLY Biryani */}
        {/* ========================================================= */}
        <View style={styles.centerSection}>
          {/* Floating Rose Petal 1 (Top Left) */}
          <Animated.View style={[styles.floatingItem, styles.petal1, petal1Style]}>
            <Text style={styles.petalEmoji}>🌹</Text>
          </Animated.View>

          {/* Floating Cashew 1 (Left) */}
          <Animated.View style={[styles.floatingItem, styles.cashew1, cashew1Style]}>
            <Text style={styles.cashewEmoji}>🥜</Text>
          </Animated.View>

          {/* Floating Rose Petal 2 (Right) */}
          <Animated.View style={[styles.floatingItem, styles.petal2, petal2Style]}>
            <Text style={styles.petalEmoji}>🥀</Text>
          </Animated.View>

          {/* Floating Shimmer Star (Top Right) */}
          <Animated.View style={[styles.floatingItem, styles.cashew2, cashew2Style]}>
            <Text style={styles.cashewEmoji}>✨</Text>
          </Animated.View>

          {/* CIRCLE CENTERPIECE: Contains ONLY Biryani! */}
          <Animated.View style={[styles.emblemWrapper, emblemStyle]}>
            <Image
              source={require('../../assets/images/splash_biryani_circle.jpg')}
              style={styles.biryaniImage}
              contentFit="cover"
              transition={300}
            />
            {/* Elegant Pink & Gold Rim Ring */}
            <View style={styles.goldRingBorder} />
          </Animated.View>

          {/* Floating Saffron Flower (Bottom Right) */}
          <Animated.View style={[styles.floatingItem, styles.spiceItem, petal1Style]}>
            <Text style={styles.spiceEmoji}>🌺</Text>
          </Animated.View>
        </View>

        {/* ========================================================= */}
        {/* BRAND TYPOGRAPHY: The Biryani Heritage */}
        {/* ========================================================= */}
        <Animated.View style={[styles.brandSection, textStyle]}>
          {/* Royal Crown Crest in Dusty Rose Pink */}
          <View style={styles.crestRow}>
            <View style={styles.crestLine} />
            <MaterialCommunityIcons name="crown" size={24} color={Palette.primary} />
            <View style={styles.crestLine} />
          </View>

          <Text style={styles.brandTitle}>THE BIRYANI HERITAGE</Text>
          <Text style={styles.brandTagline}>ROYAL AWADHI DUM PUKHT FEASTS</Text>

          {/* Dusty Rose Pink Loading Progress Bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressStyle]} />
          </View>
        </Animated.View>

        {/* ========================================================= */}
        {/* BOTTOM BRAND FOOTER */}
        {/* ========================================================= */}
        <Animated.View style={[styles.bottomSection, bottomStyle]}>
          <Text style={styles.bottomBrandText}>AN AUTHENTIC LUCKNOW HERITAGE</Text>
          <Text style={styles.bottomTapToSkip}>Tap anywhere to enter</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 99999,
    elevation: 99999,
  },
  pressableBackdrop: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },
  ambientGlow: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.32,
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: (SCREEN_WIDTH * 0.85) / 2,
    backgroundColor: 'rgba(227, 107, 154, 0.18)', // Soft pink ambient glow
    alignSelf: 'center',
    ...Platform.select({
      web: { filter: 'blur(50px)' as any },
    }),
  },

  // Top Location Section
  topLocationContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
    minHeight: 90,
    justifyContent: 'center',
  },

  // Detecting State
  detectingBox: {
    alignItems: 'center',
  },
  detectingIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.primarySoft, // #FCE8F0
    borderWidth: 1.5,
    borderColor: Palette.primaryLight, // #F5B4CC
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Shadows.sm,
  },
  detectingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.border, // #F0E5E9
    gap: 7,
    ...Shadows.sm,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },
  detectingTitleText: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  detectingSubText: {
    color: Palette.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 5,
    textAlign: 'center',
  },

  // Detected State
  detectedBox: {
    alignItems: 'center',
  },
  detectedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  navIconBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: Palette.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.35)',
    gap: 5,
  },
  greenLiveDot: {
    width: 5.5,
    height: 5.5,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  livePillText: {
    color: '#2E7D32',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
  },
  locationCityText: {
    color: Palette.textPrimary, // #292832
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  locationSubtitleText: {
    color: Palette.textSecondary, // #85838B
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  // Center Emblem Section - Circle Contains ONLY Biryani!
  centerSection: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  emblemWrapper: {
    width: Math.min(SCREEN_WIDTH * 0.74, 296),
    height: Math.min(SCREEN_WIDTH * 0.74, 296),
    borderRadius: Math.min(SCREEN_WIDTH * 0.74, 296) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.lg,
    borderWidth: 3.5,
    borderColor: Palette.primary, // Dusty Rose Pink border
    backgroundColor: '#FFFFFF',
  },
  biryaniImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.25 }], // Scale to show ONLY Biryani edge-to-edge
  },
  goldRingBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 200,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 180, 204, 0.45)',
  },

  // Floating Particles
  floatingItem: {
    position: 'absolute',
    zIndex: 5,
  },
  petal1: {
    top: 10,
    left: SCREEN_WIDTH * 0.11,
  },
  petal2: {
    top: 30,
    right: SCREEN_WIDTH * 0.1,
  },
  cashew1: {
    bottom: 25,
    left: SCREEN_WIDTH * 0.13,
  },
  cashew2: {
    top: -15,
    right: SCREEN_WIDTH * 0.2,
  },
  spiceItem: {
    bottom: 5,
    right: SCREEN_WIDTH * 0.13,
  },
  petalEmoji: {
    fontSize: 26,
  },
  cashewEmoji: {
    fontSize: 22,
  },
  spiceEmoji: {
    fontSize: 24,
  },

  // Brand Section
  brandSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  crestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  crestLine: {
    width: 38,
    height: 1.5,
    backgroundColor: Palette.primaryLight,
  },
  brandTitle: {
    color: Palette.textPrimary, // #292832
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  brandTagline: {
    color: Palette.primary, // #E36B9A
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginTop: 6,
    textAlign: 'center',
  },
  progressTrack: {
    width: 140,
    height: 3,
    backgroundColor: Palette.divider, // #F3E9ED
    borderRadius: 2,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Palette.primary, // #E36B9A
    borderRadius: 2,
  },

  // Bottom Section
  bottomSection: {
    alignItems: 'center',
    zIndex: 2,
  },
  bottomBrandText: {
    color: Palette.textSecondary, // #85838B
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  bottomTapToSkip: {
    color: Palette.textSecondary,
    opacity: 0.6,
    fontSize: 9.5,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});
