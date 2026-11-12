import React, { useState } from 'react';
import { AuthUser } from '../types/hospital';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  AlertCircle,
  Sparkles,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const PRESET_USERS: AuthUser[] = [
  {
    id: 'usr-001',
    nombre: 'Dr. Gonzalo',
    apellidos: 'Huanca Luna',
    email: 'dr.huanca@ehospital.med',
    rol: 'Oftalmólogo Principal',
    colegiatura: 'CMP: 49812 · RNE: 24190',
    avatar: 'GH',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  },
  {
    id: 'usr-002',
    nombre: 'Dra. Sofía',
    apellidos: 'Valdés Rivas',
    email: 'dra.valdes@ehospital.med',
    rol: 'Oftalmólogo Cirujano',
    colegiatura: 'CMP: 51204 · RNE: 28410',
    avatar: 'SV',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  },
  {
    id: 'usr-003',
    nombre: 'Lic. Valeria',
    apellidos: 'Mendoza Castro',
    email: 'valeria.mendoza@ehospital.med',
    rol: 'Enfermería & Triaje',
    colegiatura: 'CEP: 39401',
    avatar: 'VM',
    sede: 'Centro Oftalmológico Láser & Visión - Sede Central'
  },
  {
    id: 'usr-004',
    nombre: 'Recepción',
    apellidos: '& Admisión',
    email: 'admision@ehospital.med',
    rol: 'Admisión & Facturación',
    avatar: 'RA',
    sede: 'Clínica Oftalmológica Sede Norte'
  }
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('dr.huanca@ehospital.med');
  const [password, setPassword] = useState('oftalmo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSede, setSelectedSede] = useState('Centro Oftalmológico Láser & Visión - Sede Central');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectPreset = (user: AuthUser) => {
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

    // Simulate medical authentication verification
    setTimeout(() => {
      setIsLoading(false);
      const matched = PRESET_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        onLogin({
          ...matched,
          sede: selectedSede
        });
      } else {
        // Allow custom email login
        const [nombrePart] = email.split('@');
        onLogin({
          id: `usr-${Date.now()}`,
          nombre: nombrePart.charAt(0).toUpperCase() + nombrePart.slice(1),
          apellidos: 'Oftalmólogo',
          email,
          rol: 'Oftalmólogo Principal',
          colegiatura: 'CMP: 49812 · Activo',
          avatar: email.slice(0, 2).toUpperCase(),
          sede: selectedSede
        });
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0e2942] to-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-slate-100 antialiased selection:bg-sky-500 selection:text-white relative overflow-hidden">
      
      {/* Background Subtle Medical Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with System Identity */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {/* Medical Cross Brand */}
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
              Salud Visual Integral
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Portal Médico Seguro</span>
          <span className="text-emerald-400 font-bold font-mono">TLS 1.3</span>
        </div>
      </div>

      {/* Main Login Card Center */}
      <div className="max-w-4xl w-full mx-auto my-auto py-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Hospital Presentation & Quick Roles */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Módulo Clínico & Quirúrgico Oftalmológico</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Bienvenido al Sistema Oftalmológico
            </h1>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              Acceda a la historia clínica especializada, agudeza visual, refracción, presión intraocular, programación de quirófano y recetas oftalmológicas.
            </p>
          </div>

          {/* Quick Demo Access Pills */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Accesos Rápidos del Personal Médico:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_USERS.map((usr) => (
                <button
                  key={usr.id}
                  type="button"
                  onClick={() => handleSelectPreset(usr)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    email === usr.email
                      ? 'bg-sky-500/20 border-sky-400/80 shadow-md shadow-sky-500/10'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-sky-600/60 text-sky-200 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-400/30">
                    {usr.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {usr.nombre} {usr.apellidos}
                    </div>
                    <div className="text-[10px] text-sky-300 truncate">
                      {usr.rol}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingrese sus credenciales de facultativo para acceder a su gabinete.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sede Hospitalaria */}
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

            {/* Email / Username */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-600" />
                <span>Usuario Médico o Correo Institucional</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ej: dr.huanca@ehospital.med"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Contraseña</span>
                </label>
                <span className="text-[11px] text-sky-600 font-medium cursor-pointer hover:underline">
                  ¿Olvidó su clave?
                </span>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-sky-600 focus:ring-sky-500/30 cursor-pointer"
                />
                <span>Recordar sesión en este equipo</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verificando Credenciales...</span>
                </>
              ) : (
                <>
                  <span>Ingresar al Sistema Clínico</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Servidor Activo (En Turno)
            </span>
            <span className="font-mono">Versión 2026.4</span>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-[11px] text-slate-500 py-2 border-t border-white/5 z-10">
        © 2026 eHospital · Centro Especializado en Oftalmología y Cirugía Ocular. Sistema protegido para uso clínico exclusivo.
      </footer>
    </div>
  );
};
