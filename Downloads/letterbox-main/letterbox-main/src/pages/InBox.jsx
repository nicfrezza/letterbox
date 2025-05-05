// CartaForm.jsx - Part 1: Imports and Initial State Setup
import  { useState, useEffect, useRef } from 'react';
import { 
   FaMoon, FaSun, FaPaperPlane, FaSave, FaShare, FaFont, 
  FaUndo, FaRedo, FaBold, FaItalic, FaUnderline, FaList,
  FaAlignLeft, FaAlignCenter, FaAlignRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import NavBar from '../Components/NavBar';

const InBox = () => {
  // Basic States
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ setProgress] = useState(0);
  const [fontSize] = useState('medium');
  const [showFormatting, setShowFormatting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [draftSaved, setDraftSaved] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);

  // Form and User Search States
  const [formData, setFormData] = useState({
    recipientName: '',
    senderAddress: '',
    content: '',
    recipientId: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(window.innerWidth >= 768);



  formattingOptions
  // Text Formatting States
  const [ setSelectedText] = useState({
    start: 0,
    end: 0,
    text: ''
  });

  const [formatOptions, setFormatOptions] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignment: 'left',
    fontSize: '16px',
    textColor: '#000000'
  });

  // Refs
  const textAreaRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  // Template Definitions
  const templates = [
    { id: 'blank', name: 'Em branco' },
    { id: 'formal', name: 'Formal' },
    { id: 'casual', name: 'Casual' },
    { id: 'holiday', name: 'Festivo' },
  ];

  const templateContents = {
    blank: {
      content: '',
      recipientName: '',
      senderAddress: '',
      formatting: {
        fontSize: '16px',
        textColor: '#000000',
        alignment: 'left'
      }
    },
    formal: {
      content: 'Prezado(a) [Nome],\n\nEspero que esta carta o(a) encontre bem. ...\n\nAtenciosamente,\n[Seu Nome]',
      recipientName: '',
      senderAddress: '',
      formatting: {
        fontSize: '16px',
        textColor: '#000000',
        alignment: 'left'
      }
    },
    casual: {
      content: 'Oi [Nome]!\n\nComo você está? Espero que tudo bem. ...\n\nAbraços,\n[Seu Nome]',
      recipientName: '',
      senderAddress: '',
      formatting: {
        fontSize: '18px',
        textColor: '#2C3E50',
        alignment: 'left'
      }
    },
    holiday: {
      content: 'Querido(a) [Nome],\n\nNesta época festiva, gostaria de desejar... \n\nCom carinho,\n[Seu Nome]',
      recipientName: '',
      senderAddress: '',
      formatting: {
        fontSize: '18px',
        textColor: '#34495E',
        alignment: 'center'
      }
    }
  };

  // Formatting toolbar options
  const formattingOptions = [
    { icon: <FaBold />, tooltip: 'Negrito', action: 'bold' },
    { icon: <FaItalic />, tooltip: 'Itálico', action: 'italic' },
    { icon: <FaUnderline />, tooltip: 'Sublinhado', action: 'underline' },
    { icon: <FaAlignLeft />, tooltip: 'Alinhar à esquerda', action: 'left' },
    { icon: <FaAlignCenter />, tooltip: 'Centralizar', action: 'center' },
    { icon: <FaAlignRight />, tooltip: 'Alinhar à direita', action: 'right' },
    { icon: <FaList />, tooltip: 'Lista', action: 'list' },
  ];


  // User Search Function
  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const users = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.name?.toLowerCase().includes(query.toLowerCase()) || 
            userData.email?.toLowerCase().includes(query.toLowerCase())) {
          users.push({
            id: doc.id,
            ...userData
          });
        }
      });
      
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Firebase Message Functions
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const messagesCollection = collection(db, "messages");
      const querySnapshot = await getDocs(messagesCollection);
      const messagesList = [];
      querySnapshot.forEach((doc) => {
        messagesList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesList);
    } catch (error) {
      console.error("Error fetching messages: ", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const saveMessageToFirebase = async (messageData) => {
    try {
      if (!formData.recipientId) {
        throw new Error("Por favor, selecione um destinatário válido");
      }

      const messagesCollection = collection(db, "messages");
      const docRef = await addDoc(messagesCollection, {
        ...messageData,
        timestamp: serverTimestamp(),
        recipientId: formData.recipientId,
        recipientName: formData.recipientName,
        senderId: auth.currentUser?.uid,
        senderName: auth.currentUser?.displayName,
        formData: {
          ...formData,
          content: formData.content
        },
        formatOptions: formatOptions
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving message: ", error);
      throw error;
    }
  };

  // Text Formatting Handlers
  const handleTextSelect = () => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const text = textAreaRef.current.value.substring(start, end);
      setSelectedText({ start, end, text });
    }
  };

 
  
  // Form Handlers
  const handleTemplateChange = (e) => {
    const selectedTemplateId = e.target.value;
    setSelectedTemplate(selectedTemplateId);
    
    const templateContent = templateContents[selectedTemplateId];
    
    setFormData(prev => ({
      ...prev,
      content: templateContent.content,
      recipientName: templateContent.recipientName || prev.recipientName,
      senderAddress: templateContent.senderAddress || prev.senderAddress
    }));

    if (templateContent.formatting) {
      setFormatOptions(prev => ({
        ...prev,
        ...templateContent.formatting
      }));
    }

    const words = templateContent.content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'content') {
      const words = value.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
      
      undoStack.current.push(value);
    }
  };

  const handleUndo = () => {
    if (undoStack.current.length > 1) {
      const currentState = undoStack.current.pop();
      redoStack.current.push(currentState);
      const previousState = undoStack.current[undoStack.current.length - 1];
      setFormData(prev => ({ ...prev, content: previousState }));
    }
  };

  const handleRedo = () => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop();
      undoStack.current.push(nextState);
      setFormData(prev => ({ ...prev, content: nextState }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!selectedUser) {
        throw new Error("Por favor, selecione um destinatário válido");
      }
      
   
      
      await fetchMessages();
      alert('Carta enviada com sucesso!');
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert(error.message || 'Erro ao enviar a carta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const autosaveDraft = async () => {
    try {
      await saveMessageToFirebase({
        isDraft: true,
        darkMode,
        fontSize,
        selectedTemplate,
        wordCount
      });
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    } catch (error) {
      console.error("Error saving draft: ", error);
      alert('Erro ao salvar rascunho. Tente novamente.');
    }
  };

  // Effects
  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // CartaForm.jsx - Part 3: JSX Rendering and Component Export

return (
  <div className="flex h-screen w-full overflow-hidden bg-[#E8E1D5]"> {/* Changed background here */}
  <NavBar 
    darkMode={darkMode} 
    isOpen={isNavOpen}
    onToggle={setIsNavOpen}
  />
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        flex-1 
        flex 
        flex-col 
        h-screen
        w-full
        overflow-hidden 
        transition-all 
        duration-300
        ${isNavOpen ? 'md:ml-64' : 'ml-0'}
        ${darkMode 
          ? 'bg-gray-900 text-gray-100' 
          : 'bg-[#E8E1D5] bg-[url("/images/Background.png")] bg-cover bg-no-repeat'}
      `}
    >
      {/* Header */}
      <header className={`
        sticky 
        top-0 
        w-full 
        z-40 
        bg-opacity-95 
        backdrop-blur-md 
        p-4 
        flex 
        justify-between 
        items-center 
        border-b 
        border-gray-200 
        dark:border-gray-700 
        shadow-sm
        transition-all 
        duration-300
        ${isNavOpen ? 'md:pl-4' : 'pl-16 md:pl-4'}
      `}>
     <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              className={`px-3 py-1 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white/90 border-[#D4C5B2]'
              } border-2`}
              value={selectedTemplate}
              onChange={handleTemplateChange}
              onMouseEnter={() => setShowTemplatePreview(true)}
              onMouseLeave={() => setShowTemplatePreview(false)}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            
            <AnimatePresence>
              {showTemplatePreview && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 w-64"
                >
                  <h3 className="font-medium mb-2">
                    {templates.find(t => t.id === selectedTemplate)?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {templateContents[selectedTemplate].content.substring(0, 100)}...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleUndo}
              className="p-2 rounded-lg hover:bg-gray-200/20"
              disabled={undoStack.current.length <= 1}
            >
              <FaUndo />
            </button>
            <button 
              onClick={handleRedo}
              className="p-2 rounded-lg hover:bg-gray-200/20"
              disabled={redoStack.current.length === 0}
            >
              <FaRedo />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {draftSaved && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-green-500"
            >
              Rascunho salvo
            </motion.span>
          )}
          <button
            onClick={() => setShowFormatting(!showFormatting)}
            className="p-2 rounded-lg hover:bg-gray-200/20"
          >
            <FaFont />
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-full bg-opacity-80 backdrop-blur-sm"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-700" />
            )}
          </motion.button>
        </div>
      </header>

       {/* Main Content */}
       <main className={`
        flex-1 
        w-full 
        overflow-y-auto 
        p-4 
        relative 
        z-0
        transition-all 
        duration-300
        ${isNavOpen ? 'md:pl-4' : 'pl-4'}
      `}>
        <div className="
          max-w-4xl 
          mx-auto 
          w-full 
          px-4 
          sm:px-6 
          lg:px-8 
          py-6
          space-y-6
        ">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipient Search Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-1">
                Nome do destinatário
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  searchUsers(e.target.value);
                }}
                className={`w-full p-3 rounded-lg ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white/90 border-[#D4C5B2] text-gray-900'
                } border-2 focus:outline-none focus:ring-2 focus:ring-[#B49F7E]`}
                placeholder="Digite o nome do destinatário"
              />
              
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#B49F7E]"></div>
                </div>
              )}

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchTerm(user.name || user.email);
                        setSearchResults([]);
                        setFormData(prev => ({
                          ...prev,
                          recipientName: user.name || user.email,
                          recipientId: user.id
                        }));
                      }}
                      className={`p-3 cursor-pointer flex items-center gap-3 ${
                        darkMode 
                          ? 'hover:bg-gray-700 text-white' 
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {user.photoURL && (
                        <img 
                          src={user.photoURL}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Conteúdo da carta
              </label>
              <textarea
                ref={textAreaRef}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                onSelect={handleTextSelect}
                rows={12}
                style={{
                  textAlign: formatOptions.alignment,
                  fontSize: formatOptions.fontSize,
                  color: formatOptions.textColor
                }}
                className={`w-full p-6 rounded-lg ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white/90 border-[#D4C5B2]'
                } border-2 focus:outline-none focus:ring-2 focus:ring-[#B49F7E] resize-none font-serif
                ${formatOptions.bold ? 'font-bold' : ''}
                ${formatOptions.italic ? 'italic' : ''}
                ${formatOptions.underline ? 'underline' : ''}`}
                placeholder="Escreva sua mensagem..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={autosaveDraft}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-lg"
                >
                  <FaSave /> Salvar rascunho
                </motion.button>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500/20 rounded-lg"
                >
                  <FaShare /> Compartilhar
                </motion.button>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[#8B7355] hover:bg-[#6B5E49] text-white rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <FaPaperPlane /> Enviar carta
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Messages Display */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4"></h2>
            {loadingMessages ? (
              <div className="text-center">Carregando mensagens...</div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      darkMode ? 'bg-gray-800' : 'bg-white/90'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">
                          Para: {message.formData.recipientName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          De: {message.formData.senderAddress}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {message.timestamp?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2">{message.formData.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`
        sticky 
        bottom-0 
        w-full 
        z-40 
        p-4 
        flex 
        justify-end 
        items-center 
        gap-4 
        text-sm 
        text-gray-500 
        bg-opacity-95 
        backdrop-blur-md
        transition-all 
        duration-300
        ${isNavOpen ? 'md:pl-4' : 'pl-16 md:pl-4'}
      `}>
        <span>Palavras: {wordCount}</span>
        <span>Caracteres: {formData.content.length}/1000</span>
      </footer>
    </motion.div>
  </div>
);

};

export default InBox;