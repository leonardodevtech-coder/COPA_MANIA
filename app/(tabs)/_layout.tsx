import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: '#E0B953', 
        tabBarInactiveTintColor: '#888', 
        tabBarStyle: {
          backgroundColor: '#131A2F', 
          borderTopColor: '#1E2538', 
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        }
      }}>
      
      {/* TELAS ESCONDIDAS */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="cadastro" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />

      {/* TELAS DO MENU INFERIOR */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="abrir_album" 
        options={{
          title: 'Álbum',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lendas"
        options={{
          title: 'Lendas',
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
  name="copa2026"
  options={{
    title: 'Copa 2026',
    tabBarIcon: ({ color }) => <Ionicons name="map" size={24} color={color} />,
  }}
/>
    </Tabs>
  );
}