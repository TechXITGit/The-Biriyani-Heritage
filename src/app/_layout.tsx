import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform } from 'react-native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { BottomTabBar } from '@/components/navigation/BottomTabBar';
import { Palette, Colors } from '@/constants/theme';
import { useDietStore } from '@/store/dietStore';
import '@/global.css';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const isVegOnly = useDietStore((state) => state.isVegOnly);

  useEffect(() => {
    // Hide splash screen after initialization
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <AnimatedSplashOverlay />

        <Stack
          screenOptions={{
            headerShown: false,
            animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
            contentStyle: { backgroundColor: Palette.background.main },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Home' }} />
          <Stack.Screen name="explore" options={{ title: 'Menu' }} />
          <Stack.Screen name="orders" options={{ title: 'My Orders' }} />
          <Stack.Screen name="cart" options={{ title: 'Cart' }} />
          <Stack.Screen name="profile" options={{ title: 'Profile' }} />
          <Stack.Screen name="search" options={{ title: 'Search' }} />
          <Stack.Screen
            name="dish/[id]"
            options={{
              title: 'Dish Details',
              presentation: 'card',
            }}
          />
          <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
          <Stack.Screen name="tracking/[orderId]" options={{ title: 'Track Order' }} />
          <Stack.Screen name="addresses" options={{ title: 'Saved Addresses' }} />
          <Stack.Screen name="about" options={{ title: 'About' }} />
          <Stack.Screen name="contact" options={{ title: 'Contact' }} />
        </Stack>

        {/* Global Bottom Tab Bar for Main Tabs */}
        <BottomTabBar />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background.main,
  },
});
