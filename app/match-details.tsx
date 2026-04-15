import React from 'react';
import { 
  StyleSheet, View, Text, Image, TouchableOpacity, 
  ScrollView, Dimensions, SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MatchDetailsScreen() {
  const router = useRouter();

  // Lista fictícia de jogadores confirmados (Peladeiros)
  const confirmedPlayers = [
    { id: 1, img: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, img: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, img: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, img: 'https://i.pravatar.cc/150?u=4' },
    { id: 5, img: 'https://i.pravatar.cc/150?u=5' },
    { id: 6, img: 'https://i.pravatar.cc/150?u=6' },
  ];

  return (
    <View style={styles.container}>
      {/* Imagem de Fundo Superior */}
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018' }} 
        style={styles.heroImage} 
      />

      {/* Botão de Voltar com Glassmorphism */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView style={styles.detailsCard} bounces={false}>
        <View style={styles.content}>
          <Text style={styles.matchTitle}>Pelada dos Amigos</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color="#2ECC71" />
            <Text style={styles.locationText}>Arena das Palmeiras, Carandaí - MG</Text>
          </View>

          {/* Grid de Informações Rápidas */}
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Ionicons name="time-outline" size={22} color="#666" />
              <Text style={styles.infoLabel}>Hora</Text>
              <Text style={styles.infoValue}>19:30</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="cash-outline" size={22} color="#666" />
              <Text style={styles.infoLabel}>Preço</Text>
              <Text style={styles.infoValue}>R$ 20,00</Text>
            </View>
            <View style={styles.infoBox}>
              <Ionicons name="people-outline" size={22} color="#666" />
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={styles.infoValue}>5 x 5</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>
            Pelada organizada semanalmente. Nível equilibrado, gramado sintético novo. 
            É necessário confirmar até 2h antes.
          </Text>

          {/* Seção de Peladeiros (Horizontal Scroll) */}
          <View style={styles.playersSection}>
            <Text style={styles.sectionTitle}>Quem vai jogar (6/10)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarList}>
              {confirmedPlayers.map((player) => (
                <Image 
                  key={player.id} 
                  source={{ uri: player.img }} 
                  style={styles.playerAvatar} 
                />
              ))}
              <TouchableOpacity style={styles.addPlayerSlot}>
                <Ionicons name="add" size={24} color="#CCC" />
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Botão de Ação Inferior (Fixo) */}
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
  heroImage: { width: '100%', height: 300, position: 'absolute' },
  backButton: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 12 },
  detailsCard: { marginTop: 250, backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35 },
  content: { padding: 25 },
  matchTitle: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { marginLeft: 5, color: '#666', fontSize: 14 },
  infoGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 25 },
  infoBox: { alignItems: 'center', backgroundColor: '#F8F9FA', padding: 15, borderRadius: 15, width: width * 0.25 },
  infoLabel: { fontSize: 12, color: '#888', marginTop: 5 },
  infoValue: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  descriptionText: { color: '#666', lineHeight: 22, marginBottom: 25 },
  playersSection: { marginBottom: 20 },
  avatarList: { flexDirection: 'row', marginTop: 10 },
  playerAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10, borderWidth: 2, borderColor: '#2ECC71' },
  addPlayerSlot: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#CCC' },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  matchButton: { backgroundColor: '#2ECC71', height: 60, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  matchButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});