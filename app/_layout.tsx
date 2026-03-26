import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { LocaleProvider } from "../lib/locale";
import { preloadSounds } from "../lib/sounds";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    preloadSounds();
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocaleProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="alphabet" />
          <Stack.Screen name="progress" />
        </Stack>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}
