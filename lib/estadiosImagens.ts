import type { ImageSourcePropType } from 'react-native';

// Imagens dos estádios das finais, empacotadas no app (assets/estadios/<ano>.jpg).
// Local porque o Wikimedia bloqueia o User-Agent do carregador de imagens
// nativo (Android/iOS) com HTTP 403 — então as URLs remotas não carregam no
// celular. O require exige caminho estático, daí o mapa fixo por ano.
export const estadiosImagens: Record<number, ImageSourcePropType> = {
  2022: require('../assets/estadios/2022.jpg'),
  2018: require('../assets/estadios/2018.jpg'),
  2014: require('../assets/estadios/2014.jpg'),
  2010: require('../assets/estadios/2010.jpg'),
  2006: require('../assets/estadios/2006.jpg'),
  2002: require('../assets/estadios/2002.jpg'),
  1998: require('../assets/estadios/1998.jpg'),
  1994: require('../assets/estadios/1994.jpg'),
  1990: require('../assets/estadios/1990.jpg'),
  1986: require('../assets/estadios/1986.jpg'),
  1982: require('../assets/estadios/1982.jpg'),
  1978: require('../assets/estadios/1978.jpg'),
  1974: require('../assets/estadios/1974.jpg'),
  1970: require('../assets/estadios/1970.jpg'),
  1966: require('../assets/estadios/1966.jpg'),
  1962: require('../assets/estadios/1962.jpg'),
  1958: require('../assets/estadios/1958.jpg'),
  1954: require('../assets/estadios/1954.jpg'),
  1950: require('../assets/estadios/1950.jpg'),
  1938: require('../assets/estadios/1938.jpg'),
  1934: require('../assets/estadios/1934.jpg'),
  1930: require('../assets/estadios/1930.jpg'),
};
