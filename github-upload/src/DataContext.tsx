import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Usuario, Categoria, Producto, Proveedor, Compra, DetalleCompra, Venta, DetalleVenta, Alerta, PageType } from './types';

interface DataContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  currentUser: Usuario | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  usuarios: Usuario[];
  categorias: Categoria[];
  productos: Producto[];
  proveedores: Proveedor[];
  compras: Compra[];
  detalleCompras: DetalleCompra[];
  ventas: Venta[];
  detalleVentas: DetalleVenta[];
  alertas: Alerta[];
  addUsuario: (user: Omit<Usuario, 'id' | 'fecha_creacion'>) => void;
  updateUsuario: (id: number, user: Partial<Usuario>) => void;
  addCategoria: (cat: Omit<Categoria, 'id'>) => void;
  updateCategoria: (id: number, cat: Partial<Categoria>) => void;
  addProducto: (prod: Omit<Producto, 'id' | 'fecha_registro'>) => void;
  updateProducto: (id: number, prod: Partial<Producto>) => void;
  addProveedor: (prov: Omit<Proveedor, 'id'>) => void;
  updateProveedor: (id: number, prov: Partial<Proveedor>) => void;
  addCompra: (compra: Omit<Compra, 'id'>, detalles: Omit<DetalleCompra, 'id' | 'id_compra'>[]) => void;
  addVenta: (venta: Omit<Venta, 'id'>, detalles: Omit<DetalleVenta, 'id' | 'id_venta'>[]) => void;
  marcarAlertaLeida: (id: number) => void;
  getProductoById: (id: number) => Producto | undefined;
  getCategoriaById: (id: number) => Categoria | undefined;
  getProveedorById: (id: number) => Proveedor | undefined;
  getUsuarioById: (id: number) => Usuario | undefined;
  getAlertasActivas: () => Alerta[];
  stats: {
    totalProductos: number;
    productosStockBajo: number;
    productosProximosVencer: number;
    ventasHoy: number;
    ventasMes: number;
    comprasMes: number;
    gananciaDia: number;
    gananciaMes: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialUsuarios: Usuario[] = [
  { id: 1, nombre: 'Steven Gabriel Lopez Hernandez', usuario: 'admin', contrasena: 'admin123', rol: 'administrador', activo: true, fecha_creacion: '2026-02-16' },
  { id: 2, nombre: 'Joel Edgardo Mendoza Lopez', usuario: 'vendedor1', contrasena: 'vendedor123', rol: 'vendedor', activo: true, fecha_creacion: '2026-02-16' },
  { id: 3, nombre: 'Guadalupe Abigaíl Romero Pedroza', usuario: 'vendedor2', contrasena: 'vendedor123', rol: 'vendedor', activo: true, fecha_creacion: '2026-02-16' },
  { id: 4, nombre: 'Tiffany Alessandra Sermeño Flores', usuario: 'vendedor3', contrasena: 'vendedor123', rol: 'vendedor', activo: true, fecha_creacion: '2026-02-16' },
];

const initialCategorias: Categoria[] = [
  { id: 1, nombre: 'Analgésicos', descripcion: 'Medicamentos para el dolor', activo: true },
  { id: 2, nombre: 'Antibióticos', descripcion: 'Medicamentos antibacterianos', activo: true },
  { id: 3, nombre: 'Vitaminas', descripcion: 'Suplementos vitamínicos', activo: true },
  { id: 4, nombre: 'Antiinflamatorios', descripcion: 'Medicamentos antiinflamatorios', activo: true },
  { id: 5, nombre: 'Antialérgicos', descripcion: 'Medicamentos para alergias', activo: true },
  { id: 6, nombre: 'Antigripales', descripcion: 'Medicamentos para resfriados', activo: true },
  { id: 7, nombre: 'Dermatológicos', descripcion: 'Productos para la piel', activo: true },
  { id: 8, nombre: 'Cuidado Personal', descripcion: 'Productos de uso personal', activo: true },
];

const initialProductos: Producto[] = [
  { id: 1, codigo_barras: '7501234567890', nombre: 'Paracetamol 500mg', descripcion: 'Analgésico y antipirético', id_categoria: 1, laboratorio: 'Bayer', precio_costo: 2.50, precio_venta: 4.50, stock_actual: 150, stock_minimo: 30, fecha_vencimiento: '2027-06-15', activo: true, fecha_registro: '2026-02-16' },
  { id: 2, codigo_barras: '7501234567891', nombre: 'Ibuprofeno 400mg', descripcion: 'Antiinflamatorio no esteroideo', id_categoria: 4, laboratorio: 'Pfizer', precio_costo: 3.00, precio_venta: 5.50, stock_actual: 80, stock_minimo: 25, fecha_vencimiento: '2027-08-20', activo: true, fecha_registro: '2026-02-16' },
  { id: 3, codigo_barras: '7501234567892', nombre: 'Amoxicilina 500mg', descripcion: 'Antibiótico de amplio espectro', id_categoria: 2, laboratorio: 'Novartis', precio_costo: 5.00, precio_venta: 9.00, stock_actual: 45, stock_minimo: 20, fecha_vencimiento: '2026-04-25', activo: true, fecha_registro: '2026-02-16' },
  { id: 4, codigo_barras: '7501234567893', nombre: 'Vitamina C 1000mg', descripcion: 'Suplemento vitamínico', id_categoria: 3, laboratorio: 'Centrum', precio_costo: 4.00, precio_venta: 7.50, stock_actual: 100, stock_minimo: 30, fecha_vencimiento: '2027-12-31', activo: true, fecha_registro: '2026-02-16' },
  { id: 5, codigo_barras: '7501234567894', nombre: 'Loratadina 10mg', descripcion: 'Antialérgico no sedante', id_categoria: 5, laboratorio: 'Schering', precio_costo: 3.50, precio_venta: 6.00, stock_actual: 12, stock_minimo: 25, fecha_vencimiento: '2027-03-10', activo: true, fecha_registro: '2026-02-16' },
  { id: 6, codigo_barras: '7501234567895', nombre: 'Clorfenamina 4mg', descripcion: 'Antihistamínico', id_categoria: 5, laboratorio: 'Bayer', precio_costo: 2.00, precio_venta: 3.50, stock_actual: 60, stock_minimo: 20, fecha_vencimiento: '2026-05-01', activo: true, fecha_registro: '2026-02-16' },
  { id: 7, codigo_barras: '7501234567896', nombre: ' Acetilsalicílico 100mg', descripcion: 'Antiagregante plaquetario', id_categoria: 4, laboratorio: 'Bayer', precio_costo: 2.80, precio_venta: 5.00, stock_actual: 200, stock_minimo: 50, fecha_vencimiento: '2027-09-15', activo: true, fecha_registro: '2026-02-16' },
  { id: 8, codigo_barras: '7501234567897', nombre: 'Omeprazol 20mg', descripcion: 'Inhibidor de bomba de protones', id_categoria: 1, laboratorio: 'AstraZeneca', precio_costo: 4.50, precio_venta: 8.00, stock_actual: 35, stock_minimo: 15, fecha_vencimiento: '2027-01-20', activo: true, fecha_registro: '2026-02-16' },
  { id: 9, codigo_barras: '7501234567898', nombre: 'Vitamina B12', descripcion: 'Suplemento vitamínico B12', id_categoria: 3, laboratorio: 'Nature Made', precio_costo: 6.00, precio_venta: 11.00, stock_actual: 25, stock_minimo: 15, fecha_vencimiento: '2027-06-30', activo: true, fecha_registro: '2026-02-16' },
  { id: 10, codigo_barras: '7501234567899', nombre: 'Alcohol Antiséptico', descripcion: 'Alcohol para limpieza', id_categoria: 8, laboratorio: 'Crystal', precio_costo: 1.50, precio_venta: 2.50, stock_actual: 8, stock_minimo: 20, fecha_vencimiento: '2027-12-31', activo: true, fecha_registro: '2026-02-16' },
];

const initialProveedores: Proveedor[] = [
  { id: 1, nombre: 'Distribuidora Farmacéutica S.A.', contacto: 'Juan Pérez', telefono: '2222-5555', email: 'juan@disfarma.com', direccion: 'San Salvador, Calle Principal #123', activo: true },
  { id: 2, nombre: 'Medicamentos del Pacífico', contacto: 'María López', telefono: '2333-6666', email: 'maria@medpac.com', direccion: 'Santa Tecla, Avenida Buenos Aires #456', activo: true },
  { id: 3, nombre: 'Cruz Verde Distribuciones', contacto: 'Carlos Rodríguez', telefono: '2444-7777', email: 'carlos@cruzverde.com', direccion: 'Antiguo Cuscatlán, Km 8 #789', activo: true },
];

const initialVentas: Venta[] = [
  { id: 1, id_usuario: 2, fecha_venta: '2026-04-08 09:15:00', total: 15.50, metodo_pago: 'efectivo' },
  { id: 2, id_usuario: 2, fecha_venta: '2026-04-08 10:30:00', total: 28.00, metodo_pago: 'tarjeta' },
  { id: 3, id_usuario: 3, fecha_venta: '2026-04-08 11:45:00', total: 9.00, metodo_pago: 'efectivo' },
  { id: 4, id_usuario: 2, fecha_venta: '2026-04-08 14:20:00', total: 22.50, metodo_pago: 'efectivo' },
  { id: 5, id_usuario: 3, fecha_venta: '2026-04-08 16:00:00', total: 35.00, metodo_pago: 'tarjeta' },
  { id: 6, id_usuario: 2, fecha_venta: '2026-04-07 09:00:00', total: 18.00, metodo_pago: 'efectivo' },
  { id: 7, id_usuario: 3, fecha_venta: '2026-04-07 11:30:00', total: 42.00, metodo_pago: 'efectivo' },
  { id: 8, id_usuario: 2, fecha_venta: '2026-04-07 15:45:00', total: 12.50, metodo_pago: 'tarjeta' },
];

const initialDetalleVentas: DetalleVenta[] = [
  { id: 1, id_venta: 1, id_producto: 1, cantidad: 2, precio_venta: 4.50, subtotal: 9.00 },
  { id: 2, id_venta: 1, id_producto: 4, cantidad: 1, precio_venta: 7.50, subtotal: 7.50 },
  { id: 3, id_venta: 2, id_producto: 2, cantidad: 3, precio_venta: 5.50, subtotal: 16.50 },
  { id: 4, id_venta: 2, id_producto: 8, cantidad: 2, precio_venta: 8.00, subtotal: 16.00 },
  { id: 5, id_venta: 3, id_producto: 3, cantidad: 1, precio_venta: 9.00, subtotal: 9.00 },
  { id: 6, id_venta: 4, id_producto: 4, cantidad: 2, precio_venta: 7.50, subtotal: 15.00 },
  { id: 7, id_venta: 4, id_producto: 5, cantidad: 2, precio_venta: 6.00, subtotal: 12.00 },
  { id: 8, id_venta: 5, id_producto: 9, cantidad: 2, precio_venta: 11.00, subtotal: 22.00 },
  { id: 9, id_venta: 5, id_producto: 1, cantidad: 3, precio_venta: 4.50, subtotal: 13.50 },
  { id: 10, id_venta: 6, id_producto: 2, cantidad: 2, precio_venta: 5.50, subtotal: 11.00 },
  { id: 11, id_venta: 6, id_producto: 7, cantidad: 2, precio_venta: 5.00, subtotal: 10.00 },
  { id: 12, id_venta: 7, id_producto: 3, cantidad: 3, precio_venta: 9.00, subtotal: 27.00 },
  { id: 13, id_venta: 7, id_producto: 8, cantidad: 2, precio_venta: 8.00, subtotal: 16.00 },
  { id: 14, id_venta: 8, id_producto: 1, cantidad: 2, precio_venta: 4.50, subtotal: 9.00 },
  { id: 15, id_venta: 8, id_producto: 6, cantidad: 1, precio_venta: 3.50, subtotal: 3.50 },
];

const initialAlertas: Alerta[] = [
  { id: 1, id_producto: 5, tipo_alerta: 'stock_bajo', mensaje: 'Stock bajo: Loratadina 10mg solo tiene 12 unidades', fecha_alerta: '2026-04-08', leida: false },
  { id: 2, id_producto: 10, tipo_alerta: 'stock_bajo', mensaje: 'Stock bajo: Alcohol Antiséptico solo tiene 8 unidades', fecha_alerta: '2026-04-08', leida: false },
  { id: 3, id_producto: 3, tipo_alerta: 'caducidad', mensaje: 'Próximo a vencer en 17 días: Amoxicilina 500mg', fecha_alerta: '2026-04-08', leida: false },
  { id: 4, id_producto: 6, tipo_alerta: 'caducidad', mensaje: 'Próximo a vencer en 23 días: Clorfenamina 4mg', fecha_alerta: '2026-04-08', leida: true },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsuarios);
  const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias);
  const [productos, setProductos] = useState<Producto[]>(initialProductos);
  const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [detalleCompras, setDetalleCompras] = useState<DetalleCompra[]>([]);
  const [ventas, setVentas] = useState<Venta[]>(initialVentas);
  const [detalleVentas, setDetalleVentas] = useState<DetalleVenta[]>(initialDetalleVentas);
  const [alertas, setAlertas] = useState<Alerta[]>(initialAlertas);

  const login = (username: string, password: string): boolean => {
    const user = usuarios.find(u => u.usuario === username && u.contrasena === password && u.activo);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const addUsuario = (user: Omit<Usuario, 'id' | 'fecha_creacion'>) => {
    const newUser: Usuario = {
      ...user,
      id: Math.max(...usuarios.map(u => u.id)) + 1,
      fecha_creacion: new Date().toISOString().split('T')[0]
    };
    setUsuarios([...usuarios, newUser]);
  };

  const updateUsuario = (id: number, user: Partial<Usuario>) => {
    setUsuarios(usuarios.map(u => u.id === id ? { ...u, ...user } : u));
  };

  const addCategoria = (cat: Omit<Categoria, 'id'>) => {
    const newCat: Categoria = {
      ...cat,
      id: Math.max(...categorias.map(c => c.id), 0) + 1
    };
    setCategorias([...categorias, newCat]);
  };

  const updateCategoria = (id: number, cat: Partial<Categoria>) => {
    setCategorias(categorias.map(c => c.id === id ? { ...c, ...cat } : c));
  };

  const addProducto = (prod: Omit<Producto, 'id' | 'fecha_registro'>) => {
    const newProd: Producto = {
      ...prod,
      id: Math.max(...productos.map(p => p.id), 0) + 1,
      fecha_registro: new Date().toISOString().split('T')[0]
    };
    setProductos([...productos, newProd]);
  };

  const updateProducto = (id: number, prod: Partial<Producto>) => {
    setProductos(productos.map(p => p.id === id ? { ...p, ...prod } : p));
  };

  const addProveedor = (prov: Omit<Proveedor, 'id'>) => {
    const newProv: Proveedor = {
      ...prov,
      id: Math.max(...proveedores.map(p => p.id), 0) + 1
    };
    setProveedores([...proveedores, newProv]);
  };

  const updateProveedor = (id: number, prov: Partial<Proveedor>) => {
    setProveedores(proveedores.map(p => p.id === id ? { ...p, ...prov } : p));
  };

  const addCompra = (compra: Omit<Compra, 'id'>, detalles: Omit<DetalleCompra, 'id' | 'id_compra'>[]) => {
    const newCompra: Compra = {
      ...compra,
      id: Math.max(...compras.map(c => c.id), 0) + 1
    };
    const newDetalles = detalles.map((d, i) => ({
      ...d,
      id: Math.max(...detalleCompras.map(d => d.id), 0) + 1 + i,
      id_compra: newCompra.id
    }));
    setCompras([...compras, newCompra]);
    setDetalleCompras([...detalleCompras, ...newDetalles]);
    
    newDetalles.forEach(d => {
      const prod = productos.find(p => p.id === d.id_producto);
      if (prod) {
        updateProducto(prod.id, { stock_actual: prod.stock_actual + d.cantidad });
      }
    });
  };

  const addVenta = (venta: Omit<Venta, 'id'>, detalles: Omit<DetalleVenta, 'id' | 'id_venta'>[]) => {
    const newVenta: Venta = {
      ...venta,
      id: Math.max(...ventas.map(v => v.id), 0) + 1
    };
    const newDetalles = detalles.map((d, i) => ({
      ...d,
      id: Math.max(...detalleVentas.map(d => d.id), 0) + 1 + i,
      id_venta: newVenta.id
    }));
    setVentas([...ventas, newVenta]);
    setDetalleVentas([...detalleVentas, ...newDetalles]);
    
    newDetalles.forEach(d => {
      const prod = productos.find(p => p.id === d.id_producto);
      if (prod) {
        updateProducto(prod.id, { stock_actual: prod.stock_actual - d.cantidad });
      }
    });
  };

  const marcarAlertaLeida = (id: number) => {
    setAlertas(alertas.map(a => a.id === id ? { ...a, leida: true } : a));
  };

  const getProductoById = (id: number) => productos.find(p => p.id === id);
  const getCategoriaById = (id: number) => categorias.find(c => c.id === id);
  const getProveedorById = (id: number) => proveedores.find(p => p.id === id);
  const getUsuarioById = (id: number) => usuarios.find(u => u.id === id);
  const getAlertasActivas = () => alertas.filter(a => !a.leida);

  const stats = {
    totalProductos: productos.filter(p => p.activo).length,
    productosStockBajo: productos.filter(p => p.activo && p.stock_actual < p.stock_minimo).length,
    productosProximosVencer: productos.filter(p => {
      if (!p.activo) return false;
      const hoy = new Date();
      const venc = new Date(p.fecha_vencimiento);
      const diffDays = Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }).length,
    ventasHoy: ventas.filter(v => v.fecha_venta.startsWith('2026-04-08')).reduce((sum, v) => sum + v.total, 0),
    ventasMes: ventas.filter(v => v.fecha_venta.startsWith('2026-04')).reduce((sum, v) => sum + v.total, 0),
    comprasMes: compras.filter(c => c.fecha_compra.startsWith('2026-04')).reduce((sum, c) => sum + c.total, 0),
    gananciaDia: ventas.filter(v => v.fecha_venta.startsWith('2026-04-08')).reduce((sum, v) => sum + v.total, 0),
    gananciaMes: ventas.filter(v => v.fecha_venta.startsWith('2026-04')).reduce((sum, v) => sum + v.total, 0),
  };

  return (
    <DataContext.Provider value={{
      currentPage, setCurrentPage, currentUser, login, logout,
      usuarios, categorias, productos, proveedores, compras, detalleCompras, ventas, detalleVentas, alertas,
      addUsuario, updateUsuario, addCategoria, updateCategoria, addProducto, updateProducto,
      addProveedor, updateProveedor, addCompra, addVenta, marcarAlertaLeida,
      getProductoById, getCategoriaById, getProveedorById, getUsuarioById, getAlertasActivas,
      stats
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
