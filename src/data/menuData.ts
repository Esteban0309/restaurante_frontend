export type Plato = {
  nombre: string;
  descripcion: string;
  precio: string;
};

export const menuData: Record<string, { nombre: string; platos: Plato[] }> = {
  entradas: {
    nombre: 'Entradas',
    platos: [
      { nombre: 'Bruschetta', descripcion: 'Pan tostado con tomate y albahaca', precio: '$6' },
      { nombre: 'Croquetas de jamón', descripcion: 'Crujientes y sabrosas', precio: '$7' }
    ]
  },
  'platos-fuertes': {
    nombre: 'Platos Fuertes',
    platos: [
      { nombre: 'Pizza Margarita', descripcion: 'Clásica con albahaca y mozzarella', precio: '$10' },
      { nombre: 'Spaghetti Bolognese', descripcion: 'Salsa casera con carne molida', precio: '$12' }
    ]
  },
  bebidas: {
    nombre: 'Bebidas',
    platos: [
      { nombre: 'Limonada', descripcion: 'Refrescante y natural', precio: '$3' },
      { nombre: 'Vino Tinto', descripcion: 'Copa de vino seleccionado', precio: '$5' }
    ]
  },
  postres: {
    nombre: 'Postres',
    platos: [
      { nombre: 'Tiramisú', descripcion: 'Clásico italiano con café', precio: '$6' },
      { nombre: 'Helado Artesanal', descripcion: 'Sabores variados', precio: '$5' }
    ]
  }
};
