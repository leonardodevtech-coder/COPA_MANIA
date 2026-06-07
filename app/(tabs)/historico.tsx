import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import historicoData from '../../data/historico_copas.json';

export default function HistoricoScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.mainTitle}>Histórico das Copas</Text>
      {historicoData.historico.map((copa, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.ano}>{copa.ano} - {copa.sede}</Text>
          <Text style={styles.info}><Text style={styles.label}>Campeão:</Text> {copa.campeao}</Text>
          <Text style={styles.info}><Text style={styles.label}>Vice:</Text> {copa.vice}</Text>
          <Text style={styles.info}><Text style={styles.label}>Artilheiro:</Text> {copa.artilheiro}</Text>
          <Text style={styles.destaque}><Text style={styles.label}>Destaque:</Text> {copa.destaque}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131A2F', padding: 20 },
  mainTitle: { color: '#E0B953', fontSize: 26, fontWeight: '900', textAlign: 'center', marginVertical: 20 },
  card: { backgroundColor: '#1E2538', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#118B44' },
  ano: { color: '#E0B953', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  info: { color: '#FFF', fontSize: 14, marginBottom: 4 },
  label: { fontWeight: 'bold', color: '#118B44' },
  destaque: { color: '#B0C4DE', fontSize: 13, marginTop: 8, fontStyle: 'italic' }
});