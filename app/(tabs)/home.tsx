import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../../assets/images/background.jpg')} 
      style={styles.backgroundImage}
      blurRadius={12} 
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Rumo ao Mundial,</Text>
            <Text style={styles.headerTitle}>COPA MANIA</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <FontAwesome5 name="user-alt" size={18} color="#0B101E" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroTextSection}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>COPA DO MUNDO 2026</Text>
                </View>
                <Text style={styles.heroTitle}>Meu Álbum</Text>
                <Text style={styles.heroSubtitle}>Colecione os astros e as seleções da América do Norte.</Text>
              </View>
              <View style={styles.heroIconWrapper}>
                <FontAwesome5 name="book" size={38} color="#E0B953" />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.heroButton}
              activeOpacity={0.8}
              onPress={() => router.push('/album' as any)}
            >
              <Text style={styles.heroButtonText}>ABRIR PACOTINHOS</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aquecimento 2026</Text>
          </View>

          <View style={styles.grid}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={styles.cardTopRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(224, 185, 83, 0.12)' }]}>
                  <MaterialCommunityIcons name="trophy-award" size={24} color="#E0B953" />
                </View>
              </View>
              <Text style={styles.cardTitle}>Sedes & Estádios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <View style={styles.cardTopRow}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(17, 139, 68, 0.15)' }]}>
                  <FontAwesome5 name="user-secret" size={20} color="#118B44" />
                </View>
              </View>
              <Text style={styles.cardTitle}>Quem é a Lenda?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.75)' }, // O Azul perfeito
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  greeting: { color: '#B0C4DE', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  headerTitle: { color: '#E0B953', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  avatarContainer: { width: 45, height: 45, backgroundColor: '#E0B953', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1A2235' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  heroCard: { backgroundColor: 'rgba(25, 45, 80, 0.9)', borderRadius: 24, marginTop: 10, marginBottom: 35, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.25)', overflow: 'hidden' },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 24 },
  heroTextSection: { flex: 1, paddingRight: 15 },
  badge: { backgroundColor: 'rgba(224, 185, 83, 0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginBottom: 12 },
  badgeText: { color: '#E0B953', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  heroSubtitle: { color: '#B0C4DE', fontSize: 13, lineHeight: 20 },
  heroIconWrapper: { width: 70, height: 70, backgroundColor: 'rgba(224, 185, 83, 0.08)', borderRadius: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },
  heroButton: { backgroundColor: '#0C6B33', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18 },
  heroButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1, marginRight: 10 },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { width: '48%', backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cardTopRow: { marginBottom: 16 },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }
});