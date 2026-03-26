import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Locale } from "./colors";

interface LocaleContextValue {
  locale: Locale | null;
  setLocale: (l: Locale) => Promise<void>;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: null,
  setLocale: async () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("locale").then((v) => {
      if (v === "hy" || v === "el" || v === "ar") setLocaleState(v);
    });
  }, []);

  const setLocale = async (l: Locale) => {
    setLocaleState(l);
    await AsyncStorage.setItem("locale", l);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
