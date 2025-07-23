import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MenuPage from './pages/Menu';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/contacto';

// 🆕 Admin y login
import LoginPage from './pages/LoginPage';
import EntradasAdmin from './pages/EntradasAdmin';
import VinosAdmin from './pages/VinosAdmin'; // si tienes página de vinos admin
import { useAuth } from './hooks/useAuth';
import PlatosFuertesAdmin from './pages/PlatosFuertesAdmin';
import PostresAdmin from './pages/PostresAdmin';
import BebidasAdmin from './pages/BebidasAdmin';
import DesayunossAdmin from './pages/DesayunosAdmin';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* 🆕 Ruta de login */}
        <Route path="/user" element={<LoginPage />} />

        {/* 🛡️ Rutas protegidas de administración */}
        <Route
          path="/admin/entradas"
          element={isAuthenticated ? <EntradasAdmin /> : <Navigate to="/user" />}
        />
        <Route
          path="/admin/platosfuertes"
          element={isAuthenticated ? <PlatosFuertesAdmin /> : <Navigate to="/user" />}
        />
        <Route
          path="/admin/postres"
          element={isAuthenticated ? <PostresAdmin /> : <Navigate to="/user" />}
        />
        <Route
          path="/admin/bebidas"
          element={isAuthenticated ? <BebidasAdmin /> : <Navigate to="/user" />}
        />
        <Route
          path="/admin/vinos"
          element={isAuthenticated ? <VinosAdmin /> : <Navigate to="/user" />}
        />
        <Route
          path="/admin/desayunos"
          element={isAuthenticated ? <DesayunossAdmin /> : <Navigate to="/user" />}
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Mostrar el footer en todas las páginas */}
      <Footer />
    </Router>
  );
};

export default App;
