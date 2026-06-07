import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, Dimensions, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AlbumPage from '../../components/AlbumPage';
import { getUser, setFotoJogador, todosOsSlots, type Figurinha } from '../../lib/album';

const { width } = Dimensions.get('window');
const dadosSelecoes = require('../../data/selecoes.json');
const TOTAL_SLOTS = todosOsSlots().length;

export default function AbrirAlbumScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [figurinhas, setFigurinhas] = useState<Record<string, Figurinha>>({});
  const [medalhas, setMedalhas] = useState(0);

  const recarregar = useCallback(() => {
    getUser().then((u) => {
      setFigurinhas(u.figurinhas);
      setMedalhas(u.medalhas);
    });
  }, []);

  useFocusEffect(useCallback(() => { recarregar(); }, [recarregar]));

  const desbloqueadas = Object.keys(figurinhas).length;
  const ultima = dadosSelecoes.selecoes.length - 1;

  function irPara(novo: number) {
    const alvo = Math.max(0, Math.min(novo, ultima));
    scrollRef.current?.scrollTo({ x: alvo * width, animated: true });
    setIndex(alvo);
  }

  async function escolherFoto(key: string) {
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
    await setFotoJogador(key, uri);
    recarregar();
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho de status / loja */}
      <View style={styles.topBar}>
        <View style={styles.statusBox}>
          <FontAwesome5 name="medal" size={16} color="#E0B953" />
          <Text style={styles.statusText}>{medalhas}</Text>
          <Text style={styles.statusLabel}>medalhas</Text>
        </View>

        <TouchableOpacity style={styles.packBtn} onPress={() => router.push('/loja' as any)} activeOpacity={0.85}>
          <Ionicons name="gift" size={18} color="#0B101E" />
          <Text style={styles.packBtnText}>Abrir figurinha</Text>
        </TouchableOpacity>

        <View style={styles.statusBox}>
          <Ionicons name="albums" size={16} color="#E0B953" />
          <Text style={styles.statusText}>{desbloqueadas}/{TOTAL_SLOTS}</Text>
        </View>
      </View>

      {/* Páginas do álbum (deslizam na horizontal) */}
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {dadosSelecoes.selecoes.map((item: any) => (
            <View key={item.id.toString()} style={{ width, height: '100%' }}>
              <AlbumPage
                selecao={item}
                figurinhas={figurinhas}
                onSlotPress={(key) => escolherFoto(key)}
              />
            </View>
          ))}
        </ScrollView>

        {/* Setas de navegação */}
        {index > 0 && (
          <TouchableOpacity style={[styles.arrow, styles.leftArrow]} onPress={() => irPara(index - 1)}>
            <Ionicons name="chevron-back" size={30} color="#E0B953" />
          </TouchableOpacity>
        )}
        {index < ultima && (
          <TouchableOpacity style={[styles.arrow, styles.rightArrow]} onPress={() => irPara(index + 1)}>
            <Ionicons name="chevron-forward" size={30} color="#E0B953" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131A2F' },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#131A2F', paddingHorizontal: 14, paddingVertical: 12, paddingTop: 45 },
  statusBox: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusText: { color: '#FFF', fontWeight: '900', fontSize: 14, marginLeft: 4 },
  statusLabel: { color: '#8FA3C0', fontSize: 11 },
  packBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#E0B953', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20 },
  packBtnText: { color: '#0B101E', fontWeight: '900', fontSize: 13 },

  arrow: { position: 'absolute', top: '50%', padding: 10, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 25 },
  leftArrow: { left: 10 },
  rightArrow: { right: 10 },
});
