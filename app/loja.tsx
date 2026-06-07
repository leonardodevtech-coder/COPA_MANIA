import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ImageBackground, Modal } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import CardFigurinha from '../components/CardFigurinha';
import { getUser, abrirPacote, setFotoJogador, todosOsSlots, type Slot } from '../lib/album';
import { useAcessibilidade } from '../lib/acessibilidade';

const TOTAL = todosOsSlots().length;

export default function LojaScreen() {
  const router = useRouter();
  const { altoContraste: hc } = useAcessibilidade();
  const [medalhas, setMedalhas] = useState(0);
  const [desbloqueadas, setDesbloqueadas] = useState(0);
  const [aberta, setAberta] = useState<Slot | null>(null);
  const [fotoAtual, setFotoAtual] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    getUser().then((u) => {
      setMedalhas(u.medalhas);
      setDesbloqueadas(Object.keys(u.figurinhas).length);
    });
  }, []);

  useFocusEffect(useCallback(() => { recarregar(); }, [recarregar]));

  async function abrir() {
    const res = await abrirPacote();
    if (!res.ok) {
      setMsg(
        res.motivo === 'sem_medalha'
          ? 'Você não tem medalhas. Acerte perguntas no Quiz para ganhar!'
          : 'Parabéns! Você já desbloqueou todos os jogadores.'
      );
      return;
    }
    setFotoAtual(null);
    setAberta(res.jogador!);
    recarregar();
  }

  async function escolherFoto() {
    if (!aberta) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.4,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
    await setFotoJogador(aberta.key, uri);
    setFotoAtual(uri);
  }

  return (
    <ImageBackground source={require('../assets/images/background.jpg')} style={styles.bg} blurRadius={12}>
      <View style={[styles.overlay, hc && styles.overlayHC]}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loja de Pacotinhos</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.saldoRow}>
          <View style={styles.saldoBox}>
            <FontAwesome5 name="medal" size={16} color="#E0B953" />
            <Text style={styles.saldoText}>{medalhas} medalhas</Text>
          </View>
          <View style={styles.saldoBox}>
            <Ionicons name="albums" size={16} color="#E0B953" />
            <Text style={styles.saldoText}>{desbloqueadas}/{TOTAL}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {!aberta ? (
            <View style={styles.center}>
              <View style={styles.packBox}>
                <FontAwesome5 name="box-open" size={64} color="#E0B953" />
              </View>
              <Text style={styles.packTitle}>Abra um pacote!</Text>
              <Text style={styles.packSub}>Cada pacote custa 1 medalha e traz um craque surpresa da Copa.</Text>
            </View>
          ) : (
            <View style={styles.center}>
              <CardFigurinha slot={aberta} fotoUri={fotoAtual} />
            </View>
          )}
        </View>

        {/* Ações */}
        <View style={styles.acoes}>
          {!aberta ? (
            <TouchableOpacity style={styles.btnPrimario} onPress={abrir} activeOpacity={0.9}>
              <Ionicons name="gift" size={20} color="#0B101E" />
              <Text style={styles.btnPrimarioText}>Abrir Pacote (1 medalha)</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.btnPrimario} onPress={escolherFoto} activeOpacity={0.9}>
                <Ionicons name="camera" size={20} color="#0B101E" />
                <Text style={styles.btnPrimarioText}>{fotoAtual ? 'Trocar foto' : 'Adicionar foto'}</Text>
              </TouchableOpacity>
              <View style={styles.acoesRow}>
                <TouchableOpacity style={styles.btnSecundario} onPress={abrir} activeOpacity={0.9}>
                  <Ionicons name="gift" size={18} color="#E0B953" />
                  <Text style={styles.btnSecundarioText}>Abrir outro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSecundario} onPress={() => router.push('/abrir_album' as any)} activeOpacity={0.9}>
                  <Ionicons name="book" size={18} color="#E0B953" />
                  <Text style={styles.btnSecundarioText}>Meu álbum</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Modal mensagem */}
        <Modal visible={!!msg} transparent animationType="fade" onRequestClose={() => setMsg(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Ionicons name="information-circle" size={42} color="#E0B953" />
              <Text style={styles.modalMsg}>{msg}</Text>
              <TouchableOpacity style={styles.btnPrimario} onPress={() => setMsg(null)}>
                <Text style={styles.btnPrimarioText}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(11, 22, 46, 0.92)', padding: 20 },
  overlayHC: { backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#E0B953', letterSpacing: 1 },

  saldoRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 10 },
  saldoBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(25, 45, 80, 0.9)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  saldoText: { color: '#FFF', fontWeight: 'bold' },

  body: { flex: 1, justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  packBox: { width: 130, height: 130, borderRadius: 24, backgroundColor: 'rgba(224,185,83,0.12)', borderWidth: 2, borderColor: 'rgba(224,185,83,0.4)', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  packTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', marginTop: 22 },
  packSub: { color: '#B0C4DE', fontSize: 14, textAlign: 'center', marginTop: 8, paddingHorizontal: 30, lineHeight: 20 },

  acoes: { gap: 12 },
  acoesRow: { flexDirection: 'row', gap: 12 },
  btnPrimario: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, backgroundColor: '#E0B953', borderRadius: 16, paddingVertical: 16 },
  btnPrimarioText: { color: '#0B101E', fontWeight: '900', fontSize: 16 },
  btnSecundario: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: 'rgba(25, 45, 80, 0.95)', borderRadius: 16, paddingVertical: 14, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  btnSecundarioText: { color: '#E0B953', fontWeight: 'bold', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalCard: { backgroundColor: '#1A2235', borderRadius: 22, padding: 26, alignItems: 'center', width: '100%', maxWidth: 360, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  modalMsg: { color: '#FFF', fontSize: 16, textAlign: 'center', marginVertical: 16, lineHeight: 23 },
});
