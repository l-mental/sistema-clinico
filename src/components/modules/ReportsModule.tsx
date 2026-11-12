import React from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Users,
  Award
} from 'lucide-react';

interface ReportsModuleProps {
  onBack: () => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({ onBack }) => {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Volver al Menú Principal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                Auditoría y Gestión
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Métricas Clínicas & Eficiencia Quirúrgica</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Reportes Estadísticos MIS · Oftalmología
            </h1>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Éxito Refractivo Post-Faco
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-2 tabular-nums">96.4%</div>
          <p className="text-xs text-slate-500 mt-1">Pacientes con AV &ge; 20/25 a los 30 días</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Cirugías Oculares del Mes
          </span>
          <div className="text-3xl font-black text-sky-700 mt-2 tabular-nums">142</div>
          <p className="text-xs text-slate-500 mt-1">+18% respecto al mes anterior</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tiempo de Espera Promedio
          </span>
          <div className="text-3xl font-black text-slate-800 mt-2 tabular-nums">14 min</div>
          <p className="text-xs text-slate-500 mt-1">Desde triaje hasta ingreso al gabinete</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Tasa de Endoftalmitis
          </span>
          <div className="text-3xl font-black text-indigo-600 mt-2 tabular-nums">0.00%</div>
          <p className="text-xs text-slate-500 mt-1">Protocolo estéril en quirófano clase 100</p>
        </div>
      </div>

      {/* Pathology Breakdown & Visual Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pathology Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            Distribución de Patologías Atendidas
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Catarata Senil (Facoemulsificación)</span>
                <span className="font-mono text-sky-700">38% (210 casos)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-600 rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Ametropías / Refracción (Miopía, Astigmatismo)</span>
                <span className="font-mono text-indigo-700">29% (160 casos)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '29%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Glaucoma & Hipertensión Ocular</span>
                <span className="font-mono text-teal-700">16% (88 casos)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full" style={{ width: '16%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Superficie Ocular & Ojo Seco</span>
                <span className="font-mono text-amber-700">12% (66 casos)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Retinopatía Diabética & Mácula</span>
                <span className="font-mono text-rose-700">5% (28 casos)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Surgical Volume by Specialist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900">
            Cirujanos Oftalmólogos · Actividad del Período
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Dr. Gonzalo Huanca Luna</div>
                <div className="text-[11px] text-slate-500">Catarata, LIO Premium & Glaucoma</div>
              </div>
              <div className="text-right">
                <div className="font-black text-sky-700 font-mono text-sm">64 Cirugías</div>
                <span className="text-[10px] text-emerald-600 font-semibold">100% Satisfacción</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Dr. Roberto Méndez</div>
                <div className="text-[11px] text-slate-500">Cirugía Refractiva Láser (Femto-LASIK)</div>
              </div>
              <div className="text-right">
                <div className="font-black text-indigo-700 font-mono text-sm">48 Cirugías</div>
                <span className="text-[10px] text-emerald-600 font-semibold">99% Satisfacción</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800">Dra. Carmen Morales</div>
                <div className="text-[11px] text-slate-500">Retina Quirúrgica & Vitrectomía 23G</div>
              </div>
              <div className="text-right">
                <div className="font-black text-purple-700 font-mono text-sm">30 Cirugías</div>
                <span className="text-[10px] text-emerald-600 font-semibold">98% Satisfacción</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
