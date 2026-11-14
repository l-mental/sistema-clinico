import React from 'react';
import { UserRole } from '../types/hospital';
import {
  LayoutGrid,
  CalendarDays,
  Users,
  Eye,
  Siren,
  Scissors,
  Microscope,
  Boxes,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  Glasses
} from 'lucide-react';

export type ActiveView =
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'clinical'
  | 'optica'
  | 'daycare'
  | 'emergency'
  | 'surgery'
  | 'insurance'
  | 'procedures'
  | 'laboratory'
  | 'corneabank'
  | 'imaging'
  | 'inventory'
  | 'reports'
  | 'nursing'
  | 'inventory-setup'
  | 'discharge'
  | 'templates'
  | 'management';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  userRole: UserRole;
  counts?: {
    appointments: number;
    surgeries: number;
    emergencies: number;
    opticaOrders: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobileOpen,
  setIsMobileOpen,
  userRole,
  counts
}) => {
  const allNavItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutGrid,
      count: null,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'optica',
      label: 'Óptica · Venta de Lentes',
      icon: Glasses,
      count: counts ? String(counts.opticaOrders) : null,
      roles: ['Administrador', 'Operador'] as UserRole[]
    },
    {
      id: 'appointments',
      label: userRole === 'Doctor' ? 'Mis Citas & Agenda' : 'Citas & Agenda',
      icon: CalendarDays,
      count: counts ? String(counts.appointments) : null,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'patients',
      label: userRole === 'Doctor' ? 'Mis Pacientes' : 'Pacientes',
      icon: Users,
      count: null,
      roles: ['Administrador', 'Doctor', 'Operador'] as UserRole[]
    },
    {
      id: 'clinical',
      label: 'Consulta Oftalmológica',
      icon: Eye,
      count: null,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'emergency',
      label: 'Urgencias Oculares',
      icon: Siren,
      count: counts ? String(counts.emergencies) : null,
      urgent: (counts?.emergencies || 0) > 0,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'surgery',
      label: userRole === 'Doctor' ? 'Mis Cirugías' : 'Quirófano Ocular',
      icon: Scissors,
      count: counts ? String(counts.surgeries) : null,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'laboratory',
      label: 'OCT & Campimetría',
      icon: Microscope,
      count: null,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'inventory',
      label: 'LIOs & Farmacia',
      icon: Boxes,
      count: null,
      roles: ['Administrador'] as UserRole[]
    },
    {
      id: 'reports',
      label: 'Estadísticas & MIS',
      icon: BarChart3,
      count: null,
      roles: ['Administrador'] as UserRole[]
    },
    {
      id: 'discharge',
      label: 'Epicrisis & Altas',
      icon: FileText,
      count: null,
      roles: ['Administrador', 'Doctor'] as UserRole[]
    },
    {
      id: 'management',
      label: 'Configuración',
      icon: Settings,
      count: null,
      roles: ['Administrador'] as UserRole[]
    }
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  const handleSelect = (id: string) => {
    setActiveView(id as ActiveView);
    setIsMobileOpen(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 md:w-16 lg:w-20 bg-[#0e2942] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
      >
        <div className="flex-1 overflow-y-auto py-3 space-y-1.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                title={item.label}
                className={`
                  w-full group relative flex items-center md:justify-center lg:justify-center p-2.5 rounded-xl transition-all duration-150 cursor-pointer
                  ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-400 font-semibold shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {isActive && (
                  <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-400 rounded-r-md"></span>
                )}

                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-sky-400' : 'text-slate-300'}`} />
                  {item.urgent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0e2942] animate-pulse"></span>
                  )}
                  {item.count && !item.urgent && Number(item.count) > 0 && (
                    <span className="hidden md:flex absolute -top-1.5 -right-2 text-[9px] font-bold bg-sky-600 text-white rounded-full w-4 h-4 items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>

                <span className="ml-3 text-sm md:hidden font-medium">{item.label}</span>

                <div className="hidden md:group-hover:block absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-2 border-t border-white/10 flex flex-col items-center">
          <button
            onClick={() => handleSelect(userRole === 'Administrador' ? 'management' : userRole === 'Operador' ? 'optica' : 'dashboard')}
            className="w-full p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center md:justify-center transition-colors cursor-pointer"
            title="Soporte del Sistema"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="ml-3 text-xs md:hidden">Soporte Técnico</span>
          </button>
        </div>
      </aside>
    </>
  );
};
