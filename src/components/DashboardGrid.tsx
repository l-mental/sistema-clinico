import React from 'react';
import { ActiveView } from './Sidebar';
import { UserRole } from '../types/hospital';
import {
  Eye,
  Bed,
  Siren,
  Scissors,
  ShieldCheck,
  Syringe,
  FlaskConical,
  Droplet,
  Scan,
  Boxes,
  BarChart3,
  UserCheck,
  Settings2,
  FileCheck2,
  ScrollText,
  Wrench,
  ArrowRight,
  Glasses
} from 'lucide-react';

interface DashboardGridProps {
  onNavigate: (view: ActiveView) => void;
  userRole: UserRole;
  userDisplayName: string;
  stats: {
    appointmentsCount: number;
    patientsCount: number;
    activeSurgeries: number;
    emergenciesCount: number;
    inventoryLowCount: number;
    opticaOrdersCount: number;
  };
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  onNavigate,
  userRole,
  userDisplayName,
  stats
}) => {
  const modules: {
    id: ActiveView;
    title: string;
    subtitle: string;
    desc: string;
    badge: string;
    badgeColor: string;
    iconBg: string;
    iconBorder: string;
    roles: UserRole[];
    icon: React.ReactNode;
  }[] = [
    {
      id: 'optica' as ActiveView,
      title: 'Óptica · Venta de Lentes',
      subtitle: 'Optical Store & POS',
      desc: 'Monturas, lunas progresivas, taller óptico y caja',
      badge: `${stats.opticaOrdersCount} Órdenes`,
      badgeColor: 'bg-teal-100 text-teal-800',
      iconBg: 'from-teal-50 to-emerald-100/60',
      iconBorder: 'border-teal-200',
      roles: ['Administrador', 'Operador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-500 flex items-center justify-center shadow-md shadow-teal-600/25 text-white">
            <Glasses className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'appointments' as ActiveView,
      title: userRole === 'Doctor' ? 'Mis Citas y Agenda' : 'Citas y Agenda',
      subtitle: 'Appointment',
      desc: userRole === 'Doctor' ? 'Su agenda médica personal, consultas y turnos' : 'Gestión de agenda médica, consultas y turnos',
      badge: `${stats.appointmentsCount} Hoy`,
      badgeColor: 'bg-sky-100 text-sky-800',
      iconBg: 'from-sky-50 to-blue-100/60',
      iconBorder: 'border-sky-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Calendar illustration like image */}
          <div className="w-13 h-14 bg-white rounded-lg shadow-md border border-slate-200 flex flex-col overflow-hidden">
            <div className="h-4 bg-rose-500 flex items-center justify-center gap-1.5 px-2">
              <div className="w-1 h-1.5 bg-slate-100 rounded-full"></div>
              <div className="w-1 h-1.5 bg-slate-100 rounded-full"></div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50">
              <span className="text-xs font-black text-slate-800 leading-none">25</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">NOV</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'patients' as ActiveView,
      title: userRole === 'Doctor' ? 'Mis Pacientes' : 'Registro de Pacientes',
      subtitle: 'Patient Registration',
      desc: userRole === 'Doctor' ? 'Expedientes y antecedentes de sus pacientes' : 'Filiación, antecedentes oculares y seguro',
      badge: `${stats.patientsCount} ${userRole === 'Doctor' ? 'Asignados' : 'Registrados'}`,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      iconBg: 'from-emerald-50 to-teal-100/60',
      iconBorder: 'border-emerald-200',
      roles: ['Administrador', 'Doctor', 'Operador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-14 bg-amber-50 rounded-lg shadow-md border border-amber-200 flex flex-col p-1.5 relative">
            <div className="w-6 h-2 bg-slate-400 rounded-t-sm self-center -mt-2.5"></div>
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-xs bg-emerald-500"></div>
                <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-xs bg-emerald-500"></div>
                <div className="w-5 h-1 bg-slate-300 rounded-full"></div>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-xs bg-sky-500"></div>
                <div className="w-7 h-1 bg-slate-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'clinical' as ActiveView,
      title: 'Consulta Oftalmológica',
      subtitle: 'Clinical Management',
      desc: 'Agudeza visual, refracción, PIO y lámpara',
      badge: 'Expediente Activo',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      iconBg: 'from-indigo-50 to-sky-100/60',
      iconBorder: 'border-indigo-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/25">
            <Eye className="w-7 h-7 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'daycare' as ActiveView,
      title: 'Hospitalización de Día',
      subtitle: 'Day Care',
      desc: 'Recuperación postquirúrgica y reposo ocular',
      badge: '4 Camas Libres',
      badgeColor: 'bg-amber-100 text-amber-800',
      iconBg: 'from-amber-50 to-orange-100/60',
      iconBorder: 'border-amber-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20 text-white">
            <Bed className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'emergency' as ActiveView,
      title: 'Urgencias Oculares',
      subtitle: 'Emergency Room',
      desc: 'Traumatismos, causticaciones y glaucoma agudo',
      badge: `${stats.emergenciesCount} En Espera`,
      badgeColor: 'bg-red-100 text-red-800',
      iconBg: 'from-red-50 to-rose-100/60',
      iconBorder: 'border-red-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-md shadow-red-600/30 text-white animate-pulse">
            <Siren className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'surgery' as ActiveView,
      title: userRole === 'Doctor' ? 'Mis Cirugías' : 'Quirófano Ocular',
      subtitle: 'Operation Theatre',
      desc: 'Facoemulsificación, LASIK, vitrectomía',
      badge: `${stats.activeSurgeries} Programadas`,
      badgeColor: 'bg-purple-100 text-purple-800',
      iconBg: 'from-purple-50 to-fuchsia-100/60',
      iconBorder: 'border-purple-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/25 text-white">
            <Scissors className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'insurance' as ActiveView,
      title: 'Seguros y Facturación',
      subtitle: 'Insurance & eClaim',
      desc: 'Coberturas EPS, prepagas y autorización',
      badge: '98% Aprobación',
      badgeColor: 'bg-blue-100 text-blue-800',
      iconBg: 'from-blue-50 to-cyan-100/60',
      iconBorder: 'border-blue-200',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center shadow-md shadow-blue-600/25 text-white">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'procedures' as ActiveView,
      title: 'Procedimientos Menores',
      subtitle: 'Phlebotomy / Procedures',
      desc: 'Inyecciones intravítreas, YAG Láser, lavados',
      badge: 'Box Rápido',
      badgeColor: 'bg-teal-100 text-teal-800',
      iconBg: 'from-teal-50 to-emerald-100/60',
      iconBorder: 'border-teal-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/25 text-white">
            <Syringe className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'laboratory' as ActiveView,
      title: 'Diagnósticos Especiales',
      subtitle: 'Laboratory / OCT',
      desc: 'OCT macular, campimetría y biometría',
      badge: '3 Procesados',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      iconBg: 'from-cyan-50 to-sky-100/60',
      iconBorder: 'border-cyan-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 flex items-center justify-center shadow-md shadow-cyan-600/25 text-white">
            <FlaskConical className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'corneabank' as ActiveView,
      title: 'Banco de Córneas & Tejidos',
      subtitle: 'Cornea Bank',
      desc: 'Tejido corneal para trasplante y endotelio',
      badge: '2 Botones Disponibles',
      badgeColor: 'bg-rose-100 text-rose-800',
      iconBg: 'from-rose-50 to-pink-100/60',
      iconBorder: 'border-rose-200',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-md shadow-rose-500/25 text-white">
            <Droplet className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'imaging' as ActiveView,
      title: 'Diagnóstico por Imágenes',
      subtitle: 'Radiology & Eco Ocular',
      desc: 'Ecografía modo B, retinografía y angiografía',
      badge: 'Digital HD',
      badgeColor: 'bg-slate-100 text-slate-800',
      iconBg: 'from-slate-50 to-slate-200/60',
      iconBorder: 'border-slate-300',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 flex items-center justify-center shadow-md shadow-slate-700/25 text-white">
            <Scan className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'inventory' as ActiveView,
      title: 'Inventario & Farmacia',
      subtitle: 'Inventory',
      desc: 'LIOs, viscoelásticos y colirios oftálmicos',
      badge: 'Stock Actualizado',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      iconBg: 'from-emerald-50 to-green-100/60',
      iconBorder: 'border-emerald-200',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-600/25 text-white">
            <Boxes className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'reports' as ActiveView,
      title: 'Reportes y Métricas MIS',
      subtitle: 'MIS Reports',
      desc: 'Estadísticas quirúrgicas y epidemiología',
      badge: 'Analítica en Vivo',
      badgeColor: 'bg-sky-100 text-sky-800',
      iconBg: 'from-sky-50 to-indigo-100/60',
      iconBorder: 'border-sky-200',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-600/25 text-white">
            <BarChart3 className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'nursing' as ActiveView,
      title: 'Estación de Enfermería',
      subtitle: 'Nurse Station',
      desc: 'Triaje visual, tonometría de aire y midriasis',
      badge: 'Dilataciones Activas',
      badgeColor: 'bg-pink-100 text-pink-800',
      iconBg: 'from-pink-50 to-rose-100/60',
      iconBorder: 'border-pink-200',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md shadow-pink-500/25 text-white">
            <UserCheck className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'inventory-setup' as ActiveView,
      title: 'Configuración Catálogo',
      subtitle: 'Inventory Setup',
      desc: 'Gestión de marcas LIO, dioptrías y lotes',
      badge: 'Catálogo Maestro',
      badgeColor: 'bg-slate-100 text-slate-800',
      iconBg: 'from-slate-50 to-zinc-100/60',
      iconBorder: 'border-slate-300',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-slate-600 to-zinc-700 flex items-center justify-center shadow-md shadow-slate-600/25 text-white">
            <Settings2 className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'discharge' as ActiveView,
      title: 'Resumen de Alta y Epicrisis',
      subtitle: 'Discharge Summary',
      desc: 'Instrucciones post-faco y reposo visual',
      badge: 'Protocolos Activos',
      badgeColor: 'bg-amber-100 text-amber-800',
      iconBg: 'from-amber-50 to-yellow-100/60',
      iconBorder: 'border-amber-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-md shadow-amber-500/25 text-white">
            <FileCheck2 className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'templates' as ActiveView,
      title: 'Recetario y Plantillas',
      subtitle: 'Custom Template',
      desc: 'Prescripción óptica de gafas y colirios',
      badge: 'Impresión Lista',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      iconBg: 'from-emerald-50 to-teal-100/60',
      iconBorder: 'border-emerald-200',
      roles: ['Administrador', 'Doctor'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/25 text-white">
            <ScrollText className="w-7 h-7" />
          </div>
        </div>
      )
    },
    {
      id: 'management' as ActiveView,
      title: 'Gestión Médica y Sistema',
      subtitle: 'Software Management',
      desc: 'Oftalmólogos, consultorios y permisos',
      badge: 'Admin General',
      badgeColor: 'bg-slate-100 text-slate-800',
      iconBg: 'from-slate-50 to-slate-200/60',
      iconBorder: 'border-slate-300',
      roles: ['Administrador'],
      icon: (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-slate-700 to-cyan-800 flex items-center justify-center shadow-md shadow-slate-700/25 text-white">
            <Wrench className="w-7 h-7" />
          </div>
        </div>
      )
    }
  ];

  const visibleModules = modules.filter(m => m.roles.includes(userRole));

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Banner / Overview Header */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-600 rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-sky-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider">
              {userRole === 'Administrador'
                ? 'Modo Administrador · Control Global'
                : userRole === 'Doctor'
                  ? `Vista Privada del Especialista · ${userDisplayName}`
                  : 'Módulo de Óptica · Operador'}
            </span>
            <span className="text-xs text-sky-100">
              {userRole === 'Doctor'
                ? 'Solo se muestran sus citas, pacientes y cirugías'
                : 'Jornada Quirúrgica, Consultas y Óptica'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            {userRole === 'Doctor'
              ? `Mi Gabinete Oftalmológico · ${userDisplayName}`
              : 'Panel de Control General · eHospital'}
          </h1>
          <p className="text-sm text-sky-100/90 max-w-2xl mt-1">
            {userRole === 'Doctor'
              ? 'Gestione exclusivamente su agenda de consultas, sus pacientes asignados, expedientes clínicos y parte quirúrgico.'
              : 'Seleccione el módulo clínico, de óptica o administrativo para iniciar la gestión hospitalaria.'}
          </p>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <div className="text-lg font-black tabular-nums">{stats.appointmentsCount}</div>
            <div className="text-[11px] text-sky-100">{userRole === 'Doctor' ? 'Mis Citas' : 'Citas Hoy'}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <div className="text-lg font-black tabular-nums">{stats.activeSurgeries}</div>
            <div className="text-[11px] text-sky-100">{userRole === 'Doctor' ? 'Mis Cirugías' : 'Cirugías'}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <div className="text-lg font-black tabular-nums text-red-200">{stats.emergenciesCount}</div>
            <div className="text-[11px] text-red-100">Urgencias</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <div className="text-lg font-black tabular-nums text-emerald-200">{stats.patientsCount}</div>
            <div className="text-[11px] text-emerald-100">{userRole === 'Doctor' ? 'Mis Pacientes' : 'Pacientes'}</div>
          </div>
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 md:gap-4.5">
        {visibleModules.map((m) => (
          <button
            key={m.id}
            onClick={() => onNavigate(m.id)}
            className="group relative bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-sky-300 rounded-2xl p-4 md:p-5 flex flex-col items-center text-center shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500/40"
          >
            {/* Top Badge */}
            <div className="w-full flex justify-end mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                {m.badge}
              </span>
            </div>

            {/* Icon Graphic Container matching the realistic look of the screenshot */}
            <div className="my-2 p-2 rounded-2xl group-hover:scale-108 transition-transform duration-200">
              {m.icon}
            </div>

            {/* Module Name & Subtitle */}
            <div className="mt-2 w-full">
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-700 transition-colors leading-tight">
                {m.title}
              </h3>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                {m.subtitle}
              </p>
            </div>

            {/* Brief Functional Description */}
            <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
              {m.desc}
            </p>

            {/* Subtle Hover Action Footer */}
            <div className="mt-3 pt-2 w-full border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-600 opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Ingresar</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
