import React from 'react';
import './Nosotros.css'

const Nosotros: React.FC = () => {
  return (
    <>
      <div className="header-imagen-container">
        <img
          className="imagen-header"
          src="/logos/nosotros_back_vista_hermosa.jpg"
          alt="Encabezado Nosotros"
        />
        <h1 className="titulo-superpuesto">NOSOTROS</h1>
      </div>

      <div className="contenido-nosotros">
        <h2>Bienvenidos a Coval Restaurant</h2>
        <p>
          Somos un restaurante dedicado a ofrecer la mejor experiencia gastronómica
          con ingredientes frescos y un ambiente acogedor. Nuestra pasión es
          compartir la cultura y los sabores únicos de nuestra región.
        </p>
        <p>
          Nuestro equipo está comprometido con la calidad y el servicio para que
          cada visita sea inolvidable.
        </p>
        {/* Aquí puedes agregar más contenido, imágenes, etc. */}
      </div>
    </>
  );
};

export default Nosotros;
