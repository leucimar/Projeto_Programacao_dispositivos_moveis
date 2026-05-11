import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth } from '../../services/firebaseConfig';
import { deleteMatch, getAllMatches, Match } from '../../services/matchDatabase';

const NIVEL_COLORS: Record<string, string> = {
  'Amador': '#2ECC71',
  'Intermediário': '#F39C12',
  'Avançado': '#E74C3C',
};

export default function HomeScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  // Fica escutando o usuário logado — resolve o problema do auth.currentUser ser null na web
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  const loadMatches = async () => {
    try {
      const data = await getAllMatches();
      setMatches(data);
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadMatches();
    }, [])
  );

  const handleDelete = (match: Match) => {
    Alert.alert(
      'Excluir Partida',
      `Tem certeza que deseja excluir "${match.local}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMatch(match.id!);
              setMatches(prev => prev.filter(m => m.id !== match.id));
              Alert.alert('Sucesso', 'Partida excluída!');
            } catch (error: any) {
              Alert.alert('Erro', error.message);
            }
          },
        },
      ]
    );
  };

  const renderMatchCard = ({ item }: { item: Match }) => {
    const isOwner = !!currentUid && currentUid === item.criadoPor;

    return (
      <View style={styles.card}>
        <ImageBackground
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' }}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 15 }}
        >
          <View style={styles.overlay}>
            <View style={styles.cardHeader}>
              <View style={styles.locationInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="location" size={18} color="white" />
                  <Text style={styles.locationTitle}>{item.local}</Text>
                </View>
                <Text style={styles.locationSub}>{item.subLocal}</Text>
              </View>
              <Text style={styles.timeText}>{item.hora}</Text>
            </View>

            <View style={styles.bottomRow}>
              <View style={[styles.nivelBadge, { backgroundColor: NIVEL_COLORS[item.nivel] || '#2ECC71' }]}>
                <Text style={styles.nivelText}>{item.nivel}</Text>
              </View>
              <View style={styles.infoChips}>
                <View style={styles.chip}>
                  <Ionicons name="people-outline" size={12} color="white" />
                  <Text style={styles.chipText}>{item.tipo}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="cash-outline" size={12} color="white" />
                  <Text style={styles.chipText}>R$ {Number(item.preco).toFixed(0)}</Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => router.push({ pathname: '/match-details', params: { id: item.id } })}
          >
            <Ionicons name="eye-outline" size={18} color="white" />
            <Text style={styles.detailButtonText}>Ver Detalhes</Text>
          </TouchableOpacity>

          {isOwner && (
            <>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => router.push({ pathname: '/match-form', params: { id: item.id } })}
              >
                <Ionicons name="pencil-outline" size={18} color="#2ECC71" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item)}
              >
                <Ionicons name="trash-outline" size={18} color="#E74C3C" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tinder de Peladas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/match-form')}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2ECC71" />
          <Text style={styles.loadingText}>Carregando partidas...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="football-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>Nenhuma partida cadastrada</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/match-form')}
          >
            <Text style={styles.emptyButtonText}>Criar primeira partida</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id!}
          renderItem={renderMatchCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); loadMatches(); }}
              colors={['#2ECC71']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    height: 110, backgroundColor: '#2ECC71',
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingTop: 40, paddingHorizontal: 20,
  },
  headerTitle: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  addButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  listContent: { padding: 20 },
  card: {
    backgroundColor: 'white', borderRadius: 15,
    marginBottom: 25, elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  cardImage: { width: '100%', height: 170 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: 15, padding: 15, justifyContent: 'space-between',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  locationInfo: { flex: 1 },
  locationTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 5 },
  locationSub: { color: '#EEE', fontSize: 13, marginLeft: 23 },
  timeText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  nivelBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  nivelText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  infoChips: { flexDirection: 'row', gap: 6 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8,
    paddingVertical: 4, borderRadius: 10,
  },
  chipText: { color: 'white', fontSize: 11 },
  cardActions: { flexDirection: 'row', padding: 12, gap: 8 },
  detailButton: {
    flex: 1, backgroundColor: '#2ECC71', height: 44,
    borderRadius: 10, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  detailButtonText: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  editButton: {
    width: 44, height: 44, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#2ECC71',
    justifyContent: 'center', alignItems: 'center',
  },
  deleteButton: {
    width: 44, height: 44, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E74C3C',
    justifyContent: 'center', alignItems: 'center',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#888', fontSize: 15 },
  emptyText: { color: '#AAA', fontSize: 16, fontWeight: '500' },
  emptyButton: {
    backgroundColor: '#2ECC71', paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12,
  },
  emptyButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});
