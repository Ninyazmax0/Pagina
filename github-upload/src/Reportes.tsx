import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Calendar, Download, Printer } from 'lucide-react';
import { useData } from './DataContext';

export function Reportes() {
  const { stats, productos, ventas, detalleVentas, compras, detalleCompras, getCategoriaById, getUsuarioById } = useData();
  const [reportType, setReportType] = useState<'resumen' | 'ventas' | 'inventario' | 'compras'>('resumen');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const ventasPorDia = ventas.reduce((acc, venta) => {
    const dia = formatDate(venta.fecha_venta);
    acc[dia] = (acc[dia] || 0) + venta.total;
    return acc;
  }, {} as Record<string, number>);

  const ventasPorCategoria = detalleVentas.reduce((acc, dv) => {
    const producto = productos.find(p => p.id === dv.id_producto);
    if (producto) {
      const catNombre = getCategoriaById(producto.id_categoria)?.nombre || 'Sin categoría';
      acc[catNombre] = (acc[catNombre] || 0) + dv.subtotal;
    }
    return acc;
  }, {} as Record<string, number>);

  const ventasPorVendedor = ventas.reduce((acc, venta) => {
    const vendedor = getUsuarioById(venta.id_usuario)?.nombre || 'Desconocido';
    acc[vendedor] = (acc[vendedor] || 0) + venta.total;
    return acc;
  }, {} as Record<string, number>);

  const maxVenta = Math.max(...Object.values(ventasPorDia), 1);
  const maxCategoria = Math.max(...Object.values(ventasPorCategoria), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes y Estadísticas</h1>
          <p className="text-gray-400">Análisis del negocio</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white rounded-xl transition-colors">
            <Printer size={18} />
            Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'resumen', label: 'Resumen General', icon: BarChart3 },
          { id: 'ventas', label: 'Análisis de Ventas', icon: DollarSign },
          { id: 'inventario', label: 'Inventario', icon: Package },
          { id: 'compras', label: 'Compras', icon: ShoppingCart },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setReportType(type.id as typeof reportType)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
              reportType === type.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/50 border border-slate-700 text-gray-400 hover:text-white'
            }`}
          >
            <type.icon size={18} />
            {type.label}
          </button>
        ))}
      </div>

      {reportType === 'resumen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                  <DollarSign className="text-emerald-400" size={24} />
                </div>
                <TrendingUp className="text-emerald-400" size={20} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">${stats.ventasMes.toFixed(2)}</p>
              <p className="text-gray-400">Ventas del mes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/30 flex items-center justify-center">
                  <Package className="text-blue-400" size={24} />
                </div>
                <span className="text-blue-400 text-sm">Total</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stats.totalProductos}</p>
              <p className="text-gray-400">Productos en inventario</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/30 flex items-center justify-center">
                  <BarChart3 className="text-purple-400" size={24} />
                </div>
                <span className="text-purple-400 text-sm">Promedio</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">${(stats.ventasMes / 30).toFixed(2)}</p>
              <p className="text-gray-400">Ventas promedio diarias</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center">
                  <ShoppingCart className="text-amber-400" size={24} />
                </div>
                <span className="text-amber-400 text-sm">{ventas.length}</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{ventas.length}</p>
              <p className="text-gray-400">Transacciones del mes</p>
            </motion.div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Calendar className="text-emerald-400" size={20} />
              Ventas por Día
            </h3>
            <div className="space-y-3">
              {Object.entries(ventasPorDia).map(([dia, total]) => (
                <div key={dia} className="flex items-center gap-4">
                  <span className="w-20 text-gray-400 text-sm">{dia}</span>
                  <div className="flex-1 h-8 bg-slate-900 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(total / maxVenta) * 100}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg"
                    />
                  </div>
                  <span className="w-24 text-right text-white font-medium">${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === 'ventas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Ventas por Categoría</h3>
            <div className="space-y-4">
              {Object.entries(ventasPorCategoria).map(([categoria, total]) => (
                <div key={categoria} className="flex items-center gap-4">
                  <span className="w-32 text-gray-400 text-sm truncate">{categoria}</span>
                  <div className="flex-1 h-6 bg-slate-900 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(total / maxCategoria) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg"
                    />
                  </div>
                  <span className="w-24 text-right text-white font-medium">${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Ventas por Vendedor</h3>
            <div className="space-y-4">
              {Object.entries(ventasPorVendedor).map(([vendedor, total]) => (
                <div key={vendedor} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    {vendedor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{vendedor}</p>
                    <p className="text-gray-400 text-sm">{ventas.filter(v => getUsuarioById(v.id_usuario)?.nombre === vendedor).length} ventas</p>
                  </div>
                  <span className="text-emerald-400 font-bold">${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === 'inventario' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Estado del Inventario</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Producto</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Categoría</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Stock</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Stock Mín.</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Precio Venta</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {productos.filter(p => p.activo).map((producto) => {
                  const isLow = producto.stock_actual < producto.stock_minimo;
                  return (
                    <tr key={producto.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white font-medium">{producto.nombre}</td>
                      <td className="px-6 py-4 text-gray-400">{getCategoriaById(producto.id_categoria)?.nombre}</td>
                      <td className="px-6 py-4 text-right text-white">{producto.stock_actual}</td>
                      <td className="px-6 py-4 text-right text-gray-400">{producto.stock_minimo}</td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-medium">${producto.precio_venta.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          isLow 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {isLow ? 'Stock Bajo' : 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'compras' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-6">
              <p className="text-3xl font-bold text-blue-400 mb-1">{compras.length}</p>
              <p className="text-gray-400">Compras registradas</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30 rounded-2xl p-6">
              <p className="text-3xl font-bold text-purple-400 mb-1">${stats.comprasMes.toFixed(2)}</p>
              <p className="text-gray-400">Total compras mes</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6">
              <p className="text-3xl font-bold text-amber-400 mb-1">
                {compras.length > 0 ? `$${(stats.comprasMes / compras.length).toFixed(2)}` : '$0.00'}
              </p>
              <p className="text-gray-400">Promedio por compra</p>
            </div>
          </div>

          {compras.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
              <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">Sin compras registradas</h3>
              <p className="text-gray-400">Las compras aparecerán aquí cuando se registren</p>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Método de Pago</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {compras.map((compra) => (
                    <tr key={compra.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 text-white font-medium">#{compra.id.toString().padStart(4, '0')}</td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(compra.fecha_compra)}</td>
                      <td className="px-6 py-4 text-gray-400 capitalize">{compra.metodo_pago}</td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-medium">${compra.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
