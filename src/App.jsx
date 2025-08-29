import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import Rooms from './pages/Rooms';
import Login from './pages/Login';
import Labs from './pages/Labs.jsx';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { auth } from './services/auth.js';
import LabPage from './pages/LabPage';
import ChallengePage from './pages/ChallengePage.jsx';
// Protected Route Component
function ProtectedRoute({ children }) {
  if (!auth.checkAuth()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {

  const lab = {
    name: "Intro Lab",
    desc: "Solve this lab by finding the flag!",
    url: "https://example.com/lab"
  }

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/challenges" element={
          <ProtectedRoute>
            <ChallengePage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        

        
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/:slug" element={<LabPage />} />
      </Routes>
      <Footer />
    </>
  );
}
