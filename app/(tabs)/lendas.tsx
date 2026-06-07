import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, StatusBar } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import lendasData from '../../data/lendas.json';
import { lendasImagens } from '../../lib/lendasImagens';
import { getUser, desbloquearLenda } from '../../lib/album';

interface Lenda {
  id: string;
  nome: string;
  pais: string;
  posicao: string;
  foto: string;
  descricao: string;
}

const LENDAS = (lendasData as any).lendas as Lenda[];

export default function LendasScreen() {
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [tacas, setTacas] = useState(0);
  const [escolher, setEscolher] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    getUser().then((u) => {
      setUnlocked(u.lendas);
      setTacas(u.tacas);
    });
  }, []);

  useFocusEffect(useCallback(() => { recarregar(); }, [recarregar]));

  const totalDesbloqueadas = Object.keys(unlocked).filter((k) => unlocked[k]).length;
  const bloqueadas = LENDAS.filter((l) => !unlocked[l.id]);

  function abrirTroca() {
    if (tacas < 1) {
      setMsg('Você não tem taças. Acerte 100% do Quiz Completo para ganhar uma!');
      return;
    }
    if (bloqueadas.length === 0) {
      setMsg('Você já colecionou todas as lendas. Lenda você também! 🏆');
      return;
    }
    setEscolher(true);
  }

  async function escolherLenda(id: string) {
    const res = await desbloquearLenda(id);
    setEscolher(false);
    if (res.ok) recarregar();
    else setMsg(res.motivo === 'sem_taca' ? 'Você não tem taças suficientes.' : 'Você já tem essa lenda.');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Álbum de Lendas</Text>
          <Text style={styles.subtitle}>{totalDesbloqueadas}/{LENDAS.length} colecionadas</Text>
        </View>
        <TouchableOpacity style={styles.trocaBtn} onPress={abrirTroca} activeOpacity={0.85}>
          <FontAwesome5 name="trophy" size={16} color="#0B101E" />
          <Text style={styles.trocaBtnText}>Trocar taça ({tacas})</Text>
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
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal escolher lenda */}
      <Modal visible={escolher} transparent animationType="slide" onRequestClose={() => setEscolher(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.chooseCard}>
            <Text style={styles.chooseTitle}>Escolha uma lenda</Text>
            <Text style={styles.chooseSub}>Gasta 1 taça 🏆</Text>
            <ScrollView style={{ maxHeight: 360 }}>
              {bloqueadas.map((l) => (
                <TouchableOpacity key={l.id} style={styles.chooseItem} onPress={() => escolherLenda(l.id)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chooseNome}>{l.nome}</Text>
                    <Text style={styles.chooseMeta}>{l.pais} · {l.posicao}</Text>
                  </View>
                  <Ionicons name="lock-open" size={20} color="#E0B953" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalLink} onPress={() => setEscolher(false)}>
              <Text style={styles.modalLinkText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
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
  trocaBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E0B953', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22 },
  trocaBtnText: { color: '#0B101E', fontWeight: '900', fontSize: 13 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 14 },
  card: { width: '48%', backgroundColor: '#1A2235', borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },
  foto: { width: '100%', height: 180 },
  lockArea: { width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222e47' },
  lockBadge: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 14, padding: 7 },
  cardInfo: { padding: 10 },
  cardNome: { color: '#FFF', fontSize: 15, fontWeight: 'bold' },
  cardMeta: { color: '#8FA3C0', fontSize: 12, marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  chooseCard: { backgroundColor: '#1A2235', borderRadius: 22, padding: 22, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  chooseTitle: { color: '#E0B953', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  chooseSub: { color: '#B0C4DE', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  chooseItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222e47', borderRadius: 12, padding: 14, marginBottom: 10 },
  chooseNome: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  chooseMeta: { color: '#8FA3C0', fontSize: 12, marginTop: 2 },
  modalLink: { padding: 12, marginTop: 6, alignItems: 'center' },
  modalLinkText: { color: '#8FA3C0', fontWeight: 'bold' },

  msgCard: { backgroundColor: '#1A2235', borderRadius: 22, padding: 26, alignItems: 'center', width: '100%', maxWidth: 360, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  msgText: { color: '#FFF', fontSize: 16, textAlign: 'center', marginVertical: 16, lineHeight: 23 },
  okBtn: { backgroundColor: '#E0B953', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 14, width: '100%', alignItems: 'center' },
  okBtnText: { color: '#0B101E', fontWeight: '900', fontSize: 15 }
});
