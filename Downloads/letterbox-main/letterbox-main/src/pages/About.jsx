import  { useState, useEffect } from 'react';
import Navigation from '../Components/Navigation';


const About = () => {
    const [currentPage, setCurrentPage] = useState(2); // Set to 2 for About page
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
  
  
  // Image information content
  const imageInfo = {
    title: "Young Girl Reading",
    artist: "Jean-Honoré Fragonard",
    year: "1769",
    description: "Fragonard’s brushwork is as much the subject of this painting as the young woman. A flurry of rapid marks captures her blushing face.",

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

      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-screen pt-20">
        {/* Left Section */}
        <div className={`w-full md:w-1/2 flex flex-col justify-center px-8 md:pl-20
          transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
          <div className="space-y-2 text-left">
            <h1 className="text-6xl md:text-8xl font-serif leading-tight text-left hover:tracking-wider
              transition-all duration-300 cursor-default" style={{ color: colors.secondary }}>
              About
            </h1>
            <h1 className="text-6xl md:text-8xl font-serif leading-tight text-left hover:tracking-wider
              transition-all duration-300 cursor-default" style={{ color: colors.secondary }}>
              Us
            </h1>
          </div>
          
          <p className="mt-6 text-lg italic font-light max-w-md text-left transform hover:scale-105
            transition-all duration-300" style={{ color: colors.secondary }}>
            Bem-vindo ao LetterBox, um espaço onde o passado encontra o presente, e a arte da escrita renasce em um mundo digital. Inspirados pelos tempos em que cartas eram o meio mais nobre de expressar sentimentos, criamos um lugar onde você pode compartilhar mensagens digitais com o charme e a elegância das épocas passadas.

Cada carta é mais do que palavras: é uma experiência. Decoradas com obras de arte renomadas e envolvidas por um toque de nostalgia, nossas cartas oferecem uma maneira única de se reconectar com aqueles que você ama, valorizando a beleza da escrita e das emoções genuínas.

Nosso objetivo é transformar suas mensagens em obras de arte atemporais, inspiradas pelos grandes mestres e por um desejo de resgatar a delicadeza das interações humanas.

Entre e permita-se viajar no tempo, onde cada detalhe conta e cada palavra carrega um pedacinho da sua alma.
          </p>
        </div>

        {/* Right Section - Decorative Elements */}
        <div className="w-full md:w-1/2 relative">
          <div className="absolute right-0 w-2/3 h-full rounded-l-[40px] shadow-lg transform -skew-x-3
            hover:skew-x-0 transition-all duration-500" style={{ backgroundColor: colors.accent }} />
          
          {/* Image Container with Info */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative group"
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>
              <img 
                src="./images/gir_reading-removebg-preview.png"
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
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <a
                      href="https://artsandculture.google.com/asset/young-girl-reading-0009/JgFJCH9wxBktkg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="text-xs px-3 py-1 rounded-full transition-all duration-300
                        hover:bg-opacity-20 hover:scale-105"
                        style={{ backgroundColor: `${colors.accent}10` }}>
                        Learn More
                      </button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;