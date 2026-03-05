import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Fertilizer from './pages/Fertilizer';
import Disease from './pages/Disease';
import ProtectedRoute from './components/ProtectedRoute';
import { LanguageProvider } from './contexts/LanguageContext';


// Add inside Routes:


function App() {
  return (
      <LanguageProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>

          <Route path="/dashboard" element={
             <ProtectedRoute> 
              <Dashboard />
             </ProtectedRoute>
             
          } />
          <Route path="/fertilizer" element={
            <ProtectedRoute>
              <Fertilizer />
            </ProtectedRoute>
          } />

       

<Route path="/disease" element={
  <ProtectedRoute>
    <Disease />
  </ProtectedRoute>
} />


        </Route>
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;