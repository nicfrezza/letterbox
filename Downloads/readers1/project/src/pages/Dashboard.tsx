import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, Users, Clock, Plus, Book, Search, Bell, Settings, User, ChevronRight, BarChart2, Bookmark, Inbox, TrendingUp, LogOut, Menu, X, Edit, FileText, Upload, MoreVertical, Download } from 'lucide-react';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  arrayUnion, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase.js';
import { supabase } from '../../lib/supabase.js'; // Importação do cliente Supabase
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ePub from 'epubjs';


// Adicione este estado
const [epubReader, setEpubReader] = useState(null);
const readerContainerRef = useRef(null);

// Adicione esta função para renderizar o EPUB
const renderEpub = async (url) => {
  if (!readerContainerRef.current) return;
  
  const book = ePub(url);
  const rendition = book.renderTo(readerContainerRef.current, {
    width: '100%',
    height: '100%',
    spread: 'none'
  });
  
  await rendition.display();
  setEpubReader(rendition);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Estado do usuário
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  
  // Estados para dados
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [friendsProgress, setFriendsProgress] = useState([]);
  const [recentReads, setRecentReads] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeGroups: 0,
    readingHours: 0
  });
  
  // Estado para modais
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showUploadBookModal, setShowUploadBookModal] = useState(false);
  const [showGroupMenuId, setShowGroupMenuId] = useState(null);
  
  
  // Estados para formulário de criação/edição de grupo
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    bookTitle: '',
    bookAuthor: '',
    totalPages: '',
    dailyGoal: '',
    deadline: '',
    privacy: 'public'
  });
  
  // Estado para edição de grupo existente
  const [editingGroup, setEditingGroup] = useState({
    id: '',
    name: '',
    description: '',
    bookTitle: '',
    bookAuthor: '',
    totalPages: '',
    dailyGoal: '',
    deadline: '',
    privacy: 'public'
  });
  
  // Estado para upload de livro
  const [uploadingGroupId, setUploadingGroupId] = useState(null);
  const [bookFile, setBookFile] = useState(null);
  const [bookType, setBookType] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Refs para os inputs de arquivo
  const fileInputRef = useRef(null);


  // Adicione junto com os outros estados
