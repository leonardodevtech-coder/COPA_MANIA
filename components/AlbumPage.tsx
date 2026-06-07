import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons'; // Adicionado Ionicons

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
  const { principal, secundaria, texto } = selecao.cores;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* CABEÇALHO DA PÁGINA */}
      <View style={[styles.headerBanner, { backgroundColor: principal }]}>
        <Text style={[styles.headerTitle, { color: texto }]}>{selecao.nome}</Text>
        
        {/* LINHA DO HEADER (GRUPO + BOTÃO HISTÓRIA) */}
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: texto }]}>
            <Text style={[styles.badgeText, { color: principal }]}>Grupo {selecao.grupo}</Text>
          </View>

          {/* BOTÃO HISTÓRIA ESTILIZADO */}
          <Link href={{ pathname: "/details", params: { id: selecao.id } }} asChild>
            <TouchableOpacity style={[styles.historyButton, { borderColor: texto }]}>
              <Ionicons name="book-outline" size={14} color={texto} />
              <Text style={[styles.historyButtonText, { color: texto }]}>História</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {/* ÁREA DE COLAR AS FIGURINHAS */}
      <View style={styles.albumArea}>
        <Text style={[styles.sectionTitle, { color: principal }]}>Elenco Oficial</Text>
        
        <View style={styles.grid}>
          {selecao.jogadores.map((jogador: string, index: number) => (
            <View key={index} style={[styles.stickerSlot, { borderColor: principal }]}>
              <View style={[styles.stickerNumberBox, { backgroundColor: principal }]}>
                <Text style={[styles.stickerNumber, { color: texto }]}>{index + 1}</Text>
              </View>
              <FontAwesome5 name="user-alt" size={40} color={principal + '20'} style={styles.silhouette} />
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
  
  headerBanner: { padding: 25, borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  headerTitle: { fontSize: 32, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 15 },
  
  // Alinhamento do Grupo e Botão
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },

  // Botão História "Pill"
  historyButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    borderWidth: 1 
  },
  historyButtonText: { fontSize: 12, fontWeight: '600', marginLeft: 5 },

  albumArea: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  stickerSlot: { 
    width: '31%', 
    aspectRatio: 0.7, 
    backgroundColor: '#E8ECEF', 
    borderRadius: 5, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
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