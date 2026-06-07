import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ImageBackground, Modal } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  
  const [menuAberto, setMenuAberto] = useState(false);
  const [quizExpandido, setQuizExpandido] = useState(false);

  const temasQuiz = [
    { titulo: 'Gastronomia' },
    { titulo: 'Pontos Turísticos' },
    { titulo: 'História das Copas' },
    { titulo: 'Adivinhe o Jogador' },
    { titulo: 'Bandeiras' },
  ];

  const navegarPara = (rota: string) => {
    setMenuAberto(false);
    setQuizExpandido(false);
    router.push(rota as any);
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background.jpg')} 
      style={styles.backgroundImage}
      blurRadius={12} 
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setMenuAberto(true)} style={{ marginRight: 15 }}>
              <Ionicons name="menu" size={34} color="#E0B953" />
            </TouchableOpacity>
            <View>
              <Text style={styles.greeting}>Rumo ao Mundial,</Text>
              <Text style={styles.headerTitle}>COPA MANIA</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => router.push('/profile' as any)}>
            <FontAwesome5 name="user-alt" size={18} color="#0B101E" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionContainer}>
            <View style={styles.heroCard}>
              <View style={styles.heroContent}>
                <View style={styles.heroTextSection}>
                  <View style={styles.badge}><Text style={styles.badgeText}>COPA DO MUNDO 2026</Text></View>
                  <Text style={styles.heroTitle}>Meu Álbum</Text>
                  <Text style={styles.heroSubtitle}>Colecione os astros e as seleções da América do Norte.</Text>
                </View>
                <View style={styles.heroIconWrapper}><FontAwesome5 name="book" size={32} color="#E0B953" /></View>
              </View>
              <TouchableOpacity style={styles.heroButton} onPress={() => router.push('/abrir_album' as any)}>
                <Text style={styles.heroButtonText}>Abrir Álbum</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeaderTitle}>Aquecimento 2026</Text>
            
            <View style={styles.grid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/quiz' as any)}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(224, 185, 83, 0.15)' }]}>
                  <MaterialCommunityIcons name="trophy-award" size={24} color="#E0B953" />
                </View>
                <Text style={styles.cardTitle}>Quiz da Copa</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/loja' as any)}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(17, 139, 68, 0.15)' }]}>
                  <FontAwesome5 name="shopping-cart" size={20} color="#118B44" />
                </View>
                <Text style={styles.cardTitle}>Comprar Pacotes</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.fullWidthCard} activeOpacity={0.8} onPress={() => router.push('/copa2026' as any)}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(224, 185, 83, 0.15)', marginBottom: 0, marginRight: 16 }]}>
                <Ionicons name="map" size={24} color="#E0B953" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Explorar Copa 2026</Text>
                <Text style={{ color: '#B0C4DE', fontSize: 12, marginTop: 4 }}>Estádios, Sedes, Mascotes e Seleções</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#E0B953" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.fullWidthCard} activeOpacity={0.8} onPress={() => router.push('/historico' as any)}>
              <View style={[styles.iconBox, { backgroundColor: 'rgba(17, 139, 68, 0.15)', marginBottom: 0, marginRight: 16 }]}>
                <Ionicons name="time-outline" size={24} color="#118B44" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Histórico das Copas</Text>
                <Text style={{ color: '#B0C4DE', fontSize: 12, marginTop: 4 }}>Relembre os campeões e momentos marcantes.</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#118B44" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal visible={menuAberto} transparent animationType="fade">
        <View style={styles.menuOverlay}>
          <View style={styles.menuLateral}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderTitle}>MENU</Text>
              <TouchableOpacity onPress={() => setMenuAberto(false)}>
                <Ionicons name="close" size={30} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.menuLinks}>
              <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/abrir_album')}>
                <FontAwesome5 name="book-open" size={20} color="#E0B953" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Meu Álbum</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/loja')}>
                <FontAwesome5 name="store" size={20} color="#E0B953" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Loja de Pacotinhos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => setQuizExpandido(!quizExpandido)}>
                <MaterialCommunityIcons name="comment-question" size={24} color="#E0B953" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Quiz da Copa</Text>
                <Ionicons name={quizExpandido ? "chevron-up" : "chevron-down"} size={20} color="#E0B953" style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
              {quizExpandido && temasQuiz.map((tema, index) => (
                <TouchableOpacity key={index} style={[styles.menuItem, { paddingLeft: 60, paddingVertical: 12 }]} onPress={() => navegarPara('/quiz')}>
                  <Text style={{ color: '#B0C4DE', fontSize: 14 }}>{tema.titulo}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/copa2026')}>
                <Ionicons name="map" size={24} color="#E0B953" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Guia Copa 2026</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/historico')}>
                <Ionicons name="time" size={24} color="#E0B953" style={styles.menuIcon} />
                <Text style={styles.menuItemText}>Histórico das Copas</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.menuItem} onPress={() => navegarPara('/sobre')}>
                <Ionicons name="information-circle" size={24} color="#B0C4DE" style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { color: '#B0C4DE' }]}>Sobre o Projeto</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.menuCloseArea} onPress={() => { setMenuAberto(false); setQuizExpandido(false); }} />
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.75)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  greeting: { color: '#B0C4DE', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  headerTitle: { color: '#E0B953', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  avatarContainer: { width: 45, height: 45, backgroundColor: '#E0B953', borderRadius: 25, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1A2235' },
  scrollContent: { paddingBottom: 40 },
  sectionContainer: { marginBottom: 24, paddingHorizontal: 24 },
  sectionHeaderTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 16, letterSpacing: 0.5 },
  heroCard: { backgroundColor: 'rgba(25, 45, 80, 0.95)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)', overflow: 'hidden', elevation: 5 },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', padding: 24 },
  heroTextSection: { flex: 1, paddingRight: 15 },
  badge: { backgroundColor: 'rgba(224, 185, 83, 0.15)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginBottom: 12 },
  badgeText: { color: '#E0B953', fontSize: 10, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  heroSubtitle: { color: '#B0C4DE', fontSize: 13, lineHeight: 20 },
  heroIconWrapper: { width: 70, height: 70, backgroundColor: 'rgba(224, 185, 83, 0.08)', borderRadius: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },
  heroButton: { backgroundColor: '#0C6B33', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18 },
  heroButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1, marginRight: 10 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  actionCard: { width: '47%', backgroundColor: 'rgba(25, 45, 80, 0.7)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  fullWidthCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  menuOverlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.6)' },
  menuCloseArea: { flex: 1 }, 
  menuLateral: { width: '75%', backgroundColor: '#0A132B', height: '100%', padding: 25, paddingTop: 60, borderRightWidth: 1, borderRightColor: 'rgba(224, 185, 83, 0.3)' },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 20, marginBottom: 20 },
  menuHeaderTitle: { color: '#E0B953', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  menuLinks: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  menuIcon: { width: 30, textAlign: 'center', marginRight: 15 },
  menuItemText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  menuDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 }
});