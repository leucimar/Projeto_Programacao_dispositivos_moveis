import React from 'react';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DATA = [
  { id: '1', title: 'Pelada de Terça', date: '12 Abr 2026', score: '5 - 3', status: 'Vitória' },
  { id: '2', title: 'Clássico da Arena', date: '08 Abr 2026', score: '2 - 2', status: 'Empate' },
  { id: '3', title: 'Jogo Beneficente', date: '01 Abr 2026', score: '1 - 4', status: 'Derrota' },
];

export default function HistoryScreen() {
  const renderItem = ({ item } : {item: any}) => (
    <View style={styles.matchCard}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.teamContainer}>
          <Ionicons name="shirt" size={24} color="#2ECC71" />
          <Text style={styles.teamName}>Meu Time</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.score}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Vitória' ? '#E8F5E9' : item.status === 'Empate' ? '#FFF3E0' : '#FFEBEE' }]}>
            <Text style={{ fontSize: 10, color: item.status === 'Vitória' ? '#2ECC71' : item.status === 'Empate' ? '#FF9800' : '#FF5252' }}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.teamContainer}>
          <Text style={[styles.teamName, { textAlign: 'right' }]}>Adversário</Text>
          <Ionicons name="shirt" size={24} color="#555" />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Partidas</Text>
      </View>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { height: 100, backgroundColor: '#2ECC71', justifyContent: 'center', alignItems: 'center', paddingTop: 30 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  matchCard: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2 },
  dateContainer: { borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 10, marginBottom: 10 },
  dateText: { color: '#888', fontSize: 12 },
  matchInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  teamContainer: { flex: 1, alignItems: 'center', flexDirection: 'row', gap: 5 },
  teamName: { fontSize: 14, fontWeight: '500', color: '#333', flex: 1 },
  scoreContainer: { alignItems: 'center', flex: 0.6 },
  scoreText: { fontSize: 22, fontWeight: 'bold', color: '#2ECC71' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, marginTop: 5 }
});