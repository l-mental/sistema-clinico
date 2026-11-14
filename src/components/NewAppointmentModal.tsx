import React, { useState } from 'react';
import { Appointment, Patient } from '../types/hospital';
import { X, Calendar } from 'lucide-react';

interface NewAppointmentModalProps {
  patients: Patient[];
  onAddAppointment: (apt: Appointment) => void;
  onClose: () => void;
  lockedDoctorName?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  patients,
  onAddAppointment,
  onClose,
  lockedDoctorName
}) => {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [fecha, setFecha] = useState('2026-11-12');
  const [hora, setHora] = useState('12:00');
  const [tipo, setTipo] = useState<Appointment['tipo']>('Primera Consulta');
  const [especialista, setEspecialista] = useState(lockedDoctorName || 'Dr. Gonzalo Huanca');
  const [consultorio, setConsultorio] = useState('Consultorio 1 - Lámpara de Hendidura');
  const [motivo, setMotivo] = useState('Evaluación oftalmológica general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId) || patients[0];
    if (!patient) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      pacienteId: patient.id,
      pacienteNombre: `${patient.nombre} ${patient.apellidos}`,
      nhc: patient.nhc,
      fecha,
      hora,
      tipo,
      especialista,
      consultorio,
      estado: 'En espera',
      motivo
    };

    onAddAppointment(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Agendar Cita Oftalmológica</h3>
              <p className="text-[11px] text-slate-500">Asignar turno y especialista</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Seleccionar Paciente *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellidos} ({p.nhc} - DNI: {p.dni})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tipo de Consulta Oftalmológica</label>
            <select
              value={tipo}
              onChange={(e: any) => setTipo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            >
              <option value="Primera Consulta">Primera Consulta</option>
              <option value="Refracción y Agudeza">Refracción y Agudeza Visual</option>
              <option value="Control Postoperatorio">Control Postoperatorio (Catarata / LASIK)</option>
              <option value="Fondo de Ojo / Dilatación">Fondo de Ojo / Dilatación</option>
              <option value="OCT / Diagnóstico">OCT / Diagnóstico Especial</option>
              <option value="Urgencia">Urgencia Ocular</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Médico Especialista</label>
              <select
                value={especialista}
                disabled={Boolean(lockedDoctorName)}
                onChange={(e) => setEspecialista(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium disabled:bg-slate-100 disabled:text-slate-700"
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
              <label className="font-bold text-slate-700 block mb-1">Gabinete / Consultorio</label>
              <input
                type="text"
                value={consultorio}
                onChange={(e) => setConsultorio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Motivo de Consulta</label>
            <textarea
              rows={2}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              placeholder="Ej: Molestia en ojo derecho, visión borrosa..."
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
              className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Confirmar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
