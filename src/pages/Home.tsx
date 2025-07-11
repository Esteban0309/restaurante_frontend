import React from 'react';
import './Home.css'; // Estilos personalizados

const Home: React.FC = () => {
  return (
    <div className="hero-container">
      <div className="overlay">
        <div className="content text-center text-white">
          <h3 className="text-uppercase text-highlight">COVAL</h3>
          <h1 className="display-4 fw-bold">Restaurant</h1>
          <p className="lead mb-4">Música en vivo los días viernes y sábados en la noche</p>
          <a href="/menu" className="btn btn-primary btn-lg">Ver Menú</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
