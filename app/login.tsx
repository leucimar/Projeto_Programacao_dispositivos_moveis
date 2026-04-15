import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router'; 
import { auth } from '../services/firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons'; 

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)'); 
    } catch (error: any) {
      Alert.alert("Erro de Login", "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image 
          source={require('../assets/images/icon.png')} 
          style={styles.logo} 
        />
        <Text style={styles.brandName}>Tinder de Peladas</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.loginTitle}>Login</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.loginButton, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Entrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity 
           style={styles.googleButton}
           onPress={() => Alert.alert("Aviso", "Login com Google em desenvolvimento")}
        >
          <Image 
            source={{uri: 'https://img.icons8.com/color/48/000000/google-logo.png'}} 
            style={styles.googleIcon} 
          />
          <Text style={styles.googleButtonText}>Continuar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={{marginTop: 20}}>
          <Text style={{color: '#888'}}>Não tem conta? <Text style={{color: '#2ECC71', fontWeight: 'bold'}}>Cadastre-se</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2ECC71' },
  header: { flex: 0.4, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 10 },
  brandName: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  formContainer: { flex: 0.6, backgroundColor: '#FFF', borderTopLeftRadius: 35, borderTopRightRadius: 35, paddingHorizontal: 30, paddingTop: 40, alignItems: 'center' },
  loginTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, width: '100%', height: 55 },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotPasswordText: { color: '#2ECC71', fontWeight: '500' },
  loginButton: { backgroundColor: '#2ECC71', width: '100%', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  loginButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  googleButton: { flexDirection: 'row', width: '100%', height: 55, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleButtonText: { color: '#555', fontSize: 16, fontWeight: '500' },
});