import React from 'react';
import './Nosotros.css';

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
        <div className="bienvenida">
          <h2>Bienvenidos a Coval Restaurant</h2>
          <p>
            Somos un restaurante dedicado a ofrecer la mejor experiencia gastronómica con ingredientes frescos y un ambiente acogedor.
            Nuestra pasión es compartir la cultura y los sabores únicos de nuestra región. Nuestro equipo está comprometido con la calidad
            y el servicio para que cada visita sea inolvidable.
          </p>
        </div>

        <div className="contenedor-mv">
          <div className="caja">
            <h3>Misión</h3>
            <p>
              Brindar una experiencia culinaria que celebre la riqueza gastronómica del Ecuador, ofreciendo platos tradicionales elaborados
              con ingredientes locales, en un ambiente acogedor y familiar que resalte nuestra cultura y hospitalidad.
            </p>
          </div>
          <div className="caja">
            <h3>Visión</h3>
            <p>
              Convertirnos en un referente de cocina ecuatoriana a nivel nacional e internacional, promoviendo nuestras raíces culturales
              a través de la gastronomía y generando un impacto positivo en nuestra comunidad y el turismo local.
            </p>
          </div>
        </div>
      </div>

      
      <div className="separador">
        <img
          src="https://vistahermosa.ec/wp-content/uploads/2018/04/cocteles1.jpg"
          alt="Separador decorativo"
        />
      </div>

      
      <section className="beneficios-nosotros">
        <div className="beneficio">
          <h2><span className="resaltado">Música</span><br />en vivo</h2>
          <p>Vista Hermosa ofrece música en vivo todos los días Viernes y Sábados en las noches.</p>
        </div>
        <div className="beneficio">
          <h2><span className="resaltado">Estacionamiento</span><br />San Isidro del Inca</h2>
          <p>Parqueadero Cadisán está ubicado a pocos metros del restaurante.</p>
        </div>
        <div className="beneficio">
          <h2><span className="resaltado">Estacionamiento</span><br />Nayon</h2>
          <p>Parqueadero propio para 6 vehículos y alternativa de aparcamiento en la calle Manuel Samaniego.</p>
        </div>
        <div className="beneficio">
          <h2><span className="resaltado">Cortesía para</span><br />cumpleañeros</h2>
          <p>
            El beneficio para el cumpleañero es un postre de cortesía o un cóctel gratis. <br />
            <em>*Es necesario presentar cédula</em>
          </p>
        </div>
      </section>
    </>
  );
};

export default Nosotros;
