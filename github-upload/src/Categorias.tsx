import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Tags, X } from 'lucide-react';
import { useData } from './DataContext';
import { Categoria } from './types';

export function Categorias() {
  const { categorias, productos, addCategoria, updateCategoria } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  const filteredCategorias = categorias.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductCount = (categoriaId: number) => {
    return productos.filter(p => p.id_categoria === categoriaId).length;
  };

  const openModal = (categoria?: Categoria) => {
    if (categoria) {
      setEditingCategoria(categoria);
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        activo: categoria.activo,
      });
    } else {
      setEditingCategoria(null);
      setFormData({ nombre: '', descripcion: '', activo: true });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategoria) {
      updateCategoria(editingCategoria.id, formData);
    } else {
      addCategoria(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Categorías</h1>
          <p className="text-gray-400">{categorias.length} categorías registradas</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={20} />
          Nueva Categoría
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategorias.map((categoria) => (
          <motion.div
            key={categoria.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-800/50 border rounded-2xl p-6 transition-colors ${
              categoria.activo ? 'border-slate-700' : 'border-slate-700/50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Tags className="text-white" size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                categoria.activo 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {categoria.activo ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{categoria.nombre}</h3>
            <p className="text-gray-400 text-sm mb-4">{categoria.descripcion}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {getProductCount(categoria.id)} productos
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(categoria)}
                  className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => updateCategoria(categoria.id, { activo: !categoria.activo })}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md"
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ej: Antibióticos"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    rows={3}
                    placeholder="Descripción de la categoría..."
                    required
                  />
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
                    {editingCategoria ? 'Guardar Cambios' : 'Crear Categoría'}
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