const [selectedGroupForReading, setSelectedGroupForReading] = useState(null);

  // Verificar autenticação e carregar dados iniciais
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          // Carregar dados do usuário
          await loadUserData(user.uid);
          // Carregar outros dados
          await Promise.all([
            loadUserGroups(user.uid),
            loadFriendsProgress(user.uid),
            loadRecentReads(user.uid),
            loadReadingActivity(user.uid)
          ]);
          setLoading(false);
        } catch (err) {
          console.error("Erro ao carregar dados:", err);
          setError("Falha ao carregar os dados. Por favor, tente novamente.");
          setLoading(false);
        }
      } else {
        // Usuário não está autenticado, redirecionar para login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fechar o menu de grupo quando clicar fora dele
  useEffect(() => {
    const handleClickOutside = () => {
      setShowGroupMenuId(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Carregar dados do usuário a partir do Firestore
  const loadUserData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUserData(userData);
        
        // Atualizar estatísticas
        setStats({
          totalBooks: userData.booksCompleted || 0,
          activeGroups: userData.readingGroups?.length || 0,
          readingHours: Math.round((userData.totalPagesRead || 0) / 20) // Estimativa baseada em páginas lidas
        });
      } else {
        console.warn("Documento do usuário não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      throw error;
    }
  };

  // Carregar grupos de leitura do usuário
  const loadUserGroups = async (userId) => {
    try {
      // Obter referências de grupos do usuário
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists() || !userDoc.data().readingGroups) {
        setUserGroups([]);
        return;
      }
      
      const userGroupIds = userDoc.data().readingGroups;
      
      // Se não há grupos, retornar array vazio
      if (!userGroupIds.length) {
        setUserGroups([]);
        return;
      }
      
      // Buscar detalhes de cada grupo
      const groupsData = [];
      for (const groupId of userGroupIds) {
        const groupDoc = await getDoc(doc(db, 'readingGroups', groupId));
        
        if (groupDoc.exists()) {
          const group = groupDoc.data();
          
          // Buscar capa do livro (se disponível)
          let coverUrl = 'https://via.placeholder.com/60x80';
          if (group.bookCoverId) {
            // Aqui você poderia buscar a URL da capa do livro
            // Por simplicidade, estamos usando um placeholder
          }
          
          // Calcular progresso
          const totalPages = group.totalPages || 300;
          const pagesRead = group.progress?.[userId]?.pagesRead || 0;
          const progressPercentage = Math.round((pagesRead / totalPages) * 100);
          
          // Calcular dias restantes
          const deadline = group.deadline?.toDate() || new Date();
          const today = new Date();
          const daysLeft = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));
          
          // Formatar a data para o formato esperado pelo input date
          const formattedDeadline = group.deadline ? new Date(group.deadline.toDate()).toISOString().split('T')[0] : '';
          
          groupsData.push({
            id: groupDoc.id,
            name: group.name,
            description: group.description || '',
            currentBook: group.bookTitle,
            bookAuthor: group.bookAuthor || '',
            members: group.members?.length || 0,
            pagesRead: pagesRead,
            totalPages: totalPages,
            dailyGoal: group.dailyGoal || 0,
            coverUrl: coverUrl,
            daysLeft: daysLeft,
            progressPercentage: progressPercentage,
            privacy: group.privacy || 'public',
            deadline: formattedDeadline,
            createdBy: group.createdBy,
            bookFilePath: group.bookFilePath || null,
            bookFileURL: group.bookFileURL || null,
            bookFileType: group.bookFileType || null,
            bookFileName: group.bookFileName || null
          });
        }
      }
      
      setUserGroups(groupsData);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      throw error;
    }
  };

  // Funções anteriores permanecem iguais...
  // loadFriendsProgress, loadRecentReads, loadReadingActivity, etc.
  
  // Carregar progresso de leitura dos amigos
  const loadFriendsProgress = async (userId) => {
    try {
      // Primeiro, buscar a lista de amigos do usuário
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists() || !userDoc.data().friends) {
        setFriendsProgress([]);
        return;
      }
      
      const friendIds = userDoc.data().friends;
      
      // Se não há amigos, retornar array vazio
      if (!friendIds.length) {
        setFriendsProgress([]);
        return;
      }
      
      // Buscar dados de cada amigo
      const friendsData = [];
      for (const friendId of friendIds) {
        const friendDoc = await getDoc(doc(db, 'users', friendId));
        
        if (friendDoc.exists()) {
          const friend = friendDoc.data();
          
          // Buscar o livro atual do amigo (se disponível)
          let currentBook = "Nenhum livro atual";
          let progress = 0;
          
          if (friend.currentRead) {
            const readDoc = await getDoc(doc(db, 'reads', friend.currentRead));
            if (readDoc.exists()) {
              const readData = readDoc.data();
              currentBook = readData.bookTitle;
              progress = Math.round((readData.pagesRead / readData.totalPages) * 100);
            }
          }
          
          friendsData.push({
            id: friendId,
            name: friend.name,
            book: currentBook,
            progress: progress,
            avatar: friend.photoURL || 'https://via.placeholder.com/40',
            lastActive: friend.lastActive?.toDate() || new Date()
          });
        }
      }
      
      // Ordenar por última atividade
      friendsData.sort((a, b) => b.lastActive - a.lastActive);
      
      setFriendsProgress(friendsData);
    } catch (error) {
      console.error("Erro ao carregar progresso dos amigos:", error);
      throw error;
    }
  };

  // Carregar histórico de leituras recentes
  const loadRecentReads = async (userId) => {
    try {
      const readsRef = collection(db, 'reads');
      const q = query(readsRef, 
        where('userId', '==', userId),
        orderBy('lastReadAt', 'desc'),
        limit(3)
      );
      
      const querySnapshot = await getDocs(q);
      const readsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const progress = Math.round((data.pagesRead / data.totalPages) * 100);
        
        // Formatar data
        const lastReadDate = data.lastReadAt?.toDate() || new Date();
        const formattedDate = `${lastReadDate.getDate().toString().padStart(2, '0')}/${
          (lastReadDate.getMonth() + 1).toString().padStart(2, '0')}/${
          lastReadDate.getFullYear()}`;
        
        readsData.push({
          id: doc.id,
          title: data.bookTitle,
          author: data.bookAuthor,
          progress: progress,
          lastRead: formattedDate,
          coverUrl: data.coverUrl || 'https://via.placeholder.com/50x70',
          totalPages: data.totalPages,
          pagesRead: data.pagesRead
        });
      });
      
      setRecentReads(readsData);
    } catch (error) {
      console.error("Erro ao carregar leituras recentes:", error);
      throw error;
    }
  };

  // Carregar atividade de leitura da última semana
  const loadReadingActivity = async (userId) => {
    try {
      // Criar um array dos últimos 7 dias
      const activityData = [];
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayIndex = date.getDay();
        
        activityData.push({
          date: date,
          day: days[dayIndex],
          pages: 0 // Valor padrão
        });
      }
      
      // Buscar registros de leitura da última semana
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      const readingActivityRef = collection(db, 'readingActivity');
      const q = query(readingActivityRef, 
        where('userId', '==', userId),
        where('date', '>=', startDate),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Preencher dados reais
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const activityDate = data.date.toDate();
        
        // Encontrar o dia correspondente no array
        const dayIndex = activityData.findIndex(item => {
          const itemDate = item.date;
          return itemDate.getDate() === activityDate.getDate() && 
                 itemDate.getMonth() === activityDate.getMonth() &&
                 itemDate.getFullYear() === activityDate.getFullYear();
        });
        
        if (dayIndex !== -1) {
          activityData[dayIndex].pages = data.pagesRead;
        }
      });
      
      setActivityData(activityData);
    } catch (error) {
      console.error("Erro ao carregar atividade de leitura:", error);
      throw error;
    }
  };

  // Função para lidar com logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setError("Falha ao fazer logout. Por favor, tente novamente.");
    }
  };

  // Funções para o formulário de criação/edição de grupo
  const handleInputChange = (e, isEditForm = false) => {
    const { name, value } = e.target;
    
    if (isEditForm) {
      setEditingGroup(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewGroup(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Função para exibir menu de opções do grupo
  const handleGroupMenuClick = (e, groupId) => {
    e.stopPropagation();
    setShowGroupMenuId(prevId => prevId === groupId ? null : groupId);
  };

  // Função para abrir modal de edição
  const handleEditGroup = (group) => {
    setEditingGroup({
      id: group.id,
      name: group.name,
      description: group.description,
      bookTitle: group.currentBook,
      bookAuthor: group.bookAuthor,
      totalPages: group.totalPages.toString(),
      dailyGoal: group.dailyGoal.toString(),
      deadline: group.deadline,
      privacy: group.privacy
    });
    setShowEditGroupModal(true);
    setShowGroupMenuId(null);
  };
  
  // Função para abrir modal de upload de livro
  const handleShowUploadBookModal = (groupId) => {
    setUploadingGroupId(groupId);
    setBookFile(null);
    setBookType('');
    setUploadProgress(0);
    setShowUploadBookModal(true);
    setShowGroupMenuId(null);
  };

  // Função para lidar com a seleção de arquivo
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Verificar tipo de arquivo
  const fileName = file.name.toLowerCase();
  const fileType = file.type; // Pegamos o MIME type do arquivo
  
  // Verificação mais robusta do tipo de arquivo
  if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
    setBookType('pdf');
    setBookFile(file);
  } else if (fileName.endsWith('.epub') || fileType === 'application/epub+zip') {
    setBookType('epub');
    setBookFile(file);
  } else {
    setError("Apenas arquivos PDF ou EPUB são aceitos.");
    return;
  }
  
  console.log('File selected:', {
    name: file.name,
    type: file.type,
    size: file.size
  });
};
  // Função para criar um novo grupo
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!newGroup.name || !newGroup.bookTitle || !newGroup.totalPages || !newGroup.deadline) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Criar novo documento de grupo no Firestore
      const groupRef = await addDoc(collection(db, 'readingGroups'), {
        name: newGroup.name,
        description: newGroup.description,
        bookTitle: newGroup.bookTitle,
        bookAuthor: newGroup.bookAuthor,
        totalPages: parseInt(newGroup.totalPages),
        dailyGoal: parseInt(newGroup.dailyGoal) || 10,
        deadline: new Date(newGroup.deadline),
        privacy: newGroup.privacy,
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        members: [currentUser.uid],
        progress: {
          [currentUser.uid]: {
            pagesRead: 0,
            lastUpdate: serverTimestamp()
          }
        }
      });
      
      // Adicionar grupo à lista de grupos do usuário
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        readingGroups: arrayUnion(groupRef.id)
      });
      
      // Recarregar grupos do usuário
      await loadUserGroups(currentUser.uid);
      
      // Resetar formulário e fechar modal
      setNewGroup({
        name: '',
        description: '',
        bookTitle: '',
        bookAuthor: '',
        totalPages: '',
        dailyGoal: '',
        deadline: '',
        privacy: 'public'
      });
      setShowCreateGroupModal(false);
      
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      setError("Falha ao criar o grupo. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar um grupo existente
  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    
    if (!editingGroup.name || !editingGroup.bookTitle || !editingGroup.totalPages || !editingGroup.deadline) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    try {
      setLoading(true);
      
      const groupRef = doc(db, 'readingGroups', editingGroup.id);
      await updateDoc(groupRef, {
        name: editingGroup.name,
        description: editingGroup.description,
        bookTitle: editingGroup.bookTitle,
        bookAuthor: editingGroup.bookAuthor,
        totalPages: parseInt(editingGroup.totalPages),
        dailyGoal: parseInt(editingGroup.dailyGoal) || 10,
        deadline: new Date(editingGroup.deadline),
        privacy: editingGroup.privacy,
        updatedAt: serverTimestamp()
      });
      
      // Recarregar grupos do usuário
      await loadUserGroups(currentUser.uid);
      
      setShowEditGroupModal(false);
      
    } catch (error) {
      console.error("Erro ao atualizar grupo:", error);
      setError("Falha ao atualizar o grupo. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBook = async (e) => {
    e.preventDefault();
    
    if (!bookFile) {
      setError("Por favor, selecione um arquivo.");
      return;
    }
    
    try {
      setLoading(true);
      setUploadProgress(0);
      
      // Limpar o nome do arquivo
      const cleanFileName = bookFile.name
        .replace(/[^a-zA-Z0-9.]/g, '_') // Substitui caracteres especiais por underscore
        .replace(/__+/g, '_')           // Remove underscores múltiplos
        .toLowerCase();                  // Converte para minúsculas
  
      // Criar um caminho para o arquivo
      const timestamp = Date.now();
      const filePath = `${uploadingGroupId}/${timestamp}_${cleanFileName}`;
      
      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('books')
        .upload(filePath, bookFile, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }

    // Obter URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from('books')
      .getPublicUrl(filePath);
    
    if (!urlData?.publicUrl) {
      throw new Error("Falha ao obter URL do arquivo");
    }
    
    const downloadURL = urlData.publicUrl;
    
    // Atualizar progresso para mostrar que o upload foi concluído
    setUploadProgress(100);
    
    // Atualizar o documento do grupo com as informações do arquivo
    const groupRef = doc(db, 'readingGroups', uploadingGroupId);
    await updateDoc(groupRef, {
      bookFilePath: filePath,
      bookFileURL: downloadURL,
      bookFileType: bookType,
      bookFileName: bookFile.name,
      updatedAt: serverTimestamp()
    });
    
    // Recarregar grupos do usuário
    await loadUserGroups(currentUser.uid);
    
    setShowUploadBookModal(false);
    setUploadingGroupId(null);
    setBookFile(null);
    setBookType('');
    
  } catch (error) {
    console.error("Erro detalhado:", error);
    setError(error.message || "Falha ao fazer upload do arquivo. Por favor, tente novamente.");
  } finally {
    setLoading(false);
  }
};

  // Função para baixar o livro
  const handleDownloadBook = (group) => {
    if (!group.bookFileURL) {
      setError("Este grupo não possui um arquivo de livro disponível.");
      return;
    }
    
    // Abrir o link de download em uma nova aba
    window.open(group.bookFileURL, '_blank');
  };

  // Função para atualizar progresso de leitura
  const handleUpdateProgress = async (groupId, pagesRead) => {
    try {
      setLoading(true);
      
      // Atualizar progresso no documento do grupo
      const groupRef = doc(db, 'readingGroups', groupId);
      await updateDoc(groupRef, {
        [`progress.${currentUser.uid}.pagesRead`]: pagesRead,
        [`progress.${currentUser.uid}.lastUpdate`]: serverTimestamp()
      });
      
      // Adicionar registro na atividade de leitura
      await addDoc(collection(db, 'readingActivity'), {
        userId: currentUser.uid,
        groupId: groupId,
        pagesRead: pagesRead,
        date: new Date(),
        createdAt: serverTimestamp()
      });
      
      // Atualizar total de páginas lidas pelo usuário
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const currentTotal = userDoc.data().totalPagesRead || 0;
        await updateDoc(userDocRef, {
          totalPagesRead: currentTotal + pagesRead
        });
      }
      
      // Recarregar dados
      await Promise.all([
        loadUserGroups(currentUser.uid),
        loadReadingActivity(currentUser.uid)
      ]);
      
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      setError("Falha ao atualizar progresso. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Renderização condicional durante carregamento
  if (loading && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Renderização de erro
  if (error && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center bg-red-50 p-6 rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">Erro ao carregar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-2 text-gray-600 lg:hidden" 
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-xl font-semibold truncate max-w-[120px] sm:max-w-full">LeituraGrupo</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:flex mr-3 items-center">
                <div className="relative">
                  <input 
                    type="text" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2" 
                    placeholder="Buscar..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
              </div>
              <button className="p-1 mr-4 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-1 mr-4 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 hidden sm:block">
                <Settings className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <img 
                  className="h-8 w-8 rounded-full mr-2" 
                  src={currentUser?.photoURL || "https://via.placeholder.com/32"} 
                  alt="Usuário" 
                />
                <span className="text-sm font-medium text-gray-700 mr-2 hidden sm:inline">{userData?.name || currentUser?.displayName}</span>
                <button 
                  onClick={handleLogout}
                  className="p-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Sidebar - Versão para telas grandes */}
      <aside 
        className="fixed top-0 left-0 z-20 w-64 h-full pt-16 bg-white border-r border-gray-200 hidden lg:block" 
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center p-2 text-base font-medium text-white rounded-lg bg-indigo-600 hover:bg-indigo-700">
                <BarChart2 className="w-6 h-6 text-white" />
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                <Users className="w-6 h-6 text-indigo-500" />
                <span className="ml-3">Meus Grupos</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                <Book className="w-6 h-6 text-indigo-500" />
                <span className="ml-3">Biblioteca</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                <Bookmark className="w-6 h-6 text-indigo-500" />
                <span className="ml-3">Leituras Salvas</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                <Inbox className="w-6 h-6 text-indigo-500" />
                <span className="ml-3">Mensagens</span>
                <span className="inline-flex items-center justify-center w-5 h-5 ml-3 text-xs font-semibold text-white bg-indigo-500 rounded-full">
                  {userData?.unreadMessages || 0}
                </span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                <User className="w-6 h-6 text-indigo-500" />
                <span className="ml-3">Perfil</span>
              </a>
            </li>
          </ul>
          <div className="pt-5 mt-5 space-y-2 border-t border-gray-200">
            <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 transition duration-75 rounded-lg hover:bg-gray-100 group">
              <Settings className="w-6 h-6 text-indigo-500" />
              <span className="ml-3">Configurações</span>
            </a>
            <button 
              onClick={handleLogout}
              className="flex w-full items-center p-2 text-base font-medium text-gray-700 transition duration-75 rounded-lg hover:bg-gray-100 group"
            >
              <LogOut className="w-6 h-6 text-indigo-500" />
              <span className="ml-3">Sair</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Sidebar - Versão móvel */}
      {showSidebar && (
        <div className="lg:hidden">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40" onClick={() => setShowSidebar(false)}></div>
          <aside 
            className="fixed top-0 left-0 z-50 w-64 h-full pt-16 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out"
            aria-label="Sidebar"
          >
            <div className="absolute top-3 right-3">
              <button 
                onClick={() => setShowSidebar(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="h-full px-3 py-4 overflow-y-auto">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center p-2 text-base font-medium text-white rounded-lg bg-indigo-600 hover:bg-indigo-700">
                    <BarChart2 className="w-6 h-6 text-white" />
                    <span className="ml-3">Dashboard</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                    <Users className="w-6 h-6 text-indigo-500" />
                    <span className="ml-3">Meus Grupos</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                    <Book className="w-6 h-6 text-indigo-500" />
                    <span className="ml-3">Biblioteca</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                    <Bookmark className="w-6 h-6 text-indigo-500" />
                    <span className="ml-3">Leituras Salvas</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                    <Inbox className="w-6 h-6 text-indigo-500" />
                    <span className="ml-3">Mensagens</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 ml-3 text-xs font-semibold text-white bg-indigo-500 rounded-full">
                      {userData?.unreadMessages || 0}
                    </span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100">
                    <User className="w-6 h-6 text-indigo-500" />
                    <span className="ml-3">Perfil</span>
                  </a>
                </li>
              </ul>
              <div className="pt-5 mt-5 space-y-2 border-t border-gray-200">
                <a href="#" className="flex items-center p-2 text-base font-medium text-gray-700 transition duration-75 rounded-lg hover:bg-gray-100 group">
                  <Settings className="w-6 h-6 text-indigo-500" />
                  <span className="ml-3">Configurações</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center p-2 text-base font-medium text-gray-700 transition duration-75 rounded-lg hover:bg-gray-100 group"
                >
                  <LogOut className="w-6 h-6 text-indigo-500" />
                  <span className="ml-3">Sair</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-4 lg:ml-64 pt-20">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Olá, {userData?.name || currentUser?.displayName || "Leitor"}!</h2>
                <p className="mt-1">
                  {userData?.totalPagesRead > 0 
                    ? `Você leu ${userData?.weeklyPages || 0} páginas esta semana.`
                    : "Comece a registrar seu progresso de leitura nos grupos."}
                </p>
                {userGroups.length > 0 && (
                  <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition duration-300">
                    Continuar Lendo
                  </button>
                )}
              </div>
              <div className="hidden md:block">
                <TrendingUp className="w-24 h-24 text-indigo-200" />
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Livros</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBooks}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Grupos Ativos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.activeGroups}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Horas de Leitura</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.readingHours}</p>
                </div>
              </div>
            </div>
          </div>

        {/* Reading Groups and Create Group Button */}
<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold text-gray-800">Meus Grupos de Leitura</h2>
  <button 
    onClick={() => setShowCreateGroupModal(true)}
    className="flex items-center text-sm font-medium px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
  >
    <Plus className="w-4 h-4 mr-2" />
    Criar Novo Grupo
  </button>
</div>

{userGroups.length === 0 ? (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Sem grupos de leitura</h3>
    <p className="text-gray-500 mb-4">
      Você ainda não participa de nenhum grupo de leitura. Crie seu primeiro grupo ou encontre grupos existentes para participar.
    </p>
    <button
      onClick={() => setShowCreateGroupModal(true)}
      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
    >
      <Plus className="w-4 h-4 mr-2" />
      Criar meu primeiro grupo
    </button>
  </div>
) : (
  <div className="grid md:grid-cols-2 gap-6">
    {userGroups.map((group) => (
      <div 
        key={group.id} 
        className="bg-white p-5 rounded-lg shadow-md relative hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => setSelectedGroupForReading(group)}
      >
        <div 
          className="absolute top-4 right-4 z-10"
          onClick={(e) => e.stopPropagation()} // Previne que o clique no menu propague para o card
        >
          <button 
            onClick={(e) => handleGroupMenuClick(e, group.id)}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {/* Menu de opções do grupo */}
          {showGroupMenuId === group.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <div className="py-1">
                {group.createdBy === currentUser.uid && (
                  <button
                    onClick={() => handleEditGroup(group)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar grupo
                  </button>
                )}
                
                <button
                  onClick={() => handleShowUploadBookModal(group.id)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {group.bookFileURL ? 'Substituir arquivo do livro' : 'Adicionar arquivo do livro'}
                </button>
                
                {group.bookFileURL && (
                  <button
                    onClick={() => handleDownloadBook(group)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar livro
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex group-hover:opacity-90 transition-opacity">
          <img src={group.coverUrl} alt={group.name} className="h-20 w-15 rounded" />
          <div className="ml-4 flex-1">
            <div className="flex justify-between pr-8">
              <h3 className="font-semibold text-lg text-indigo-600">{group.name}</h3>
              <span className="text-sm text-gray-500">{group.members} membros</span>
            </div>
            <p className="text-gray-600 mt-1">
              Lendo: <span className="font-medium">{group.currentBook}</span>
              {group.bookFileURL && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  <FileText className="w-3 h-3 mr-1" />
                  {group.bookFileType.toUpperCase()}
                </span>
              )}
            </p>
            <div className="mt-3 flex justify-between items-center">
              <div className="w-2/3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progresso</span>
                  <span>{group.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${group.progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">Prazo</span>
                <p className={`font-medium ${group.daysLeft <= 3 ? 'text-red-500' : 'text-gray-900'}`}>
                  {group.daysLeft} dias
                </p>
              </div>
            </div>

            {/* Botão Ler */}
            {group.bookFileURL && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGroupForReading(group);
                  }}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Indicador visual de que o card é clicável */}
        <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-5 rounded-lg transition-opacity"></div>
      </div>
    ))}
  </div>
)}
          {/* Resto do conteúdo igual ao anterior */}
          {/* ... */}
        </div>
      </div>
      
      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Criar Novo Grupo de Leitura</h3>
                <button 
                  onClick={() => setShowCreateGroupModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Grupo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newGroup.name}
                    onChange={(e) => handleInputChange(e, false)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ex: Clube do Livro - Clássicos"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newGroup.description}
                    onChange={(e) => handleInputChange(e, false)}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Descreva o propósito do seu grupo de leitura..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">Título do Livro</label>
                  <input
                    type="text"
                    id="bookTitle"
                    name="bookTitle"
                    value={newGroup.bookTitle}
                    onChange={(e) => handleInputChange(e, false)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Título do livro que o grupo vai ler"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="bookAuthor" className="block text-sm font-medium text-gray-700">Autor do Livro</label>
                  <input
                    type="text"
                    id="bookAuthor"
                    name="bookAuthor"
                    value={newGroup.bookAuthor}
                    onChange={(e) => handleInputChange(e, false)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Nome do autor"
                  />
                </div>
                
                <div>
                  <label htmlFor="totalPages" className="block text-sm font-medium text-gray-700">Total de Páginas</label>
                  <input
                    type="number"
                    id="totalPages"
                    name="totalPages"
                    value={newGroup.totalPages}
                    onChange={(e) => handleInputChange(e, false)}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ex: 300"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dailyGoal" className="block text-sm font-medium text-gray-700">Meta de páginas/dia</label>
                    <input
                      type="number"
                      id="dailyGoal"
                      name="dailyGoal"
                      value={newGroup.dailyGoal}
                      onChange={(e) => handleInputChange(e, false)}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ex: 20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Prazo de Conclusão</label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={newGroup.deadline}
                      onChange={(e) => handleInputChange(e, false)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Privacidade</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="privacy-public"
                        name="privacy"
                        type="radio"
                        value="public"
                        checked={newGroup.privacy === 'public'}
                        onChange={(e) => handleInputChange(e, false)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="privacy-public" className="ml-2 block text-sm text-gray-700">
                        Público (Qualquer pessoa pode ver e solicitar para participar)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="privacy-private"
                        name="privacy"
                        type="radio"
                        value="private"
                        checked={newGroup.privacy === 'private'}
                        onChange={(e) => handleInputChange(e, false)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="privacy-private" className="ml-2 block text-sm text-gray-700">
                        Privado (Apenas por convite)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateGroupModal(false)}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Criando...' : 'Criar Grupo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Group Modal */}
      {showEditGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Editar Grupo de Leitura</h3>
                <button 
                  onClick={() => setShowEditGroupModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleUpdateGroup} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Nome do Grupo</label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editingGroup.name}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ex: Clube do Livro - Clássicos"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Descrição</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editingGroup.description}
                    onChange={(e) => handleInputChange(e, true)}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Descreva o propósito do seu grupo de leitura..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="edit-bookTitle" className="block text-sm font-medium text-gray-700">Título do Livro</label>
                  <input
                    type="text"
                    id="edit-bookTitle"
                    name="bookTitle"
                    value={editingGroup.bookTitle}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Título do livro que o grupo vai ler"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-bookAuthor" className="block text-sm font-medium text-gray-700">Autor do Livro</label>
                  <input
                    type="text"
                    id="edit-bookAuthor"
                    name="bookAuthor"
                    value={editingGroup.bookAuthor}
                    onChange={(e) => handleInputChange(e, true)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Nome do autor"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-totalPages" className="block text-sm font-medium text-gray-700">Total de Páginas</label>
                  <input
                    type="number"
                    id="edit-totalPages"
                    name="totalPages"
                    value={editingGroup.totalPages}
                    onChange={(e) => handleInputChange(e, true)}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Ex: 300"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-dailyGoal" className="block text-sm font-medium text-gray-700">Meta de páginas/dia</label>
                    <input
                      type="number"
                      id="edit-dailyGoal"
                      name="dailyGoal"
                      value={editingGroup.dailyGoal}
                      onChange={(e) => handleInputChange(e, true)}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Ex: 20"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-deadline" className="block text-sm font-medium text-gray-700">Prazo de Conclusão</label>
                    <input
                      type="date"
                      id="edit-deadline"
                      name="deadline"
                      value={editingGroup.deadline}
                      onChange={(e) => handleInputChange(e, true)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Privacidade</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="edit-privacy-public"
                        name="privacy"
                        type="radio"
                        value="public"
                        checked={editingGroup.privacy === 'public'}
                        onChange={(e) => handleInputChange(e, true)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="edit-privacy-public" className="ml-2 block text-sm text-gray-700">
                        Público (Qualquer pessoa pode ver e solicitar para participar)
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="edit-privacy-private"
                        name="privacy"
                        type="radio"
                        value="private"
                        checked={editingGroup.privacy === 'private'}
                        onChange={(e) => handleInputChange(e, true)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="edit-privacy-private" className="ml-2 block text-sm text-gray-700">
                        Privado (Apenas por convite)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditGroupModal(false)}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Book Modal */}
      {showUploadBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {userGroups.find(g => g.id === uploadingGroupId)?.bookFileURL ? 'Substituir Arquivo do Livro' : 'Adicionar Arquivo do Livro'}
                </h3>
                <button 
                  onClick={() => setShowUploadBookModal(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                  <p>{error}</p>
                </div>
              )}
              
              <form onSubmit={handleUploadBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o arquivo PDF ou EPUB do livro
                  </label>
                  
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="book-file"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Selecionar arquivo</span>
                          <input 
                            id="book-file" 
                            name="book-file" 
                            type="file" 
                            ref={fileInputRef}
                            className="sr-only" 
                            accept=".pdf,.epub"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF ou EPUB até 50MB
                      </p>
                    </div>
                  </div>
                  
                  {bookFile && (
                    <div className="mt-3 bg-indigo-50 p-3 rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-indigo-700 truncate">{bookFile.name}</span>
                      </div>
                      <p className="text-xs text-indigo-500 mt-1">
                        {(bookFile.size / (1024 * 1024)).toFixed(2)} MB • {bookType.toUpperCase()}
                      </p>
                    </div>
                  )}
                </div>
                
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadBookModal(false)}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !bookFile}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Enviar Arquivo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      
{selectedGroupForReading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
    <div className="absolute inset-0 flex flex-col bg-white lg:p-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{selectedGroupForReading.name}</h2>
          <p className="text-gray-600">
            {selectedGroupForReading.currentBook} - {selectedGroupForReading.bookAuthor}
          </p>
        </div>
        <button 
          onClick={() => {
            setSelectedGroupForReading(null);
            if (epubReader) {
              epubReader.destroy();
              setEpubReader(null);
            }
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 rounded-lg relative">
        {selectedGroupForReading.bookFileType === 'pdf' ? (
          <iframe
            src={selectedGroupForReading.bookFileURL}
            className="w-full h-full rounded-lg"
            title="PDF Reader"
          />
        ) : selectedGroupForReading.bookFileType === 'epub' ? (
          <>
            <div 
              ref={readerContainerRef} 
              className="w-full h-full"
            />
            {/* Controles do EPUB */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-lg shadow-lg p-2">
              <button
                onClick={() => epubReader?.prev()}
                className="p-2 hover:bg-gray-100 rounded"
              >
                Anterior
              </button>
              <button
                onClick={() => epubReader?.next()}
                className="p-2 hover:bg-gray-100 rounded"
              >
                Próxima
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Formato de arquivo não suportado.</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

// Adicione este useEffect para inicializar o leitor EPUB
useEffect(() => {
  if (
    selectedGroupForReading?.bookFileType === 'epub' &&
    selectedGroupForReading?.bookFileURL &&
    readerContainerRef.current
  ) {
    renderEpub(selectedGroupForReading.bookFileURL);
  }

  return () => {
    if (epubReader) {
      epubReader.destroy();
      setEpubReader(null);
    }
  };
}, [selectedGroupForReading]);


      
      {/* Notification for errors while using the dashboard */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button 
                  onClick={() => setError(null)} 
                  className="inline-flex text-red-500 hover:text-red-600"
                >
                  <span className="sr-only">Fechar</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;