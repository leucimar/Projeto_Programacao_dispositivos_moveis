import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Importação para salvar no banco
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('Amador');
  const [loading, setLoading] = useState(false);

 const handleRegister = async () => {
  if (!email || !password || !username) {
    alert("Preencha todos os campos!");
    return;
  }

  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username,
      email,
      level,
      age,
      createdAt: new Date()
    });

    alert("Sucesso! Conta criada.");
    router.replace('/login'); 
  } catch (error: any) {
    // Isso vai mostrar exatamente por que o Firebase recusou o cadastro
    console.error(error);
    alert(`Erro: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.greenHeader}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="white" />
         </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Criar Sua Conta</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#888" />
          <TextInput 
            style={styles.input} 
            placeholder="Username" 
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#888" />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={20} color="#888" />
          <TextInput 
            style={styles.input} 
            placeholder="Idade" 
            keyboardType="numeric" 
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Ionicons name="settings-outline" size={18} color="#555" />
            <Text style={styles.levelHeaderText}>Nível de Habilidade</Text>
          </View>
          <View style={styles.levelOptions}>
            {['Amador', 'Intermediário', 'Avançado'].map((l) => (
              <TouchableOpacity key={l} onPress={() => setLevel(l)} style={styles.levelItem}>
                <FontAwesome5 name="futbol" size={22} color={level === l ? '#2ECC71' : '#CCC'} />
                <Text style={[styles.levelLabel, {color: level === l ? '#2ECC71' : '#888'}]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#888" />
          <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        </View>

        <TouchableOpacity 
          style={[styles.registerButton, loading && { opacity: 0.7 }]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerButtonText}>CADASTRAR</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  greenHeader: { height: 100, backgroundColor: '#2ECC71', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center', paddingLeft: 20 },
  backButton: { marginTop: 20 },
  content: { padding: 25, marginTop: -20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 12, paddingHorizontal: 15, marginBottom: 12, height: 50 },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },
  levelCard: { borderWidth: 1, borderColor: '#2ECC71', borderRadius: 15, padding: 12, marginBottom: 12 },
  levelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  levelHeaderText: { marginLeft: 8, fontSize: 14, fontWeight: '500' },
  levelOptions: { flexDirection: 'row', justifyContent: 'space-around' },
  levelItem: { alignItems: 'center' },
  levelLabel: { fontSize: 11, marginTop: 4 },
  registerButton: { backgroundColor: '#2ECC71', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});