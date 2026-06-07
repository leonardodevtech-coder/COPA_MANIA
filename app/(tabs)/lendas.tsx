import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import lendasData from '../../data/lendas.json';
import { lendasImagens } from '../../lib/lendasImagens';
import { getUser, desbloquearLenda } from '../../lib/album';
import CardLenda, { type Lenda } from '../../components/CardLenda';

const LENDAS = (lendasData as any).lendas as Lenda[];
const ITEM_W = 96; // largura de cada rosto na roleta
const REPS = 7; // quantas voltas a roleta dá
const { width: SCREEN_W } = Dimensions.get('window');

export default function LendasScreen() {
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [tacas, setTacas] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  // Estado da roleta
  const [overlay, setOverlay] = useState(false);
  const [phase, setPhase] = useState<'spin' | 'reveal'>('spin');
  const [sorteada, setSorteada] = useState<Lenda | null>(null);
  const [containerW, setContainerW] = useState(SCREEN_W - 48);
  const scrollX = useRef(new Animated.Value(0)).current;

  const recarregar = useCallback(() => {
    getUser().then((u) => {
      setUnlocked(u.lendas);
      setTacas(u.tacas);
    });
  }, []);

  useFocusEffect(useCallback(() => { recarregar(); }, [recarregar]));

  const totalDesbloqueadas = Object.keys(unlocked).filter((k) => unlocked[k]).length;

  function abrirRoleta() {
    if (tacas < 1) {
      setMsg('Você não tem taças. Acerte 100% em um tema do Quiz para ganhar uma!');
      return;
    }
    const bloqueadas = LENDAS.filter((l) => !unlocked[l.id]);
    if (bloqueadas.length === 0) {
      setMsg('Você já colecionou todas as lendas. Lenda você também! 🏆');
      return;
    }
    const escolhida = bloqueadas[Math.floor(Math.random() * bloqueadas.length)];
    setSorteada(escolhida);
    setPhase('spin');
    setOverlay(true);
  }

  // Dispara a animação quando a roleta abre
  useEffect(() => {
    if (!overlay || phase !== 'spin' || !sorteada) return;
    scrollX.setValue(0);
    const idx = LENDAS.findIndex((l) => l.id === sorteada.id);
    const alvo = (REPS - 1) * LENDAS.length + idx;
    const finalX = alvo * ITEM_W - (containerW / 2 - ITEM_W / 2);

    const t = setTimeout(() => {
      Animated.timing(scrollX, {
        toValue: -finalX,
        duration: 3400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(async ({ finished }) => {
        if (!finished) return;
        const res = await desbloquearLenda(sorteada.id);
        if (res.ok) {
          recarregar();
          setPhase('reveal');
        } else {
          setOverlay(false);
          setMsg(res.motivo === 'sem_taca' ? 'Você não tem taças suficientes.' : 'Algo deu errado.');
        }
      });
    }, 250);
    return () => clearTimeout(t);
  }, [overlay, phase, sorteada, containerW, scrollX, recarregar]);

  function fecharColando() {
    setOverlay(false);
    setSorteada(null);
    setPhase('spin');
    recarregar();
  }

  // Tira longa de rostos para a roleta girar
  const tira: Lenda[] = [];
  for (let r = 0; r < REPS; r++) tira.push(...LENDAS);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Álbum de Lendas</Text>
          <Text style={styles.subtitle}>{totalDesbloqueadas}/{LENDAS.length} colecionadas</Text>
        </View>
        <TouchableOpacity style={styles.sortearBtn} onPress={abrirRoleta} activeOpacity={0.85}>
          <FontAwesome5 name="dice" size={15} color="#0B101E" />
          <Text style={styles.sortearBtnText}>Sortear ({tacas} 🏆)</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {LENDAS.map((l) => {
          const tem = !!unlocked[l.id];
          return (
            <View key={l.id} style={styles.card}>
              {tem ? (
                <Image source={lendasImagens[l.id]} style={styles.foto} resizeMode="cover" />
              ) : (
                <View style={styles.lockArea}>
                  <FontAwesome5 name="user-alt" size={40} color="#33415c" />
                  <View style={styles.lockBadge}>
                    <Ionicons name="lock-closed" size={16} color="#fff" />
                  </View>
                </View>
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.cardNome} numberOfLines={1}>{tem ? l.nome : '???'}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>
                  {tem ? `${l.pais} · ${l.posicao}` : 'Lenda bloqueada'}
                </Text>
                {tem && (
                  <View style={styles.cardTitulosRow}>
                    <FontAwesome5 name="trophy" size={10} color="#E0B953" />
                    <Text style={styles.cardTitulos} numberOfLines={2}>{l.titulos}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Overlay da roleta / revelação */}
      <Modal visible={overlay} transparent animationType="fade" onRequestClose={() => phase === 'reveal' && fecharColando()}>
        <View style={styles.rouletteOverlay}>
          {phase === 'spin' ? (
            <View style={styles.spinWrap}>
              <Text style={styles.spinTitle}>Girando a roleta das lendas…</Text>
              <View style={styles.glowSpin} />
              <View
                style={styles.roleta}
                onLayout={(e) => setContainerW(e.nativeEvent.layout.width)}
              >
                <Animated.View style={[styles.tira, { transform: [{ translateX: scrollX }] }]}>
                  {tira.map((l, i) => (
                    <View key={`${l.id}-${i}`} style={styles.faceCell}>
                      <Image source={lendasImagens[l.id]} style={styles.face} resizeMode="cover" />
                    </View>
                  ))}
                </Animated.View>

                {/* Marcador central */}
                <View pointerEvents="none" style={styles.marker} />
                <View pointerEvents="none" style={styles.markerTop}>
                  <Ionicons name="caret-down" size={26} color="#E0B953" />
                </View>
                <View pointerEvents="none" style={styles.markerBottom}>
                  <Ionicons name="caret-up" size={26} color="#E0B953" />
                </View>
                {/* Bordas escuras laterais */}
                <View pointerEvents="none" style={[styles.fade, styles.fadeLeft]} />
                <View pointerEvents="none" style={[styles.fade, styles.fadeRight]} />
              </View>
              <Text style={styles.spinSub}>Boa sorte! Uma lenda aleatória está sendo escolhida.</Text>
            </View>
          ) : (
            sorteada && (
              <View style={styles.revealWrap}>
                <Text style={styles.revealTitle}>Você tirou uma lenda! ✨</Text>
                <CardLenda lenda={sorteada} imagem={lendasImagens[sorteada.id]} />
                <Text style={styles.revealDesc} numberOfLines={3}>{sorteada.descricao}</Text>
                <TouchableOpacity style={styles.colarBtn} onPress={fecharColando} activeOpacity={0.9}>
                  <FontAwesome5 name="paste" size={16} color="#0B101E" />
                  <Text style={styles.colarBtnText}>Colar no álbum</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </Modal>

      {/* Modal mensagem */}
      <Modal visible={!!msg} transparent animationType="fade" onRequestClose={() => setMsg(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.msgCard}>
            <Ionicons name="information-circle" size={42} color="#E0B953" />
            <Text style={styles.msgText}>{msg}</Text>
            <TouchableOpacity style={styles.okBtn} onPress={() => setMsg(null)}>
              <Text style={styles.okBtnText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1E3C' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 50, paddingBottom: 16, backgroundColor: '#131A2F' },
  title: { color: '#E0B953', fontSize: 22, fontWeight: '900' },
  subtitle: { color: '#8FA3C0', fontSize: 13, marginTop: 2 },
  sortearBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E0B953', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22 },
  sortearBtnText: { color: '#0B101E', fontWeight: '900', fontSize: 13 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 14 },
  card: { width: '48%', backgroundColor: '#1A2235', borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },
  foto: { width: '100%', height: 180 },
  lockArea: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222e47' },
  lockBadge: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, padding: 7 },
  cardInfo: { padding: 10 },
  cardNome: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  cardMeta: { color: '#8FA3C0', fontSize: 12, marginTop: 2 },
  cardTitulosRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 6, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 6 },
  cardTitulos: { color: '#D7E3F4', fontSize: 11, fontWeight: '600', flex: 1, lineHeight: 15 },

  // Roleta
  rouletteOverlay: { flex: 1, backgroundColor: 'rgba(7, 13, 28, 0.96)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  spinWrap: { width: '100%', alignItems: 'center' },
  spinTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', marginBottom: 24, textAlign: 'center' },
  glowSpin: { position: 'absolute', top: 70, width: 260, height: 200, borderRadius: 130, backgroundColor: 'rgba(224,185,83,0.25)' },
  roleta: { width: '100%', height: 150, justifyContent: 'center', overflow: 'hidden', borderRadius: 16, borderWidth: 2, borderColor: 'rgba(224,185,83,0.4)', backgroundColor: 'rgba(20, 34, 64, 0.9)' },
  tira: { flexDirection: 'row', alignItems: 'center' },
  faceCell: { width: ITEM_W, alignItems: 'center', justifyContent: 'center' },
  face: { width: 78, height: 110, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  marker: { position: 'absolute', alignSelf: 'center', width: ITEM_W - 8, height: '100%', borderLeftWidth: 3, borderRightWidth: 3, borderColor: '#E0B953' },
  markerTop: { position: 'absolute', top: -2, alignSelf: 'center' },
  markerBottom: { position: 'absolute', bottom: -2, alignSelf: 'center' },
  fade: { position: 'absolute', top: 0, bottom: 0, width: 40 },
  fadeLeft: { left: 0, backgroundColor: 'rgba(7,13,28,0.55)' },
  fadeRight: { right: 0, backgroundColor: 'rgba(7,13,28,0.55)' },
  spinSub: { color: '#8FA3C0', fontSize: 13, textAlign: 'center', marginTop: 24 },

  // Revelação
  revealWrap: { width: '100%', alignItems: 'center' },
  revealTitle: { color: '#E0B953', fontSize: 20, fontWeight: '900', marginBottom: 18, textAlign: 'center' },
  revealDesc: { color: '#B0C4DE', fontSize: 13, textAlign: 'center', lineHeight: 19, marginTop: 18, paddingHorizontal: 10 },
  colarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#E0B953', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40, marginTop: 20 },
  colarBtnText: { color: '#0B101E', fontWeight: '900', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  msgCard: { backgroundColor: '#1A2235', borderRadius: 22, padding: 26, alignItems: 'center', width: '100%', maxWidth: 360, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  msgText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginVertical: 16, lineHeight: 23 },
  okBtn: { backgroundColor: '#E0B953', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 14, width: '100%', alignItems: 'center' },
  okBtnText: { color: '#0B101E', fontWeight: '900', fontSize: 15 },
});
