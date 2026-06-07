import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleSheet, Image, type ImageSourcePropType } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

export interface Lenda {
  id: string;
  nome: string;
  pais: string;
  posicao: string;
  altura: string;
  peso: string;
  gols: string;
  idade: string;
  aposentadoria: string;
  titulos: string;
  descricao: string;
}

interface Props {
  lenda: Lenda;
  imagem: ImageSourcePropType;
}

/**
 * Carta de Lenda: entra com escala + giro, brilho dourado pulsante e varredura
 * de luz. Mostra foto, país, posição e os atributos (gols, altura, peso, idade,
 * ano de aposentadoria e títulos).
 */
export default function CardLenda({ lenda, imagem }: Props) {
  const entrada = useRef(new Animated.Value(0)).current;
  const brilho = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    entrada.setValue(0);
    Animated.spring(entrada, { toValue: 1, friction: 5, tension: 55, useNativeDriver: false }).start();

    const loopBrilho = Animated.loop(
      Animated.sequence([
        Animated.timing(brilho, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(brilho, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    const loopShine = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.delay(600),
      ])
    );
    loopBrilho.start();
    loopShine.start();
    return () => {
      loopBrilho.stop();
      loopShine.stop();
    };
  }, [lenda.id]);

  const scale = entrada.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const rotate = entrada.interpolate({ inputRange: [0, 1], outputRange: ['12deg', '0deg'] });
  const glowOpacity = brilho.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.95] });
  const glowScale = brilho.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-180, 260] });

  return (
    <View style={styles.wrap}>
      <Animated.View pointerEvents="none" style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]} />

      <Animated.View style={[styles.card, { transform: [{ scale }, { rotate }] }]}>
        {/* Faixa "LENDA" */}
        <View style={styles.topRow}>
          <View style={styles.lendaBadge}>
            <FontAwesome5 name="crown" size={11} color="#0B101E" />
            <Text style={styles.lendaBadgeText}>LENDA</Text>
          </View>
          <View style={styles.posBadge}>
            <Text style={styles.posText}>{lenda.posicao}</Text>
          </View>
        </View>

        {/* Foto */}
        <View style={styles.fotoWrap}>
          <Image source={imagem} style={styles.foto} resizeMode="cover" />
        </View>

        <Text style={styles.nome} numberOfLines={1}>{lenda.nome}</Text>
        <View style={styles.paisRow}>
          <Ionicons name="location" size={12} color="#E0B953" />
          <Text style={styles.pais}>{lenda.pais}</Text>
        </View>

        {/* Atributos principais */}
        <View style={styles.stats}>
          <Stat icon="futbol" valor={lenda.gols} label="Gols" />
          <View style={styles.divider} />
          <Stat icon="ruler-vertical" valor={lenda.altura} label="Altura" />
          <View style={styles.divider} />
          <Stat icon="weight-hanging" valor={lenda.peso} label="Peso" />
        </View>
        <View style={[styles.stats, { marginTop: 8 }]}>
          <Stat icon="birthday-cake" valor={lenda.idade} label="Idade" />
          <View style={styles.divider} />
          <Stat icon="flag-checkered" valor={lenda.aposentadoria} label="Aposentou" />
        </View>

        {/* Títulos */}
        <View style={styles.titulosBox}>
          <FontAwesome5 name="trophy" size={13} color="#E0B953" />
          <Text style={styles.titulosText} numberOfLines={2}>{lenda.titulos}</Text>
        </View>

        <Animated.View pointerEvents="none" style={[styles.shine, { transform: [{ translateX: shineX }, { rotate: '20deg' }] }]} />
      </Animated.View>
    </View>
  );
}

function Stat({ icon, valor, label }: { icon: any; valor: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <FontAwesome5 name={icon} size={13} color="#E0B953" />
      <Text style={styles.statValue} numberOfLines={1}>{valor}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 300, height: 420, borderRadius: 210, backgroundColor: '#E0B953' },

  card: {
    width: 270,
    backgroundColor: '#0E1B36',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E0B953',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    alignItems: 'center',
    overflow: 'hidden',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  lendaBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E0B953', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  lendaBadgeText: { color: '#0B101E', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  posBadge: { backgroundColor: 'rgba(224,185,83,0.18)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  posText: { color: '#E0B953', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },

  fotoWrap: { width: 130, height: 130, borderRadius: 65, borderWidth: 3, borderColor: '#E0B953', backgroundColor: '#16264a', justifyContent: 'center', alignItems: 'center', marginTop: 14, marginBottom: 10, overflow: 'hidden' },
  foto: { width: '100%', height: '100%' },

  nome: { color: '#FFF', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  paisRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, marginBottom: 14 },
  pais: { color: '#E0B953', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },

  stats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, paddingVertical: 12, width: '100%' },
  statItem: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  statValue: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginTop: 5 },
  statLabel: { color: '#8FA3C0', fontSize: 9, marginTop: 1, textTransform: 'uppercase' },
  divider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.1)' },

  titulosBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(224,185,83,0.1)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, width: '100%', marginTop: 10, borderLeftWidth: 3, borderLeftColor: '#E0B953' },
  titulosText: { color: '#D7E3F4', fontSize: 12, fontWeight: '600', flex: 1, lineHeight: 16 },

  shine: { position: 'absolute', top: -40, left: 0, width: 64, height: 520, backgroundColor: 'rgba(255,255,255,0.18)' },
});
