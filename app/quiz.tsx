import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const temasQuiz = [
  { id: '1', titulo: 'Gastronomia', icon: 'food-fork-drink', color: '#E0B953' },
  { id: '2', titulo: 'Pontos Turísticos', icon: 'map-marker-alt', color: '#118B44' },
  { id: '3', titulo: 'História das Copas', icon: 'history', color: '#B0C4DE' },
  { id: '4', titulo: 'Adivinhe o Jogador', icon: 'user-secret', color: '#E0B953' },
  { id: '5', titulo: 'Bandeiras', icon: 'flag', color: '#118B44' },
];

export default function QuizScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
source={require('../assets/images/background.jpg')}      style={styles.backgroundImage}
      blurRadius={12} 
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz da Copa</Text>
          <View style={{ width: 28 }} />
        </View>

        <Text style={styles.subTitle}>Escolha um tema e teste seus conhecimentos:</Text>

        <FlatList
          data={temasQuiz}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.8}>
              <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
                {item.id === '3' || item.id === '4' ? (
                  <FontAwesome5 name={item.icon as any} size={28} color={item.color} />
                ) : (
                  <MaterialCommunityIcons name={item.icon as any} size={30} color={item.color} />
                )}
              </View>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.85)', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 30 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#E0B953', letterSpacing: 1 },
  subTitle: { color: '#B0C4DE', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  listContainer: { paddingBottom: 20 },
  card: { 
    flex: 1, 
    margin: 8, 
    backgroundColor: 'rgba(25, 45, 80, 0.9)', 
    padding: 20, 
    borderRadius: 20, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: 'rgba(224, 185, 83, 0.2)' 
  },
  iconBox: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }
});