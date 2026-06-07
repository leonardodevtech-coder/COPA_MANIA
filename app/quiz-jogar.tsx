import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import quizData from '../data/quiz.json';
import { addMedalhas, concluirQuiz } from '../lib/album';
import { useAcessibilidade } from '../lib/acessibilidade';

interface Pergunta {
  pergunta: string;
  opcoes: string[];
  correta: number;
  tema: string;
}

const temas = (quizData as any).temas as any[];

function montarPerguntas(modo: string, temaId?: string): Pergunta[] {
  const lista: Pergunta[] = [];
  temas.forEach((t) => {
    if (modo === 'tema' && t.id !== temaId) return;
    t.perguntas.forEach((p: any) => lista.push({ ...p, tema: t.titulo }));
  });
  return lista;
}

export default function QuizJogarScreen() {
  const router = useRouter();
  const { altoContraste: hc } = useAcessibilidade();
  const { modo, tema } = useLocalSearchParams<{ modo: string; tema?: string }>();

  const perguntas = useMemo(() => montarPerguntas(modo || 'tema', tema), [modo, tema]);

  const [idx, setIdx] = useState(0);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [fim, setFim] = useState(false);
  const [ganhouTaca, setGanhouTaca] = useState(false);

  const atual = perguntas[idx];

  async function responder(opcao: number) {
    if (selecionada !== null) return; // já respondeu esta pergunta
    setSelecionada(opcao);
    if (opcao === atual.correta) {
      setAcertos((a) => a + 1);
      await addMedalhas(1); // cada acerto = 1 medalha
    }
  }

  async function proxima() {
    if (idx + 1 >= perguntas.length) {
      // fim do quiz: 100% de acertos (em um tema ou no completo) concede 1 taça
      const res = await concluirQuiz(acertos, perguntas.length);
      setGanhouTaca(res.ganhouTaca);
      setFim(true);
    } else {
      setIdx(idx + 1);
      setSelecionada(null);
    }
  }

  function reiniciar() {
    setIdx(0);
    setSelecionada(null);
    setAcertos(0);
    setFim(false);
    setGanhouTaca(false);
  }

  function corOpcao(i: number) {
    if (selecionada === null) return styles.opcao;
    if (i === atual.correta) return [styles.opcao, styles.opcaoCerta];
    if (i === selecionada) return [styles.opcao, styles.opcaoErrada];
    return [styles.opcao, styles.opcaoDesativada];
  }

  return (
    <ImageBackground
      source={require('../assets/images/background.jpg')}
      style={styles.bg}
      blurRadius={12}
    >
      <View style={[styles.overlay, hc && styles.overlayHC]}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {modo === 'completo' ? 'Quiz Completo' : atual?.tema || 'Quiz'}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {!fim ? (
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.progresso}>
              Pergunta {idx + 1} de {perguntas.length}
            </Text>

            <View style={styles.cardPergunta}>
              <Text style={styles.tema}>{atual.tema}</Text>
              <Text style={styles.pergunta}>{atual.pergunta}</Text>
            </View>

            {atual.opcoes.map((op, i) => (
              <TouchableOpacity
                key={i}
                style={corOpcao(i)}
                activeOpacity={0.9}
                onPress={() => responder(i)}
              >
                <Text style={styles.opcaoText}>{op}</Text>
                {selecionada !== null && i === atual.correta && (
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                )}
                {selecionada !== null && i === selecionada && i !== atual.correta && (
                  <Ionicons name="close-circle" size={22} color="#fff" />
                )}
              </TouchableOpacity>
            ))}

            {selecionada !== null && (
              <TouchableOpacity style={styles.proximaBtn} onPress={proxima} activeOpacity={0.9}>
                <Text style={styles.proximaText}>
                  {idx + 1 >= perguntas.length ? 'Ver resultado' : 'Próxima'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#0B101E" />
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : (
          <View style={styles.resultado}>
            <FontAwesome5
              name={ganhouTaca ? 'trophy' : 'medal'}
              size={70}
              color="#E0B953"
            />
            <Text style={styles.resTitulo}>
              {ganhouTaca ? 'Taça conquistada! 🏆' : 'Quiz finalizado!'}
            </Text>
            <Text style={styles.resPlacar}>
              Você acertou {acertos} de {perguntas.length}
            </Text>
            <Text style={styles.resGanho}>+{acertos} medalha(s)</Text>

            {!ganhouTaca && (
              <Text style={styles.resDica}>
                Acerte 100% das perguntas do tema para ganhar uma taça!
              </Text>
            )}
            {ganhouTaca && (
              <Text style={styles.resDica}>
                Troque sua taça por uma figurinha de lenda no álbum de Lendas!
              </Text>
            )}

            <TouchableOpacity style={styles.proximaBtn} onPress={reiniciar} activeOpacity={0.9}>
              <Ionicons name="refresh" size={20} color="#0B101E" />
              <Text style={styles.proximaText}>Jogar de novo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.voltarBtn} onPress={() => router.back()} activeOpacity={0.9}>
              <Text style={styles.voltarText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 30, 60, 0.9)', padding: 20 },
  overlayHC: { backgroundColor: '#000000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#E0B953', letterSpacing: 1 },

  body: { paddingBottom: 30 },
  progresso: { color: '#8FA3C0', textAlign: 'center', marginBottom: 12, fontWeight: 'bold' },
  cardPergunta: { backgroundColor: 'rgba(25, 45, 80, 0.95)', borderRadius: 18, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.25)' },
  tema: { color: '#E0B953', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  pergunta: { color: '#FFF', fontSize: 18, fontWeight: 'bold', lineHeight: 26 },

  opcao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(25, 45, 80, 0.9)', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  opcaoText: { color: '#FFF', fontSize: 15, fontWeight: '600', flex: 1 },
  opcaoCerta: { backgroundColor: '#1E7D44', borderColor: '#2ecc71' },
  opcaoErrada: { backgroundColor: '#A8322D', borderColor: '#e74c3c' },
  opcaoDesativada: { opacity: 0.5 },

  proximaBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#E0B953', borderRadius: 14, padding: 16, marginTop: 10 },
  proximaText: { color: '#0B101E', fontWeight: '900', fontSize: 16 },

  resultado: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 },
  resTitulo: { color: '#FFF', fontSize: 24, fontWeight: '900', marginTop: 20, textAlign: 'center' },
  resPlacar: { color: '#B0C4DE', fontSize: 18, marginTop: 10 },
  resGanho: { color: '#E0B953', fontSize: 16, fontWeight: 'bold', marginTop: 6 },
  resDica: { color: '#8FA3C0', fontSize: 14, textAlign: 'center', marginTop: 16, marginBottom: 10, paddingHorizontal: 20 },
  voltarBtn: { padding: 14, marginTop: 6 },
  voltarText: { color: '#B0C4DE', fontWeight: 'bold', fontSize: 15 }
});
