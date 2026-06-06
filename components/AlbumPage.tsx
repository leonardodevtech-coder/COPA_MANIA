import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

interface SelecaoProps {
  selecao: {
    id: number;
    nome: string;
    grupo: string;
    cores: { principal: string; secundaria: string; texto: string };
    jogadores: string[];
  };
}

export default function AlbumPage({ selecao }: SelecaoProps) {
  // Cores dinâmicas vindas do JSON
  const { principal, secundaria, texto } = selecao.cores;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* CABEÇALHO DA PÁGINA COM AS CORES DA SELEÇÃO */}
      <View style={[styles.headerBanner, { backgroundColor: principal }]}>
        <Text style={[styles.headerTitle, { color: texto }]}>{selecao.nome}</Text>
        
        <View style={styles.headerInfo}>
          <View style={[styles.badge, { backgroundColor: texto }]}>
            <Text style={[styles.badgeText, { color: principal }]}>Grupo {selecao.grupo}</Text>
          </View>

          {/* Botão para a tela de Detalhes que fizemos antes */}
          <Link href={{ pathname: "/details", params: { id: selecao.id } }} asChild>
            <TouchableOpacity style={[styles.detailsBtn, { backgroundColor: secundaria }]}>
              <Text style={styles.detailsBtnText}>História da Seleção</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* ÁREA DE COLAR AS FIGURINHAS */}
      <View style={styles.albumArea}>
        <Text style={[styles.sectionTitle, { color: principal }]}>Elenco Oficial</Text>
        
        <View style={styles.grid}>
          {selecao.jogadores.map((jogador: string, index: number) => (
            // O espaço vazio da figurinha ganha a cor da seleção na borda
            <View key={index} style={[styles.stickerSlot, { borderColor: principal }]}>
              
              {/* Número da figurinha */}
              <View style={[styles.stickerNumberBox, { backgroundColor: principal }]}>
                <Text style={[styles.stickerNumber, { color: texto }]}>{index + 1}</Text>
              </View>

              {/* Silhueta do jogador (marca d'água) */}
              <FontAwesome5 name="user-alt" size={40} color={principal + '20'} style={styles.silhouette} />
              
              {/* Nome do Jogador */}
              <Text style={styles.playerName} numberOfLines={2}>{jogador}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F9', marginHorizontal: 10, borderRadius: 15, overflow: 'hidden', elevation: 3, marginBottom: 20, marginTop: 10 },
  
  // Header
  headerBanner: { padding: 25, borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: 32, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 15 },
  headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  detailsBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, elevation: 2 },
  detailsBtnText: { fontSize: 13, fontWeight: 'bold', color: '#111' },

  // Album Area
  albumArea: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase' },
  
  // Grid de Figurinhas
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // Espaço da Figurinha Vazia
  stickerSlot: { 
    width: '31%', // Permite 3 figurinhas por linha
    aspectRatio: 0.7, // Proporção exata de uma figurinha retangular
    backgroundColor: '#E8ECEF', 
    borderRadius: 5, 
    borderWidth: 2, 
    borderStyle: 'dashed', // Estilo tracejado indicando "cole aqui"
    marginBottom: 15, 
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative'
  },
  stickerNumberBox: { position: 'absolute', top: 5, left: 5, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  stickerNumber: { fontSize: 10, fontWeight: 'bold' },
  silhouette: { position: 'absolute', top: '35%' },
  playerName: { fontSize: 11, fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: 'auto', marginBottom: 5 }
});