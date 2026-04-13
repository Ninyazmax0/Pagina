export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  contrasena: string;
  rol: 'administrador' | 'vendedor';
  activo: boolean;
  fecha_creacion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Producto {
  id: number;
  codigo_barras: string;
  nombre: string;
  descripcion: string;
  id_categoria: number;
  laboratorio: string;
  precio_costo: number;
  precio_venta: number;
  stock_actual: number;
  stock_minimo: number;
  fecha_vencimiento: string;
  activo: boolean;
  fecha_registro: string;
}

export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
}

export interface Compra {
  id: number;
  id_proveedor: number;
  id_usuario: number;
  numero_factura: string;
  fecha_compra: string;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta' | 'credito';
}

export interface DetalleCompra {
  id: number;
  id_compra: number;
  id_producto: number;
  cantidad: number;
  precio_costo: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  id_usuario: number;
  fecha_venta: string;
  total: number;
  metodo_pago: 'efectivo' | 'tarjeta';
}

export interface DetalleVenta {
  id: number;
  id_venta: number;
  id_producto: number;
  cantidad: number;
  precio_venta: number;
  subtotal: number;
}

export interface Alerta {
  id: number;
  id_producto: number;
  tipo_alerta: 'caducidad' | 'stock_bajo';
  mensaje: string;
  fecha_alerta: string;
  leida: boolean;
}

export type PageType = 'home' | 'portfolio' | 'login' | 'dashboard' | 'productos' | 'categorias' | 'proveedores' | 'compras' | 'ventas' | 'alertas' | 'reportes' | 'usuarios';
