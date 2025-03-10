import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import PDFReader from './pages/PDFReader';
import CreateGroup from './pages/CreateGroup';
import Welcome from './pages/Home';
import Login from './pages/SignIn';
import Signup from './pages/SignUp';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path='/'  element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/reader/:groupId/:documentId" element={<PDFReader />} />
            <Route path="/create-group" element={<CreateGroup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;