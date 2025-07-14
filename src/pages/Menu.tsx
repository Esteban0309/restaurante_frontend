import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Entrada } from '../type';
import './Menu.css';

type Categoria = 'entradas' | 'platosfuertes' | 'postres' | 'bebidas' | 'vinos';

const categorias: { key: Categoria; label: string }[] = [
  { key: 'entradas', label: 'ENTRADAS' },
  { key: 'platosfuertes', label: 'PLATOS FUERTES' },
  { key: 'postres', label: 'POSTRES' },
  { key: 'bebidas', label: 'BEBIDAS' },
  { key: 'vinos', label: 'VINOS' },
];

function Menu() {
  const [categoria, setCategoria] = useState<Categoria>('entradas');
  const [items, setItems] = useState<Entrada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.get(`/${categoria}`)
      .then((response: any) => {
        let data;

        if (categoria === 'vinos') {
          // Esperamos un array directamente
          data = Array.isArray(response.data) ? response.data : [];
        } else {
          // Esperamos un objeto con data.items
          data = response.data?.data?.items || [];
        }

        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, [categoria]);


  const grupos = items.reduce<Record<string, Entrada[]>>((acc, item) => {
    const key = item.tipo;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  // 2. Ordenamos los items dentro de cada grupo por id
  Object.keys(grupos).forEach(tipo => {
    grupos[tipo].sort((a, b) => a.id - b.id);
  });

  // 3. Ordenamos los tipos según el menor id de su primer elemento
  const tiposOrdenados = Object.entries(grupos)
    .sort(([, aItems], [, bItems]) => aItems[0].id - bItems[0].id)
    .map(([tipo]) => tipo);

  const formatPrecio = (precio: number | null | undefined) => {
    return typeof precio === 'number' ? `$${precio.toFixed(2)}` : '-';
  };

  return (
    <>
      <div className="header-imagen-container">
        <img className="imagen-header" src="/logos/header_menu.jpg" alt="Encabezado menú" />
        <h1 className="titulo-superpuesto">MENÚ</h1>
      </div>
      <div className="menu-container">

        {/* Navbar para cambiar tabla */}
        <nav className="submenu">
          {categorias.map(cat => (
            <button
              key={cat.key}
              className={categoria === cat.key ? 'activo' : ''}
              onClick={() => setCategoria(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Contenido agrupado por tipo */}
        <div className="lista-items">
          {loading && <p>Cargando {categoria}...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && items.length === 0 && (
            <p>No hay {categoria} para mostrar.</p>
          )}
          {!loading && !error && tiposOrdenados.map(tipo => (
            <div key={tipo} className="grupo-tipo">
              <h2 className="titulo-tipo">
                {categoria === 'vinos'
                  ? `VINO ${tipo.toUpperCase()}`
                  : tipo.toUpperCase()}
              </h2>
              <hr />

              {categoria === 'vinos' && (
                <div className="encabezado-precio-vinos">
                  <span className="espacio-nombre" />
                  <span className="columna-precio">Copa</span>
                  <span className="columna-precio">Botella</span>
                </div>
              )}

              {grupos[tipo].map(item => (
                <div key={item.id} className="item-menu">
                  <div className="info-item">
                    <strong className="nombre-item">{item.nombre}.</strong>
                    <p className="descripcion-item">{item.descripcion}</p>
                  </div>

                  {categoria === 'vinos' ? (
                    <>
                      <div className="precio-vino">
                        <span className="precio-copa">{formatPrecio(item.precioCopa)}</span>
                        <span className="precio-botella">{formatPrecio(item.precioBotella)}</span>
                      </div>

                    </>
                  ) : (
                    <div className="precio-item">
                      ${
                        typeof item.precio === 'number'
                          ? item.precio.toFixed(2)
                          : parseFloat(item.precio).toFixed(2)
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Menu;
