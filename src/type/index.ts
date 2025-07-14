// type/index.ts
export interface Entrada {
  id: number;
  nombre: string;
  precio: number;
  precioCopa: number | null;
  precioBotella: number | null;
  tipo: string;
  descripcion: string;
  porciones: string | null;
  disponibilidad: boolean;
  profile: string | null;
}

export interface Vino {
  _id: string;
  __v: number;
  id: number;
  nombre: string;
  precioCopa: number | null;
  precioBotella: number | null;
  tipo: string;
  descripcion: string;
  porciones: string | null;
  disponibilidad: boolean;
  profile: string | null;
}
