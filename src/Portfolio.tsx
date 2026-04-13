import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Activity, Package, Database, FileText, 
  GitBranch, Shield, ShoppingCart, DollarSign, 
  AlertTriangle, BarChart3, ChevronDown, Menu, X,
  Code, Server, Layout, Monitor, FlaskConical,
  Mail, CircleDot, Link2, User, ArrowRight
} from 'lucide-react';
import { useData } from './DataContext';
import { PageType } from './types';

const teamMembers = [
  { name: 'Steven Gabriel Lopez Hernandez', id: '#04', initials: 'SL', rol: 'Administrador' },
  { name: 'Joel Edgardo Mendoza Lopez', id: '#08', initials: 'JM', rol: 'Vendedor' },
  { name: 'Guadalupe Abigaíl Romero Pedroza', id: '#32', initials: 'GR', rol: 'Vendedor' },
  { name: 'Tiffany Alessandra Sermeño Flores', id: '#34', initials: 'TS', rol: 'Vendedor' },
]

const stats = [
  { number: '7', label: 'Requisitos', icon: FileText },
  { number: '7', label: 'Casos de Uso', icon: GitBranch },
  { number: '10', label: 'Clases', icon: Code },
  { number: '9', label: 'Tablas BD', icon: Database },
]

const requirements = [
  { code: 'RF-001', title: 'Inicio de Sesión', desc: 'Acceso con usuario y contraseña' },
  { code: 'RF-002', title: 'Registrar Productos', desc: 'Registro de medicamentos' },
  { code: 'RF-003', title: 'Registrar Compras', desc: 'Compra a proveedores' },
  { code: 'RF-004', title: 'Registrar Ventas', desc: 'Venta y facturación' },
  { code: 'RF-005', title: 'Monitoreo de Costos', desc: 'Control de precios' },
  { code: 'RF-006', title: 'Alerta de Caducidad', desc: 'Productos próximos a vencer' },
  { code: 'RF-007', title: 'Generar Reportes', desc: 'Reportes de inventario' },
]

const useCases = [
  { code: 'CU-01', title: 'Iniciar Sesión', desc: 'Autenticación de usuarios' },
  { code: 'CU-02', title: 'Gestionar Productos', desc: 'CRUD de medicamentos' },
  { code: 'CU-03', title: 'Registrar Compra', desc: 'Compra a proveedor' },
  { code: 'CU-04', title: 'Registrar Venta', desc: 'Venta con factura' },
  { code: 'CU-05', title: 'Ver Alertas', desc: 'Stock y caducidad' },
  { code: 'CU-06', title: 'Generar Reportes', desc: 'Reportes del sistema' },
  { code: 'CU-07', title: 'Gestionar Usuarios', desc: 'Admin de usuarios' },
]

const classes = [
  { name: 'Usuario', methods: ['iniciarSesion()', 'verificarPermisos()'] },
  { name: 'Producto', methods: ['registrar()', 'actualizarStock()', 'verificarVencimiento()'] },
  { name: 'Categoría', methods: ['crear()', 'asignar()'] },
  { name: 'Proveedor', methods: ['registrar()', 'actualizar()'] },
  { name: 'Compra', methods: ['registrar()', 'calcularTotal()'] },
  { name: 'DetalleCompra', methods: ['agregar()', 'calcular()'] },
  { name: 'Venta', methods: ['registrar()', 'generarFactura()'] },
  { name: 'DetalleVenta', methods: ['agregar()', 'descontarStock()'] },
  { name: 'Alerta', methods: ['generar()', 'verificar()'] },
  { name: 'Reporte', methods: ['generar()', 'exportar()'] },
]

const entities = [
  { name: 'Usuario', desc: 'Admin, Vendedor', color: 'from-emerald-500 to-teal-600' },
  { name: 'Proveedor', desc: 'Distribuidores', color: 'from-purple-500 to-violet-600' },
  { name: 'Categoría', desc: 'Clasificación', color: 'from-amber-500 to-orange-600' },
  { name: 'Producto', desc: 'Medicamentos', color: 'from-rose-500 to-pink-600' },
  { name: 'Compra', desc: 'Orden de compra', color: 'from-cyan-500 to-blue-600' },
  { name: 'Venta', desc: 'Registro de venta', color: 'from-indigo-500 to-purple-600' },
]

const documents = [
  { name: 'ARQUITECTURA_SOFTWARE.html', desc: 'Diagrama de Componentes MVC', icon: Layout },
  { name: 'DIAGRAMA_CLASES.html', desc: 'Modelo de Clases UML', icon: Code },
  { name: 'DICCIONARIO_DATOS.html', desc: 'Diccionario de Datos', icon: FileText },
  { name: 'DER_FARMACIA.html', desc: 'Diagrama Entidad-Relación', icon: Database },
  { name: 'inventario_farmacia.html', desc: 'Documento Principal', icon: Package },
  { name: 'PLAN_COMPLETO.md', desc: 'Plan del Proyecto', icon: BarChart3 },
  { name: 'REGISTRO_CAMBIOS.md', desc: 'Registro de Cambios', icon: Activity },
  { name: 'RF_LOGICOS.md', desc: 'Requisitos Funcionales', icon: Shield },
]

