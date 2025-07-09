import React from 'react';
import { Link } from 'react-router-dom';
import { menuData } from '../data/menuData';

const Home: React.FC = () => {
  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Categorías del Menú</h2>
      <div className="row justify-content-center">
        {Object.entries(menuData).map(([key, { nombre }]) => (
          <div key={key} className="col-md-3 mb-4">
            <div className="card text-center h-100 shadow">
              <div className="card-body d-flex flex-column justify-content-center">
                <h5 className="card-title mb-3">{nombre}</h5>
                <Link to={`/${key}`} className="btn btn-primary mt-auto">
                  Ver {nombre}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
