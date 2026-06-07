import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import type { Figurinha } from '../lib/album';

export interface Jogador {
  nome: string;
  posicao?: string;
  altura?: string;
  peso?: string;
}

interface SelecaoProps {
  selecao: {
    id: number;
    nome: string;
    grupo: string;
    cores: { principal: string; secundaria: string; texto: string };
    jogadores: Jogador[];
  };
  figurinhas: Record<string, Figurinha>;
  onSlotPress: (key: string, jogador: Jogador) => void;
}

function Slot({
  nome,
  numero,
  fig,
  principal,
  texto,
  posicao,
  altura,
  peso,
  onPress,
}: {
  nome: string;
  numero: number;
  fig?: Figurinha;
  principal: string;
  texto: string;
  posicao?: string;
  altura?: string;
  peso?: string;
  onPress: () => void;
}) {
  const desbloqueada = !!fig;
  const temFoto = !!fig?.fotoUri;

  return (
    <TouchableOpacity
      style={[styles.stickerSlot, { borderColor: principal }]}
      activeOpacity={desbloqueada ? 0.8 : 1}
      onPress={desbloqueada ? onPress : undefined}
    >
      {/* Foto colocada pelo usuário */}
      {temFoto && (
        <Image source={{ uri: fig!.fotoUri! }} style={styles.foto} resizeMode="cover" />
      )}

      {/* Desbloqueada mas ainda sem foto: convite para adicionar */}
      {desbloqueada && !temFoto && (
        <View style={styles.addArea}>
          <Ionicons name="add-circle" size={34} color={principal} />
          <Text style={[styles.addText, { color: principal }]}>Adicionar foto</Text>
        </View>
      )}

      {/* Bloqueada: cadeado + silhueta */}
      {!desbloqueada && (
        <View style={styles.lockArea}>
          <FontAwesome5 name="user-alt" size={36} color={principal + '20'} />
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={14} color="#fff" />
          </View>
        </View>
      )}

      {/* Número */}
      <View style={[styles.stickerNumberBox, { backgroundColor: principal }]}>
        <Text style={[styles.stickerNumber, { color: texto }]}>{numero}</Text>
      </View>

      {/* Nome + atributos (ocultos enquanto bloqueada) */}
      <View style={styles.nameBar}>
        <Text style={styles.playerName} numberOfLines={1}>
          {desbloqueada ? nome : '???'}
        </Text>
        {desbloqueada && (
          <>
            {!!posicao && <Text style={styles.playerPos} numberOfLines={1}>{posicao}</Text>}
            {(!!altura || !!peso) && (
              <Text style={styles.playerStats} numberOfLines={1}>
                {[altura, peso].filter(Boolean).join(' · ')}
              </Text>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function AlbumPage({ selecao, figurinhas, onSlotPress }: SelecaoProps) {
  const router = useRouter();
  const { principal, texto } = selecao.cores;

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

          {/* Botão História estilizado (pill) — usa router.push (sem Link asChild) */}
          <TouchableOpacity
            style={[styles.historyButton, { borderColor: texto }]}
            onPress={() => router.push({ pathname: '/details', params: { id: selecao.id } })}
          >
            <Ionicons name="book-outline" size={14} color={texto} />
            <Text style={[styles.historyButtonText, { color: texto }]}>História</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ÁREA DE COLAR AS FIGURINHAS */}
      <View style={styles.albumArea}>
        <Text style={[styles.sectionTitle, { color: principal }]}>Elenco Oficial</Text>

        <View style={styles.grid}>
          {selecao.jogadores.map((jogador: Jogador, index: number) => {
            const key = `${selecao.id}:${index}`;
            return (
              <Slot
                key={key}
                nome={jogador.nome}
                numero={index + 1}
                fig={figurinhas[key]}
                principal={principal}
                texto={texto}
                posicao={jogador.posicao}
                altura={jogador.altura}
                peso={jogador.peso}
                onPress={() => onSlotPress(key, jogador)}
              />
            );
          })}
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
  historyButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  historyButtonText: { fontSize: 13, fontWeight: 'bold' },

  albumArea: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', textTransform: 'uppercase' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  stickerSlot: {
    width: '31%',
    aspectRatio: 0.7,
    backgroundColor: '#E8ECEF',
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative'
  },
  foto: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  addArea: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', padding: 4 },
  addText: { fontSize: 10, fontWeight: 'bold', textAlign: 'center', marginTop: 4 },
  lockArea: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  lockBadge: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 12, padding: 5 },

  stickerNumberBox: { position: 'absolute', top: 5, left: 5, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  stickerNumber: { fontSize: 10, fontWeight: 'bold' },
  nameBar: { width: '100%', backgroundColor: 'rgba(0,0,0,0.65)', paddingVertical: 5, paddingHorizontal: 3 },
  playerName: { fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  playerPos: { fontSize: 9, fontWeight: '700', color: '#E0B953', textAlign: 'center', marginTop: 2, textTransform: 'uppercase' },
  playerStats: { fontSize: 9, color: '#D7E3F4', textAlign: 'center', marginTop: 1 }
});
