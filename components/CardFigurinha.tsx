import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, Text, StyleSheet, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import type { Slot } from '../lib/album';

interface Props {
  slot: Slot;
  fotoUri?: string | null;
}

/**
 * Figurinha estilo "carta" que entra com animação (escala + giro) e fica
 * brilhando em dourado. Mostra nome, posição, altura e peso.
 */
export default function CardFigurinha({ slot, fotoUri }: Props) {
  const entrada = useRef(new Animated.Value(0)).current; // 0 -> 1 (entrada)
  const brilho = useRef(new Animated.Value(0)).current; // loop do glow
  const shine = useRef(new Animated.Value(0)).current; // varredura diagonal

  useEffect(() => {
    entrada.setValue(0);
    Animated.spring(entrada, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: false,
    }).start();

    const loopBrilho = Animated.loop(
      Animated.sequence([
        Animated.timing(brilho, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(brilho, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    );
    const loopShine = Animated.loop(
      Animated.sequence([
        Animated.timing(shine, { toValue: 1, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.delay(700),
      ])
    );
    loopBrilho.start();
    loopShine.start();
    return () => {
      loopBrilho.stop();
      loopShine.stop();
    };
  }, [slot.key]);

  const scale = entrada.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const rotate = entrada.interpolate({ inputRange: [0, 1], outputRange: ['-12deg', '0deg'] });
  const glowOpacity = brilho.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.95] });
  const glowScale = brilho.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const shineX = shine.interpolate({ inputRange: [0, 1], outputRange: [-160, 220] });

  return (
    <View style={styles.wrap}>
      {/* Glow dourado pulsante atrás da carta */}
      <Animated.View
        pointerEvents="none"
        style={[styles.glow, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
      />

      <Animated.View style={[styles.card, { transform: [{ scale }, { rotate }] }]}>
        {/* Cabeçalho: posição + número */}
        <View style={styles.topRow}>
          <View style={styles.posBadge}>
            <Text style={styles.posText}>{slot.posicao}</Text>
          </View>
          <View style={styles.numBadge}>
            <Text style={styles.numText}>{slot.idx + 1}</Text>
          </View>
        </View>

        {/* Emblema central / foto */}
        <View style={[styles.emblema, { borderColor: slot.cor }]}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.foto} resizeMode="cover" />
          ) : (
            <FontAwesome5 name="user-alt" size={56} color="#E0B95355" />
          )}
        </View>

        {/* Nome */}
        <Text style={styles.nome} numberOfLines={1}>{slot.nome}</Text>
        <Text style={styles.selecao} numberOfLines={1}>{slot.selecao}</Text>

        {/* Atributos */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <FontAwesome5 name="running" size={14} color="#E0B953" />
            <Text style={styles.statValue}>{slot.posicao}</Text>
            <Text style={styles.statLabel}>Posição</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FontAwesome5 name="ruler-vertical" size={14} color="#E0B953" />
            <Text style={styles.statValue}>{slot.altura}</Text>
            <Text style={styles.statLabel}>Altura</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <FontAwesome5 name="weight-hanging" size={14} color="#E0B953" />
            <Text style={styles.statValue}>{slot.peso}</Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>
        </View>

        {/* Brilho que varre a carta na diagonal */}
        <Animated.View
          pointerEvents="none"
          style={[styles.shine, { transform: [{ translateX: shineX }, { rotate: '20deg' }] }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', width: 280, height: 380, borderRadius: 200, backgroundColor: '#E0B953' },

  card: {
    width: 250,
    backgroundColor: '#0E1B36',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#E0B953',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    alignItems: 'center',
    overflow: 'hidden',
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
  posBadge: { backgroundColor: 'rgba(224,185,83,0.18)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  posText: { color: '#E0B953', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  numBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E0B953', justifyContent: 'center', alignItems: 'center' },
  numText: { color: '#0B101E', fontWeight: '900', fontSize: 16 },

  emblema: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, backgroundColor: '#16264a', justifyContent: 'center', alignItems: 'center', marginTop: 14, marginBottom: 12, overflow: 'hidden' },
  foto: { width: '100%', height: '100%' },

  nome: { color: '#FFF', fontSize: 22, fontWeight: '900', textAlign: 'center' },
  selecao: { color: '#E0B953', fontSize: 13, fontWeight: 'bold', marginTop: 2, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 },

  stats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14, paddingVertical: 12, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  statLabel: { color: '#8FA3C0', fontSize: 9, marginTop: 1, textTransform: 'uppercase' },
  statDivider: { width: 1, height: 34, backgroundColor: 'rgba(255,255,255,0.1)' },

  shine: { position: 'absolute', top: -40, left: 0, width: 60, height: 460, backgroundColor: 'rgba(255,255,255,0.18)' },
});
