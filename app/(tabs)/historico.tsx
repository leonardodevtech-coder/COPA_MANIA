import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import historicoData from '../../data/historico_copas.json';

interface Copa {
  ano: number;
  sede: string;
  bandeiraSede: string;
  bandeiraSede2?: string;
  campeao: string;
  bandeiraCampeao: string;
  vice: string;
  bandeiraVice: string;
  placarFinal: string;
  finalDetalhe: string;
  terceiro: string;
  estadioFinal: string;
  cidadeFinal: string;
  publico: string;
  participantes: number;
  melhorJogador: string;
  imagemEstadio: string;
  artilheiro: string;
  destaque: string;
  curiosidade: string;
}

const COPAS = historicoData.historico as Copa[];

export default function HistoricoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico das Copas</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {COPAS.map((copa, index) => (
          <View key={index} style={styles.card}>
            {/* Banner: estádio da final */}
            <ImageBackground source={{ uri: copa.imagemEstadio }} style={styles.banner} imageStyle={styles.bannerImg}>
              <View style={styles.bannerOverlay}>
                <View style={styles.anoBadge}>
                  <Text style={styles.anoText}>{copa.ano}</Text>
                </View>
                <View style={styles.sedeRow}>
                  <Image source={{ uri: copa.bandeiraSede }} style={styles.sedeFlag} />
                  {copa.bandeiraSede2 && (
                    <Image source={{ uri: copa.bandeiraSede2 }} style={styles.sedeFlag} />
                  )}
                  <Text style={styles.sedeText}>{copa.sede}</Text>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.body}>
              {/* Confronto da final */}
              <Text style={styles.blocoLabel}>A GRANDE FINAL</Text>
              <View style={styles.finalRow}>
                <View style={styles.timeBox}>
                  <Image source={{ uri: copa.bandeiraCampeao }} style={styles.timeFlag} />
                  <Text style={styles.timeNome} numberOfLines={1}>{copa.campeao}</Text>
                  <View style={styles.champTag}>
                    <FontAwesome5 name="trophy" size={10} color="#0B101E" />
                    <Text style={styles.champTagText}>Campeão</Text>
                  </View>
                </View>

                <View style={styles.placarBox}>
                  <Text style={styles.placar}>{copa.placarFinal}</Text>
                  <Text style={styles.vsText}>x</Text>
                </View>

                <View style={styles.timeBox}>
                  <Image source={{ uri: copa.bandeiraVice }} style={[styles.timeFlag, styles.viceFlag]} />
                  <Text style={[styles.timeNome, { color: '#B0C4DE' }]} numberOfLines={1}>{copa.vice}</Text>
                  <Text style={styles.viceTag}>Vice</Text>
                </View>
              </View>
              <Text style={styles.finalDetalhe}>{copa.finalDetalhe}</Text>

              <View style={styles.terceiroRow}>
                <FontAwesome5 name="medal" size={12} color="#CD7F32" />
                <Text style={styles.terceiroText}>3º lugar: <Text style={styles.terceiroNome}>{copa.terceiro}</Text></Text>
              </View>

              {/* Infos do estádio / público / dados */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Ionicons name="business" size={15} color="#E0B953" />
                  <Text style={styles.infoText}>{copa.estadioFinal} · {copa.cidadeFinal}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="people" size={15} color="#E0B953" />
                  <Text style={styles.infoText}>{copa.publico} torcedores na final</Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="futbol" size={13} color="#E0B953" />
                  <Text style={styles.infoText}>Artilheiro: {copa.artilheiro}</Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="star" size={13} color="#E0B953" />
                  <Text style={styles.infoText}>Melhor jogador: {copa.melhorJogador}</Text>
                </View>
                <View style={styles.infoItem}>
                  <FontAwesome5 name="flag" size={13} color="#E0B953" />
                  <Text style={styles.infoText}>{copa.participantes} seleções participantes</Text>
                </View>
              </View>

              {/* Destaque */}
              <View style={styles.destaqueBox}>
                <Ionicons name="bulb" size={16} color="#E0B953" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.destaque}>{copa.destaque}</Text>
              </View>

              {/* Curiosidade */}
              <View style={styles.curiosidadeRow}>
                <Ionicons name="sparkles" size={14} color="#8FA3C0" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.curiosidade}>{copa.curiosidade}</Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.footer}>Próxima parada: Copa do Mundo 2026 🏆</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1E3C' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16, backgroundColor: '#131A2F' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#E0B953', fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  scroll: { padding: 16, paddingBottom: 40 },

  card: { backgroundColor: '#1A2235', borderRadius: 18, overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },

  banner: { height: 150, justifyContent: 'flex-end' },
  bannerImg: { resizeMode: 'cover' },
  bannerOverlay: { flex: 1, justifyContent: 'space-between', padding: 14, backgroundColor: 'rgba(11, 16, 30, 0.45)' },
  anoBadge: { alignSelf: 'flex-start', backgroundColor: '#E0B953', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  anoText: { color: '#0B101E', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  sedeRow: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(11, 16, 30, 0.7)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  sedeFlag: { width: 24, height: 16, borderRadius: 3, marginRight: 8 },
  sedeText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  body: { padding: 16 },
  blocoLabel: { color: '#8FA3C0', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 12, textAlign: 'center' },

  finalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeBox: { flex: 1, alignItems: 'center' },
  timeFlag: { width: 54, height: 36, borderRadius: 5, marginBottom: 8, borderWidth: 2, borderColor: '#E0B953' },
  viceFlag: { borderColor: 'rgba(255,255,255,0.2)' },
  timeNome: { color: '#FFF', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  champTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E0B953', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 6 },
  champTagText: { color: '#0B101E', fontWeight: '900', fontSize: 10 },
  viceTag: { color: '#8FA3C0', fontSize: 11, fontWeight: '600', marginTop: 6 },

  placarBox: { alignItems: 'center', paddingHorizontal: 8 },
  placar: { color: '#E0B953', fontSize: 20, fontWeight: '900' },
  vsText: { color: '#8FA3C0', fontSize: 12, marginTop: 2 },

  finalDetalhe: { color: '#B0C4DE', fontSize: 12, fontStyle: 'italic', textAlign: 'center', marginTop: 12 },

  terceiroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
  terceiroText: { color: '#8FA3C0', fontSize: 12 },
  terceiroNome: { color: '#FFF', fontWeight: 'bold' },

  infoGrid: { marginTop: 18, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 14, gap: 10 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { color: '#FFF', fontSize: 13, flex: 1 },

  destaqueBox: { flexDirection: 'row', backgroundColor: 'rgba(224, 185, 83, 0.08)', borderRadius: 12, padding: 12, marginTop: 16, borderLeftWidth: 3, borderLeftColor: '#E0B953' },
  destaque: { color: '#D7E3F4', fontSize: 13, lineHeight: 19, flex: 1 },

  curiosidadeRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, paddingHorizontal: 4 },
  curiosidade: { color: '#8FA3C0', fontSize: 12, lineHeight: 18, flex: 1, fontStyle: 'italic' },

  footer: { color: '#8FA3C0', fontSize: 14, textAlign: 'center', marginTop: 10, fontWeight: '600', fontStyle: 'italic' },
});
