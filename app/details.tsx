import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Importando os dados do JSON atualizado
const dadosSelecoes = require('../data/selecoes.json');

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Busca a seleção específica pelo ID
  const selecao = dadosSelecoes.selecoes.find((s: any) => s.id.toString() === id);

  if (!selecao) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: '#333' }}>Seleção não encontrada.</Text>
      </View>
    );
  }

  // Desestruturando as cores para facilitar o uso no StyleSheet dinâmico
  const { principal, secundaria, texto } = selecao.cores;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={principal} />

      {/* CABEÇALHO COM A COR DA SELEÇÃO */}
      <View style={[styles.header, { backgroundColor: principal }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color={texto} />
        </TouchableOpacity>
        
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: texto }]}>{selecao.nome}</Text>
          <View style={[styles.badge, { backgroundColor: texto }]}>
            <Text style={[styles.badgeText, { color: principal }]}>Grupo {selecao.grupo}</Text>
          </View>
        </View>
      </View>

      {/* CORPO DA PÁGINA */}
      <View style={styles.body}>
        
        {/* Descrição e Mascote */}
        <Text style={styles.descricao}>{selecao.descricao}</Text>
        <View style={styles.mascoteRow}>
          <MaterialCommunityIcons name="cat" size={20} color={principal} />
          <Text style={styles.mascoteText}>Mascote: <Text style={{fontWeight: 'bold'}}>{selecao.mascote}</Text></Text>
        </View>

        {/* ESTATÍSTICAS RÁPIDAS (Painel) */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { borderColor: principal, borderTopWidth: 4 }]}>
            <Ionicons name="trophy" size={24} color={principal} />
            <Text style={styles.statValue}>{selecao.estatisticas.titulos}</Text>
            <Text style={styles.statLabel}>Títulos</Text>
          </View>
          <View style={[styles.statBox, { borderColor: principal, borderTopWidth: 4 }]}>
            <Ionicons name="football" size={24} color={principal} />
            <Text style={styles.statValue}>{selecao.estatisticas.vitorias}</Text>
            <Text style={styles.statLabel}>Vitórias</Text>
          </View>
          <View style={[styles.statBox, { borderColor: principal, borderTopWidth: 4 }]}>
            <FontAwesome5 name="user-tie" size={20} color={principal} />
            <Text style={[styles.statValue, { fontSize: 13, marginTop: 4 }]} numberOfLines={1}>
              {selecao.tecnico}
            </Text>
            <Text style={styles.statLabel}>Técnico</Text>
          </View>
        </View>

        {/* CARDS DE INFORMAÇÃO */}
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="book-open-page-variant" size={24} color={principal} />
            <Text style={[styles.cardTitle, { color: principal }]}>História nas Copas</Text>
          </View>
          <Text style={styles.text}>{selecao.informacoesHistoricas}</Text>
          
          <View style={[styles.curiosityBox, { backgroundColor: principal + '15', borderLeftColor: principal }]}>
            <Ionicons name="bulb-outline" size={20} color={principal} style={{marginRight: 10}} />
            <Text style={[styles.curiosityText, { color: '#333' }]}>{selecao.curiosidades}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="earth" size={24} color={principal} />
            <Text style={[styles.cardTitle, { color: principal }]}>Cultura & Sociedade</Text>
          </View>
          <Text style={styles.text}>{selecao.cultura}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="restaurant" size={24} color={principal} />
            <Text style={[styles.cardTitle, { color: principal }]}>Gastronomia Típica</Text>
          </View>
          <Text style={styles.text}>{selecao.gastronomia}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="camera" size={24} color={principal} />
            <Text style={[styles.cardTitle, { color: principal }]}>Pontos Turísticos</Text>
          </View>
          <Text style={styles.text}>{selecao.pontosTuristicos}</Text>
        </View>

        {/* JOGADORES DESTAQUE (Gerado via Map) */}
        <View style={[styles.card, { marginBottom: 40 }]}>
          <View style={styles.cardHeader}>
            <FontAwesome5 name="users" size={20} color={principal} />
            <Text style={[styles.cardTitle, { color: principal }]}>Craques Destaque</Text>
          </View>
          <View style={styles.playersContainer}>
            {selecao.jogadores.map((jogador: string, index: number) => (
              <View key={index} style={[styles.playerTag, { backgroundColor: principal }]}>
                <Ionicons name="star" size={12} color={secundaria} style={{marginRight: 5}} />
                <Text style={[styles.playerText, { color: texto }]}>{jogador}</Text>
              </View>
            ))}
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header Styles
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10 },
  headerTextContainer: { alignItems: 'center', marginTop: 10 },
  title: { fontSize: 32, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 8 },
  badgeText: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },

  // Body Styles
  body: { paddingHorizontal: 20, paddingTop: 25 },
  descricao: { fontSize: 16, lineHeight: 24, color: '#444', textAlign: 'center', fontStyle: 'italic', marginBottom: 10 },
  mascoteRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  mascoteText: { fontSize: 14, color: '#555', marginLeft: 6 },

  // Stats Box
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { flex: 1, backgroundColor: '#fff', marginHorizontal: 5, paddingVertical: 15, borderRadius: 15, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#222', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2, textTransform: 'uppercase' },

  // Cards Content
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  text: { fontSize: 15, lineHeight: 24, color: '#444', textAlign: 'justify' },
  
  // Curiosidades Callout
  curiosityBox: { flexDirection: 'row', marginTop: 15, padding: 15, borderRadius: 10, borderLeftWidth: 4 },
  curiosityText: { flex: 1, fontSize: 14, lineHeight: 20, fontStyle: 'italic' },

  // Tags Jogadores
  playersContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  playerTag: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, margin: 5 },
  playerText: { fontSize: 14, fontWeight: 'bold' }
});