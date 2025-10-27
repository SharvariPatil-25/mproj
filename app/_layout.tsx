
import { Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import AsyncStorage from '@react-native-async-storage/async-storage';
import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SystemBars } from "react-native-edge-to-edge";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (loaded && isLoggedIn !== null && onboardingCompleted !== null) {
      SplashScreen.hideAsync();
      
      // Navigate based on auth and onboarding status
      if (!isLoggedIn) {
        router.replace('/auth');
      } else if (!onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [loaded, isLoggedIn, onboardingCompleted]);

  const checkAuthStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('userLoggedIn');
      const onboarding = await AsyncStorage.getItem('onboardingCompleted');
      
      console.log('Auth status:', { loggedIn, onboarding });
      
      setIsLoggedIn(loggedIn === 'true');
      setOnboardingCompleted(onboarding === 'true');
    } catch (error) {
      console.log('Error checking auth status:', error);
      setIsLoggedIn(false);
      setOnboardingCompleted(false);
    }
  };

  if (!loaded || isLoggedIn === null || onboardingCompleted === null) {
    return null;
  }

  // Custom light theme for women's safety app
  const WomenSafetyTheme: Theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#FF69B4',
      background: '#F8F8F8',
      card: '#FFFFFF',
      text: '#333333',
      border: '#E5E5EA',
      notification: '#FF3B30',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={WomenSafetyTheme}>
        <SystemBars style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/index" />
          <Stack.Screen name="onboarding/index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="safety-tips" options={{ 
            title: "Safety Tips",
            headerShown: true,
            headerStyle: { backgroundColor: '#F8F8F8' },
            headerTintColor: '#333333',
          }} />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
