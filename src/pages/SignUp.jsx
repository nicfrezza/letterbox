import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaEye, FaEyeSlash, FaGoogle, FaArrowRight } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../config/firebase';

const SignUp = () => {
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isDarkMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Image information content
  const imageInfo = {
    title: "Girl Before the Mirror",
    artist: "Ticiano",
    year: "1576",
    description: "This work is a replica of the picture which in 1515 was in the Gonzaga collection in Mantua and which is now in the Louvre. It is one of the finest works from Titian's youth.",
  };

  const colors = {
    primary: '#F5F5F5',
    secondary: '#6B5E49',
    accent: '#B49F7E',
  };

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccessMessage('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login com Google:', error);
      setErrorMessage(
        error.code === 'auth/popup-closed-by-user'
          ? 'Login cancelado'
          : 'Erro ao criar conta com Google'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, email, password, confirmPassword } = formData;

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Todos os campos são obrigatórios!');
      }

      if (!validateEmail(email)) {
        throw new Error('Email inválido');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não correspondem.');
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name
      });

      setSuccessMessage('Conta criada com sucesso!');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setErrorMessage('Este email já está em uso.');
            break;
          case 'auth/invalid-email':
            setErrorMessage('Email inválido.');
            break;
          case 'auth/operation-not-allowed':
            setErrorMessage('Operação não permitida.');
            break;
          case 'auth/weak-password':
            setErrorMessage('Senha muito fraca.');
            break;
          default:
            setErrorMessage('Erro ao criar conta. Tente novamente.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full px-4 md:px-8 py-6 flex justify-between items-center z-50 
        backdrop-blur-md bg-white/80 shadow-sm">
        <div className="text-2xl font-serif cursor-pointer hover:scale-105 transform transition-all duration-300"
          style={{ color: '#6B5E49' }}>
          LetterBox
        </div>
        <button 
          className="md:hidden" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Section - Image */}
        <div 
          className={`hidden md:block w-1/2 h-screen fixed left-0 top-0 
            ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
            transition-all duration-1000 ease-out`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10" />
          <img
            src="./images/image.png"
            alt="Girl Before the Mirror by Ticiano"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'fallback-image.png';
              console.error('Error loading image');
            }}
          />

          {/* Image Information Box */}
          {isHovered && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 
              bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-xl p-6 z-20
              animate-fade-up transition-all duration-300">
              <h3 className="text-xl font-serif mb-2" style={{ color: colors.secondary }}>
                {imageInfo.title}
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-medium" style={{ color: colors.secondary }}>
                  {imageInfo.artist}
                </p>
                <p className="text-sm opacity-80" style={{ color: colors.secondary }}>
                  {imageInfo.year}
                </p>
                <p className="text-sm italic" style={{ color: colors.secondary }}>
                  {imageInfo.description}
                </p>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <a
                  href="https://artsandculture.google.com/asset/girl-before-the-mirror-0006/BAFrGWxHGr9rVg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Saiba mais sobre Girl Before the Mirror"
                  className="text-xs px-3 py-1 rounded-full transition-all duration-300
                    hover:bg-opacity-20 hover:scale-105 bg-[#B49F7E] text-white
                    hover:bg-[#8B7355]"
                >
                  Saiba mais
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-full min-h-screen flex items-center justify-center p-8 bg-white md:ml-[50%]">
          <div className="w-full max-w-md space-y-8 animate-fade-in px-4">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: '#6B5E49' }}>
              Criar Conta
            </h2>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center mb-6">
                <p className="text-red-600 text-sm">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center mb-6">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300
                      border-gray-200 focus:border-[#B49F7E] peer placeholder-transparent bg-gray-50 focus:bg-white"
                    placeholder="Nome"
                    disabled={isLoading}
                  />
                  <label className="absolute left-4 -top-2.5 text-sm px-2 bg-white transition-all duration-300
                    text-gray-500 peer-focus:text-[#B49F7E]">
                    Nome
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300
                      border-gray-200 focus:border-[#B49F7E] peer placeholder-transparent bg-gray-50 focus:bg-white"
                    placeholder="Email"
                    disabled={isLoading}
                  />
                  <label className="absolute left-4 -top-2.5 text-sm px-2 bg-white transition-all duration-300
                    text-gray-500 peer-focus:text-[#B49F7E]">
                    Email
                  </label>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300
                      border-gray-200 focus:border-[#B49F7E] peer placeholder-transparent bg-gray-50 focus:bg-white"
                    placeholder="Senha"
                    disabled={isLoading}
                  />
                  <label className="absolute left-4 -top-2.5 text-sm px-2 bg-white transition-all duration-300
                    text-gray-500 peer-focus:text-[#B49F7E]">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600
                      transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 border-2 rounded-xl outline-none transition-all duration-300
                      border-gray-200 focus:border-[#B49F7E] peer placeholder-transparent bg-gray-50 focus:bg-white"
                    placeholder="Confirmar Senha"
                    disabled={isLoading}
                  />
                  <label className="absolute left-4 -top-2.5 text-sm px-2 bg-white transition-all duration-300
                    text-gray-500 peer-focus:text-[#B49F7E]">
                    Confirmar Senha
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-white transform 
                  transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-[#B49F7E] to-[#8B7355]
                  flex items-center justify-center space-x-3
                  ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-102'}`}
              >
                <span>{isLoading ? 'Criando conta...' : 'Criar Conta'}</span>
                {!isLoading && <FaArrowRight className="w-4 h-4" />}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Ou continue com</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className={`w-full py-4 border-2 border-gray-200 rounded-xl flex items-center 
                  justify-center space-x-3 transition-all duration-300
                  ${isLoading 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'hover:bg-gray-50 hover:border-[#B49F7E] hover:shadow-md'
                  }`}
              >
                <FaGoogle className="text-red-500 w-5 h-5" />
                <span className="font-medium">
                  {isLoading ? 'Conectando...' : 'Google'}
                </span>
              </button>

              <div className="text-center text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/signin" className="text-[#B49F7E] hover:text-[#8B7355] font-medium">
                  Entre
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;