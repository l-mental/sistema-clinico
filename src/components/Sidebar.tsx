import React from 'react';
import { 
  LayoutGrid, 
  CalendarDays, 
  Users, 
  Eye, 
  Syringe, 
  Siren, 
  Scissors, 
  ShieldCheck, 
  Microscope, 
  HeartPulse, 
  Scan, 
  Boxes, 
  BarChart3, 
  FileText, 
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

export type ActiveView = 
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'clinical'
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutGrid, count: null },
    { id: 'appointments', label: 'Citas & Agenda', icon: CalendarDays, count: '5' },
    { id: 'patients', label: 'Pacientes', icon: Users, count: null },
    { id: 'clinical', label: 'Consulta Oftalmológica', icon: Eye, count: '2' },
    { id: 'emergency', label: 'Urgencias Oculares', icon: Siren, count: '1', urgent: true },
    { id: 'surgery', label: 'Quirófano Ocular', icon: Scissors, count: '3' },
    { id: 'laboratory', label: 'OCT & Campimetría', icon: Microscope, count: null },
    { id: 'inventory', label: 'LIOs & Farmacia', icon: Boxes, count: null },
    { id: 'reports', label: 'Estadísticas & MIS', icon: BarChart3, count: null },
    { id: 'discharge', label: 'Epicrisis & Altas', icon: FileText, count: null },
    { id: 'management', label: 'Configuración', icon: Settings, count: null }
  ];

  const handleSelect = (id: string) => {
    setActiveView(id as ActiveView);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Main Dark Sidebar matching the reference screenshot (#0e2942 aesthetic) */}
      <aside className={`
        fixed top-16 bottom-0 left-0 z-40 w-64 md:w-16 lg:w-20 bg-[#0e2942] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out shadow-xl
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Navigation Item Stack */}
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
                  ${isActive 
                    ? 'bg-sky-500/20 text-sky-400 font-semibold shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-400 rounded-r-md"></span>
                )}

                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-sky-400' : 'text-slate-300'}`} />
                  {item.urgent && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0e2942] animate-pulse"></span>
                  )}
                  {item.count && !item.urgent && (
                    <span className="hidden md:flex absolute -top-1.5 -right-2 text-[9px] font-bold bg-sky-600 text-white rounded-full w-4 h-4 items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>

                {/* Mobile Full Text Label */}
                <span className="ml-3 text-sm md:hidden font-medium">
                  {item.label}
                </span>

                {/* Tooltip on Hover for Compact Desktop Bar */}
                <div className="hidden md:group-hover:block absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-xl whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-2 border-t border-white/10 flex flex-col items-center">
          <button 
            onClick={() => handleSelect('management')}
            className="w-full p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center md:justify-center transition-colors cursor-pointer"
            title="Ayuda y Manual del Sistema Oftalmológico"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="ml-3 text-xs md:hidden">Soporte Técnico</span>
          </button>
        </div>
      </aside>
    </>
  );
};
