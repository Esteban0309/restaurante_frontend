import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../public/logos/pngtree-interlaced-vc-and-cv-logo-in-vector-format-with-alphabet-pattern-vector-png-image_39415714.png';
import './Navbar.css';
import { getToken, clearToken } from '../services/auth';

const CustomNavbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      {isLoggedIn && (
        <div className="admin-navbar">
          <span className="admin-title">Panel admin:</span>
          <Nav className="admin-links">
            <Link to="/admin/entradas" className="admin-link">Entradas</Link>
            <Link to="/admin/platosfuertes" className="admin-link">Platos Fuertes</Link>
            <Link to="/admin/postres" className="admin-link">Postres</Link>
            <Link to="/admin/bebidas" className="admin-link">Bebidas</Link>
            <Link to="/admin/vinos" className="admin-link">Vinos</Link>
            <Link to="/admin/desayunos" className="admin-link">Desayunos</Link>
            <button onClick={handleLogout} className="admin-logout-btn">Cerrar sesión</button>
          </Nav>
        </div>
      )}

      <Navbar expand="lg" fixed="top" className={`navbar-transparent ${isLoggedIn ? 'with-admin-bar' : ''}`}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto text-uppercase">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/nosotros">Nosotros</Nav.Link>
              <Nav.Link as={Link} to="/menu">Menú</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
            </Nav>

            <div className="navbar-icons">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-tripadvisor"></i></a>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default CustomNavbar;
