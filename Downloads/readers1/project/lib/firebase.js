// src/lib/firebase.js

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
// Substitua estas informações pelas suas próprias credenciais do Console do Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCLmBZdFU6cdz-f1qCFf-AYfZI6KF16408",
    authDomain: "readers-4aa03.firebaseapp.com",
    projectId: "readers-4aa03",
    storageBucket: "readers-4aa03.firebasestorage.app",
    messagingSenderId: "447917241737",
    appId: "1:447917241737:web:1ade6d68c73948aa64dd58",
    measurementId: "G-X3V0PQNPST"
  };

// Inicializa o Firebase
let app;

// Verifica se já existe uma instância do Firebase para evitar inicialização dupla
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Exporta os serviços do Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Provedor do Google para autenticação
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Funções úteis relacionadas ao Firebase

// Função para buscar todos os grupos de um usuário
export const getUserGroups = async (userId) => {
  try {
    const groupsQuery = query(
      collection(db, 'readingGroups'),
      where('members', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(groupsQuery);
    const groups = [];
    
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return groups;
  } catch (error) {
    console.error('Erro ao buscar grupos do usuário:', error);
    throw error;
  }
};

// Função para buscar documentos de um grupo
export const getGroupDocuments = async (groupId) => {
  try {
    const documentsQuery = query(
      collection(db, 'documents'),
      where('groupId', '==', groupId)
    );
    
    const querySnapshot = await getDocs(documentsQuery);
    const documents = [];
    
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return documents;
  } catch (error) {
    console.error('Erro ao buscar documentos do grupo:', error);
    throw error;
  }
};

// Função para buscar progresso de leitura de um usuário para um documento
export const getUserDocumentProgress = async (userId, documentId) => {
  try {
    const progressQuery = query(
      collection(db, 'readingProgress'),
      where('userId', '==', userId),
      where('documentId', '==', documentId)
    );
    
    const querySnapshot = await getDocs(progressQuery);
    
    if (querySnapshot.empty) {
      return null; // Nenhum progresso encontrado
    }
    
    // Retorna o primeiro documento de progresso encontrado
    return {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Erro ao buscar progresso de leitura:', error);
    throw error;
  }
};

// Função para buscar a lista de usuários de um grupo
export const getGroupMembers = async (groupId) => {
  try {
    const groupDoc = await getDocs(doc(db, 'readingGroups', groupId));
    
    if (!groupDoc.exists()) {
      throw new Error('Grupo não encontrado');
    }
    
    const members = groupDoc.data().members || [];
    
    if (members.length === 0) {
      return [];
    }
    
    // Buscar detalhes de cada membro
    const usersQuery = query(
      collection(db, 'users'),
      where('__name__', 'in', members)
    );
    
    const querySnapshot = await getDocs(usersQuery);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Erro ao buscar membros do grupo:', error);
    throw error;
  }
};

export default app;