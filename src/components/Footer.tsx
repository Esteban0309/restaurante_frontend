import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer text-white pt-4 pb-3">
      <div className="container text-center">
        <div className="footer-logo mb-3">
          {/* Puedes usar tu logo aquí si quieres */}
          <h5 className="mb-0">Coval Restaurant</h5>
        </div>

        <div className="footer-social mb-3">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
          <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
          <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a href="#" aria-label="TripAdvisor"><i className="fab fa-tripadvisor"></i></a>
        </div>

        <div className="footer-text">
          <p>&copy; 2025 CovalRestaurant. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
