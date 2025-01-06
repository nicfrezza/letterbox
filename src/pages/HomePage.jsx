import React, { useState, useEffect } from 'react';
import { FaPen, FaBars, FaTimes } from 'react-icons/fa';
import '/Users/offfservicosdetecnologia/Downloads/letterbox/src/App.css'
import { useNavigate } from "react-router-dom";
import Navigation from '../Components/Navigation';




const Home = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false) // define o estado para saber se imagem está sendo hovered
  const handleMouseEnter = () => setIsHovered(true) // função chamada quando o mouse entra na area da imagem
  const handleMouseLeave = () => setIsHovered(false) // função chamadao mouse sai da area da imagem
  const navigate = useNavigate();
  
  // Image information content
  const imageInfo = {
    title: "Girl Before the Mirror",
    artist: "Ticiano",
    year: "1576",
    description: "This work is a replica of the picture which in 1515 was in the Gonzaga collection in Mantua and which is now in the Louvre. It is one of the finest works from Titian's youth.",

};


  const pages = [
    { id: 0, title: "Home" },
    { id: 2, title: "About" }
  ];


  const handleNavigation = (pageTitle, pageId) => {
    if (pageTitle === "About") {
      navigate("/about");
    } else {
      setCurrentPage(pageId);
      navigate("/");
    }
  };

  // Animation on component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Color scheme
  const colors = {
    primary: isDarkMode ? '#2D3748' : '#F5F5F5',
    secondary: isDarkMode ? '#4A5568' : '#6B5E49',
    accent: isDarkMode ? '#805AD5' : '#B49F7E',
    text: isDarkMode ? '#FFFFFF' : '#2D3748',
  };

  return (
    <div className={`relative h-screen w-full transition-colors duration-500 overflow-hidden
      ${isDarkMode ? 'bg-gray-900' : 'bg-[#F5F5F5]'}`}>
      
      <Navigation 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        colors={colors}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      
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
        <div className="text-2xl font-serif cursor-pointer hover:scale-105 transform transition-all duration-300"
          style={{ color: colors.secondary }}>
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

      {/* Left Section */}
      <div className={`absolute left-0 w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:pl-20
        transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="space-y-2 text-left">
          <h1 className="text-6xl md:text-8xl font-serif leading-tight text-left hover:tracking-wider
            transition-all duration-300 cursor-default" style={{ color: colors.secondary }}>
            Letter
          </h1>
          <h1 className="text-6xl md:text-8xl font-serif leading-tight text-left hover:tracking-wider
            transition-all duration-300 cursor-default" style={{ color: colors.secondary }}>
            Box
          </h1>
        </div>
        
        <p className="mt-6 text-lg italic font-light max-w-md text-left transform hover:scale-105
          transition-all duration-300" style={{ color: colors.secondary }}>
          "Porque metade de mim é amor e a outra metade também"
        </p>
        
        <button className="mt-8 flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300
          shadow-md hover:shadow-xl hover:scale-105 group bg-opacity-90 hover:bg-opacity-100"
          style={{ backgroundColor: colors.accent, color: colors.primary }}>
          <FaPen className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          <a href="/signup">
          <span className="font-medium">Escreva sua carta</span>
          </a>
        </button>
      </div>

       {/* Right Section - Decorative Elements */}
       <div className={`absolute right-0 w-1/2 h-full hidden md:block transform transition-all duration-1000
        ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="absolute right-0 w-2/3 h-full rounded-l-[40px] shadow-lg transform -skew-x-3
          hover:skew-x-0 transition-all duration-500" style={{ backgroundColor: colors.accent }} />
        
        {/* Image Container with Info */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative group"
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}>
            <img 
              src="./images/woman_with_a_mirror-removebg-preview.png"
              alt="Decorative Letter" 
              className="h-4/5 object-contain z-10 transform translate-x-[-10%] 
                transition-all duration-500 group-hover:scale-105 group-hover:rotate-2"
            />
            
            {/* Image Information Box */}
            {isHovered && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 
                bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-xl p-6 z-20
                animate-fade-up transition-all duration-300"
                style={{ 
                  backgroundColor: isDarkMode ? 'rgba(45, 55, 72, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                  color: colors.secondary 
                }}>
                <h3 className="text-xl font-serif mb-2">{imageInfo.title}</h3>
                <div className="space-y-2">
                  <p className="text-sm font-medium">{imageInfo.artist}</p>
                  <p className="text-sm text-opacity-80">{imageInfo.year}</p>
                  <p className="text-sm italic">{imageInfo.description}</p>
                  <p className="text-xs font-light mt-2">{imageInfo.details}</p>
                </div>
                
                {/* Interactive Elements */}
                <div className="mt-4 flex justify-between items-center">
                    <a
                    href="https://artsandculture.google.com/asset/girl-before-the-mirror-0006/BAFrGWxHGr9rVg"
                    target="_blank" // Abre o link em uma nova aba
                    rel="noopener noreferrer" // Segurança ao abrir em nova aba
                    >
                  <button className="text-xs px-3 py-1 rounded-full transition-all duration-300
                    hover:bg-opacity-20 hover:scale-105"
                    style={{ backgroundColor: `${colors.accent}10` }}>
                    Learn More
                  </button>
                  </a>
                  <div className="flex gap-2">
                
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  
    </div>
  );
};

export default Home;