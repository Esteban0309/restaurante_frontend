import React from 'react';
import { useParams } from 'react-router-dom';
import { menuData } from '../data/menuData';

const CategoriaPage: React.FC = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  const categoria = menuData[categoriaId ?? ''];

  if (!categoria) {
    return <h2 className="text-center mt-5">Categoría no encontrada</h2>;
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">{categoria.nombre}</h2>
      <div className="row">
        {categoria.platos.map((plato, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{plato.nombre}</h5>
                <p className="card-text">{plato.descripcion}</p>
                <p className="card-text"><strong>{plato.precio}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriaPage;
