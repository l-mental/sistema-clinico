import React, { useState } from 'react';
import { DiagnosticStudy, Patient } from '../../types/hospital';
import { 
  Microscope, 
  ArrowLeft, 
  Scan, 
  FileCheck, 
  Eye, 
  Activity,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DiagnosticsOCTModuleProps {
  diagnostics: DiagnosticStudy[];
  patients: Patient[];
  onBack: () => void;
}

export const DiagnosticsOCTModule: React.FC<DiagnosticsOCTModuleProps> = ({
  diagnostics,
  patients,
  onBack
}) => {
  const [selectedStudy, setSelectedStudy] = useState<DiagnosticStudy>(diagnostics[0]);
  const [filterType, setFilterType] = useState('todos');

  const filtered = diagnostics.filter(d => {
    if (filterType === 'todos') return true;
    return d.tipo.includes(filterType);
  });

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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700">
                Gabinete Diagnóstico
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">OCT, Topografía Corneal & Biometría</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Laboratorio Ocular & Diagnóstico por Imágenes
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2"
          >
            <option value="todos">Todos los Estudios Oculares</option>
            <option value="OCT">Tomografía OCT (Mácula / RNFL)</option>
            <option value="Biometría">Biometría IOL Master</option>
            <option value="Topografía">Topografía Corneal Pentacam</option>
          </select>
        </div>
      </div>

      {/* Main Split: Left Study List, Right High-Resolution Diagnostic Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Estudios Procesados Recientes ({filtered.length})
          </h2>

          <div className="space-y-2">
            {filtered.map(study => {
              const isSelected = selectedStudy?.id === study.id;
              return (
                <div
                  key={study.id}
                  onClick={() => setSelectedStudy(study)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-50/70 border-cyan-300 shadow-xs' 
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {study.tipo}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5 font-medium">
                        {study.pacienteNombre} <span className="font-mono text-cyan-700">({study.nhc})</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                      Ojo: {study.ojo}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{study.fecha}</span>
                    <span className="text-cyan-700 font-semibold">{study.estado}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Diagnostic Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          {selectedStudy ? (
            <>
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                      {selectedStudy.tipo}
                    </span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                      Ojo: {selectedStudy.ojo}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-2">
                    Informe Técnico: {selectedStudy.pacienteNombre}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>NHC: <strong className="font-mono text-cyan-700">{selectedStudy.nhc}</strong></span>
                    <span>·</span>
                    <span>Fecha: {selectedStudy.fecha}</span>
                    <span>·</span>
                    <span>Operador: {selectedStudy.tecnicoOftalmico}</span>
                  </div>
                </div>
              </div>

              {/* Graphical Simulated Visualization of OCT / Corneal Scan */}
              <div className="bg-slate-950 rounded-2xl p-4 text-white overflow-hidden relative border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    RECONSTRUCCIÓN DE ALTA DEFINICIÓN (HD OCT SCAN)
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px]">CALIDAD SEÑAL: 10/10</span>
                </div>

                {/* Simulated scan graph visual */}
                <div className="h-44 flex items-center justify-center relative mt-2">
                  {/* Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
                  
                  {/* Curved foveal depression or topography ring simulation */}
                  <div className="relative z-10 w-full flex flex-col items-center justify-center px-4">
                    <svg className="w-full h-28" viewBox="0 0 400 100" fill="none">
                      {/* Retinal layers curve */}
                      <path d="M 0,40 Q 150,42 200,75 Q 250,42 400,40" stroke="#06b6d4" strokeWidth="3" fill="none" />
                      <path d="M 0,55 Q 150,57 200,85 Q 250,57 400,55" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" fill="none" />
                      <path d="M 0,70 Q 150,72 200,95 Q 250,72 400,70" stroke="#10b981" strokeWidth="2.5" fill="none" />
                      
                      {/* Fovea marker */}
                      <circle cx="200" cy="75" r="4" fill="#f43f5e" />
                      <text x="208" y="78" fill="#f43f5e" fontSize="9" fontWeight="bold" fontFamily="monospace">Fóvea Central</text>
                    </svg>
                    <div className="flex items-center justify-between w-full text-[10px] text-slate-400 font-mono mt-1">
                      <span>Temporal (T)</span>
                      <span className="text-cyan-400">Espesor Foveal: 242 μm</span>
                      <span>Nasal (N)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formal Ophthalmologist Findings */}
              <div className="bg-cyan-50/60 border border-cyan-200/80 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-cyan-950 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-cyan-700" />
                  <span>Conclusiones Clínicas del Especialista</span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {selectedStudy.hallazgos}
                </p>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400">
              Seleccione un estudio para ver el trazado e informe oftalmológico.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
