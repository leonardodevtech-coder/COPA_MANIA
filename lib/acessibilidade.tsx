import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Modo de alto contraste (acessibilidade / WCAG). Estado global persistido.
const KEY = '@copamania_altocontraste';

interface Ctx {
  altoContraste: boolean;
  alternar: () => void;
}

const AcessibilidadeContext = createContext<Ctx>({ altoContraste: false, alternar: () => {} });

export function AcessibilidadeProvider({ children }: { children: React.ReactNode }) {
  const [altoContraste, setAlto] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => setAlto(v === '1')).catch(() => {});
  }, []);

  const alternar = useCallback(() => {
    setAlto((prev) => {
      const novo = !prev;
      AsyncStorage.setItem(KEY, novo ? '1' : '0').catch(() => {});
      return novo;
    });
  }, []);

  return (
    <AcessibilidadeContext.Provider value={{ altoContraste, alternar }}>
      {children}
    </AcessibilidadeContext.Provider>
  );
}

export function useAcessibilidade() {
  return useContext(AcessibilidadeContext);
}
