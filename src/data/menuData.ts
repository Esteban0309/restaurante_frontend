export interface Entradas {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  descripcion: string;
  porciones: string | null;
  disponibilidad: boolean;
  profile: string | null;
}

export interface PlatosFuertes {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  descripcion: string;
  porciones: string | null;
  disponibilidad: boolean;
  profile: string | null;
}

export interface Postres {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  descripcion: string;
  porciones: string | null;
  disponibilidad: boolean;
  profile: string | null;
}

export interface Bebidas {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  descripcion: string;
  porciones: string | null;
  disponibilidad: boolean;
  profile: string | null;
}

// Funciones para obtener los datos desde el backend
export const fetchPlatosFuertes = async () => {
  const response = await fetch('http://localhost:3000/platosfuertes');
  const data = await response.json();
  return data as PlatosFuertes[];
};

export const fetchEntradas = async () => {
  const response = await fetch('http://localhost:3000/entradas');
  const data = await response.json();
  return data as Entradas[];
};

export const fetchBebidas = async () => {
  const response = await fetch('http://localhost:3000/bebidas');
  const data = await response.json();
  return data as Bebidas[];
};

export const fetchPostres = async () => {
  const response = await fetch('http://localhost:3000/postres');
  const data = await response.json();
  return data as Postres[];
};
