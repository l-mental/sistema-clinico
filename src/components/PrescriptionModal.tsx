import React from 'react';
import { OphthalmologyExam } from '../types/hospital';
import { X, Printer, Glasses, Eye, ShieldCheck } from 'lucide-react';

interface PrescriptionModalProps {
  exam: OphthalmologyExam | null;
  onClose: () => void;
}

export const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ exam, onClose }) => {
  if (!exam) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative my-8">
        
        {/* Controls - not printed */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Vista Previa de Receta Oftalmológica
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir Receta</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Area */}
        <div className="mt-4 p-6 border-2 border-slate-800 rounded-2xl bg-white space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  <span className="text-sky-600">e</span>Hospital · Oftalmología
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Clínica Especializada en Microcirugía & Salud Ocular
              </p>
              <p className="text-[11px] text-slate-400">
                Av. Médica 450 · Central: (01) 480-2200 · emergencias@ehospital.med
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold font-mono text-sky-700 block">RECETA OFTÁLMICA</span>
              <span className="text-[11px] text-slate-500 font-mono">Fecha: {exam.fecha}</span>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Paciente:</span>
              <span className="font-extrabold text-slate-900 text-sm">{exam.pacienteNombre}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">N° Historia Clínica (NHC):</span>
              <span className="font-mono font-bold text-sky-700 text-sm">{exam.nhc}</span>
            </div>
          </div>

          {/* Optical Formula Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Glasses className="w-4 h-4 text-sky-600" />
                <span>Graduación Óptica para Gafas</span>
              </h4>
              <span className="text-xs font-mono font-bold text-slate-700">
                DIP: {exam.distanciaInterpupilar} mm
              </span>
            </div>

            <table className="w-full text-xs text-center border border-slate-300">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                <tr>
                  <th className="py-2 px-3 text-left">Ojo</th>
                  <th className="py-2 px-3">Esfera</th>
                  <th className="py-2 px-3">Cilindro</th>
                  <th className="py-2 px-3">Eje</th>
                  <th className="py-2 px-3">Adición (Cerca)</th>
                  <th className="py-2 px-3">Agudeza Visual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold text-left text-sky-700">Ojo Derecho (OD)</td>
                  <td className="py-2.5 px-3 font-bold">{exam.refraccionOD.esfera}</td>
                  <td className="py-2.5 px-3">{exam.refraccionOD.cilindro}</td>
                  <td className="py-2.5 px-3">{exam.refraccionOD.eje}°</td>
                  <td className="py-2.5 px-3 font-bold text-indigo-700">{exam.refraccionOD.adicion || '-'}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-emerald-700">{exam.refraccionOD.agudezaVisual}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold text-left text-indigo-700">Ojo Izquierdo (OI)</td>
                  <td className="py-2.5 px-3 font-bold">{exam.refraccionOI.esfera}</td>
                  <td className="py-2.5 px-3">{exam.refraccionOI.cilindro}</td>
                  <td className="py-2.5 px-3">{exam.refraccionOI.eje}°</td>
                  <td className="py-2.5 px-3 font-bold text-indigo-700">{exam.refraccionOI.adicion || '-'}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-emerald-700">{exam.refraccionOI.agudezaVisual}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Prescribed Drops */}
          {exam.medicamentosPrescritos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Tratamiento Farmacológico (Colirios & Gotas)</span>
              </h4>
              <div className="space-y-2">
                {exam.medicamentosPrescritos.map((med, i) => (
                  <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{med.nombre}</span>
                      <span className="text-slate-500 block text-[11px]">
                        Aplicar {med.dosis} · {med.frecuencia} durante {med.duracion}
                      </span>
                    </div>
                    <span className="font-bold font-mono text-sky-700 text-xs px-2 py-0.5 bg-sky-50 rounded-md">
                      Ojo: {med.ojo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer with doctor stamp and signature simulation */}
          <div className="pt-6 border-t-2 border-slate-800 flex items-end justify-between">
            <div className="text-[11px] text-slate-400">
              Válido por 6 meses para ópticas autorizadas.
            </div>

            <div className="text-center">
              {/* Signature line */}
              <div className="w-48 border-b-2 border-slate-800 mb-1 mx-auto"></div>
              <div className="text-xs font-black text-slate-900">{exam.medico}</div>
              <div className="text-[10px] text-slate-600 font-mono">CMP: 49812 · RNE: 24190</div>
              <div className="text-[10px] text-sky-700 font-semibold">Especialista en Oftalmología</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
