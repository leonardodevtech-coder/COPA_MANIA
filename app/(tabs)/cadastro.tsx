import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ImageBackground,
  Alert
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAcessibilidade } from '../../lib/acessibilidade';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const router = useRouter();
  const { altoContraste: hc } = useAcessibilidade();

  // Função assíncrona para validar e salvar os dados
  async function handleCadastro() {
    // 1. Verifica se tem algum campo vazio
    if (!nome || !email || !senha || !confirmarSenha) {
      return Alert.alert('Atenção', 'Preencha todos os campos para entrar em campo!');
    }

    // 2. Valida se o formato do e-mail é aceitável
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return Alert.alert('Atenção', 'Por favor, digite um e-mail válido!');
    }

    // 3. Valida o tamanho mínimo de segurança para a senha
    if (senha.length < 6) {
      return Alert.alert('Atenção', 'A sua senha precisa ter pelo menos 6 caracteres.');
    }

    // 4. Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      return Alert.alert('Cartão Amarelo', 'As senhas não coincidem. Tente novamente.');
    }

    try {
      // --- NOVA VERIFICAÇÃO DE DUPLICIDADE ---
      // Busca no banco se já existe alguém cadastrado
      const existingDataString = await AsyncStorage.getItem('@copamania_user');
      
      if (existingDataString) {
        const existingData = JSON.parse(existingDataString);
        
        // Compara o e-mail digitado com o e-mail salvo
        if (existingData.email === email.toLowerCase().trim()) {
          return Alert.alert('Impedido!', 'Este e-mail já está cadastrado no nosso álbum. Vá para a tela de Login.');
        }
        
        // Compara o nome digitado com o nome salvo
        if (existingData.nome.toLowerCase() === nome.toLowerCase().trim()) {
          return Alert.alert('Impedido!', 'Este nome de colecionador já está em uso. Escolha outro nome.');
        }
      }
      // ----------------------------------------

      // 5. Empacota os dados do usuário
      const userData = {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha: senha
      };

      // 6. Salva no celular
      await AsyncStorage.setItem('@copamania_user', JSON.stringify(userData));
      
      Alert.alert('Golaço!', 'Conta criada com sucesso. Faça seu login!');
      
      // 7. Limpa os campos e vai para a tela de login
      setNome(''); setEmail(''); setSenha(''); setConfirmarSenha('');
      router.push('/login' as any);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  }

  return (
    <ImageBackground 
      source={require('../../assets/images/logo.jpg')} 
      style={styles.backgroundImage}
      blurRadius={15} 
    >
      <View style={[styles.overlay, hc && styles.overlayHC]}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={styles.title}>COPA MANIA</Text>
              <Text style={styles.subtitle}>O seu álbum de figurinhas te espera.</Text>
            </View>

            <View style={styles.formContainer}>
              
              <Text style={styles.label}>NOME DE COLECIONADOR</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="user-alt" size={18} color="#0A2463" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="ex: torcedor_10"
                  placeholderTextColor="#999"
                  value={nome}
                  onChangeText={setNome}
                />
              </View>

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

              <Text style={styles.label}>CRIE UMA SENHA</Text>
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

              <Text style={styles.label}>CONFIRME SUA SENHA</Text>
              <View style={styles.inputContainer}>
                <FontAwesome5 name="shield-alt" size={18} color="#0A2463" style={styles.icon} />
                <TextInput 
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor="#999"
                  secureTextEntry
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>ENTRAR EM CAMPO ⚽</Text>
              </TouchableOpacity>

            </View>
            
            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login' as any)}>
              <Text style={styles.loginText}>Já tem um passe? <Text style={styles.loginTextBold}>Entrar</Text></Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, resizeMode: 'cover' },
  overlay: { flex: 1, backgroundColor: 'rgba(10, 36, 99, 0.80)' },
  overlayHC: { backgroundColor: '#000000' },
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingTop: 60 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 40, fontWeight: '900', color: '#E0B953', letterSpacing: 2, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 10 },
  subtitle: { fontSize: 16, color: '#FFF', fontStyle: 'italic', marginTop: 5, textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5 },
  formContainer: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.3)' },
  label: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', color: '#000', fontSize: 16 },
  button: { backgroundColor: '#118B44', height: 55, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#0C6B33' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
  loginLink: { marginTop: 25, alignItems: 'center' },
  loginText: { color: '#CCC', fontSize: 14 },
  loginTextBold: { color: '#E0B953', fontWeight: 'bold' }
});