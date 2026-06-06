import React from 'react';
import { FlatList, Dimensions, View, StyleSheet } from 'react-native';
import AlbumPage from '../../components/AlbumPage';

const { width } = Dimensions.get('window');
const dadosSelecoes = require('../../data/selecoes.json'); 

export default function AbrirAlbumScreen() {
  // Isso vai imprimir no seu terminal do VS Code a quantidade de seleções lidas
  console.log("TOTAL DE SELEÇÕES CARREGADAS:", dadosSelecoes.selecoes.length);

  return (
    <View style={styles.container}>
      <FlatList
        data={dadosSelecoes.selecoes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={true} // Deixei ativado para você ver a barra
        keyExtractor={(item) => item.id.toString()}
        
        // --- AS MÁGICAS PARA RESOLVER O CORTE ---
        initialNumToRender={12} // Força a carregar as 12 logo de cara
        windowSize={12} // Mantém todas na memória ao rolar
        maxToRenderPerBatch={12} // Carrega todas no mesmo lote
        // ----------------------------------------

        renderItem={({ item }) => (
          <View style={{ width }}>
            <AlbumPage selecao={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }
});