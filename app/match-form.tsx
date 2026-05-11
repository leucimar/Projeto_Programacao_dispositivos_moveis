import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../services/firebaseConfig';
import { createMatch, getMatchById, Match, updateMatch } from '../services/matchDatabase';

const NIVEIS = ['Amador', 'Intermediário', 'Avançado'] as const;
const TIPOS = ['5x5', '7x7', '11x11', 'Society'] as const;

const IMAGE_OPTIONS = [
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d',
];

export default function MatchFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const [local, setLocal] = useState('');
  const [subLocal, setSubLocal] = useState('');
  const [hora, setHora] = useState('');
  const [nivel, setNivel] = useState<Match['nivel']>('Amador');
  const [tipo, setTipo] = useState('5x5');
  const [preco, setPreco] = useState('');
  const [maxJogadores, setMaxJogadores] = useState('10');
  const [descricao, setDescricao] = useState('');
  const [image, setImage] = useState(IMAGE_OPTIONS[0]);

  // Garante o uid mesmo na web
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      getMatchById(id).then((match) => {
        if (match) {
          setLocal(match.local);
          setSubLocal(match.subLocal);
          setHora(match.hora);
          setNivel(match.nivel);
          setTipo(match.tipo);
          setPreco(String(match.preco));
          setMaxJogadores(String(match.maxJogadores));
          setDescricao(match.descricao);
          setImage(match.image || IMAGE_OPTIONS[0]);
        }
        setLoadingData(false);
      });
    }
  }, [id]);

  const validate = (): boolean => {
    if (!local.trim()) { Alert.alert('Atenção', 'Informe o local da partida.'); return false; }
    if (!subLocal.trim()) { Alert.alert('Atenção', 'Informe o bairro/cidade.'); return false; }
    if (!hora.trim()) { Alert.alert('Atenção', 'Informe o horário.'); return false; }
    if (!preco.trim() || isNaN(Number(preco))) { Alert.alert('Atenção', 'Informe um preço válido.'); return false; }
    if (!maxJogadores.trim() || isNaN(Number(maxJogadores))) { Alert.alert('Atenção', 'Informe o número máximo de jogadores.'); return false; }
    if (!currentUid) { Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.'); return false; }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: Omit<Match, 'id' | 'criadoEm' | 'criadoPor'> = {
        local: local.trim(),
        subLocal: subLocal.trim(),
        hora: hora.trim(),
        nivel,
        tipo,
        preco: Number(preco),
        maxJogadores: Number(maxJogadores),
        descricao: descricao.trim(),
        image,
      };

      if (isEditing && id) {
        await updateMatch(id, payload);
      } else {
        await createMatch(payload);
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Editar Partida' : 'Nova Partida'}</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Local *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="location-outline" size={20} color="#888" />
            <TextInput style={styles.input} placeholder="Ex: Arena das Palmeiras" value={local} onChangeText={setLocal} />
          </View>

          <Text style={styles.label}>Bairro / Cidade *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="map-outline" size={20} color="#888" />
            <TextInput style={styles.input} placeholder="Ex: Centro, Carandaí - MG" value={subLocal} onChangeText={setSubLocal} />
          </View>

          <Text style={styles.label}>Horário *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="time-outline" size={20} color="#888" />
            <TextInput style={styles.input} placeholder="Ex: 19:30" value={hora} onChangeText={setHora} />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Preço (R$) *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="cash-outline" size={20} color="#888" />
                <TextInput style={styles.input} placeholder="20" value={preco} onChangeText={setPreco} keyboardType="numeric" />
              </View>
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Máx. Jogadores *</Text>
              <View style={styles.inputBox}>
                <Ionicons name="people-outline" size={20} color="#888" />
                <TextInput style={styles.input} placeholder="10" value={maxJogadores} onChangeText={setMaxJogadores} keyboardType="numeric" />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Nível</Text>
          <View style={styles.optionsRow}>
            {NIVEIS.map((n) => (
              <TouchableOpacity key={n} style={[styles.optionBtn, nivel === n && styles.optionBtnActive]} onPress={() => setNivel(n)}>
                <FontAwesome5 name="futbol" size={14} color={nivel === n ? 'white' : '#888'} />
                <Text style={[styles.optionText, nivel === n && styles.optionTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tipo de Jogo</Text>
          <View style={styles.optionsRow}>
            {TIPOS.map((t) => (
              <TouchableOpacity key={t} style={[styles.optionBtn, tipo === t && styles.optionBtnActive]} onPress={() => setTipo(t)}>
                <Text style={[styles.optionText, tipo === t && styles.optionTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Fale um pouco sobre a partida..."
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Foto da Partida</Text>
          <View style={styles.imageOptions}>
            {IMAGE_OPTIONS.map((img, i) => (
              <TouchableOpacity key={i} style={[styles.imageDot, image === img && styles.imageDotActive]} onPress={() => setImage(img)}>
                <Text style={styles.imageDotText}>Campo {i + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.saveButton, loading && { opacity: 0.7 }]} onPress={handleSave} disabled={loading}>
            {loading
              ? <ActivityIndicator color="white" />
              : <>
                  <Ionicons name={isEditing ? 'save-outline' : 'add-circle-outline'} size={22} color="white" />
                  <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Criar Partida'}</Text>
                </>
            }
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    height: 110, backgroundColor: '#2ECC71',
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 40, paddingHorizontal: 16, gap: 10,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  form: { padding: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 14 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'white', borderRadius: 12,
    paddingHorizontal: 14, height: 50,
    borderWidth: 1, borderColor: '#E8E8E8',
  },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: '#333' },
  row: { flexDirection: 'row' },
  textArea: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 14, fontSize: 15, color: '#333',
    borderWidth: 1, borderColor: '#E8E8E8',
    minHeight: 90, textAlignVertical: 'top',
  },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#DDD',
    backgroundColor: 'white',
  },
  optionBtnActive: { backgroundColor: '#2ECC71', borderColor: '#2ECC71' },
  optionText: { fontSize: 13, color: '#888', fontWeight: '500' },
  optionTextActive: { color: 'white' },
  imageOptions: { flexDirection: 'row', gap: 10 },
  imageDot: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#DDD',
    alignItems: 'center', backgroundColor: 'white',
  },
  imageDotActive: { borderColor: '#2ECC71', backgroundColor: '#E8F8F0' },
  imageDotText: { fontSize: 12, color: '#555', fontWeight: '500' },
  saveButton: {
    marginTop: 24, backgroundColor: '#2ECC71', height: 56,
    borderRadius: 14, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 10,
    elevation: 4,
  },
  saveButtonText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
});
