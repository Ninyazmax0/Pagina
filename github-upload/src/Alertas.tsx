import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Package, Check } from 'lucide-react';
import { useData } from './DataContext';

export function Alertas() {
  const { alertas, productos, marcarAlertaLeida, getProductoById } = useData();
  const [filter, setFilter] = useState<'todas' | 'caducidad' | 'stock_bajo'>('todas');

  const filteredAlertas = alertas.filter(a => {
    if (filter === 'todas') return true;
    return a.tipo_alerta === filter;
  }).sort((a, b) => {
    if (a.leida !== b.leida) return a.leida ? 1 : -1;
    return new Date(b.fecha_alerta).getTime() - new Date(a.fecha_alerta).getTime();
  });

  const getDaysUntilExpiry = (fechaVencimiento: string) => {
    const hoy = new Date();
    const venc = new Date(fechaVencimiento);
    return Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alertas del Sistema</h1>
          <p className="text-gray-400">{alertas.filter(a => !a.leida).length} alertas sin leer</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('todas')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === 'todas'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('caducidad')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === 'caducidad'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            Caducidad
          </button>
          <button
            onClick={() => setFilter('stock_bajo')}
            className={`px-4 py-2 rounded-xl transition-colors ${
              filter === 'stock_bajo'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            Stock Bajo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/30 flex items-center justify-center">
              <Clock className="text-amber-400" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">
                {alertas.filter(a => a.tipo_alerta === 'caducidad' && !a.leida).length}
              </p>
              <p className="text-gray-400">Por Caducidad</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-500/30 flex items-center justify-center">
              <Package className="text-red-400" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-400">
                {alertas.filter(a => a.tipo_alerta === 'stock_bajo' && !a.leida).length}
              </p>
              <p className="text-gray-400">Stock Bajo</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/30 flex items-center justify-center">
              <Check className="text-emerald-400" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">
                {alertas.filter(a => a.leida).length}
              </p>
              <p className="text-gray-400">Resueltas</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-3">
        {filteredAlertas.map((alerta, index) => {
          const producto = getProductoById(alerta.id_producto);
          const isCaducidad = alerta.tipo_alerta === 'caducidad';
          const daysLeft = producto ? getDaysUntilExpiry(producto.fecha_vencimiento) : 0;
          
          return (
            <motion.div
              key={alerta.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-slate-800/50 border rounded-2xl p-5 transition-all ${
                alerta.leida 
                  ? 'border-slate-700/50 opacity-60' 
                  : isCaducidad 
                    ? 'border-amber-500/30' 
                    : 'border-red-500/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isCaducidad ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`}>
                  <AlertTriangle className={isCaducidad ? 'text-amber-400' : 'text-red-400'} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                          isCaducidad 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {isCaducidad ? 'Caducidad' : 'Stock Bajo'}
                        </span>
                        {alerta.leida && (
                          <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-500/20 text-gray-400">
                            Leída
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-lg">{producto?.nombre}</h3>
                      <p className="text-gray-400 mt-1">{alerta.mensaje}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{alerta.fecha_alerta}</p>
                      {isCaducidad && daysLeft > 0 && (
                        <p className={`text-sm font-medium mt-1 ${
                          daysLeft <= 7 ? 'text-red-400' : daysLeft <= 30 ? 'text-amber-400' : 'text-gray-400'
                        }`}>
                          {daysLeft} días restantes
                        </p>
                      )}
                      {isCaducidad && daysLeft <= 0 && (
                        <p className="text-sm font-medium mt-1 text-red-400">VENCIDO</p>
                      )}
                    </div>
                  </div>
                  {!alerta.leida && (
                    <button
                      onClick={() => marcarAlertaLeida(alerta.id)}
                      className="mt-3 flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors text-sm"
                    >
                      <Check size={16} />
                      Marcar como leída
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredAlertas.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">¡Sin alertas!</h3>
            <p className="text-gray-400">No hay alertas en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
