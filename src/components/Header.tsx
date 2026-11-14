import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Plus, 
  Eye, 
  Calendar, 
  UserPlus,
  Activity,
  LogOut,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Glasses
} from 'lucide-react';
import { Patient, AuthUser } from '../types/hospital';

interface HeaderProps {
  onOpenNewPatient: () => void;
  onOpenNewAppointment: () => void;
  onOpenConsultation: () => void;
  onSelectPatient: (patient: Patient) => void;
  patients: Patient[];
  activeCenter: string;
  setActiveCenter: (center: string) => void;
  onNavigateHome: () => void;
  onOpenOptica: () => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewPatient,
  onOpenNewAppointment,
  onOpenConsultation,
  onSelectPatient,
  patients,
  activeCenter,
  setActiveCenter,
  onNavigateHome,
  onOpenOptica,
  currentUser,
  onLogout
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showCenterMenu, setShowCenterMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const centers = [
    'Centro Oftalmológico Láser & Visión - Sede Central',
    'Clínica Oftalmológica Sede Norte',
    'Unidad de Cirugía Ambulatoria y Láser Sur'
  ];

  const filteredPatients = searchQuery.trim() === '' 
    ? [] 
    : patients.filter(p => 
        p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.apellidos.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.dni.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nhc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs h-16 flex items-center justify-between px-3 md:px-6">
      {/* Left: Brand Identity matching user reference */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 focus:outline-hidden group cursor-pointer text-left"
          title="Ir al Menú Principal"
        >
          {/* Distinctive eHospital Cross Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-sky-400 p-0.5 shadow-md shadow-sky-500/20 flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-sky-50/50"></div>
              {/* Geometric Medical Cross with Eye */}
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-2 bg-sky-600 rounded-xs"></div>
                <div className="w-2 h-5 bg-sky-600 rounded-xs absolute"></div>
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full absolute ring-2 ring-white"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-800">
                <span className="text-sky-600 font-black">e</span>Hospital
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 bg-sky-100 text-sky-800 rounded-sm">
                Oftalmología
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Sistema Especializado de Salud Visual
            </p>
          </div>
        </button>

        {/* Center / Branch selector */}
        <div className="hidden lg:relative lg:block">
          <button
            onClick={() => setShowCenterMenu(!showCenterMenu)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="max-w-[260px] truncate">{activeCenter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showCenterMenu && (
            <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Seleccionar Sede o Sucursal
              </div>
              {centers.map(center => (
                <button
                  key={center}
                  onClick={() => {
                    setActiveCenter(center);
                    setShowCenterMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-medium flex items-center justify-between hover:bg-sky-50 transition-colors ${
                    center === activeCenter ? 'text-sky-700 bg-sky-50/60 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{center}</span>
                  {center === activeCenter && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Search for Patients */}
      <div className="relative flex-1 max-w-xs md:max-w-md mx-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Buscar paciente por nombre, DNI o N° Historia..."
            className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Live Search dropdown */}
        {showSearchResults && filteredPatients.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
              <span>Pacientes Encontrados ({filteredPatients.length})</span>
              <button 
                onClick={() => setShowSearchResults(false)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-normal"
              >
                Cerrar
              </button>
            </div>
            {filteredPatients.map(patient => (
              <button
                key={patient.id}
                onClick={() => {
                  onSelectPatient(patient);
                  setShowSearchResults(false);
                  setSearchQuery('');
                }}
                className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 border-b border-slate-50 last:border-0 flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                    {patient.nombre} {patient.apellidos}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-sky-600 font-semibold">{patient.nhc}</span>
                    <span>·</span>
                    <span>DNI: {patient.dni}</span>
                    <span>·</span>
                    <span>{patient.edad} años ({patient.sexo})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-medium">
                    {patient.seguro}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Quick Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentUser?.rol !== 'Operador' && (
          <>
            {/* Quick Consultation CTA */}
            <button
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs shadow-sky-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
              title="Nueva Consulta Oftalmológica Completa"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Consulta Oftalmológica</span>
            </button>

            {/* New Appointment Quick Button */}
            <button
              onClick={onOpenNewAppointment}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              title="Agendar Nueva Cita"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>Agendar Cita</span>
            </button>
          </>
        )}

        {(currentUser?.rol === 'Operador' || currentUser?.rol === 'Administrador') && (
          <button
            onClick={onOpenOptica}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs shadow-teal-600/30 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Ir a Óptica y Venta de Lentes"
          >
            <Glasses className="w-3.5 h-3.5" />
            <span>Óptica · Venta de Lentes</span>
          </button>
        )}

        {/* Notifications Icon with Urgent Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
            title="Notificaciones y Avisos de Urgencias"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in duration-150">
              <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Alertas Clínicas</span>
                <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                  1 Urgencia Activa
                </span>
              </div>
              <div className="p-3 hover:bg-slate-50 transition-colors border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-700">Urgencia en Box 1</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Quemadura alcalina OD en paciente Mateo Morales. Requiere lavado continuo y control de pH.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Hace 12 minutos</span>
              </div>
              <div className="p-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-bold text-amber-700">Alerta de Quirófano</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Paciente Elena Vargas en preparación para Facoemulsificación OD + LIO +21.5D.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">Cirugía 12:30</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill matching screenshot "Admin" */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 pl-1.5 sm:pr-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            <div className={`w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs ${
              currentUser?.rol === 'Operador' ? 'bg-teal-600' : currentUser?.rol === 'Administrador' ? 'bg-indigo-700' : 'bg-sky-700'
            }`}>
              {currentUser?.avatar || 'GH'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{currentUser ? `${currentUser.nombre} ${currentUser.apellidos}` : 'Usuario'}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600 inline" />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {currentUser?.rol} · {currentUser?.tituloCargo}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">
                  {currentUser ? `${currentUser.nombre} ${currentUser.apellidos}` : 'Usuario'}
                </p>
                <p className="text-[11px] text-sky-700 font-semibold">{currentUser?.rol} · {currentUser?.tituloCargo}</p>
                {currentUser?.colegiatura && (
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{currentUser.colegiatura}</p>
                )}
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{currentUser?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenNewPatient();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                  <span>Registrar Nuevo Paciente</span>
                </button>
                {currentUser?.rol !== 'Operador' && (
                  <>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenNewAppointment();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Nueva Cita en Agenda</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigateHome();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5 text-slate-400" />
                      <span>Panel Principal de Módulos</span>
                    </button>
                  </>
                )}

                <div className="border-t border-slate-100 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Cerrar Sesión (Cambiar Rol)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
