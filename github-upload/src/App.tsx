import { useState } from 'react';
import { motion } from 'framer-motion';
import { DataProvider, useData } from './DataContext';
import { Login } from './Login';
import { Layout } from './Layout';
import { Dashboard } from './Dashboard';
import { Productos } from './Productos';
import { Categorias } from './Categorias';
import { Proveedores } from './Proveedores';
import { Compras } from './Compras';
import { Ventas } from './Ventas';
import { Alertas } from './Alertas';
import { Reportes } from './Reportes';
import { Usuarios } from './Usuarios';
import { Portfolio } from './Portfolio';
import { Pill, Presentation, ArrowRight } from 'lucide-react';

function HomePage({ onSelectPortfolio, onSelectSystem }: { onSelectPortfolio: () => void; onSelectSystem: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
        >
          <Pill className="text-white" size={48} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold text-white mb-4"
        >
          Farmacia Santa Cruz
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-xl mb-12"
        >
          Sistema de Inventario | Portafolio de Proyecto
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.button
            onClick={onSelectSystem}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-left hover:border-emerald-500/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Pill className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sistema de Inventario</h2>
            <p className="text-gray-400 mb-4">Acceder al sistema completo con login, gestión de productos, ventas, compras y más.</p>
            <span className="text-emerald-400 font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
              Entrar al sistema <ArrowRight size={18} />
            </span>
          </motion.button>

          <motion.button
            onClick={onSelectPortfolio}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-left hover:border-pink-500/50 transition-all group"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Presentation className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Portafolio</h2>
            <p className="text-gray-400 mb-4">Ver la presentación del proyecto, requisitos, casos de uso y documentación.</p>
            <span className="text-pink-400 font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
              Ver portafolio <ArrowRight size={18} />
            </span>
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 text-sm mt-12"
        >
          Instituto Nacional de San Martín | 2° Bachillerato Técnico en Desarrollo de Software "B" | 2026
        </motion.p>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const { currentPage, setCurrentPage, currentUser } = useData();

  const handleSelectPortfolio = () => {
    setCurrentPage('portfolio');
  };

  const handleSelectSystem = () => {
    setCurrentPage('login');
  };

  const handleBackHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'home') {
    return <HomePage onSelectPortfolio={handleSelectPortfolio} onSelectSystem={handleSelectSystem} />;
  }

  if (currentPage === 'portfolio') {
    return (
      <div>
        <Portfolio />
        <button
          onClick={handleBackHome}
          className="fixed bottom-6 right-6 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-colors z-50"
        >
          <ArrowRight size={16} className="rotate-180" />
          Volver al inicio
        </button>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <Login />
        <button
          onClick={handleBackHome}
          className="fixed bottom-6 right-6 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl flex items-center gap-2 hover:bg-slate-700 transition-colors z-50"
        >
          <ArrowRight size={16} className="rotate-180" />
          Volver al inicio
        </button>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'productos':
        return <Productos />;
      case 'categorias':
        return <Categorias />;
      case 'proveedores':
        return <Proveedores />;
      case 'compras':
        return <Compras />;
      case 'ventas':
        return <Ventas />;
      case 'alertas':
        return <Alertas />;
      case 'reportes':
        return <Reportes />;
      case 'usuarios':
        return <Usuarios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
