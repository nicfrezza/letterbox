import { useNavigate } from 'react-router-dom';
import { FaPen, FaBars, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';




const Navigation = ({ 
  isDarkMode, 
  setIsDarkMode, 
  colors, 
  currentPage, 
  setCurrentPage, 
  isMenuOpen, 
  setIsMenuOpen 
}) => {
  const navigate = useNavigate();
  
  const pages = [
    { id: 0, title: "Home" },
    { id: 2, title: "About" }
  ];

  const handleNavigation = (pageTitle, pageId) => {
    if (pageTitle === "About") {
      navigate("/about");
    } else if (pageTitle === "Home") {
      navigate("/");
    }
    setCurrentPage(pageId);
  };

  return (
    <>
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-opacity-20 backdrop-blur-sm
          hover:bg-opacity-30 transition-all duration-300"
        style={{ backgroundColor: colors.accent }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 w-full px-4 md:px-8 py-6 flex justify-between items-center z-20
        backdrop-blur-sm bg-opacity-80" style={{ backgroundColor: colors.primary }}>
        {/* Logo */}
        <div 
          className="text-2xl font-serif cursor-pointer hover:scale-105 transform transition-all duration-300"
          style={{ color: colors.secondary }}
          onClick={() => navigate('/')}
        >
          LetterBox
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <div className={`flex flex-col md:flex-row gap-8 items-center absolute md:relative top-0 right-0
          h-screen md:h-auto w-64 md:w-auto p-8 md:p-0 bg-white md:bg-transparent transform transition-transform duration-300
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handleNavigation(page.title, page.id)}
              className={`px-4 py-2 font-medium transition-all duration-300 relative hover:scale-105
                ${currentPage === page.id ? 'text-[#6B5E49]' : 'text-[#6B5E49]/60 hover:text-[#6B5E49]'}`}
            >
              {page.title}
              {currentPage === page.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B49F7E] rounded-full
                  animate-pulse" />
              )}
            </button>
          ))}
          <button className="ml-4 px-6 py-2 bg-[#B49F7E] text-white rounded-lg hover:bg-[#9A8768]
            transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 flex items-center gap-2">
            <FaPen className="w-3 h-3 animate-spin-slow" />
            <span>Write</span>
          </button>
        </div>
      </nav>
    </>
  );
};

Navigation.propTypes = {
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
};


export default Navigation;