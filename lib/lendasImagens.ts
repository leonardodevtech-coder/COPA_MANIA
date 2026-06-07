import type { ImageSourcePropType } from 'react-native';

// Imagens das lendas empacotadas no app (assets/lendas/).
// O require precisa de caminho estático, por isso o mapa fixo por id.
export const lendasImagens: Record<string, ImageSourcePropType> = {
  pele: require('../assets/lendas/pele.jpg'),
  maradona: require('../assets/lendas/maradona.jpg'),
  zidane: require('../assets/lendas/zidane.jpg'),
  cruyff: require('../assets/lendas/cruyff.jpg'),
  'roberto-carlos': require('../assets/lendas/roberto-carlos.jpg'),
  ronaldo: require('../assets/lendas/ronaldo.jpg'),
  ronaldinho: require('../assets/lendas/ronaldinho.jpg'),
  beckenbauer: require('../assets/lendas/beckenbauer.jpg'),
  garrincha: require('../assets/lendas/garrincha.jpg'),
  maldini: require('../assets/lendas/maldini.jpg'),
  romario: require('../assets/lendas/romario.jpg'),
  zico: require('../assets/lendas/zico.jpg'),
};
