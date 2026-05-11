import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export interface Match {
  id?: string;
  local: string;
  subLocal: string;
  hora: string;
  nivel: 'Amador' | 'Intermediário' | 'Avançado';
  image: string;
  preco: number;
  tipo: string;
  descricao: string;
  maxJogadores: number;
  criadoEm?: any;
  criadoPor?: string; // uid do criador
}

const COLLECTION = 'matches';

// READ — listar todas as partidas
export const getAllMatches = async (): Promise<Match[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Match));
};

// READ — buscar uma partida por ID
export const getMatchById = async (id: string): Promise<Match | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Match;
};

// CREATE — salva uid do criador automaticamente
export const createMatch = async (match: Omit<Match, 'id' | 'criadoEm' | 'criadoPor'>): Promise<string> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Usuário não autenticado.');
  const ref = await addDoc(collection(db, COLLECTION), {
    ...match,
    criadoPor: uid,
    criadoEm: serverTimestamp(),
  });
  return ref.id;
};

// UPDATE — só o criador pode atualizar
export const updateMatch = async (id: string, match: Omit<Match, 'id' | 'criadoEm' | 'criadoPor'>): Promise<void> => {
  const uid = auth.currentUser?.uid;
  const existing = await getMatchById(id);
  if (!existing) throw new Error('Partida não encontrada.');
  if (existing.criadoPor !== uid) throw new Error('Você não tem permissão para editar esta partida.');
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...match });
};

// DELETE — só o criador pode deletar
export const deleteMatch = async (id: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  const existing = await getMatchById(id);
  if (!existing) throw new Error('Partida não encontrada.');
  if (existing.criadoPor !== uid) throw new Error('Você não tem permissão para excluir esta partida.');
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
};

// Utilitário — verifica se o usuário atual é o criador
export const isOwner = (match: Match): boolean => {
  return !!auth.currentUser && auth.currentUser.uid === match.criadoPor;
};
