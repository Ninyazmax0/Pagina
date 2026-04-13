import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, User, X, Shield, UserCheck, Trash2 } from 'lucide-react';
import { useData } from './DataContext';
import { Usuario } from './types';

export function Usuarios() {
  const { usuarios, addUsuario, updateUsuario } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',
    contrasena: '',
    rol: 'vendedor' as 'administrador' | 'vendedor',
    activo: true,
  });

  const filteredUsuarios = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (user?: Usuario) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nombre: user.nombre,
        usuario: user.usuario,
        contrasena: user.contrasena,
        rol: user.rol,
        activo: user.activo,
      });
    } else {
      setEditingUser(null);
      setFormData({ nombre: '', usuario: '', contrasena: '', rol: 'vendedor', activo: true });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUsuario(editingUser.id, formData);
    } else {
      addUsuario(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-gray-400">{usuarios.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Usuario</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Fecha Creación</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsuarios.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                        {user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="text-white font-medium">@{user.usuario}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.nombre}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                      user.rol === 'administrador' 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.rol === 'administrador' ? <Shield size={14} /> : <UserCheck size={14} />}
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.fecha_creacion}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-lg text-sm ${
                      user.activo 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal(user)}
                        className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => updateUsuario(user.id, { activo: !user.activo })}
                        className={`p-2 rounded-lg transition-colors ${
                          user.activo 
                            ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {user.activo ? <Trash2 size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md"
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <User className="text-emerald-400" size={24} />
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nombre completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Usuario</label>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nombre de usuario"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={formData.contrasena}
                    onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={editingUser ? 'Dejar en blanco para no cambiar' : 'Contraseña'}
                    required={!editingUser}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, rol: 'vendedor' })}
                      className={`p-4 rounded-xl border transition-colors ${
                        formData.rol === 'vendedor'
                          ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                          : 'bg-slate-900 border-slate-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      <UserCheck className="mx-auto mb-2" size={24} />
                      <span className="text-sm font-medium">Vendedor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, rol: 'administrador' })}
                      className={`p-4 rounded-xl border transition-colors ${
                        formData.rol === 'administrador'
                          ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                          : 'bg-slate-900 border-slate-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Shield className="mx-auto mb-2" size={24} />
                      <span className="text-sm font-medium">Administrador</span>
                    </button>
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
                    {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
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
