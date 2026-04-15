import React from 'react';
import { 
  StyleSheet, View, Text, FlatList, Image, 
  TouchableOpacity, ImageBackground 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dados fictícios para simular as partidas do seu protótipo
const MATCHES = [
  { 
    id: '1', 
    local: 'Rua San Pariama', 
    subLocal: 'Gargnse Konta', 
    hora: '12h00', 
    nivel: 'Amador',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' 
  },
  { 
    id: '2', 
    local: 'Rua San Pariama', 
    subLocal: 'Gargnva Konta', 
    hora: '12h00', 
    nivel: 'Intermediário',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2' 
  },
  { 
    id: '3', 
    local: 'Rua San Pariama', 
    subLocal: 'Gargma Konta', 
    hora: '12h00', 
    nivel: 'Avançado',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d' 
  },
];

export default function HomeScreen() {
  const router = useRouter();

  // Corrigindo o erro de tipagem aqui também com ": { item: any }"
  const renderMatchCard = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <ImageBackground 
        source={{ uri: item.image }} 
        style={styles.cardImage}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.overlay}>
          <View style={styles.cardHeader}>
            <View style={styles.locationInfo}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons name="location" size={18} color="white" />
                <Text style={styles.locationTitle}>{item.local}</Text>
              </View>
              <Text style={styles.locationSub}>{item.subLocal}</Text>
            </View>
            <Text style={styles.timeText}>{item.hora}</Text>
          </View>
          
          <Text style={styles.levelText}>{item.nivel}</Text>
        </View>
      </ImageBackground>

      <TouchableOpacity 
        style={styles.detailButton}
        onPress={() => router.push('/match-details')}
      >
        <Text style={styles.detailButtonText}>Ver Detalhes e Participar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Verde do Tinder de Peladas */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tinder de Peladas</Text>
      </View>

      <FlatList
        data={MATCHES}
        keyExtractor={(item) => item.id}
        renderItem={renderMatchCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 110,
    backgroundColor: '#2ECC71',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  locationSub: {
    color: '#EEE',
    fontSize: 14,
    marginLeft: 23,
  },
  timeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  },
  detailButton: {
    backgroundColor: '#2ECC71',
    margin: 15,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});