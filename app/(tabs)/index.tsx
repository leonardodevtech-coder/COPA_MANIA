import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      // Puxando a imagem dinâmica que você gerou
      source={require('../../assets/images/background.jpg')} 
      style={styles.backgroundImage}
      blurRadius={5} // Desfoque suave para dar leitura sem esconder a arte
    >
      <View style={styles.overlay}>
        
        {/* Container da Logo principal */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/logo.jpg')} 
            style={styles.logo}
          />
          <Text style={styles.title}>COPA MANIA</Text>
          <Text style={styles.subtitle}>Deslumbre o mundo do futebol</Text>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionContainer}>
          
          <TouchableOpacity 
            style={styles.buttonPrimary} 
            onPress={() => router.push('/cadastro')} // Leva para a tela que criamos antes
          >
            <Text style={styles.buttonPrimaryText}>JUNTE-SE AOS LOUCOS POR FUTEBOL</Text>
          </TouchableOpacity>

         <TouchableOpacity 
            style={styles.buttonSecondary} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonSecondaryText}>Já faço parte dessa loucura</Text>
          </TouchableOpacity>

        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 36, 99, 0.75)', // Fundo escuro transparente 
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90, 
    borderWidth: 3,
    borderColor: '#E0B953', 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#E0B953',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: {width: -1, height: 2},
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
  },
  actionContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: '#118B44', 
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0C6B33',
    elevation: 5, 
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  buttonSecondary: {
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224, 185, 83, 0.5)', 
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  buttonSecondaryText: {
    color: '#E0B953', 
    fontSize: 14,
    fontWeight: 'bold',
  }
});