const techStack = [
  { name: 'React + TypeScript', icon: Code },
  { name: 'Tailwind CSS', icon: Monitor },
  { name: 'Vite', icon: Server },
  { name: 'Framer Motion', icon: Activity },
]

function Section({ children, id, className = '' }: { children: React.ReactNode, id?: string, className?: string }) {
  return (
    <section id={id} className={`min-h-screen flex items-center justify-center py-20 px-4 ${className}`}>
      {children}
    </section>
  )
}

function SectionTitle({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <h2 className="font-display text-5xl md:text-7xl text-white mb-4">{children}</h2>
      {subtitle && <p className="text-gray-400 text-lg md:text-xl tracking-widest uppercase">{subtitle}</p>}
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 200 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mt-6 rounded-full"
      />
    </motion.div>
  )
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

function Hero({ onNavigate }: { onNavigate: () => void }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const moonY = useTransform(scrollY, [0, 500], [0, 80])

  return (
    <Section id="home" className="relative overflow-hidden">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute left-[29.427%] top-1/2 -translate-y-1/2 w-[80vh] max-w-[1385px] h-[80vh] max-h-[1385px]">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 shadow-[0_0_150px_rgba(245,245,220,0.5)]" />
        </div>
      </motion.div>
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="font-display text-7xl md:text-9xl text-white leading-none mb-4">
            FARMACIA<br/>SANTA CRUZ
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 250 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mb-6 rounded-full"
          />
          <p className="text-gray-300 text-xl md:text-2xl tracking-[0.3em] uppercase mb-8">
            Sistema de Inventario
          </p>
          <motion.button
            onClick={onNavigate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-full inline-flex items-center gap-2 shadow-lg shadow-pink-500/30"
          >
            Ir al Sistema
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>

      <motion.div 
        style={{ y: moonY }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </Section>
  )
}

function Team() {
  return (
    <Section id="team" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <SectionTitle subtitle="4 estudiantes comprometidos">EQUIPO DE TRABAJO</SectionTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.1}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-2xl font-bold">
                  {member.initials}
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-400">{member.id}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Project() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])

  return (
    <Section id="project" className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <h2 className="font-display text-5xl md:text-6xl text-white mb-6">SISTEMA DE<br/>INVENTARIO</h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: 100 }}
                className="h-1 bg-gradient-to-r from-pink-500 to-rose-500 mb-6 rounded-full"
              />
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Sistema digital de inventario para gestionar <span className="text-pink-400 font-semibold">$12,000 anuales</span> en medicamentos 
                con control de stock, alertas de caducidad y reportes detallados.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                  >
                    <stat.icon className="mx-auto mb-2 text-pink-500" size={24} />
                    <div className="text-3xl font-display text-white">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {techStack.map((tech) => (
                  <span 
                    key={tech.name}
                    className="px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-white text-sm flex items-center gap-2"
                  >
                    <tech.icon size={16} />
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          <motion.div style={{ y }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="space-y-4">
                  {[
                    { icon: Package, title: 'Control de Stock', desc: 'Gestión en tiempo real' },
                    { icon: AlertTriangle, title: 'Alertas de Caducidad', desc: 'Notificaciones automáticas' },
                    { icon: DollarSign, title: 'Control de Costos', desc: 'Monitoreo de precios' },
                    { icon: BarChart3, title: 'Reportes Detallados', desc: 'Análisis del negocio' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                        <item.icon className="text-white" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

function Architecture() {
  const layers = [
    { 
      title: 'VISTA', 
      icon: Layout,
      color: 'from-emerald-500 to-teal-600',
      items: ['Login', 'Dashboard', 'Productos', 'Compras', 'Ventas', 'Alertas']
    },
    { 
      title: 'CONTROL', 
      icon: Server,
      color: 'from-rose-500 to-pink-600',
      items: ['AuthController', 'ProductoController', 'CompraController', 'VentaController', 'AlertaController']
    },
    { 
      title: 'MODELO', 
      icon: Database,
      color: 'from-cyan-500 to-blue-600',
      items: ['Usuario', 'Producto', 'Proveedor', 'Categoría', 'Venta', 'Compra']
    },
    { 
      title: 'DATOS', 
      icon: FileText,
      color: 'from-purple-500 to-violet-600',
      items: ['SQLite', '9 Tablas', 'DER', 'Diccionario', 'Relaciones', 'Índices']
    },
  ]

  return (
    <Section id="architecture" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto w-full">
        <SectionTitle subtitle="Modelo Vista Controlador">ARQUITECTURA MVC</SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {layers.map((layer, index) => (
            <FadeIn key={layer.title} delay={index * 0.15}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-gradient-to-br ${layer.color}/20 border border-white/10 rounded-2xl p-6`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-4`}>
                  <layer.icon className="text-white" size={28} />
                </div>
                <h3 className="text-white text-xl font-semibold mb-4">{layer.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span key={item} className="px-3 py-1 bg-white/10 rounded-lg text-gray-300 text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Classes() {
  return (
    <Section id="classes" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto w-full">
        <SectionTitle subtitle="10 clases del sistema">DIAGRAMA DE CLASES</SectionTitle>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {classes.map((cls, index) => (
            <FadeIn key={cls.name} delay={index * 0.05}>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
              >
                <h4 className="text-pink-400 font-semibold mb-2">{cls.name}</h4>
                <div className="space-y-1">
                  {cls.methods.map((method) => (
                    <p key={method} className="text-gray-400 text-xs font-mono">{method}</p>
                  ))}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function UseCases() {
  return (
    <Section id="usecases" className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <SectionTitle subtitle="7 casos de uso principales">CASOS DE USO</SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, index) => (
            <FadeIn key={uc.code} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-start gap-4 hover:border-pink-500/50 transition-colors"
              >
                <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white text-sm font-mono">
                  {uc.code}
                </span>
                <div>
                  <h4 className="text-white font-semibold mb-1">{uc.title}</h4>
                  <p className="text-gray-400 text-sm">{uc.desc}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Requirements() {
  return (
    <Section id="requirements" className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto w-full">
        <SectionTitle subtitle="7 requisitos funcionales">REQUISITOS</SectionTitle>
        
        <div className="space-y-3">
          {requirements.map((req, index) => (
            <FadeIn key={req.code} delay={index * 0.08}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex items-center gap-6 hover:border-pink-500/30 transition-colors"
              >
                <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white font-mono text-sm min-w-[100px] text-center">
                  {req.code}
                </span>
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{req.title}</h4>
                  <p className="text-gray-400 text-sm">{req.desc}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function DER() {
  return (
    <Section id="der" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto w-full">
        <SectionTitle subtitle="6 entidades principales">DIAGRAMA ENTIDAD-RELACIÓN</SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entities.map((entity, index) => (
            <FadeIn key={entity.name} delay={index * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03, y: -5 }}
                className={`bg-gradient-to-br ${entity.color}/20 border border-white/10 rounded-2xl p-6`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${entity.color} flex items-center justify-center mb-4`}>
                  <Database className="text-white" size={24} />
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">{entity.name}</h4>
                <p className="text-gray-400">{entity.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Documents() {
  return (
    <Section id="documents" className="bg-gradient-to-b from-slate-950 via-slate-800 to-slate-950">
      <div className="max-w-6xl mx-auto w-full">
        <SectionTitle subtitle="8 archivos de documentación">DOCUMENTOS</SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((doc, index) => (
            <FadeIn key={doc.name} delay={index * 0.08}>
              <motion.div
                whileHover={{ scale: 1.02, y: -3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <doc.icon className="text-pink-500 mb-3" size={28} />
                <h4 className="text-white font-semibold text-sm mb-1">{doc.name}</h4>
                <p className="text-gray-400 text-xs">{doc.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Contact() {
  return (
    <Section id="contact" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto w-full text-center">
        <FadeIn>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            GRACIAS POR<br/>VER NUESTRO<br/>PROYECTO
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 200 }}
            className="h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mb-8 rounded-full"
          />
          
          <div className="space-y-2 mb-8">
            <p className="text-gray-300 text-lg">Instituto Nacional de San Martín</p>
            <p className="text-gray-400">2° Bachillerato Técnico en Desarrollo de Software "B"</p>
            <p className="text-gray-400">Docente: María Magdalena García González</p>
            <p className="text-gray-500">Marzo 2026 | San Martín, El Salvador</p>
          </div>

          <div className="flex justify-center gap-4">
            {[
              { icon: CircleDot, label: 'GitHub' },
              { icon: Link2, label: 'LinkedIn' },
              { icon: Mail, label: 'Email' },
            ].map((social) => (
              <motion.a
                key={social.label}
                href="#"
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-500 transition-colors"
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}

function PortfolioNavigation({ onNavigate }: { onNavigate: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'INICIO', href: '#home' },
    { label: 'EQUIPO', href: '#team' },
    { label: 'PROYECTO', href: '#project' },
    { label: 'ARQUITECTURA', href: '#architecture' },
    { label: 'CONTACTO', href: '#contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="font-display text-xl text-white tracking-wider">
          FARMACIA SANTA CRUZ
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-pink-400 transition-colors text-sm tracking-wider"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onNavigate}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Ir al Sistema
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950/95 backdrop-blur-md"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-300 hover:text-pink-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export function Portfolio() {
  const { setCurrentPage } = useData();

  const handleNavigate = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="bg-slate-950 min-h-screen">
      <PortfolioNavigation onNavigate={handleNavigate} />
      <Hero onNavigate={handleNavigate} />
      <Team />
      <Project />
      <Architecture />
      <Classes />
      <UseCases />
      <Requirements />
      <DER />
      <Documents />
      <Contact />
    </div>
  );
}
