import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Remove duplicate import
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPen, FaInbox, FaUserCircle, FaCog, FaArchive,
  FaBars, FaTimes, FaSignOutAlt
} from 'react-icons/fa';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import PropTypes from 'prop-types';


const navItems = [
  { icon: <FaPen />, label: 'Nova Carta', path: '/dashboard' },
  { icon: <FaInbox />, label: 'Caixa de Entrada', path: '/inbox' },
  { icon: <FaArchive />, label: 'Arquivadas', path: '/archived' },
  { icon: <FaCog />, label: 'Configurações', path: '/settings' },
];

const NavBar = ({ darkMode, isOpen, onToggle }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/profile/${auth.currentUser?.uid}`);
    setShowUserMenu(false);
    if (isMobile) {
      onToggle(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      if (!newIsMobile && !isOpen) {
        onToggle(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onToggle]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => onToggle(false)}
        />
      )}

      {/* NavBar */}
      <motion.nav
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
          x: isOpen ? 0 : -256,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className={`
          fixed 
          left-0 
          top-0 
          h-screen 
          z-50
          ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}
          shadow-lg
          overflow-hidden
        `}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Logo/Brand */}
          <div className={`
            p-6 
            border-b 
            ${darkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <h1 className="text-2xl font-serif">Carta Online</h1>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`
                  flex 
                  items-center 
                  gap-3 
                  px-6 
                  py-3 
                  transition-colors 
                  duration-200
                  ${location.pathname === item.path 
                    ? (darkMode ? 'bg-gray-800' : 'bg-gray-100') 
                    : ''}
                  ${darkMode 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'}
                `}
                onClick={() => isMobile && onToggle(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Profile Section */}
          <div className={`
            border-t 
            ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            mt-auto
          `}>
            <div className="p-4">
              <div className="relative">
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`
                    flex 
                    items-center 
                    gap-3 
                    p-2 
                    rounded-lg
                    cursor-pointer
                    transition-colors
                    duration-200
                    ${darkMode 
                      ? 'hover:bg-gray-800' 
                      : 'hover:bg-gray-100'}
                  `}
                >
                  {auth.currentUser?.photoURL ? (
                    <img 
                      src={auth.currentUser.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={24} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {auth.currentUser?.displayName || 'Usuário'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {auth.currentUser?.email}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`
                        absolute 
                        bottom-full 
                        left-0 
                        w-full 
                        mb-2
                        rounded-lg 
                        shadow-lg 
                        overflow-hidden
                        ${darkMode ? 'bg-gray-800' : 'bg-white'}
                      `}
                    >
                      <button
                        onClick={handleUserClick}
                        className={`
                          w-full 
                          flex 
                          items-center 
                          gap-3 
                          px-4 
                          py-2
                          transition-colors 
                          duration-200
                          ${darkMode 
                            ? 'hover:bg-gray-700 text-gray-100' 
                            : 'hover:bg-gray-100 text-gray-900'}
                        `}
                      >
                        <FaUserCircle />
                        <span>Ver Perfil</span>
                      </button>

                      <button
                        onClick={handleSignOut}
                        className={`
                          w-full 
                          flex 
                          items-center 
                          gap-3 
                          px-4 
                          py-2
                          text-red-500
                          transition-colors 
                          duration-200
                          ${darkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'}
                        `}
                      >
                        <FaSignOutAlt />
                        <span>Sair</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Toggle Button - Only show on mobile */}
      <button
        onClick={() => onToggle(!isOpen)}
        className={`
          fixed 
          top-4 
          left-4 
          z-50 
          p-2 
          rounded-lg
          md:hidden
          ${darkMode 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-900'}
          shadow-lg
        `}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
    </>
  );
};


NavBar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  setIsDarkMode: PropTypes.func.isRequired,
  colors: PropTypes.shape({
    accent: PropTypes.string.isRequired,
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
  }).isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  isOpen: PropTypes.func.isRequired,
  onToggleOpen: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
};



export default NavBar;