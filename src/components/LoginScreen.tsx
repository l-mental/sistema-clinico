import React, { useState } from 'react';
import { AuthUser, UserRole } from '../types/hospital';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Glasses,
  Shield
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const PRESET_USERS: AuthUser[] = [
  {
    id: 'usr-admin',
    nombre: 'Carlos',
    apellidos: 'Mendoza (Admin)',
    email: 'admin@ehospital.med',
    rol: 'Administrador',
    tituloCargo: 'Director Administrativo · Acceso Total',
    colegiatura: 'ADM-001',
    avatar: 'CM',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  },
  {
    id: 'usr-doc-1',
    nombre: 'Dr. Gonzalo',
    apellidos: 'Huanca',
    email: 'dr.huanca@ehospital.med',
    rol: 'Doctor',
    tituloCargo: 'Oftalmólogo · Catarata y Glaucoma',
    doctorName: 'Dr. Gonzalo Huanca',
    colegiatura: 'CMP: 49812 · RNE: 24190',
    avatar: 'GH',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  },
  {
    id: 'usr-doc-2',
    nombre: 'Dra. Sofía',
    apellidos: 'Valdés',
    email: 'dra.valdes@ehospital.med',
    rol: 'Doctor',
    tituloCargo: 'Oftalmóloga · Refracción y Optometría',
    doctorName: 'Dra. Sofía Valdés',
    colegiatura: 'CMP: 51204 · RNE: 28410',
    avatar: 'SV',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  },
  {
    id: 'usr-optica',
    nombre: 'Andrea',
    apellidos: 'Paredes (Óptica)',
    email: 'optica@ehospital.med',
    rol: 'Operador',
    tituloCargo: 'Operadora de Óptica · Venta de Lentes',
    colegiatura: 'OPT-204',
    avatar: 'AP',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('Administrador');
  const [email, setEmail] = useState('admin@ehospital.med');
  const [password, setPassword] = useState('oftalmo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSede, setSelectedSede] = useState('Centro Oftalmológico Láser & Visión - Sede Central');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectRoleTab = (role: UserRole) => {
    setSelectedRoleTab(role);
    const firstUserForRole = PRESET_USERS.find(u => u.rol === role);
    if (firstUserForRole) {
      setEmail(firstUserForRole.email);
      setPassword('oftalmo2026');
      setSelectedSede(firstUserForRole.sede);
    }
    setErrorMsg('');
  };

  const handleSelectPreset = (user: AuthUser) => {
    setSelectedRoleTab(user.rol);
    setEmail(user.email);
    setPassword('oftalmo2026');
    setSelectedSede(user.sede);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor complete su correo y contraseña.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matched = PRESET_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (matched) {
        onLogin({
          ...matched,
          sede: selectedSede
        });
      } else {
        // Custom email login respects the selected role tab
        const [nombrePart] = email.split('@');
        const cleanName = nombrePart.charAt(0).toUpperCase() + nombrePart.slice(1);
        onLogin({
          id: `usr-${Date.now()}`,
          nombre: selectedRoleTab === 'Doctor' ? `Dr. ${cleanName}` : cleanName,
          apellidos: selectedRoleTab === 'Operador' ? '(Óptica)' : selectedRoleTab === 'Administrador' ? '(Admin)' : '',
          email: email.trim(),
          rol: selectedRoleTab,
          tituloCargo:
            selectedRoleTab === 'Administrador'
              ? 'Administrador del Sistema'
              : selectedRoleTab === 'Doctor'
                ? 'Médico Oftalmólogo'
                : 'Operador de Óptica · Venta de Lentes',
          doctorName: selectedRoleTab === 'Doctor' ? `Dr. ${cleanName}` : undefined,
          colegiatura: selectedRoleTab === 'Doctor' ? 'CMP: 49812 · Activo' : undefined,
          avatar: email.slice(0, 2).toUpperCase(),
          sede: selectedSede
        });
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0e2942] to-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100 antialiased selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Subtle Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <div className="w-5 h-2 bg-sky-600 rounded-xs"></div>
              <div className="w-2 h-5 bg-sky-600 rounded-xs absolute"></div>
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full absolute ring-2 ring-white"></div>
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              <span className="text-sky-400">e</span>Hospital
            </span>
            <span className="text-xs text-slate-400 ml-2 font-medium hidden sm:inline">
              Oftalmología & Óptica Integral
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Control de Acceso por Roles</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl w-full mx-auto my-auto py-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: 3-Role Overview & Quick Profiles */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistema Clínico, Quirúrgico y Óptica</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Acceso al Portal Oftalmológico
            </h1>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Cada perfil dispone de permisos específicos: control total para Administradores, expediente propio para Doctores y punto de venta especializado para Operadores de Óptica.
            </p>
          </div>

          {/* 3 Roles Permissions Guide */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Cuentas de Demostración por Rol:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_USERS.map((usr) => {
                const isSelected = email === usr.email;
                const roleBadge =
                  usr.rol === 'Administrador'
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
                    : usr.rol === 'Doctor'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                      : 'bg-teal-500/20 text-teal-300 border-teal-400/30';

                return (
                  <button
                    key={usr.id}
                    type="button"
                    onClick={() => handleSelectPreset(usr)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-white/15 border-sky-400 shadow-md shadow-sky-500/10'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-white/15">
                      {usr.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {usr.nombre} {usr.apellidos}
                        </span>
                      </div>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border ${roleBadge}`}>
                        {usr.rol}
                      </span>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {usr.rol === 'Administrador' && 'Acceso global a todo el hospital'}
                        {usr.rol === 'Doctor' && 'Solo sus citas, pacientes y cirugías'}
                        {usr.rol === 'Operador' && 'Óptica: venta de lentes y monturas'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 border border-slate-100">
          <div className="mb-5">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Seleccione su rol e ingrese sus credenciales para continuar.
            </p>
          </div>

          {/* 3-Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => handleSelectRoleTab('Administrador')}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRoleTab === 'Administrador'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectRoleTab('Doctor')}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRoleTab === 'Doctor'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectRoleTab('Operador')}
              className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedRoleTab === 'Operador'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Glasses className="w-3.5 h-3.5" />
              <span>Operador</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sede */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Sede de Atención</span>
              </label>
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 cursor-pointer text-slate-800"
              >
                <option value="Centro Oftalmológico Láser & Visión - Sede Central">
                  Centro Oftalmológico Láser & Visión - Sede Central
                </option>
                <option value="Clínica Oftalmológica Sede Norte">
                  Clínica Oftalmológica Sede Norte
                </option>
                <option value="Unidad de Cirugía Ambulatoria y Láser Sur">
                  Unidad de Cirugía Ambulatoria y Láser Sur
                </option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Correo / Usuario</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@ehospital.med"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-900 placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Contraseña</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Demo: oftalmo2026</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-900 font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-sky-600 cursor-pointer"
                />
                <span>Mantener sesión iniciada</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Validando Rol y Permisos...</span>
                </>
              ) : (
                <>
                  <span>
                    Ingresar como {selectedRoleTab}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              3 Perfiles Configurados
            </span>
            <span className="font-mono">eHospital · Óptica</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-[11px] text-slate-500 py-2 border-t border-white/5 z-10">
        © 2026 eHospital · Oftalmología, Cirugía Ocular y Óptica.
      </footer>
    </div>
  );
};
