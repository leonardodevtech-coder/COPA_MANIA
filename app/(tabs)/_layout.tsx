import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde aquele cabeçalho feio padrão
        tabBarActiveTintColor: '#E0B953', // Cor dourada quando o botão está clicado
        tabBarInactiveTintColor: '#888', // Cor cinza quando não está clicado
        tabBarStyle: {
          backgroundColor: '#131A2F', // Azul marinho escuro do menu
          borderTopColor: '#1E2538', // Borda sutil
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        }
      }}>
      
      {/* TELAS ESCONDIDAS (O usuário navega por elas, mas não têm botão no menu) */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="cadastro" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />

      {/* TELAS DO MENU INFERIOR (O que aparece para o usuário) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      {/* Botão do Álbum (vamos deixar já pronto para a próxima etapa!) */}
      <Tabs.Screen
        name="album"
        options={{
          title: 'Álbum',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}