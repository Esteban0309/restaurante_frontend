import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Estilos personalizados
import logo from '../../public/logos/pngtree-interlaced-vc-and-cv-logo-in-vector-format-with-alphabet-pattern-vector-png-image_39415714.png'; // Ajusta la ruta al logo

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-transparent fixed-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo Vista Hermosa" className="navbar-logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto text-uppercase">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/nosotros">Nosotros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/galeria">Galería</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/menu">Menú</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/blog">Blog</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/contacto">Contacto</Link></li>
          </ul>

          <div className="navbar-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-tripadvisor"></i></a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
