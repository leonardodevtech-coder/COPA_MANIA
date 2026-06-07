import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import type { Figurinha } from '../lib/album';

interface Jogador {
  nome: string;
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
  onSlotPress: (key: string, nome: string) => void;
}

function Slot({
  nome,
  numero,
  fig,
  principal,
  texto,
  onPress,
}: {
  nome: string;
  numero: number;
  fig?: Figurinha;
  principal: string;
  texto: string;
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

      {/* Nome (oculto enquanto bloqueada) */}
      <View style={styles.nameBar}>
        <Text style={styles.playerName} numberOfLines={2}>
          {desbloqueada ? nome : '???'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AlbumPage({ selecao, figurinhas, onSlotPress }: SelecaoProps) {
  const router = useRouter();
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

          <TouchableOpacity
            style={[styles.detailsBtn, { backgroundColor: secundaria }]}
            onPress={() => router.push({ pathname: '/details', params: { id: selecao.id } })}
          >
            <Text style={styles.detailsBtnText}>História da Seleção</Text>
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
                onPress={() => onSlotPress(key, jogador.nome)}
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
  headerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  detailsBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, elevation: 2 },
  detailsBtnText: { fontSize: 13, fontWeight: 'bold', color: '#111' },

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
  nameBar: { width: '100%', backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 4, paddingHorizontal: 3 },
  playerName: { fontSize: 11, fontWeight: 'bold', color: '#fff', textAlign: 'center' }
});
