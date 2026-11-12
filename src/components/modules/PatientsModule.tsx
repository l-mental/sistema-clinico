import React, { useState } from 'react';
import { Patient } from '../../types/hospital';
import { 
  Users, 
  Search, 
  UserPlus, 
  ArrowLeft, 
  Eye, 
  Calendar, 
  Shield, 
  AlertCircle, 
  FileText,
  Phone,
  Mail,
  ChevronRight
} from 'lucide-react';

interface PatientsModuleProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (p: Patient) => void;
  onOpenNewPatient: () => void;
  onStartConsultation: (p: Patient) => void;
  onBack: () => void;
}

export const PatientsModule: React.FC<PatientsModuleProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onOpenNewPatient,
  onStartConsultation,
  onBack
}) => {
  const [search, setSearch] = useState('');
  const current = selectedPatient || patients[0];

  const filtered = patients.filter(p => 
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(search.toLowerCase()) ||
    p.dni.toLowerCase().includes(search.toLowerCase()) ||
    p.nhc.toLowerCase().includes(search.toLowerCase())
  );

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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Archivo Clínico
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Padrón de Pacientes Oftalmológicos</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Registro y Expedientes de Pacientes
            </h1>
          </div>
        </div>

        <button
          onClick={onOpenNewPatient}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Nuevo Paciente</span>
        </button>
      </div>

      {/* Grid Layout: Left List, Right Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI o N° Historia..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map(p => {
              const isSelected = current?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-sky-50/70 border-sky-300 shadow-xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {p.nombre} {p.apellidos}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-sky-600 font-bold">{p.nhc}</span>
                        <span>·</span>
                        <span>DNI: {p.dni}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {p.edad} años ({p.sexo})
                    </span>
                  </div>

                  {p.diagnosticoPrincipal && (
                    <div className="mt-2 text-[11px] text-slate-600 line-clamp-1 bg-white/80 p-1 rounded-sm border border-slate-100">
                      {p.diagnosticoPrincipal}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Patient Dossier (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
          {current ? (
            <>
              {/* Patient Banner */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-md shadow-sky-600/20">
                    {current.nombre[0]}{current.apellidos[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900">
                        {current.nombre} {current.apellidos}
                      </h2>
                      <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                        {current.nhc}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Registrado el {current.fechaRegistro} · Última atención: {current.ultimaConsulta || 'Sin consultas previas'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onStartConsultation(current)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Abrir Consulta</span>
                </button>
              </div>

              {/* Patient Basic Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Documento de Identidad</span>
                  <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{current.dni}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Edad y Sexo</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">{current.edad} años ({current.sexo === 'M' ? 'Masculino' : 'Femenino'})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Cobertura Médica</span>
                  <span className="font-bold text-sky-700 text-sm mt-0.5 block">{current.seguro}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Teléfono de Contacto</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">{current.telefono}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Correo Electrónico</span>
                  <span className="font-medium text-slate-800 mt-0.5 block">{current.email}</span>
                </div>
              </div>

              {/* Antecedentes Oculares y Médicos */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-sky-600" />
                    <span>Antecedentes Oculares & Quirúrgicos Previos</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {current.antecedentesOculares.map((ant, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs bg-sky-50 text-sky-800 rounded-lg border border-sky-200 font-medium">
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Antecedentes Sistémicos Relevantes (Diabetes, HTA)</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {current.antecedentesSistemicos.map((ant, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs bg-amber-50 text-amber-800 rounded-lg border border-amber-200 font-medium">
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    <span>Alergias Medicamentosas</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {current.alergias.map((al, i) => (
                      <span key={i} className="px-2.5 py-1 text-xs bg-red-50 text-red-800 rounded-lg border border-red-200 font-bold">
                        {al}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              Seleccione un paciente para ver su historia clínica oftalmológica.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
