import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Truck, X, Phone, Mail, MapPin, User } from 'lucide-react';
import { useData } from './DataContext';
import { Proveedor } from './types';

export function Proveedores() {
  const { proveedores, compras, addProveedor, updateProveedor } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    activo: true,
  });

  const filteredProveedores = proveedores.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getComprasCount = (proveedorId: number) => {
    return compras.filter(c => c.id_proveedor === proveedorId).length;
  };

  const openModal = (proveedor?: Proveedor) => {
    if (proveedor) {
      setEditingProveedor(proveedor);
      setFormData({
        nombre: proveedor.nombre,
        contacto: proveedor.contacto,
        telefono: proveedor.telefono,
        email: proveedor.email,
        direccion: proveedor.direccion,
        activo: proveedor.activo,
      });
    } else {
      setEditingProveedor(null);
      setFormData({ nombre: '', contacto: '', telefono: '', email: '', direccion: '', activo: true });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProveedor) {
      updateProveedor(editingProveedor.id, formData);
    } else {
      addProveedor(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Proveedores</h1>
          <p className="text-gray-400">{proveedores.length} proveedores registrados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={20} />
          Nuevo Proveedor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar proveedores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProveedores.map((proveedor) => (
          <motion.div
            key={proveedor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-slate-800/50 border rounded-2xl p-6 transition-colors ${
              proveedor.activo ? 'border-slate-700' : 'border-slate-700/50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Truck className="text-white" size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                proveedor.activo 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {proveedor.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{proveedor.nombre}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <User size={14} />
                <span>{proveedor.contacto}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} />
                <span>{proveedor.telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} />
                <span>{proveedor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                <span className="truncate">{proveedor.direccion}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <span className="text-sm text-gray-400">
                {getComprasCount(proveedor.id)} compras
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(proveedor)}
                  className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => updateProveedor(proveedor.id, { activo: !proveedor.activo })}
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
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg"
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre / Razón Social</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Distribuidora Farmacéutica S.A."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Persona de Contacto</label>
                  <input
                    type="text"
                    value={formData.contacto}
                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nombre del contacto"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="2222-5555"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="correo@ejemplo.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Dirección completa"
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
                    {editingProveedor ? 'Guardar Cambios' : 'Crear Proveedor'}
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
