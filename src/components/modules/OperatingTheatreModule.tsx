import React, { useState } from 'react';
import { SurgeryRecord, Patient, EyeSide } from '../../types/hospital';
import { 
  Scissors, 
  ArrowLeft, 
  Plus, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Activity, 
  Microscope,
  AlertCircle
} from 'lucide-react';

interface OperatingTheatreModuleProps {
  surgeries: SurgeryRecord[];
  patients: Patient[];
  onOpenNewSurgery: () => void;
  onUpdateSurgeryStatus: (id: string, status: SurgeryRecord['estado']) => void;
  onBack: () => void;
}

export const OperatingTheatreModule: React.FC<OperatingTheatreModuleProps> = ({
  surgeries,
  patients,
  onOpenNewSurgery,
  onUpdateSurgeryStatus,
  onBack
}) => {
  const [filterProcedure, setFilterProcedure] = useState('todos');

  const filteredSurgeries = surgeries.filter(s => {
    if (filterProcedure === 'todos') return true;
    return s.procedimiento.includes(filterProcedure);
  });

  const getStatusColor = (status: SurgeryRecord['estado']) => {
    switch (status) {
      case 'Programada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En preparación':
        return 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse';
      case 'En quirófano':
        return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
      case 'Recuperación':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Alta':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                Unidad Quirúrgica
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Cirugía de Catarata, Refractiva & Retina</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Quirófano Ocular · Programación & Cirugías
            </h1>
          </div>
        </div>

        <button
          onClick={onOpenNewSurgery}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Programar Cirugía Ocular</span>
        </button>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cirugías Hoy</span>
          <div className="text-2xl font-black text-slate-900 mt-1 tabular-nums">{surgeries.length}</div>
          <span className="text-[10px] text-purple-600 font-semibold">100% microscopios listos</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cataratas Faco + LIO</span>
          <div className="text-2xl font-black text-sky-700 mt-1 tabular-nums">
            {surgeries.filter(s => s.procedimiento.includes('Faco')).length}
          </div>
          <span className="text-[10px] text-slate-500">Lentes calculados verificados</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Cirugía Láser Refractiva</span>
          <div className="text-2xl font-black text-indigo-700 mt-1 tabular-nums">
            {surgeries.filter(s => s.procedimiento.includes('LASIK')).length}
          </div>
          <span className="text-[10px] text-slate-500">Femtosegundo calibrado</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">En Recuperación</span>
          <div className="text-2xl font-black text-emerald-700 mt-1 tabular-nums">
            {surgeries.filter(s => s.estado === 'Recuperación' || s.estado === 'Alta').length}
          </div>
          <span className="text-[10px] text-emerald-600">Evolución postoperatoria favorable</span>
        </div>
      </div>

      {/* Surgical Schedule Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            Parte Quirúrgico del Día
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filtrar:</span>
            <select
              value={filterProcedure}
              onChange={(e) => setFilterProcedure(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1"
            >
              <option value="todos">Todos los procedimientos</option>
              <option value="Faco">Facoemulsificación (Catarata)</option>
              <option value="LASIK">Cirugía Láser LASIK</option>
              <option value="Trabeculectomía">Glaucoma / Filtrante</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredSurgeries.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-purple-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
            >
              {/* Surgical Left Details */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                    {s.fechaHora}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {s.quirofano}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(s.estado)}`}>
                    {s.estado}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-black text-slate-900">
                    {s.procedimiento}
                  </h3>
                  <span className="text-xs font-black px-2 py-0.5 bg-slate-900 text-white rounded-md">
                    Ojo: {s.ojo}
                  </span>
                </div>

                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span>Paciente: <strong className="text-slate-900">{s.pacienteNombre}</strong> ({s.edad} años)</span>
                  <span>·</span>
                  <span>NHC: <strong className="font-mono text-sky-700">{s.nhc}</strong></span>
                  <span>·</span>
                  <span>Cirujano: <strong className="text-slate-800">{s.cirujano}</strong></span>
                  <span>·</span>
                  <span>Anestesia: <strong className="text-slate-700">{s.anestesiologo}</strong></span>
                </div>

                {s.lenteIntraocular && (
                  <div className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-xl text-xs flex flex-wrap items-center gap-4 text-sky-900">
                    <span className="font-bold flex items-center gap-1">
                      <Microscope className="w-3.5 h-3.5 text-sky-600" />
                      LIO Calculado:
                    </span>
                    <span>Marca: <strong>{s.lenteIntraocular.marca}</strong> ({s.lenteIntraocular.modelo})</span>
                    <span>Potencia Dióptrica: <strong className="text-sky-700 font-mono text-sm">{s.lenteIntraocular.poderDioptrico}</strong></span>
                    <span>Constante A: <strong className="font-mono">{s.lenteIntraocular.constanteA}</strong></span>
                  </div>
                )}

                {s.observaciones && (
                  <p className="text-[11px] text-slate-500 italic">
                    Notas: {s.observaciones}
                  </p>
                )}
              </div>

              {/* Status Advancement Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Avanzar Etapa Quirúrgica:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {s.estado === 'Programada' && (
                    <button
                      onClick={() => onUpdateSurgeryStatus(s.id, 'En preparación')}
                      className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer"
                    >
                      Pasa a Preparación
                    </button>
                  )}
                  {s.estado === 'En preparación' && (
                    <button
                      onClick={() => onUpdateSurgeryStatus(s.id, 'En quirófano')}
                      className="px-3 py-1.5 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg cursor-pointer"
                    >
                      Ingresa a Quirófano
                    </button>
                  )}
                  {s.estado === 'En quirófano' && (
                    <button
                      onClick={() => onUpdateSurgeryStatus(s.id, 'Recuperación')}
                      className="px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg cursor-pointer"
                    >
                      Cirugía Concluida (Recuperación)
                    </button>
                  )}
                  {s.estado === 'Recuperación' && (
                    <button
                      onClick={() => onUpdateSurgeryStatus(s.id, 'Alta')}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
                    >
                      Alta Médica Postoperatoria
                    </button>
                  )}
                  {s.estado === 'Alta' && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paciente de Alta
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
