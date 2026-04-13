import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, DollarSign, X, Package, Trash2, Check, Receipt, Calculator } from 'lucide-react';
import { useData } from './DataContext';

interface CartItem {
  id_producto: number;
  cantidad: number;
  precio_venta: number;
  subtotal: number;
}

export function Ventas() {
  const { productos, currentUser, addVenta, getCategoriaById } = useData();
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta'>('efectivo');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSale, setLastSale] = useState<{ id: number; total: number } | null>(null);

  const filteredProductos = productos.filter(p => 
    p.activo && p.stock_actual > 0 && p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (producto: typeof productos[0]) => {
    if (producto.stock_actual === 0) return;
    
    const existing = cart.find(item => item.id_producto === producto.id);
    if (existing) {
      if (existing.cantidad < producto.stock_actual) {
        setCart(cart.map(item => 
          item.id_producto === producto.id 
            ? { ...item, cantidad: item.cantidad + 1, subtotal: (item.cantidad + 1) * item.precio_venta }
            : item
        ));
      }
    } else {
      setCart([...cart, {
        id_producto: producto.id,
        cantidad: 1,
        precio_venta: producto.precio_venta,
        subtotal: producto.precio_venta,
      }]);
    }
  };

  const updateCartItem = (id_producto: number, cantidad: number) => {
    const producto = productos.find(p => p.id === id_producto);
    if (!producto) return;
    
    if (cantidad <= 0) {
      setCart(cart.filter(item => item.id_producto !== id_producto));
    } else if (cantidad <= producto.stock_actual) {
      setCart(cart.map(item => 
        item.id_producto === id_producto 
          ? { ...item, cantidad, subtotal: cantidad * item.precio_venta }
          : item
      ));
    }
  };

  const removeFromCart = (id_producto: number) => {
    setCart(cart.filter(item => item.id_producto !== id_producto));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const handleSubmit = () => {
    if (cart.length === 0 || !currentUser) return;

    const saleId = Math.max(0, 0) + 1;
    
    addVenta({
      id_usuario: currentUser.id,
      fecha_venta: new Date().toISOString(),
      total,
      metodo_pago: metodoPago,
    }, cart.map((item, index) => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
      precio_venta: item.precio_venta,
      subtotal: item.subtotal,
    })));

    setLastSale({ id: saleId, total });
    setCart([]);
    setShowReceiptModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Punto de Venta</h1>
          <p className="text-gray-400">Registrar venta</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMetodoPago('efectivo')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                metodoPago === 'efectivo'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              Efectivo
            </button>
            <button
              onClick={() => setMetodoPago('tarjeta')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                metodoPago === 'tarjeta'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              Tarjeta
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="text-blue-400" size={20} />
                Productos
              </h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
              >
                <Plus size={18} />
                Buscar Producto
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {productos.filter(p => p.activo && p.stock_actual > 0).slice(0, 8).map((producto) => {
                const inCart = cart.find(item => item.id_producto === producto.id);
                return (
                  <button
                    key={producto.id}
                    onClick={() => addToCart(producto)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      inCart 
                        ? 'bg-emerald-500/20 border border-emerald-500/30' 
                        : 'bg-slate-900/50 border border-slate-700 hover:border-emerald-500/30'
                    }`}
                  >
                    <p className="text-white font-medium text-sm truncate">{producto.nombre}</p>
                    <p className="text-emerald-400 font-bold">${producto.precio_venta.toFixed(2)}</p>
                    <p className="text-gray-400 text-xs mt-1">Stock: {producto.stock_actual}</p>
                    {inCart && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {inCart.cantidad}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="text-emerald-400" size={20} />
              Carrito de Venta
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Producto</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400">Cantidad</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Precio Unit.</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Subtotal</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-400"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center">
                        <div className="text-gray-400">
                          <Calculator size={48} className="mx-auto mb-3 opacity-50" />
                          <p>No hay productos en el carrito</p>
                          <p className="text-sm mt-1">Agregue productos para realizar una venta</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => {
                      const producto = productos.find(p => p.id === item.id_producto);
                      return (
                        <tr key={item.id_producto}>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-white font-medium">{producto?.nombre}</p>
                              <p className="text-gray-400 text-sm">{getCategoriaById(producto?.id_categoria || 0)?.nombre}</p>
                            </div>
                          </td>
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
                          <td className="px-4 py-3 text-right text-gray-300">${item.precio_venta.toFixed(2)}</td>
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
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 sticky top-6">
            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold text-white mb-2">${total.toFixed(2)}</h3>
              <p className="text-gray-400">Total a Pagar</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Productos</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Unidades</span>
                <span>{cart.reduce((sum, item) => sum + item.cantidad, 0)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Método de pago</span>
                <span className="capitalize">{metodoPago}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={cart.length === 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Check size={24} />
              Cobrar
            </button>

            <button
              onClick={() => setCart([])}
              disabled={cart.length === 0}
              className="w-full mt-3 py-2 text-gray-400 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar Venta
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
                <h3 className="text-xl font-semibold text-white">Buscar Producto</h3>
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
                    placeholder="Buscar por nombre o código de barras..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    autoFocus
                  />
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredProductos.map((producto) => (
                    <button
                      key={producto.id}
                      onClick={() => { addToCart(producto); setSearchTerm(''); }}
                      className="w-full p-4 bg-slate-900/50 hover:bg-slate-700 rounded-xl text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">{producto.nombre}</p>
                        <p className="text-gray-400 text-sm">{getCategoriaById(producto.id_categoria)?.nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">${producto.precio_venta.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">Stock: {producto.stock_actual}</p>
                      </div>
                    </button>
                  ))}
                  {filteredProductos.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No se encontraron productos
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReceiptModal && lastSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowReceiptModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="bg-emerald-500 p-6 text-center text-white">
                <Check size={48} className="mx-auto mb-2" />
                <h3 className="text-xl font-bold">¡Venta Realizada!</h3>
              </div>
              <div className="p-6 text-gray-800">
                <div className="text-center mb-6">
                  <Receipt className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-500">Farmacia Santa Cruz</p>
                  <p className="text-sm text-gray-500">San Martín, El Salvador</p>
                  <p className="text-lg font-bold mt-4">Total: ${lastSale.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500 capitalize">Pagado con: {metodoPago}</p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Nueva Venta
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
