import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { useAcessibilidade } from '../lib/acessibilidade';

const ODS = [
  {
    numero: 4,
    titulo: 'Educação de Qualidade',
    cor: '#C5192D',
    icone: 'school',
    iconLib: 'mci',
    texto:
      'O Quiz da Copa e os cards de história, cultura e curiosidades transformam o álbum em uma ferramenta de aprendizagem lúdica sobre geografia, gastronomia e história mundial.',
  },
  {
    numero: 8,
    titulo: 'Trabalho Decente e Crescimento Econômico',
    cor: '#A21942',
    icone: 'chart-line',
    iconLib: 'fa5',
    texto:
      'Ao destacar países-sede, turismo, estádios e gastronomia, o app valoriza o impacto econômico e turístico que um megaevento como a Copa gera para as cidades anfitriãs.',
  },
  {
    numero: 9,
    titulo: 'Indústria, Inovação e Infraestrutura',
    cor: '#FD6925',
    icone: 'bulb',
    iconLib: 'ion',
    texto:
      'O próprio projeto é a aplicação prática do ODS: desenvolvimento mobile multiplataforma (Expo/React Native), gamificação e armazenamento local demonstram inovação tecnológica e infraestrutura digital.',
  },
  {
    numero: 10,
    titulo: 'Redução das Desigualdades',
    cor: '#DD1367',
    icone: 'earth',
    iconLib: 'ion',
    texto:
      'O novo formato com 48 seleções dá voz a países antes sub-representados. O álbum celebra essa diversidade cultural, aproximando torcedores de todas as partes do mundo de forma gratuita.',
  },
];

function OdsIcon({ ods }: { ods: (typeof ODS)[number] }) {
  if (ods.iconLib === 'fa5') return <FontAwesome5 name={ods.icone as any} size={26} color="#FFF" />;
  if (ods.iconLib === 'mci') return <MaterialCommunityIcons name={ods.icone as any} size={30} color="#FFF" />;
  return <Ionicons name={ods.icone as any} size={28} color="#FFF" />;
}

export default function SobreScreen() {
  const router = useRouter();
  const { altoContraste: hc } = useAcessibilidade();

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.container}
      blurRadius={12}
    >
      <View style={[styles.overlay, hc && styles.overlayHC]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Stack.Screen options={{ headerShown: false, title: '' }} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sobre o Projeto</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Apresentação */}
          <View style={styles.heroCard}>
            <View style={styles.heroIconWrapper}>
              <FontAwesome5 name="futbol" size={30} color="#E0B953" />
            </View>
            <Text style={styles.heroTitle}>COPA MANIA</Text>
            <Text style={styles.heroSubtitle}>
              Um álbum digital interativo da Copa do Mundo de 2026. Mais que um catálogo de figurinhas, é uma
              experiência de descoberta com seleções, lendas, estádios, quiz e gamificação — unindo informação,
              cultura e tecnologia em um app mobile moderno.
            </Text>
          </View>

          {/* O que o app oferece */}
          <Text style={styles.sectionTitle}>O que você encontra aqui</Text>
          <View style={styles.featureList}>
            {[
              { icon: 'book', label: 'Álbum de seleções e jogadores' },
              { icon: 'star', label: 'Galeria de lendas do futebol' },
              { icon: 'trophy-award', label: 'Quiz com medalhas e taças', lib: 'mci' },
              { icon: 'map', label: 'Guia da Copa 2026: sedes e estádios' },
              { icon: 'time', label: 'Histórico dos campeões' },
            ].map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  {f.lib === 'mci' ? (
                    <MaterialCommunityIcons name={f.icon as any} size={20} color="#E0B953" />
                  ) : (
                    <Ionicons name={f.icon as any} size={20} color="#E0B953" />
                  )}
                </View>
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>

          {/* ODS */}
          <Text style={styles.sectionTitle}>Compromisso com os ODS da ONU</Text>
          <Text style={styles.sectionIntro}>
            Este projeto está alinhado aos Objetivos de Desenvolvimento Sustentável da Agenda 2030:
          </Text>

          {ODS.map((ods) => (
            <View key={ods.numero} style={[styles.odsCard, { borderLeftColor: ods.cor }]}>
              <View style={[styles.odsBadge, { backgroundColor: ods.cor }]}>
                <Text style={styles.odsNumero}>{ods.numero}</Text>
                <OdsIcon ods={ods} />
              </View>
              <View style={styles.odsInfo}>
                <Text style={styles.odsTitulo}>ODS {ods.numero} — {ods.titulo}</Text>
                <Text style={styles.odsTexto}>{ods.texto}</Text>
              </View>
            </View>
          ))}

          {/* Tecnologia */}
          <Text style={styles.sectionTitle}>Tecnologia</Text>
          <View style={styles.techCard}>
            <Text style={styles.techText}>
              Desenvolvido com <Text style={styles.techBold}>Expo</Text> e{' '}
              <Text style={styles.techBold}>React Native</Text> (multiplataforma: Android, iOS e Web), navegação com{' '}
              <Text style={styles.techBold}>Expo Router</Text> e persistência local via{' '}
              <Text style={styles.techBold}>AsyncStorage</Text>. Projeto da disciplina de Programação para
              Dispositivos Móveis I (PDMI).
            </Text>
          </View>

          <Text style={styles.footer}>Feito com ⚽ para a Copa do Mundo 2026</Text>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.85)' },
  overlayHC: { backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#E0B953', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 50 },

  heroCard: { backgroundColor: 'rgba(25, 45, 80, 0.9)', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },
  heroIconWrapper: { width: 70, height: 70, backgroundColor: 'rgba(224, 185, 83, 0.1)', borderRadius: 35, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.25)', marginBottom: 14 },
  heroTitle: { color: '#E0B953', fontSize: 26, fontWeight: '900', letterSpacing: 2, marginBottom: 10 },
  heroSubtitle: { color: '#B0C4DE', fontSize: 14, lineHeight: 22, textAlign: 'center' },

  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 28, marginBottom: 14, letterSpacing: 0.5 },
  sectionIntro: { color: '#B0C4DE', fontSize: 13, lineHeight: 20, marginBottom: 16, marginTop: -4 },

  featureList: { backgroundColor: 'rgba(25, 45, 80, 0.7)', borderRadius: 16, padding: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10 },
  featureIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(224, 185, 83, 0.12)', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  featureText: { color: '#FFF', fontSize: 14, fontWeight: '600', flex: 1 },

  odsCard: { flexDirection: 'row', backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 16, padding: 16, marginBottom: 14, borderLeftWidth: 5, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  odsBadge: { width: 58, height: 58, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  odsNumero: { color: '#FFF', fontSize: 20, fontWeight: '900', lineHeight: 22 },
  odsInfo: { flex: 1 },
  odsTitulo: { color: '#E0B953', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  odsTexto: { color: '#B0C4DE', fontSize: 13, lineHeight: 19 },

  techCard: { backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: '#118B44' },
  techText: { color: '#B0C4DE', fontSize: 13, lineHeight: 21 },
  techBold: { color: '#FFF', fontWeight: 'bold' },

  footer: { color: '#8FA3C0', fontSize: 13, textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
});
