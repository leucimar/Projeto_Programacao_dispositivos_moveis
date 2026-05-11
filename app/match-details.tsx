import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, Image, TouchableOpacity,
  ScrollView, Dimensions, ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getMatchById, Match } from '../services/matchDatabase';

const { width } = Dimensions.get('window');

export default function MatchDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getMatchById(id).then((data) => {
        setMatch(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  const confirmedPlayers = [
    { id: 1, img: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, img: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, img: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, img: 'https://i.pravatar.cc/150?u=4' },
  ];

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#2ECC71" /></View>;
  }

  if (!match) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={60} color="#CCC" />
        <Text style={{ color: '#888', marginTop: 12, fontSize: 16 }}>Partida não encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#2ECC71', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: match.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' }}
        style={styles.heroImage}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView style={styles.detailsCard} bounces={false}>
        <View style={styles.content}>
          <Text style={styles.matchTitle}>{match.local}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#2ECC71" />
            <Text style={styles.locationText}>{match.subLocal}</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={22} color="#666" />
              <Text style={styles.infoLabel}>Hora</Text>
              <Text style={styles.infoValue}>{match.hora}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="cash-outline" size={22} color="#666" />
              <Text style={styles.infoLabel}>Preço</Text>
              <Text style={styles.infoValue}>R$ {Number(match.preco).toFixed(2)}</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="people-outline" size={22} color="#666" />
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>{match.tipo}</Text>
            </View>
          </View>

          <View style={styles.nivelRow}>
            <Text style={styles.sectionTitle}>Nível</Text>
            <View style={[styles.nivelBadge,
              { backgroundColor: match.nivel === 'Avançado' ? '#E74C3C' : match.nivel === 'Intermediário' ? '#F39C12' : '#2ECC71' }
            ]}>
              <Text style={styles.nivelText}>{match.nivel}</Text>
            </View>
          </View>

          {!!match.descricao && (
            <>
              <Text style={styles.sectionTitle}>Descrição</Text>
              <Text style={styles.descriptionText}>{match.descricao}</Text>
            </>
          )}

          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>
              Quem vai jogar ({confirmedPlayers.length}/{match.maxJogadores})
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
              {confirmedPlayers.map((player) => (
                <Image key={player.id} source={{ uri: player.img }} style={styles.playerAvatar} />
              ))}
              <TouchableOpacity style={styles.addPlayerSlot}>
                <Ionicons name="add" size={24} color="#CCC" />
              </TouchableOpacity>
            </ScrollView>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push({ pathname: '/match-form', params: { id: match.id } })}
          >
            <Ionicons name="pencil-outline" size={18} color="#2ECC71" />
            <Text style={styles.editButtonText}>Editar esta partida</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.matchButton}>
          <FontAwesome5 name="futbol" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.matchButtonText}>DAR MATCH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2ECC71' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  heroImage: { width: '100%', height: 300, position: 'absolute' },
  backButton: {
    position: 'absolute', top: 50, left: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 12,
  },
  detailsCard: { marginTop: 250, backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  content: { padding: 25 },
  matchTitle: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { marginLeft: 5, color: '#666', fontSize: 14 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 25 },
  infoBox: { alignItems: 'center', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, width: width * 0.25 },
  infoLabel: { fontSize: 12, color: '#888', marginTop: 5 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  nivelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  nivelBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  nivelText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  descriptionText: { color: '#666', lineHeight: 22, marginBottom: 25 },
  playersSection: { marginBottom: 20 },
  playerAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10, borderWidth: 2, borderColor: '#2ECC71' },
  addPlayerSlot: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0',
    justifyContent: 'center', alignItems: 'center',
    borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC',
  },
  editButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: '#2ECC71', borderRadius: 12,
    paddingVertical: 12, marginTop: 10,
  },
  editButtonText: { color: '#2ECC71', fontWeight: 'bold', fontSize: 15 },
  footer: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: 'white', padding: 20,
    borderTopWidth: 1, borderTopColor: '#EEE',
  },
  matchButton: {
    backgroundColor: '#2ECC71', height: 60, borderRadius: 15,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  matchButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
