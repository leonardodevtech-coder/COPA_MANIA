import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import quizData from '../data/quiz.json';
import { getUser } from '../lib/album';
import { useAcessibilidade } from '../lib/acessibilidade';

const temas = (quizData as any).temas as {
  id: string; titulo: string; icon: string; iconLib: string; color: string; perguntas: any[];
}[];

export default function QuizScreen() {
  const router = useRouter();
  const { altoContraste: hc } = useAcessibilidade();
  const [medalhas, setMedalhas] = useState(0);
  const [tacas, setTacas] = useState(0);

  useFocusEffect(
    useCallback(() => {
      getUser().then((u) => {
        setMedalhas(u.medalhas);
        setTacas(u.tacas);
      });
    }, [])
  );

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.backgroundImage}
      blurRadius={12}
    >
      <View style={[styles.overlay, hc && styles.overlayHC]}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quiz da Copa</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Saldo de recompensas */}
        <View style={styles.saldoRow}>
          <View style={styles.saldoBox}>
            <FontAwesome5 name="medal" size={18} color="#E0B953" />
            <Text style={styles.saldoText}>{medalhas} medalhas</Text>
          </View>
          <View style={styles.saldoBox}>
            <FontAwesome5 name="trophy" size={18} color="#E0B953" />
            <Text style={styles.saldoText}>{tacas} taças</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.subTitle}>Cada acerto vale 1 medalha. Acerte um tema inteiro (100%) e ganhe uma taça!</Text>

          <View style={styles.grid}>
            {temas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(`/quiz-jogar?modo=tema&tema=${item.id}` as any)}
              >
                <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
                  {item.iconLib === 'fa5' ? (
                    <FontAwesome5 name={item.icon as any} size={28} color={item.color} />
                  ) : (
                    <MaterialCommunityIcons name={item.icon as any} size={30} color={item.color} />
                  )}
                </View>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <Text style={styles.cardSub}>{item.perguntas.length} perguntas</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quiz Completo — vale taça */}
          <TouchableOpacity
            style={styles.fullQuizBtn}
            activeOpacity={0.9}
            onPress={() => router.push('/quiz-jogar?modo=completo' as any)}
          >
            <FontAwesome5 name="trophy" size={22} color="#0B101E" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.fullQuizTitle}>Quiz Completo</Text>
              <Text style={styles.fullQuizSub}>Acerte 100% e ganhe uma taça da Copa!</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.85)', padding: 20 },
  overlayHC: { backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#E0B953', letterSpacing: 1 },

  saldoRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 20 },
  saldoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(25, 45, 80, 0.9)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  saldoText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  subTitle: { color: '#B0C4DE', fontSize: 16, marginBottom: 20, textAlign: 'center' },
  listContainer: { paddingBottom: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    marginBottom: 14,
    backgroundColor: 'rgba(25, 45, 80, 0.9)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224, 185, 83, 0.2)'
  },
  iconBox: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  cardTitle: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  cardSub: { color: '#8FA3C0', fontSize: 11, marginTop: 4 },

  fullQuizBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0B953', padding: 18, borderRadius: 20, marginTop: 10 },
  fullQuizTitle: { color: '#0B101E', fontSize: 16, fontWeight: '900' },
  fullQuizSub: { color: '#3a3320', fontSize: 12, marginTop: 2 }
});
