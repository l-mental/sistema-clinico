import React, { useState } from 'react';
import { SurgeryRecord, Patient, EyeSide } from '../types/hospital';
import { X, Scissors } from 'lucide-react';

interface NewSurgeryModalProps {
  patients: Patient[];
  onAddSurgery: (srg: SurgeryRecord) => void;
  onClose: () => void;
  lockedDoctorName?: string;
}

export const NewSurgeryModal: React.FC<NewSurgeryModalProps> = ({
  patients,
  onAddSurgery,
  onClose,
  lockedDoctorName
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [ojo, setOjo] = useState<EyeSide>('OD');
  const [procedimiento, setProcedimiento] = useState<SurgeryRecord['procedimiento']>('Facoemulsificación + LIO');
  const [cirujano, setCirujano] = useState(lockedDoctorName || 'Dr. Gonzalo Huanca');
  const [anestesiologo, setAnestesiologo] = useState('Dra. M. Arévalo');
  const [quirofano, setQuirofano] = useState('Quirófano Oftalmológico 1');
  const [fechaHora, setFechaHora] = useState('2026-11-13 10:00');
  const [poderDioptrico, setPoderDioptrico] = useState('+22.0 D');
  const [marcaLio, setMarcaLio] = useState('Alcon AcrySof IQ');
  const [observaciones, setObservaciones] = useState('Preoperatorio completo. Apto para cirugía ambulatoria.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    if (!patient) return;

    const newSurgery: SurgeryRecord = {
      id: `srg-${Date.now()}`,
      pacienteId: patient.id,
      pacienteNombre: `${patient.nombre} ${patient.apellidos}`,
      nhc: patient.nhc,
      edad: patient.edad,
      ojo,
      procedimiento,
      cirujano,
      anestesiologo,
      quirofano,
      fechaHora,
      estado: 'Programada',
      lenteIntraocular: procedimiento.includes('LIO') ? {
        marca: marcaLio,
        modelo: 'Plegable Asférico',
        poderDioptrico,
        constanteA: '118.7'
      } : undefined,
      observaciones
    };

    onAddSurgery(newSurgery);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Programar Cirugía Ocular</h3>
              <p className="text-[11px] text-slate-500">Asignación de quirófano y cálculo de lente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Paciente *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellidos} ({p.nhc})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Procedimiento Quirúrgico</label>
              <select
                value={procedimiento}
                onChange={(e: any) => setProcedimiento(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-purple-900"
              >
                <option value="Facoemulsificación + LIO">Facoemulsificación + LIO</option>
                <option value="LASIK Refractivo (Femto)">LASIK Refractivo (Femto)</option>
                <option value="Vitrectomía Posterior 23G">Vitrectomía Posterior 23G</option>
                <option value="Pterigión con Autoinjerto">Pterigión con Autoinjerto</option>
                <option value="Trabeculectomía Filtrante">Trabeculectomía Filtrante</option>
                <option value="Inyección Intravítrea Anti-VEGF">Inyección Intravítrea Anti-VEGF</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ojo a Operar</label>
              <select
                value={ojo}
                onChange={(e: any) => setOjo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold"
              >
                <option value="OD">Ojo Derecho (OD)</option>
                <option value="OI">Ojo Izquierdo (OI)</option>
                <option value="Ambos">Ambos Ojos</option>
              </select>
            </div>
          </div>

          {procedimiento.includes('LIO') && (
            <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
              <span className="font-bold text-purple-900 block text-[11px]">
                Parámetros de Lente Intraocular (LIO)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block">Marca / Modelo</label>
                  <input
                    type="text"
                    value={marcaLio}
                    onChange={(e) => setMarcaLio(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block">Poder Dióptrico (D)</label>
                  <input
                    type="text"
                    value={poderDioptrico}
                    onChange={(e) => setPoderDioptrico(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-mono font-bold text-purple-800"
                    placeholder="+21.5 D"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Cirujano</label>
              <select
                value={cirujano}
                disabled={Boolean(lockedDoctorName)}
                onChange={(e) => setCirujano(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl disabled:bg-slate-100 disabled:text-slate-700"
              >
                {lockedDoctorName && !['Dr. Gonzalo Huanca', 'Dra. Sofía Valdés', 'Dr. Roberto Méndez', 'Dra. Carmen Morales'].includes(lockedDoctorName) && (
                  <option value={lockedDoctorName}>{lockedDoctorName}</option>
                )}
                <option value="Dr. Gonzalo Huanca">Dr. Gonzalo Huanca</option>
                <option value="Dra. Sofía Valdés">Dra. Sofía Valdés</option>
                <option value="Dr. Roberto Méndez">Dr. Roberto Méndez</option>
                <option value="Dra. Carmen Morales">Dra. Carmen Morales</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha y Hora</label>
              <input
                type="text"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observaciones Quirúrgicas</label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Confirmar Cirugía
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
