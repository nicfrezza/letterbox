import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import CartaForm from './pages/Dashboard';
import './App.css'; 


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<CartaForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;