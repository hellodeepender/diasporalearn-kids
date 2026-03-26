import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { LocaleProvider } from "../lib/locale";
import { preloadSounds } from "../lib/sounds";
import { initSpeech } from "../lib/speech";
import ErrorBoundary from "../components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    preloadSounds();
    initSpeech();
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocaleProvider>
        <StatusBar style="dark" />
        <ErrorBoundary>
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="alphabet" />
            <Stack.Screen name="progress" />
            <Stack.Screen name="games" />
          </Stack>
        </ErrorBoundary>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}
