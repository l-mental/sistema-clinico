import React, { useState } from 'react';
import { EmergencyCase, EyeSide } from '../../types/hospital';
import { 
  Siren, 
  ArrowLeft, 
  Plus, 
  AlertTriangle, 
  Clock, 
  Droplet, 
  Eye, 
  CheckCircle,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface EmergencyModuleProps {
  emergencies: EmergencyCase[];
  onAddEmergency: (c: EmergencyCase) => void;
  onUpdateStatus: (id: string, status: EmergencyCase['estado']) => void;
  onBack: () => void;
}

export const EmergencyModule: React.FC<EmergencyModuleProps> = ({
  emergencies,
  onAddEmergency,
  onUpdateStatus,
  onBack
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [pacienteNombre, setPacienteNombre] = useState('');
  const [edad, setEdad] = useState(30);
  const [triage, setTriage] = useState<EmergencyCase['triage']>('Rojo - Crítico');
  const [motivo, setMotivo] = useState('');
  const [ojo, setOjo] = useState<EyeSide>('OD');
  const [detalles, setDetalles] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteNombre.trim()) return;

    const newCase: EmergencyCase = {
      id: `emg-${Date.now()}`,
      pacienteNombre,
      edad: Number(edad),
      triage,
      motivo: motivo || 'Traumatismo ocular agudo',
      ojoAfectado: ojo,
      horaIngreso: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estado: 'En Espera',
      medicoAsignado: 'Dr. Gonzalo Huanca',
      detalles: detalles || 'Pendiente de biomicroscopía y lavado.'
    };

    onAddEmergency(newCase);
    setShowNewModal(false);
    setPacienteNombre('');
    setMotivo('');
    setDetalles('');
  };

  const getTriageColor = (t: EmergencyCase['triage']) => {
    if (t.includes('Rojo')) return 'bg-red-500 text-white border-red-600 animate-pulse';
    if (t.includes('Naranja')) return 'bg-orange-500 text-white border-orange-600';
    if (t.includes('Amarillo')) return 'bg-amber-400 text-slate-900 border-amber-500';
    return 'bg-emerald-500 text-white border-emerald-600';
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                Box de Urgencias 24h
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Triaje Ocular & Traumatología</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Urgencias Oftalmológicas
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ingreso de Urgencia</span>
        </button>
      </div>

      {/* Immediate Emergency Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4 text-red-600" />
            <span>Quemaduras Químicas (Álcalis / Ácidos)</span>
          </div>
          <p className="text-xs text-red-950 font-medium leading-relaxed">
            Iniciar lavado inmediato con Ringer Lactato o SF 0.9% por 30 min. Controlar pH con tira reactiva (objetivo 7.0 - 7.4). No demorar por anamnesis.
          </p>
        </div>

        <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-orange-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span>Glaucoma Agudo de Ángulo Cerrado</span>
          </div>
          <p className="text-xs text-orange-950 font-medium leading-relaxed">
            PIO &gt; 40 mmHg + dolor hemicraneal + halos. Administrar Manitol EV 20% + Acetazolamida 500mg VO + Timolol y Brimonidina tópicos.
          </p>
        </div>

        <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>Traumatismo Abierto / Herida Corneal</span>
          </div>
          <p className="text-xs text-sky-950 font-medium leading-relaxed">
            No manipular ni presionar el globo ocular. Colocar protector ocular rígido fenestrado sin apósito comprensivo. Ayuno para quirófano inmediato.
          </p>
        </div>
      </div>

      {/* Active Emergency Patients Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">
            Pacientes en Box de Urgencias Oftalmológicas ({emergencies.length})
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            Prioridad asignada según Protocolo de Manchester Ocular
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {emergencies.map((emg) => (
            <div key={emg.id} className="p-4 md:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getTriageColor(emg.triage)}`}>
                    {emg.triage}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Ingreso: {emg.horaIngreso}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Ojo Afectado: <strong className="text-red-700">{emg.ojoAfectado}</strong>
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-md text-slate-700 font-medium">
                    {emg.estado}
                  </span>
                </div>

                <div className="text-base font-extrabold text-slate-900">
                  {emg.pacienteNombre} <span className="text-xs font-normal text-slate-500">({emg.edad} años)</span>
                </div>

                <p className="text-xs font-bold text-red-800">
                  Motivo: {emg.motivo}
                </p>

                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <strong>Evolución / Manejo:</strong> {emg.detalles}
                </p>
              </div>

              {/* Status advancement */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {emg.estado === 'En Espera' && (
                  <button
                    onClick={() => onUpdateStatus(emg.id, 'En Atención Médica')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
                  >
                    Pasar a Atención
                  </button>
                )}
                {emg.estado === 'En Atención Médica' && (
                  <button
                    onClick={() => onUpdateStatus(emg.id, 'En Procedimiento Quirúrgico')}
                    className="px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg cursor-pointer"
                  >
                    Derivar a Quirófano Urgente
                  </button>
                )}
                {emg.estado === 'En Procedimiento Quirúrgico' && (
                  <button
                    onClick={() => onUpdateStatus(emg.id, 'Estabilizado / Alta')}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
                  >
                    Marcar Estabilizado
                  </button>
                )}
                {emg.estado === 'Estabilizado / Alta' && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Paciente Estabilizado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Emergency Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Registro Rápido de Urgencia Ocular
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingreso inmediato a la sala de triaje oftalmológico.
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre Completo del Paciente</label>
                <input
                  type="text"
                  required
                  value={pacienteNombre}
                  onChange={(e) => setPacienteNombre(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Ej: Marcos Ramos Solís"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Edad</label>
                  <input
                    type="number"
                    value={edad}
                    onChange={(e) => setEdad(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ojo Comprometido</label>
                  <select
                    value={ojo}
                    onChange={(e: any) => setOjo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="OD">Ojo Derecho (OD)</option>
                    <option value="OI">Ojo Izquierdo (OI)</option>
                    <option value="Ambos">Ambos Ojos</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nivel de Triaje</label>
                <select
                  value={triage}
                  onChange={(e: any) => setTriage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold text-red-700 bg-red-50"
                >
                  <option value="Rojo - Crítico">Rojo - Crítico (Atención Inmediata: Causticación, Herida Abierta)</option>
                  <option value="Naranja - Urgente">Naranja - Urgente (Glaucoma Agudo, Pérdida Súbita Visión)</option>
                  <option value="Amarillo - Moderado">Amarillo - Moderado (Cuerpo Extraño Corneal, Queratitis)</option>
                  <option value="Verde - Leve">Verde - Leve (Hemorragia Subconjuntival, Blefaritis Aguda)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Motivo / Lesión Ocular</label>
                <input
                  type="text"
                  required
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Ej: Salpicadura de cal en ambos ojos"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Medidas Iniciales / Detalles</label>
                <textarea
                  rows={2}
                  value={detalles}
                  onChange={(e) => setDetalles(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Ej: Irrigación continua iniciada a las 10:15h. pH 8.0."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md cursor-pointer"
                >
                  Ingresar a Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
