import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoriaPage from './pages/CategoriaPage';
import MenuPage from './pages/Menu';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:categoriaId" element={<CategoriaPage />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
  