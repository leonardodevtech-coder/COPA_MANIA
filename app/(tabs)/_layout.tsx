import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useAcessibilidade } from '../../lib/acessibilidade';

export default function TabLayout() {
  const { altoContraste: hc } = useAcessibilidade();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: hc ? '#FFD400' : '#118B44',
        tabBarInactiveTintColor: hc ? '#FFFFFF' : '#888',
        tabBarLabelStyle: {
          fontSize: hc ? 12 : 11,
          fontWeight: hc ? '900' : '600',
        },
        tabBarStyle: {
          backgroundColor: hc ? '#000000' : '#131A2F',
          borderTopColor: hc ? '#FFD400' : '#1E2538',
          borderTopWidth: hc ? 2 : StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
        }
      }}>

      {/* TELAS ESCONDIDAS (O Histórico foi movido para cá com href: null) */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="cadastro" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="historico" options={{ href: null }} />

      {/* 1. INÍCIO */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />

      {/* 2. COPA 2026 (botão flutuante central) */}
      <Tabs.Screen
        name="copa2026"
        options={{
          tabBarLabel: 'Copa 2026',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.botaoFlutuante, focused && styles.botaoFlutuanteAtivo]}>
              <FontAwesome5 name="trophy" size={22} color={focused ? "#118B44" : "#1a2a1a"} />
            </View>
          ),
        }}
      />

      {/* 3. ÁLBUM */}
      <Tabs.Screen
        name="abrir_album"
        options={{
          title: 'Álbum',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />

      {/* 4. LENDAS */}
      <Tabs.Screen
        name="lendas"
        options={{
          title: 'Lendas',
          tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  botaoFlutuante: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0B953',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    borderWidth: 4,
    borderColor: '#131A2F',
    elevation: 5,
  },
  botaoFlutuanteAtivo: {
    backgroundColor: '#FFF',
  }
});
