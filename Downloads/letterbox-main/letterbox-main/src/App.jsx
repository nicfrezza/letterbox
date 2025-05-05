import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './App.css';
import Home from './pages/HomePage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn'; 
import CartaForm from './pages/Dashboard'; 
import UserPage from './pages/Profile'; 
import InBox from './pages/InBox';
import About from './pages/About';


function App() {
  return (
    <div className="App">
      <h1>Bem-vindo ao meu projeto React!</h1>
    </div>
  );
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} /> 
        <Route path="dashboard" element={<CartaForm />} /> 
        <Route path="/profile/:userId" element={<UserPage />} /> 
        <Route path="about" element={<About />} /> 
        <Route path="inbox" element={<InBox />} /> 
      </Routes>
    </Router>
  </StrictMode>
);

export default App;
