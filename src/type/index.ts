// type/index.ts
export interface Entrada {
    id: number;
    nombre: string;
    precio: number;
    tipo: string;
    descripcion: string;
    porciones: string | null;
    disponibilidad: boolean;
    profile: string | null;
  }
  