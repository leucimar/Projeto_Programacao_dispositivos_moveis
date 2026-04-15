import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = () => {
    signOut(auth).then(() => {
      router.replace('/login'); // Volta para a tela de login
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Jogador'}</Text>
        <Text style={styles.userLocation}>Carandaí, MG</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Partidas</Text>
        </View>
        <View style={[styles.statBox, styles.borderLateral]}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Avaliação</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>Amador</Text>
          <Text style={styles.statLabel}>Nível</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#2ECC71" />
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#2ECC71" />
          <Text style={styles.menuText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF5252" />
          <Text style={[styles.menuText, {color: '#FF5252'}]}>Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#2ECC71', paddingBottom: 40, alignItems: 'center', paddingTop: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  profileImageContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFF', padding: 3, marginBottom: 15 },
  profileImage: { width: '100%', height: '100%', borderRadius: 60 },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#27AE60', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  userName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  userLocation: { color: '#E8F5E9', fontSize: 16 },
  statsContainer: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -30, borderRadius: 15, paddingVertical: 20, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  statBox: { flex: 1, alignItems: 'center' },
  borderLateral: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#F0F0F0' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#2ECC71' },
  statLabel: { fontSize: 12, color: '#888' },
  menuContainer: { padding: 20, marginTop: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' }
});