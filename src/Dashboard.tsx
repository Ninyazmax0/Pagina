import { motion } from 'framer-motion';
import { 
  Package, DollarSign, AlertTriangle, TrendingUp, 
  ShoppingCart, Pill, ArrowUp, ArrowDown, Clock
} from 'lucide-react';
import { useData } from './DataContext';

export function Dashboard() {
  const { stats, productos, alertas, ventas, getAlertasActivas, getCategoriaById, getUsuarioById, currentUser } = useData();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const statCards = [
    { label: 'Total Productos', value: stats.totalProductos, icon: Package, color: 'from-emerald-500 to-teal-600', change: '+5%' },
    { label: 'Ventas Hoy', value: `$${stats.ventasHoy.toFixed(2)}`, icon: DollarSign, color: 'from-blue-500 to-indigo-600', change: '+12%' },
    { label: 'Stock Bajo', value: stats.productosStockBajo, icon: AlertTriangle, color: 'from-red-500 to-rose-600', change: '-2' },
    { label: 'Próximos a Vencer', value: stats.productosProximosVencer, icon: Clock, color: 'from-amber-500 to-orange-600', change: '-1' },
  ];

  const recentVentas = [...ventas].sort((a, b) => 
    new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime()
  ).slice(0, 5);

  const lowStockProducts = productos.filter(p => p.stock_actual < p.stock_minimo);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bienvenido, {currentUser?.nombre}</h1>
          <p className="text-gray-400">Resumen del estado de la farmacia</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Fecha actual</p>
          <p className="text-white font-medium">8 de Abril, 2026</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className={`flex items-center text-sm ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.change.startsWith('+') ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={item}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-emerald-400" size={20} />
              Ventas Recientes
            </h3>
            <button className="text-sm text-emerald-400 hover:text-emerald-300">Ver todas</button>
          </div>
          <div className="space-y-4">
            {recentVentas.map((venta) => (
              <div key={venta.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="text-emerald-400" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-medium">#{venta.id.toString().padStart(4, '0')}</p>
                    <p className="text-gray-400 text-sm">{getUsuarioById(venta.id_usuario)?.nombre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${venta.total.toFixed(2)}</p>
                  <p className="text-gray-400 text-sm">{venta.fecha_venta.split(' ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="text-red-400" size={20} />
              Alertas de Stock
            </h3>
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
              {lowStockProducts.length} productos
            </span>
          </div>
          <div className="space-y-3">
            {lowStockProducts.slice(0, 5).map((producto) => (
              <div key={producto.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Pill className="text-red-400" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{producto.nombre}</p>
                    <p className="text-gray-400 text-sm">{getCategoriaById(producto.id_categoria)?.nombre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-semibold">{producto.stock_actual} und</p>
                  <p className="text-gray-400 text-sm">Mín: {producto.stock_minimo}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={item}
        className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ShoppingCart className="text-blue-400" size={20} />
            Resumen del Mes
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
            <p className="text-4xl font-bold text-emerald-400 mb-2">${stats.ventasMes.toFixed(2)}</p>
            <p className="text-gray-400">Ventas del mes</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-500/20">
            <p className="text-4xl font-bold text-blue-400 mb-2">${stats.comprasMes.toFixed(2)}</p>
            <p className="text-gray-400">Compras del mes</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl border border-purple-500/20">
            <p className="text-4xl font-bold text-purple-400 mb-2">${(stats.ventasMes - stats.comprasMes).toFixed(2)}</p>
            <p className="text-gray-400">Ganancia estimada</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
