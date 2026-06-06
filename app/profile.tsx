import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState(''); 

  useEffect(() => {
    async function loadUserData() {
      try {
        const userDataString = await AsyncStorage.getItem('@copamania_user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setNome(userData.nome || '');
          setEmail(userData.email || '');
          setTelefone(userData.telefone || '');
        }
      } catch (error) {
        console.log("Erro ao carregar dados", error);
      }
    }
    loadUserData();
  }, []);

  async function handleSave() {
    if (!nome || !email) {
      return Alert.alert('Atenção', 'Nome e E-mail são obrigatórios.');
    }
    try {
      const userDataString = await AsyncStorage.getItem('@copamania_user');
      const userData = userDataString ? JSON.parse(userDataString) : {};
      const updatedUser = { ...userData, nome, email, telefone };

      await AsyncStorage.setItem('@copamania_user', JSON.stringify(updatedUser));
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  }

  async function handleLogout() {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair do seu álbum?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => router.replace('/login' as any)
        }
      ]
    );
  }

  function handleChangePhoto() {
    Alert.alert('Foto de Perfil', 'A funcionalidade de galeria/câmera será conectada em breve!');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <FontAwesome5 name="user-alt" size={40} color="#0B101E" />
            </View>
            <TouchableOpacity style={styles.changePhotoBtn} onPress={handleChangePhoto}>
              <Ionicons name="camera" size={16} color="#0F1E3C" />
              <Text style={styles.changePhotoText}>Alterar Foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>

            <Text style={styles.label}>NOME COMPLETO</Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="user-alt" size={16} color="#0A2463" style={styles.icon} />
              <TextInput 
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.label}>E-MAIL</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={18} color="#0A2463" style={styles.icon} />
              <TextInput 
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
              />
            </View>

            <Text style={styles.label}>TELEFONE (Opcional)</Text>
            <View style={styles.inputContainer}>
              <FontAwesome5 name="phone-alt" size={16} color="#0A2463" style={styles.icon} />
              <TextInput 
                style={styles.input}
                value={telefone}
                onChangeText={setTelefone}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF4444" />
            <Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1E3C' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#132347', borderBottomWidth: 1, borderBottomColor: '#1A2A4C' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#E0B953' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarCircle: { width: 100, height: 100, backgroundColor: '#E0B953', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#1A2235', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0B953', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: -15, borderWidth: 2, borderColor: '#0F1E3C' },
  changePhotoText: { color: '#0F1E3C', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  formContainer: { backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 10 },
  label: { color: '#B0C4DE', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8, paddingHorizontal: 12, height: 50 },
  icon: { marginRight: 10, width: 20, textAlign: 'center' },
  input: { flex: 1, height: '100%', color: '#000', fontSize: 15 },
  saveButton: { backgroundColor: '#118B44', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 30, borderWidth: 1, borderColor: '#0C6B33' },
  saveButtonText: { color: '#FFF', fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  logoutButton: { flexDirection: 'row', backgroundColor: 'rgba(255, 68, 68, 0.1)', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 25, borderWidth: 1, borderColor: 'rgba(255, 68, 68, 0.3)' },
  logoutButtonText: { color: '#FF4444', fontSize: 16, fontWeight: 'bold', marginLeft: 10 }
});