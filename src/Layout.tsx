import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, Tags, Truck, ShoppingCart, 
  DollarSign, AlertTriangle, BarChart3, Users, LogOut, 
  Menu, X, Bell, ChevronDown, Pill
} from 'lucide-react';
import { useData } from './DataContext';
import { PageType } from './types';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems: { id: PageType; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'categorias', label: 'Categorías', icon: Tags },
  { id: 'proveedores', label: 'Proveedores', icon: Truck },
  { id: 'compras', label: 'Compras', icon: ShoppingCart, adminOnly: true },
  { id: 'ventas', label: 'Ventas', icon: DollarSign },
  { id: 'alertas', label: 'Alertas', icon: AlertTriangle },
  { id: 'reportes', label: 'Reportes', icon: BarChart3, adminOnly: true },
  { id: 'usuarios', label: 'Usuarios', icon: Users, adminOnly: true },
];

export function Layout({ children }: LayoutProps) {
  const { currentPage, setCurrentPage, currentUser, logout, getAlertasActivas } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [alertasOpen, setAlertasOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const alertasActivas = getAlertasActivas();

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || currentUser?.rol === 'administrador'
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="bg-slate-800 border-r border-slate-700 flex flex-col"
      >
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Pill className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-white font-bold text-sm">Farmacia</h1>
                  <p className="text-emerald-400 text-xs">Santa Cruz</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === item.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <item.icon size={22} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={22} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  Cerrar Sesión
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white capitalize">
            {currentPage === 'dashboard' ? 'Panel Principal' : currentPage}
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setAlertasOpen(!alertasOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Bell size={22} />
                {alertasActivas.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {alertasActivas.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {alertasOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="font-semibold text-white">Notificaciones</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {alertasActivas.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          No hay notificaciones
                        </div>
                      ) : (
                        alertasActivas.map((alerta) => (
                          <div
                            key={alerta.id}
                            className={`p-4 border-b border-slate-700/50 ${
                              alerta.tipo_alerta === 'caducidad' ? 'bg-amber-500/10' : 'bg-red-500/10'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <AlertTriangle
                                size={18}
                                className={alerta.tipo_alerta === 'caducidad' ? 'text-amber-400' : 'text-red-400'}
                              />
                              <div>
                                <p className="text-sm text-white">{alerta.mensaje}</p>
                                <p className="text-xs text-gray-400 mt-1">{alerta.fecha_alerta}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {alertasActivas.length > 0 && (
                      <button
                        onClick={() => setCurrentPage('alertas')}
                        className="w-full p-3 text-center text-emerald-400 hover:bg-slate-700 transition-colors text-sm font-medium"
                      >
                        Ver todas las alertas
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {currentUser?.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-white">{currentUser?.nombre}</p>
                  <p className="text-xs text-gray-400 capitalize">{currentUser?.rol}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-slate-700">
                      <p className="text-sm text-white">{currentUser?.nombre}</p>
                      <p className="text-xs text-gray-400">@{currentUser?.usuario}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full p-3 text-left text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">Cerrar Sesión</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
