import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, StatusBar } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import data from '../data/info_copa2026.json';

export default function CopaInfoScreen() {
  const router = useRouter();
  
  // ESTADO PARA CONTROLAR OS PONTINHOS DO CARROSSEL
  const [activeIndex, setActiveIndex] = useState(0);

  const curiosidades = [
    {
      icone: "globe-americas",
      manchete: "48 SELEÇÕES! A MAIOR COPA DE TODAS É REAL!",
      snippet: "Uma festa gigante: 12 grupos de 4 times. Mais chance para o mundo todo!"
    },
    {
      icone: "calendar-alt",
      manchete: "104 PARTIDAS: UMA MARATONA DE EMOÇÕES SEM FIM!",
      snippet: "39 dias de puro futebol. Recorde absoluto de jogos!"
    },
    {
      icone: "project-diagram",
      manchete: "NOVO MATA-MATA: O RUMO À GLÓRIA FICA MAIS DIFÍCIL!",
      snippet: "Prepare o coração! 16-avos de final. Não há mais espaço para erros."
    }
  ];

  // FUNÇÃO QUE CALCULA QUAL CARTÃO ESTÁ NA TELA
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // 306 é a largura do cartão (290) + a margem (16)
    const index = Math.round(scrollPosition / 306);
    setActiveIndex(index);
  };

  return (
    <ImageBackground 
      source={require('../assets/images/background.jpg')} 
      style={styles.container} 
      blurRadius={12}
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Stack.Screen options={{ headerShown: false, title: '' }} />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Guia Copa 2026</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.sectionTitle}>Últimas Notícias - O Novo Formato</Text>
          <View style={{ marginBottom: 20 }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={{ marginBottom: 15 }}
              pagingEnabled 
              snapToInterval={306} // Largura exata para o snap (290 + 16)
              decelerationRate="fast"
              onScroll={handleScroll} // Liga o evento de rolagem
              scrollEventThrottle={16} // Deixa a animação suave
            >
              {curiosidades.map((item, i) => (
                <View key={i} style={styles.noticiaCard}>
                  <View style={styles.noticiaHeader}>
                    <View style={styles.noticiaIconBox}>
                      <FontAwesome5 name={item.icone} size={28} color="#E0B953" />
                    </View>
                    <Text style={styles.noticiaHeadline}>{item.manchete}</Text>
                  </View>
                  <Text style={styles.noticiaSnippet}>{item.snippet}</Text>
                </View>
              ))}
            </ScrollView>
            
            {/* OS PONTINHOS AGORA REAGEM AO ESTADO 'activeIndex' */}
            <View style={styles.paginationDots}>
              {curiosidades.map((_, i) => (
                <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : null]} />
              ))}
            </View>
          </View>

          {/* SEÇÃO: BOLA OFICIAL */}
          <Text style={styles.sectionTitle}>Bola Oficial</Text>
          <View style={styles.bolaCard}>
            <Image source={{ uri: data.bolaOficial.imagem }} style={styles.bolaImagem} />
            <View style={styles.bolaInfo}>
              <Text style={styles.bolaNome}>{data.bolaOficial.nome}</Text>
              <Text style={styles.bolaDescricao}>{data.bolaOficial.descricao}</Text>
            </View>
          </View>

          {/* SEÇÃO: PAÍSES-SEDE */}
          <Text style={styles.sectionTitle}>Países-Sede</Text>
          <View style={styles.sedesContainer}>
            {data.paisesSede.map((sede, i) => (
              <View key={i} style={styles.sedeCard}>
                <Image source={{ uri: sede.bandeira }} style={styles.bandeiraSede} />
                <Text style={styles.sedeNome}>{sede.nome}</Text>
              </View>
            ))}
          </View>

          {/* SEÇÃO: MASCOTES */}
          <Text style={styles.sectionTitle}>Mascotes Oficiais</Text>
          <View style={styles.mascotesContainer}>
            {data.mascotes.map((mascote, i) => (
              <View key={i} style={styles.mascoteCard}>
                <Image source={{ uri: mascote.imagem }} style={styles.mascoteImagem} />
                <Text style={styles.mascoteNome}>{mascote.nome}</Text>
                <Text style={styles.mascoteSub}>{mascote.animal} ({mascote.pais})</Text>
              </View>
            ))}
          </View>
{/* SEÇÃO: ESTÁDIOS */}
    <Text style={styles.sectionTitle}>Estádios Presentes na Copa</Text>
{data.estadios.map((estadio, i) => (
  <View key={i} style={styles.estadioCard}>
    <Image 
      source={{ uri: `https://wsrv.nl/?url=${encodeURIComponent(estadio.imagem)}` }} 
      style={styles.estadioImagem}
    />
    <View style={styles.estadioInfo}>
      <Text style={styles.estadioNome}>{estadio.nome}</Text>
      <View style={styles.locRow}>
        <Ionicons name="location" size={14} color="#E0B953" style={{ marginRight: 4 }} />
        <Text style={styles.estadioLocal}>{estadio.cidade}</Text>
      </View>
      <View style={[styles.locRow, { marginTop: 4 }]}>
        <Ionicons name="people" size={14} color="#E0B953" style={{ marginRight: 4 }} />
        <Text style={styles.estadioLocal}>{estadio.capacidade} | Fundado em {estadio.fundacao}</Text>
      </View>
    </View>
  </View>
))}

          {/* SEÇÃO: PARTICIPANTES E DIVISÕES AGRUPADAS */}
          <Text style={styles.sectionTitle}>Seleções Participantes</Text>
          
          {data.divisoes.map((divisao, idx) => (
            <View key={idx} style={styles.divisaoContainer}>
              <Text style={styles.divisaoHeader}>{divisao.nome}</Text>
              
              <View style={styles.participantesGrid}>
                {divisao.selecoes.map((pais, i) => (
                  <View key={i} style={styles.selecaoCard}>
                    <Image source={{ uri: pais.bandeira }} style={styles.bandeiraPequena} />
                    <Text style={styles.selecaoPais}>{pais.nome}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.85)' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: '#E0B953', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 16, letterSpacing: 0.5 },
  
  noticiaCard: { width: 290, height: 240, backgroundColor: '#1a2a1a', padding: 20, borderRadius: 20, marginRight: 16, borderWidth: 2.5, borderColor: '#118B44' },
  noticiaHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  noticiaHeadline: { flex: 1, color: '#E0B953', fontSize: 24, fontWeight: 'bold', lineHeight: 30, marginRight: 10 },
  noticiaIconBox: { width: 50, height: 50, backgroundColor: 'rgba(224, 185, 83, 0.15)', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  noticiaSnippet: { color: '#FFFFFF', fontSize: 15, lineHeight: 22 },
  paginationDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.3)', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#118B44', width: 16 }, // Deixei o pontinho ativo um pouco mais largo para ficar mais legal!

  bolaCard: { backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#118B44' },
  bolaImagem: { width: 80, height: 80, borderRadius: 40, resizeMode: 'contain' },
  bolaInfo: { flex: 1, marginLeft: 16 },
  bolaNome: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  bolaDescricao: { color: '#B0C4DE', fontSize: 12, lineHeight: 18 },

  sedesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  sedeCard: { width: '31%', backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1.5, borderColor: '#118B44' },
  bandeiraSede: { width: 50, height: 32, borderRadius: 4, marginBottom: 8, resizeMode: 'cover' },
  sedeNome: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },

  mascotesContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  mascoteCard: { width: '31%', backgroundColor: 'rgba(25, 45, 80, 0.8)', borderRadius: 14, padding: 10, alignItems: 'center', marginBottom: 16 ,borderWidth: 1.5, borderColor: '#118B44' },
  mascoteImagem: { width: '100%', height: 70, borderRadius: 8, marginBottom: 8 },
  mascoteNome: { color: '#FFF', fontSize: 13, fontWeight: 'bold', textAlign: 'center' },
  mascoteSub: { color: '#B0C4DE', fontSize: 10, textAlign: 'center', marginTop: 2 },

 estadioCard: { 
    backgroundColor: 'rgba(25, 45, 80, 0.8)', 
    borderRadius: 12, 
    marginBottom: 14, 
    borderWidth: 1.5, 
    borderColor: '#118B44',
    overflow: 'hidden', // IMPORTANTÍSSIMO para arredondar a imagem
  },
  estadioImagem: { 
    width: '100%', 
    height: 160, 
    resizeMode: 'cover',
  },
  estadioInfo: { padding: 16 },
  estadioNome: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  locRow: { flexDirection: 'row', alignItems: 'center' },
  estadioLocal: { color: '#B0C4DE', fontSize: 13 },

  divisaoContainer: { marginBottom: 20, backgroundColor: 'rgba(10, 20, 40, 0.6)', padding: 14, borderRadius: 16, borderWidth: 2, borderColor: '#118B44' },
  divisaoHeader: { color: '#E0B953', fontSize: 15, fontWeight: '900', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  participantesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  selecaoCard: { width: '48%', backgroundColor: 'rgba(25, 45, 80, 0.9)', borderRadius: 12, padding: 12, marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(17, 139, 68, 0.6)' },
  selecaoPais: { color: '#FFF', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  bandeiraPequena: { width: 36, height: 24, borderRadius: 3, marginBottom: 8 }
});