import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAcessibilidade } from '../../lib/acessibilidade';
import React, { useState } from 'react';
import {
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter(); // Ferramenta de navegação
  const { altoContraste: hc } = useAcessibilidade();

  // Função atualizada apenas com a lógica de validação
  async function handleLogin() {
    // 1. Verifica se tem algum campo vazio
    if (!email || !senha) {
      return Alert.alert('Atenção', 'Preencha o e-mail e a senha para acessar.');
    }

    try {
      // 2. Busca os dados salvos no celular (cadastrados na outra tela)
      const userDataString = await AsyncStorage.getItem('@copamania_user');
      
      if (!userDataString) {
        return Alert.alert('Ops!', 'Nenhuma conta encontrada. Faça seu cadastro primeiro.');
      }

      const userData = JSON.parse(userDataString);

      // 3. Verifica se o e-mail e a senha batem com o cadastro
      if (email.toLowerCase() !== userData.email || senha !== userData.senha) {
        return Alert.alert('Cartão Vermelho', 'E-mail ou senha incorretos.');
      }

      // 4. Se deu tudo certo, vai para a Home
      Alert.alert('Bem-vindo de volta!', `Acessando o álbum de ${userData.nome}!`);
      router.replace('/home' as any);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer o login.');
    }
  }

  return (
    /* Fundo com a imagem desfocada (logo ou background.jpg) */
    <ImageBackground 
      source={require('../../assets/images/background.jpg')} // Usando o fundo dinâmico que sugerimos
      style={styles.backgroundImage}
      blurRadius={15} // Mantendo o desfoque premium
    >
      <View style={[styles.overlay, hc && styles.overlayHC]}>

        {/* BOTÃO DE VOLTAR NO CANTO SUPERIOR ESQUERDO */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
          {/* Cabeçalho */}
            <View style={styles.header}>
              <Text style={styles.title}>BEM-VINDO</Text>
              <Text style={styles.subtitle}>O Lugar dos Fanáticos por Futebol.</Text>
            </View>

            {/* Formulário de Login */}
            <View style={styles.formContainer}>
              
              {/* Campo: E-mail */}
              <Text style={styles.label}>SEU E-MAIL</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="email" size={20} color="#0A2463" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Campo: Senha */}
              <Text style={styles.label}>SUA SENHA</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={18} color="#0A2463" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={senha}
                  onChangeText={setSenha}
                />
              </View>

              {/* Botão de Ação */}
              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>ACESSAR MEU ÁLBUM ⚽</Text>
              </TouchableOpacity>

            </View>
            
            {/* Link para quem não tem conta */}
            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/cadastro')}>
              <Text style={styles.loginText}>Ainda não é colecionador? <Text style={styles.loginTextBold}>Cadastre-se</Text></Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(10, 36, 99, 0.80)' }, // Azul marinho escurecido
  overlayHC: { backgroundColor: '#000000' },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingTop: 80 }, // Padding maior para o botão de voltar
  backButton: {
    position: 'absolute',
    top: 50, // Compensa a barra de status do celular
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)', // Círculo sutil
    borderRadius: 50,
  },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 40, fontWeight: '900', color: '#E0B953', letterSpacing: 2, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  subtitle: { fontSize: 16, color: '#FFF', fontStyle: 'italic', marginTop: 5, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5 },
  formContainer: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' }, // Glassmorphism
  label: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#000', fontSize: 16 },
  button: { backgroundColor: '#118B44', height: 55, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#0C6B33' }, // Verde da logo
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  loginLink: { marginTop: 25, alignItems: 'center' },
  loginText: { color: '#CCC', fontSize: 14 },
  loginTextBold: { color: '#E0B953', fontWeight: 'bold' } // Dourado da logo
});