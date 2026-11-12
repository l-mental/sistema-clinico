import React, { useState } from 'react';
import { Appointment, Patient } from '../../types/hospital';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Filter, 
  CheckCircle, 
  Eye, 
  ArrowLeft,
  Search,
  UserCheck
} from 'lucide-react';

interface AppointmentsModuleProps {
  appointments: Appointment[];
  patients: Patient[];
  onOpenNewAppointment: () => void;
  onSelectPatient: (p: Patient) => void;
  onUpdateStatus: (aptId: string, newStatus: Appointment['estado']) => void;
  onBack: () => void;
}

export const AppointmentsModule: React.FC<AppointmentsModuleProps> = ({
  appointments,
  patients,
  onOpenNewAppointment,
  onSelectPatient,
  onUpdateStatus,
  onBack
}) => {
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterDoctor, setFilterDoctor] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.pacienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.nhc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || apt.tipo === filterType;
    const matchesDoctor = filterDoctor === 'todos' || apt.especialista === filterDoctor;
    return matchesSearch && matchesType && matchesDoctor;
  });

  const getStatusBadge = (status: Appointment['estado']) => {
    switch (status) {
      case 'En espera':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'En dilatación':
        return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
      case 'En consulta':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Atendido':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelado':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Top Header */}
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                Agenda de Consultas
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Gestión de Citas y Triaje</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Citas y Agenda Oftalmológica
            </h1>
          </div>
        </div>

        <button
          onClick={onOpenNewAppointment}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por paciente o N° Historia..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
          >
            <option value="todos">Todos los Tipos de Consulta</option>
            <option value="Primera Consulta">Primera Consulta</option>
            <option value="Control Postoperatorio">Control Postoperatorio</option>
            <option value="Refracción y Agudeza">Refracción y Agudeza</option>
            <option value="Fondo de Ojo / Dilatación">Fondo de Ojo / Dilatación</option>
            <option value="OCT / Diagnóstico">OCT / Diagnóstico</option>
          </select>

          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
          >
            <option value="todos">Todos los Especialistas</option>
            <option value="Dr. Gonzalo Huanca">Dr. Gonzalo Huanca</option>
            <option value="Dra. Sofía Valdés">Dra. Sofía Valdés</option>
            <option value="Dr. Roberto Méndez">Dr. Roberto Méndez</option>
            <option value="Dra. Carmen Morales">Dra. Carmen Morales</option>
          </select>
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Hora</th>
                <th className="py-3.5 px-4">Paciente & NHC</th>
                <th className="py-3.5 px-4">Tipo de Consulta</th>
                <th className="py-3.5 px-4">Especialista & Gabinete</th>
                <th className="py-3.5 px-4">Estado Clínico</th>
                <th className="py-3.5 px-4 text-right">Flujo del Paciente</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No se encontraron citas para los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>{apt.hora}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{apt.fecha}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 hover:text-sky-700 cursor-pointer"
                        onClick={() => {
                          const p = patients.find(item => item.id === apt.pacienteId);
                          if (p) onSelectPatient(p);
                        }}
                      >
                        {apt.pacienteNombre}
                      </div>
                      <div className="text-[11px] font-mono text-sky-600 font-medium">
                        {apt.nhc}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {apt.motivo}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {apt.tipo}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{apt.especialista}</div>
                      <div className="text-[11px] text-slate-400">{apt.consultorio}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(apt.estado)}`}>
                        {apt.estado}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {apt.estado === 'En espera' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'En dilatación')}
                            className="px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors cursor-pointer"
                            title="Iniciar dilatación pupilar (Tropicamida)"
                          >
                            Dilatar Pupila
                          </button>
                        )}

                        {apt.estado === 'En dilatación' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'En consulta')}
                            className="px-2.5 py-1 text-[11px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
                            title="Llamar a consulta con el oftalmólogo"
                          >
                            Llamar a Box
                          </button>
                        )}

                        {apt.estado === 'En consulta' && (
                          <button
                            onClick={() => onUpdateStatus(apt.id, 'Atendido')}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                            title="Finalizar consulta"
                          >
                            Marcar Atendido
                          </button>
                        )}

                        <button
                          onClick={() => {
                            const p = patients.find(item => item.id === apt.pacienteId);
                            if (p) onSelectPatient(p);
                          }}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Ver Historia Clínica"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
