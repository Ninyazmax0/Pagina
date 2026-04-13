import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, ShoppingCart, X, Package, Trash2, Check } from 'lucide-react';
import { useData } from './DataContext';
import { DetalleCompra } from './types';

interface CartItem {
  id_producto: number;
  cantidad: number;
  precio_costo: number;
  subtotal: number;
}

export function Compras() {
  const { productos, proveedores, currentUser, addCompra, getProveedorById } = useData();
  const [selectedProveedor, setSelectedProveedor] = useState<number | null>(null);
  const [numeroFactura, setNumeroFactura] = useState('');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'credito'>('efectivo');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredProductos = productos.filter(p => 
    p.activo && p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (producto: typeof productos[0]) => {
    const existing = cart.find(item => item.id_producto === producto.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id_producto === producto.id 
          ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_costo }
          : item
      ));
    } else {
      setCart([...cart, {
        id_producto: producto.id,
        cantidad: 1,
        precio_costo: producto.precio_costo,
        subtotal: producto.precio_costo,
      }]);
    }
  };

  const updateCartItem = (id_producto: number, cantidad: number) => {
    if (cantidad <= 0) {
      setCart(cart.filter(item => item.id_producto !== id_producto));
    } else {
      setCart(cart.map(item => 
        item.id_producto === id_producto 
          ? { ...item, cantidad, subtotal: cantidad * item.precio_costo }
          : item
      ));
    }
  };

  const removeFromCart = (id_producto: number) => {
    setCart(cart.filter(item => item.id_producto !== id_producto));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = () => {
    if (!selectedProveedor || cart.length === 0 || !currentUser) return;

    addCompra({
      id_proveedor: selectedProveedor,
      id_usuario: currentUser.id,
      numero_factura: numeroFactura,
      fecha_compra: new Date().toISOString(),
      total,
      metodo_pago: metodoPago,
    }, cart.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_costo: item.precio_costo,
      subtotal: item.subtotal,
    })));

    setSelectedProveedor(null);
    setNumeroFactura('');
    setMetodoPago('efectivo');
    setCart([]);
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Registrar Compra</h1>
        <p className="text-gray-400">Registrar compra a proveedor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="text-emerald-400" size={20} />
              Datos de la Compra
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Proveedor</label>
                <select
                  value={selectedProveedor || ''}
                  onChange={(e) => setSelectedProveedor(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar proveedor...</option>
                  {proveedores.filter(p => p.activo).map(prov => (
                    <option key={prov.id} value={prov.id}>{prov.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">No. Factura</label>
                <input
                  type="text"
                  value={numeroFactura}
                  onChange={(e) => setNumeroFactura(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="001-000001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Método de Pago</label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value as typeof metodoPago)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="text-blue-400" size={20} />
                Agregar Productos
              </h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
              >
                <Plus size={18} />
                Agregar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Producto</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Cantidad</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Costo Unit.</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Subtotal</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        No hay productos agregados
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => {
                      const producto = productos.find(p => p.id === item.id_producto);
                      return (
                        <tr key={item.id_producto}>
                          <td className="px-4 py-3 text-white">{producto?.nombre}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => updateCartItem(item.id_producto, item.cantidad - 1)}
                                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center text-white">{item.cantidad}</span>
                              <button
                                onClick={() => updateCartItem(item.id_producto, item.cantidad + 1)}
                                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">${item.precio_costo.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right text-white font-medium">${item.subtotal.toFixed(2)}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => removeFromCart(item.id_producto)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resumen</h3>
            
            {selectedProveedor && (
              <div className="mb-4 p-3 bg-slate-900/50 rounded-xl">
                <p className="text-sm text-gray-400">Proveedor</p>
                <p className="text-white font-medium">{getProveedorById(selectedProveedor)?.nombre}</p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Productos</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Unidades</span>
                <span>{cart.reduce((sum, item) => sum + item.cantidad, 0)}</span>
              </div>
              <div className="border-t border-slate-700 pt-3">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!selectedProveedor || cart.length === 0}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Registrar Compra
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showProductModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowProductModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Seleccionar Producto</h3>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProductos.map((producto) => (
                    <button
                      key={producto.id}
                      onClick={() => { addToCart(producto); setShowProductModal(false); }}
                      className="w-full p-4 bg-slate-900/50 hover:bg-slate-700 rounded-xl text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">{producto.nombre}</p>
                        <p className="text-gray-400 text-sm">Stock: {producto.stock_actual}</p>
                      </div>
                      <span className="text-emerald-400 font-medium">${producto.precio_costo.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Confirmar Compra</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Proveedor:</span>
                  <span className="text-white">{getProveedorById(selectedProveedor!)?.nombre}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Factura:</span>
                  <span className="text-white">{numeroFactura || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Productos:</span>
                  <span className="text-white">{cart.length}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Método de pago:</span>
                  <span className="text-white capitalize">{metodoPago}</span>
                </div>
                <div className="border-t border-slate-700 pt-3 flex justify-between text-xl font-bold text-white">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 text-gray-400 hover:text-white border border-slate-600 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
