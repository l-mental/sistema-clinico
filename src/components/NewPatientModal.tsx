import React, { useState } from 'react';
import { Patient } from '../types/hospital';
import { X, UserPlus } from 'lucide-react';

interface NewPatientModalProps {
  onAddPatient: (p: Patient) => void;
  onClose: () => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({ onAddPatient, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [dni, setDni] = useState('');
  const [edad, setEdad] = useState(45);
  const [sexo, setSexo] = useState<'M' | 'F'>('M');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [seguro, setSeguro] = useState('Sanitas');
  const [antecedentesOculares, setAntecedentesOculares] = useState('Astigmatismo');
  const [antecedentesSistemicos, setAntecedentesSistemicos] = useState('Ninguno');
  const [alergias, setAlergias] = useState('Ninguna conocida');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !apellidos.trim() || !dni.trim()) return;

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      nhc: `OFT-${Math.floor(10000 + Math.random() * 90000)}`,
      dni,
      nombre,
      apellidos,
      edad: Number(edad),
      sexo,
      telefono: telefono || '+34 600 000 000',
      email: email || `${nombre.toLowerCase()}.${apellidos.toLowerCase().split(' ')[0]}@email.com`,
      seguro,
      antecedentesOculares: antecedentesOculares.split(',').map(s => s.trim()).filter(Boolean),
      antecedentesSistemicos: antecedentesSistemicos.split(',').map(s => s.trim()).filter(Boolean),
      alergias: alergias.split(',').map(s => s.trim()).filter(Boolean),
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Registrar Nuevo Paciente</h3>
              <p className="text-[11px] text-slate-500">Apertura de Expediente Oftalmológico</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombres *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                placeholder="Ej: Laura"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Apellidos *</label>
              <input
                type="text"
                required
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                placeholder="Ej: Silva Quispe"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">DNI / Documento *</label>
              <input
                type="text"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                placeholder="48291044"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Edad</label>
              <input
                type="number"
                value={edad}
                onChange={(e) => setEdad(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Sexo</label>
              <select
                value={sexo}
                onChange={(e: any) => setSexo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              >
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                placeholder="+34 622 110 994"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Seguro / EPS</label>
              <input
                type="text"
                value={seguro}
                onChange={(e) => setSeguro(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                placeholder="Ej: Sanitas, Particular"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Antecedentes Oculares (separar por comas)</label>
            <input
              type="text"
              value={antecedentesOculares}
              onChange={(e) => setAntecedentesOculares(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              placeholder="Ej: Glaucoma familiar, Miopía alta, Cirugía previa"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Antecedentes Sistémicos</label>
              <input
                type="text"
                value={antecedentesSistemicos}
                onChange={(e) => setAntecedentesSistemicos(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                placeholder="Diabetes, Hipertensión"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Alergias Medicamentosas</label>
              <input
                type="text"
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                placeholder="Penicilina, Sulfas"
              />
            </div>
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
              className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Guardar y Crear NHC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
