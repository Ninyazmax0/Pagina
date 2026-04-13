import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, X, AlertTriangle, Check } from 'lucide-react';
import { useData } from './DataContext';
import { Producto } from './types';

export function Productos() {
  const { productos, categorias, addProducto, updateProducto, getCategoriaById } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<number | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [showLowStock, setShowLowStock] = useState(false);

  const [formData, setFormData] = useState({
    codigo_barras: '',
    nombre: '',
    descripcion: '',
    id_categoria: 1,
    laboratorio: '',
    precio_costo: 0,
    precio_venta: 0,
    stock_actual: 0,
    stock_minimo: 10,
    fecha_vencimiento: '',
    activo: true,
  });

  const filteredProductos = productos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo_barras.includes(searchTerm);
    const matchesCategoria = selectedCategoria === 'all' || p.id_categoria === selectedCategoria;
    const matchesLowStock = !showLowStock || p.stock_actual < p.stock_minimo;
    return matchesSearch && matchesCategoria && matchesLowStock;
  });

  const openModal = (producto?: Producto) => {
    if (producto) {
      setEditingProduct(producto);
      setFormData({
        codigo_barras: producto.codigo_barras,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        id_categoria: producto.id_categoria,
        laboratorio: producto.laboratorio,
        precio_costo: producto.precio_costo,
        precio_venta: producto.precio_venta,
        stock_actual: producto.stock_actual,
        stock_minimo: producto.stock_minimo,
        fecha_vencimiento: producto.fecha_vencimiento,
        activo: producto.activo,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        codigo_barras: '',
        nombre: '',
        descripcion: '',
        id_categoria: 1,
        laboratorio: '',
        precio_costo: 0,
        precio_venta: 0,
        stock_actual: 0,
        stock_minimo: 10,
        fecha_vencimiento: '',
        activo: true,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProducto(editingProduct.id, formData);
    } else {
      addProducto(formData);
    }
    setShowModal(false);
  };

  const getDaysUntilExpiry = (fechaVencimiento: string) => {
    const hoy = new Date();
    const venc = new Date(fechaVencimiento);
    return Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (fechaVencimiento: string) => {
    const days = getDaysUntilExpiry(fechaVencimiento);
    if (days <= 0) return { color: 'bg-red-500', text: 'Vencido' };
    if (days <= 30) return { color: 'bg-amber-500', text: `${days}d` };
    if (days <= 90) return { color: 'bg-yellow-500', text: `${days}d` };
    return { color: 'bg-emerald-500', text: `${days}d` };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventario de Productos</h1>
          <p className="text-gray-400">{productos.length} productos registrados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Todas las categorías</option>
          {categorias.filter(c => c.activo).map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
        <button
          onClick={() => setShowLowStock(!showLowStock)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
            showLowStock 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
          }`}
        >
          <AlertTriangle size={20} />
          Stock Bajo
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Producto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Categoría</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Laboratorio</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Costo</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Venta</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Stock</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Vencimiento</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProductos.map((producto) => {
                const expiry = getExpiryStatus(producto.fecha_vencimiento);
                const isLowStock = producto.stock_actual < producto.stock_minimo;
                return (
                  <tr key={producto.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Package className="text-emerald-400" size={18} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{producto.nombre}</p>
                          <p className="text-gray-400 text-sm">{producto.codigo_barras}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{getCategoriaById(producto.id_categoria)?.nombre}</td>
                    <td className="px-6 py-4 text-gray-300">{producto.laboratorio}</td>
                    <td className="px-6 py-4 text-right text-gray-300">${producto.precio_costo.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-white font-medium">${producto.precio_venta.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm ${
                        isLowStock 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {isLowStock && <AlertTriangle size={14} />}
                        {producto.stock_actual}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-lg text-sm text-white ${expiry.color}`}>
                        {expiry.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal(producto)}
                          className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => updateProducto(producto.id, { activo: !producto.activo })}
                          className={`p-2 rounded-lg transition-colors ${
                            producto.activo 
                              ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                              : 'text-emerald-400 hover:bg-emerald-500/10'
                          }`}
                        >
                          {producto.activo ? <Trash2 size={18} /> : <Check size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Código de Barras</label>
                    <input
                      type="text"
                      value={formData.codigo_barras}
                      onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                    <input
                      type="text"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                    <select
                      value={formData.id_categoria}
                      onChange={(e) => setFormData({ ...formData, id_categoria: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {categorias.filter(c => c.activo).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Laboratorio</label>
                    <input
                      type="text"
                      value={formData.laboratorio}
                      onChange={(e) => setFormData({ ...formData, laboratorio: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Precio Costo ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio_costo}
                      onChange={(e) => setFormData({ ...formData, precio_costo: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Precio Venta ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.precio_venta}
                      onChange={(e) => setFormData({ ...formData, precio_venta: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stock Actual</label>
                    <input
                      type="number"
                      value={formData.stock_actual}
                      onChange={(e) => setFormData({ ...formData, stock_actual: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Stock Mínimo</label>
                    <input
                      type="number"
                      value={formData.stock_minimo}
                      onChange={(e) => setFormData({ ...formData, stock_minimo: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Vencimiento</label>
                    <input
                      type="date"
                      value={formData.fecha_vencimiento}
                      onChange={(e) => setFormData({ ...formData, fecha_vencimiento: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                  >
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
