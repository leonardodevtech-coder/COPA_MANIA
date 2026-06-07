import React, { useRef } from 'react';
import { FlatList, Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importação das setas
import AlbumPage from '../../components/AlbumPage';

const { width } = Dimensions.get('window');
const dadosSelecoes = require('../../data/selecoes.json'); 

export default function AbrirAlbumScreen() {
  const flatListRef = useRef<FlatList>(null); // Referência para controlar a lista
  const [index, setIndex] = React.useState(0); // Rastrear página atual

  const scrollToNext = () => {
    if (index < dadosSelecoes.selecoes.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  };

  const scrollToPrev = () => {
    if (index > 0) {
      flatListRef.current?.scrollToIndex({ index: index - 1, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dadosSelecoes.selecoes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <AlbumPage selecao={item} />
          </View>
        )}
      />

      {/* SETAS DE NAVEGAÇÃO */}
      {index > 0 && (
        <TouchableOpacity style={[styles.arrow, styles.leftArrow]} onPress={scrollToPrev}>
          <Ionicons name="chevron-back" size={30} color="#E0B953" />
        </TouchableOpacity>
      )}

      {index < dadosSelecoes.selecoes.length - 1 && (
        <TouchableOpacity style={[styles.arrow, styles.rightArrow]} onPress={scrollToNext}>
          <Ionicons name="chevron-forward" size={30} color="#E0B953" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131A2F' }, // Combinei com a cor do seu App
  arrow: {
    position: 'absolute',
    top: '50%',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 25,
  },
  leftArrow: { left: 10 },
  rightArrow: { right: 10 }
});