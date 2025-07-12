import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Entrada } from '../type';

function Menu() {
  const [data, setData] = useState<Entrada[] | null>(null);

  useEffect(() => {
    api.get('/entradas')
      .then(response => setData(response.data))
      .catch(error => console.error('Error al cargar los datos', error));
  }, []);

  return (
    <div>
      {data ? JSON.stringify(data) : 'Cargando...'}
    </div>
  );
}

export default Menu;
