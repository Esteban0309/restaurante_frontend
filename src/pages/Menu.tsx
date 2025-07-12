import React, { useState } from 'react';
import { menuData } from '../data/menuData';

const MenuPage: React.FC = () => {
    const categorias = Object.keys(menuData);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(categorias[0]);

    const menu = menuData[categoriaSeleccionada];

    return (
        <div className="container my-5">
            <h2>Menu Data</h2>
            {/* Botones de categorías */}
            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
                {categorias.map((categoria) => (
                    <button
                        key={categoria}
                        onClick={() => setCategoriaSeleccionada(categoria)}
                        className={`btn rounded-pill ${categoria === categoriaSeleccionada ? 'btn-primary text-white' : 'btn-secondary text-white'
                            }`}
                    >
                        {menuData[categoria].nombre.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Platos de la categoría seleccionada */}
            <h2 className="mb-4 text-center">{menu.nombre}</h2>
            <div className="row">
                {menu.platos.map((plato, index) => (
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

export default MenuPage;
