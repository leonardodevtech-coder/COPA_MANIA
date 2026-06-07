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
  Image,
  Alert
} from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, setFotoPerfil } from '../lib/album';
import { useAcessibilidade } from '../lib/acessibilidade';

export default function ProfileScreen() {
  const router = useRouter();
  const { altoContraste: hc } = useAcessibilidade();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [medalhas, setMedalhas] = useState(0);
  const [tacas, setTacas] = useState(0);
  const [figurinhas, setFigurinhas] = useState(0);
  const [lendas, setLendas] = useState(0);

  useEffect(() => {
    async function loadUserData() {
      try {
        const userData = await getUser();
        setNome(userData.nome || '');
        setEmail(userData.email || '');
        setTelefone(userData.telefone || '');
        setAvatarUri(userData.avatarUri || null);
        setMedalhas(userData.medalhas);
        setTacas(userData.tacas);
        setFigurinhas(Object.keys(userData.figurinhas).length);
        setLendas(Object.keys(userData.lendas).filter((k) => userData.lendas[k]).length);
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

  async function handleChangePhoto() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setAvatarUri(uri);
      await setFotoPerfil(uri);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar a foto. Tente novamente.');
    }
  }

  return (
    <View style={[styles.container, hc && { backgroundColor: '#000000' }]}>
      <View style={[styles.header, hc && { backgroundColor: '#000000', borderBottomColor: '#FFD400', borderBottomWidth: 2 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, hc && { color: '#FFD400' }]}>Meu Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarCircle} onPress={handleChangePhoto} activeOpacity={0.85}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
              ) : (
                <FontAwesome5 name="user-alt" size={40} color="#0B101E" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.changePhotoBtn} onPress={handleChangePhoto}>
              <Ionicons name="camera" size={16} color="#0F1E3C" />
              <Text style={styles.changePhotoText}>{avatarUri ? 'Trocar Foto' : 'Alterar Foto'}</Text>
            </TouchableOpacity>
          </View>

          {/* Conquistas */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <FontAwesome5 name="medal" size={22} color="#E0B953" />
              <Text style={styles.statValue}>{medalhas}</Text>
              <Text style={styles.statLabel}>Medalhas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="trophy" size={22} color="#E0B953" />
              <Text style={styles.statValue}>{tacas}</Text>
              <Text style={styles.statLabel}>Taças</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="albums" size={24} color="#E0B953" />
              <Text style={styles.statValue}>{figurinhas}</Text>
              <Text style={styles.statLabel}>Figurinhas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="star" size={22} color="#E0B953" />
              <Text style={styles.statValue}>{lendas}</Text>
              <Text style={styles.statLabel}>Lendas</Text>
            </View>
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
  avatarCircle: { width: 100, height: 100, backgroundColor: '#E0B953', borderRadius: 50, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#1A2235', overflow: 'hidden', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  avatarImg: { width: '100%', height: '100%' },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0B953', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: -15, borderWidth: 2, borderColor: '#0F1E3C' },
  changePhotoText: { color: '#0F1E3C', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  statsCard: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 15, paddingVertical: 18, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(224, 185, 83, 0.2)', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 20, fontWeight: '900', marginTop: 6 },
  statLabel: { color: '#8FA3C0', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
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