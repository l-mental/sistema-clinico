import React, { useState } from 'react';
import { 
  Patient, 
  OphthalmologyExam, 
  RefractionData, 
  EyeSide 
} from '../../types/hospital';
import { 
  Eye, 
  Save, 
  Printer, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  History, 
  Stethoscope, 
  FileText, 
  Plus, 
  Trash2,
  Glasses,
  Activity,
  ArrowLeft
} from 'lucide-react';

interface ClinicalConsultationModuleProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (p: Patient) => void;
  exams: OphthalmologyExam[];
  onSaveExam: (exam: OphthalmologyExam) => void;
  onOpenPrescription: (exam: OphthalmologyExam) => void;
  onBack: () => void;
  currentDoctorName?: string;
}

const COMMON_DIAGNOSES = [
  { code: 'H25.1', label: 'Catarata senil nuclear' },
  { code: 'H25.2', label: 'Catarata senil cortical' },
  { code: 'H52.1', label: 'Miopía simple / patológica' },
  { code: 'H52.2', label: 'Astigmatismo miópico / hipermetrópico' },
  { code: 'H52.4', label: 'Presbicia' },
  { code: 'H40.1', label: 'Glaucoma primario de ángulo abierto' },
  { code: 'H40.2', label: 'Glaucoma primario de ángulo cerrado' },
  { code: 'H04.1', label: 'Síndrome de Ojo Seco severo' },
  { code: 'H35.3', label: 'Degeneración macular asociada a la edad (DMAE)' },
  { code: 'H35.0', label: 'Retinopatía diabética no proliferativa' },
  { code: 'H11.0', label: 'Pterigión nasal grado II' },
  { code: 'H10.1', label: 'Conjuntivitis alérgica estacional' }
];

const COMMON_DROPS = [
  { nombre: 'Moxifloxacino 0.5% (Vigamox)', dosis: '1 gota cada 8 horas por 7 días' },
  { nombre: 'Prednisolona acetato 1% (Prednefrin)', dosis: '1 gota cada 6 horas por 10 días' },
  { nombre: 'Timolol maleato 0.5%', dosis: '1 gota cada 12 horas fija' },
  { nombre: 'Brimonidina tartrato 0.2% (Alphagan)', dosis: '1 gota cada 12 horas' },
  { nombre: 'Latanoprost 0.005% (Xalatan)', dosis: '1 gota por la noche (21:00h)' },
  { nombre: 'Hialuronato de Sodio 0.4% sin conservantes', dosis: '1 gota cada 4 horas según necesidad' }
];

export const ClinicalConsultationModule: React.FC<ClinicalConsultationModuleProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  exams,
  onSaveExam,
  onOpenPrescription,
  onBack,
  currentDoctorName
}) => {
  const currentPatient =
    (selectedPatient && patients.some(p => p.id === selectedPatient.id) ? selectedPatient : null) ||
    patients[0] ||
    null;

  // Clinical Exam Form State
  const [avSinOD, setAvSinOD] = useState('20/40');
  const [avSinOI, setAvSinOI] = useState('20/50');
  const [avConOD, setAvConOD] = useState('20/20');
  const [avConOI, setAvConOI] = useState('20/20');
  const [avEstOD, setAvEstOD] = useState('20/20');
  const [avEstOI, setAvEstOI] = useState('20/20');

  // Refraction State
  const [esfOD, setEsfOD] = useState('-1.50');
  const [cilOD, setCilOD] = useState('-0.75');
  const [ejeOD, setEjeOD] = useState('90');
  const [addOD, setAddOD] = useState('+2.25');

  const [esfOI, setEsfOI] = useState('-1.75');
  const [cilOI, setCilOI] = useState('-0.50');
  const [ejeOI, setEjeOI] = useState('85');
  const [addOI, setAddOI] = useState('+2.25');
  const [dip, setDip] = useState<number>(63);

  // Tonometry (PIO)
  const [pioOD, setPioOD] = useState<number>(16);
  const [pioOI, setPioOI] = useState<number>(15);
  const [metodoTonometria, setMetodoTonometria] = useState<'Goldmann' | 'Neumotonometría (Aire)' | 'Tonopen / Icare'>('Goldmann');

  // Slit Lamp
  const [corneaOD, setCorneaOD] = useState('Transparente, sin edema');
  const [corneaOI, setCorneaOI] = useState('Transparente, sin edema');
  const [camaraOD, setCamaraOD] = useState('Profunda, Tyndall 0');
  const [camaraOI, setCamaraOI] = useState('Profunda, Tyndall 0');
  const [cristalinoOD, setCristalinoOD] = useState('Opacidad nuclear moderada (N2)');
  const [cristalinoOI, setCristalinoOI] = useState('Transparente');

  // Fundus
  const [papilaOD, setPapilaOD] = useState('Bordes netos, E/P 0.3');
  const [papilaOI, setPapilaOI] = useState('Bordes netos, E/P 0.3');
  const [maculaOD, setMaculaOD] = useState('Reflejo foveal conservado');
  const [maculaOI, setMaculaOI] = useState('Reflejo foveal conservado');

  // Diagnoses and Medication
  const [diagnosticos, setDiagnosticos] = useState<string[]>(['Catarata senil nuclear OD', 'Presbicia bilateral']);
  const [cie10, setCie10] = useState<string[]>(['H25.1', 'H52.4']);
  const [planTratamiento, setPlanTratamiento] = useState(
    'Se indica valoración prequirúrgica de facoemulsificación OD + implante de LIO monofocal. Se prescriben gafas para visión cercana.'
  );

  const [medicamentos, setMedicamentos] = useState<any[]>([
    {
      nombre: 'Hialuronato de Sodio 0.4%',
      dosis: '1 gota',
      frecuencia: 'Cada 6 horas',
      duracion: '1 mes',
      ojo: 'Ambos' as EyeSide
    }
  ]);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const addDiagnosis = (diag: { code: string; label: string }) => {
    if (!diagnosticos.includes(diag.label)) {
      setDiagnosticos([...diagnosticos, diag.label]);
      setCie10([...cie10, diag.code]);
    }
  };

  const removeDiagnosis = (index: number) => {
    setDiagnosticos(diagnosticos.filter((_, i) => i !== index));
    setCie10(cie10.filter((_, i) => i !== index));
  };

  const addMedication = (drop: { nombre: string; dosis: string }) => {
    setMedicamentos([
      ...medicamentos,
      {
        nombre: drop.nombre,
        dosis: '1 gota',
        frecuencia: drop.dosis,
        duracion: '15 días',
        ojo: 'Ambos'
      }
    ]);
  };

  const removeMedication = (idx: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!currentPatient) return;
    const newExam: OphthalmologyExam = {
      id: `ex-${Date.now()}`,
      pacienteId: currentPatient.id,
      pacienteNombre: `${currentPatient.nombre} ${currentPatient.apellidos}`,
      nhc: currentPatient.nhc,
      fecha: new Date().toISOString().split('T')[0],
      medico: currentDoctorName || 'Dr. Gonzalo Huanca',
      avSinCorreccionOD: avSinOD,
      avSinCorreccionOI: avSinOI,
      avConCorreccionOD: avConOD,
      avConCorreccionOI: avConOI,
      avEstenopeicoOD: avEstOD,
      avEstenopeicoOI: avEstOI,
      refraccionOD: {
        esfera: esfOD,
        cilindro: cilOD,
        eje: ejeOD,
        adicion: addOD,
        agudezaVisual: avConOD
      },
      refraccionOI: {
        esfera: esfOI,
        cilindro: cilOI,
        eje: ejeOI,
        adicion: addOI,
        agudezaVisual: avConOI
      },
      distanciaInterpupilar: dip,
      pioOD,
      pioOI,
      metodoTonometria,
      lamparaHendidura: {
        corneaOD,
        corneaOI,
        camaraAnteriorOD: camaraOD,
        camaraAnteriorOI: camaraOI,
        cristalinoOD,
        cristalinoOI,
        irisOD: 'Normorreactivo',
        irisOI: 'Normorreactivo'
      },
      fondoDeOjo: {
        papilaOD,
        papilaOI,
        maculaOD,
        maculaOI,
        retinaPerifericaOD: 'Retina aplicada',
        retinaPerifericaOI: 'Retina aplicada'
      },
      diagnosticos,
      cie10,
      planTratamiento,
      recetaLentes: true,
      medicamentosPrescritos: medicamentos
    };

    onSaveExam(newExam);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const patientExams = exams.filter(e => e.pacienteId === currentPatient?.id);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Volver al Panel Principal"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                Gabinete Oftalmológico
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Expediente Clínico & Refracción</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Consulta Oftalmológica Especializada
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              if (currentPatient) {
                const tempExam: OphthalmologyExam = {
                  id: 'temp',
                  pacienteId: currentPatient.id,
                  pacienteNombre: `${currentPatient.nombre} ${currentPatient.apellidos}`,
                  nhc: currentPatient.nhc,
                  fecha: new Date().toISOString().split('T')[0],
                  medico: currentDoctorName || 'Dr. Gonzalo Huanca',
                  avSinCorreccionOD: avSinOD,
                  avSinCorreccionOI: avSinOI,
                  avConCorreccionOD: avConOD,
                  avConCorreccionOI: avConOI,
                  avEstenopeicoOD: avEstOD,
                  avEstenopeicoOI: avEstOI,
                  refraccionOD: { esfera: esfOD, cilindro: cilOD, eje: ejeOD, adicion: addOD, agudezaVisual: avConOD },
                  refraccionOI: { esfera: esfOI, cilindro: cilOI, eje: ejeOI, adicion: addOI, agudezaVisual: avConOI },
                  distanciaInterpupilar: dip,
                  pioOD,
                  pioOI,
                  metodoTonometria,
                  lamparaHendidura: { corneaOD, corneaOI, camaraAnteriorOD: camaraOD, camaraAnteriorOI: camaraOI, cristalinoOD, cristalinoOI, irisOD: 'Normal', irisOI: 'Normal' },
                  fondoDeOjo: { papilaOD, papilaOI, maculaOD, maculaOI, retinaPerifericaOD: 'OK', retinaPerifericaOI: 'OK' },
                  diagnosticos,
                  cie10,
                  planTratamiento,
                  recetaLentes: true,
                  medicamentosPrescritos: medicamentos
                };
                onOpenPrescription(tempExam);
              }
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600" />
            <span>Imprimir Receta</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Consulta</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-medium animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Consulta guardada exitosamente en el historial del paciente.</span>
          </div>
          <span className="font-mono text-emerald-700">NHC: {currentPatient?.nhc}</span>
        </div>
      )}

      {/* Patient Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black text-base">
            {currentPatient?.nombre[0]}{currentPatient?.apellidos[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900">
                {currentPatient?.nombre} {currentPatient?.apellidos}
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold">
                {currentPatient?.nhc}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
              <span>DNI: <strong className="text-slate-700">{currentPatient?.dni}</strong></span>
              <span>·</span>
              <span>Edad: <strong className="text-slate-700">{currentPatient?.edad} años</strong> ({currentPatient?.sexo})</span>
              <span>·</span>
              <span>Seguro: <strong className="text-sky-700">{currentPatient?.seguro}</strong></span>
              <span>·</span>
              <span>Alergias: <strong className="text-red-600">{currentPatient?.alergias.join(', ') || 'Ninguna'}</strong></span>
            </div>
          </div>
        </div>

        {/* Change Patient Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Cambiar Paciente:</span>
          <select
            value={currentPatient?.id}
            onChange={(e) => {
              const p = patients.find(item => item.id === e.target.value);
              if (p) onSelectPatient(p);
            }}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {patients.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellidos} ({p.nhc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Clinical Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: Agudeza Visual & Refracción */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <Glasses className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Agudeza Visual (Snellen)</h3>
                <p className="text-[11px] text-slate-400">Optotipo a 6 metros (20 pies)</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 rounded-sm text-slate-600">
              OD / OI
            </span>
          </div>

          {/* AV OD & OI Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold text-left">
                  <th className="py-2">Ojo</th>
                  <th className="py-2">Sin Corrección</th>
                  <th className="py-2">Con Corrección</th>
                  <th className="py-2">Estenopeico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2.5 font-bold text-sky-700">OD (Derecho)</td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={avSinOD}
                      onChange={(e) => setAvSinOD(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={avConOD}
                      onChange={(e) => setAvConOD(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono font-bold text-emerald-700"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={avEstOD}
                      onChange={(e) => setAvEstOD(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-indigo-700">OI (Izquierdo)</td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={avSinOI}
                      onChange={(e) => setAvSinOI(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={avConOI}
                      onChange={(e) => setAvConOI(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono font-bold text-emerald-700"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="text"
                      value={avEstOI}
                      onChange={(e) => setAvEstOI(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-slate-200 rounded-md font-mono"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Refraction Fields */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Refracción Subjetiva y Graduación</span>
              <span className="text-[10px] font-normal text-slate-500">
                DIP: <input type="number" value={dip} onChange={(e) => setDip(Number(e.target.value))} className="w-12 px-1 text-center font-mono border rounded-xs ml-1" /> mm
              </span>
            </h4>

            {/* OD Row */}
            <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 space-y-2 mb-2.5">
              <div className="text-[11px] font-bold text-sky-800 flex items-center justify-between">
                <span>OJO DERECHO (OD)</span>
                <span className="font-mono text-[10px] text-sky-600">Fórmula Esfero-Cilíndrica</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Esfera (D)</label>
                  <input
                    type="text"
                    value={esfOD}
                    onChange={(e) => setEsfOD(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="-1.50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Cilindro (D)</label>
                  <input
                    type="text"
                    value={cilOD}
                    onChange={(e) => setCilOD(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="-0.75"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Eje (°)</label>
                  <input
                    type="text"
                    value={ejeOD}
                    onChange={(e) => setEjeOD(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="90°"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Adición (Cerca)</label>
                  <input
                    type="text"
                    value={addOD}
                    onChange={(e) => setAddOD(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="+2.00"
                  />
                </div>
              </div>
            </div>

            {/* OI Row */}
            <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
              <div className="text-[11px] font-bold text-indigo-800 flex items-center justify-between">
                <span>OJO IZQUIERDO (OI)</span>
                <span className="font-mono text-[10px] text-indigo-600">Fórmula Esfero-Cilíndrica</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Esfera (D)</label>
                  <input
                    type="text"
                    value={esfOI}
                    onChange={(e) => setEsfOI(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="-1.75"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Cilindro (D)</label>
                  <input
                    type="text"
                    value={cilOI}
                    onChange={(e) => setCilOI(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="-0.50"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Eje (°)</label>
                  <input
                    type="text"
                    value={ejeOI}
                    onChange={(e) => setEjeOI(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="85°"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Adición (Cerca)</label>
                  <input
                    type="text"
                    value={addOI}
                    onChange={(e) => setAddOI(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md"
                    placeholder="+2.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Tonometría (PIO) y Biomicroscopía */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-5">
          {/* Tonometry */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tonometría / Presión Intraocular (PIO)</h3>
                  <p className="text-[11px] text-slate-400">Rango normal: 10 - 21 mmHg</p>
                </div>
              </div>

              <select
                value={metodoTonometria}
                onChange={(e: any) => setMetodoTonometria(e.target.value)}
                className="text-[11px] font-medium bg-slate-50 border border-slate-200 rounded-md px-2 py-1"
              >
                <option value="Goldmann">Goldmann (Aplanación)</option>
                <option value="Neumotonometría (Aire)">Neumotonometría (Aire)</option>
                <option value="Tonopen / Icare">Tonopen / Icare</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">PIO Ojo Derecho (OD)</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${pioOD > 21 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {pioOD > 21 ? 'Elevada' : 'Normal'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={pioOD}
                    onChange={(e) => setPioOD(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-base font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg text-center"
                  />
                  <span className="text-xs font-semibold text-slate-500">mmHg</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">PIO Ojo Izquierdo (OI)</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${pioOI > 21 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {pioOI > 21 ? 'Elevada' : 'Normal'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={pioOI}
                    onChange={(e) => setPioOI(Number(e.target.value))}
                    className="w-20 px-2 py-1 text-base font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-lg text-center"
                  />
                  <span className="text-xs font-semibold text-slate-500">mmHg</span>
                </div>
              </div>
            </div>

            {(pioOD > 21 || pioOI > 21) && (
              <div className="mt-2.5 p-2 bg-red-50 border border-red-200 rounded-lg text-[11px] text-red-700 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Alerta: PIO superior a 21 mmHg. Descartar hipertensión ocular o glaucoma activo.</span>
              </div>
            )}
          </div>

          {/* Slit Lamp Biomicroscopy */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Biomicroscopía / Lámpara de Hendidura
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-sky-800 block mb-1">Córnea OD</label>
                <input
                  type="text"
                  value={corneaOD}
                  onChange={(e) => setCorneaOD(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-indigo-800 block mb-1">Córnea OI</label>
                <input
                  type="text"
                  value={corneaOI}
                  onChange={(e) => setCorneaOI(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-sky-800 block mb-1">Cámara Anterior OD</label>
                <input
                  type="text"
                  value={camaraOD}
                  onChange={(e) => setCamaraOD(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-indigo-800 block mb-1">Cámara Anterior OI</label>
                <input
                  type="text"
                  value={camaraOI}
                  onChange={(e) => setCamaraOI(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-sky-800 block mb-1">Cristalino OD (Catarata)</label>
                <input
                  type="text"
                  value={cristalinoOD}
                  onChange={(e) => setCristalinoOD(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-indigo-800 block mb-1">Cristalino OI</label>
                <input
                  type="text"
                  value={cristalinoOI}
                  onChange={(e) => setCristalinoOI(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded-md bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Fondo de Ojo (Retina & Nervio Óptico) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Oftalmoscopía & Fondo de Ojo</h3>
              <p className="text-[11px] text-slate-400">Papila, Excavación E/P, Mácula y Retina Periférica</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-sky-800 block mb-1">Papila / Nervio Óptico OD</label>
              <input
                type="text"
                value={papilaOD}
                onChange={(e) => setPapilaOD(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-indigo-800 block mb-1">Papila / Nervio Óptico OI</label>
              <input
                type="text"
                value={papilaOI}
                onChange={(e) => setPapilaOI(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-sky-800 block mb-1">Mácula OD</label>
              <input
                type="text"
                value={maculaOD}
                onChange={(e) => setMaculaOD(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-indigo-800 block mb-1">Mácula OI</label>
              <input
                type="text"
                value={maculaOI}
                onChange={(e) => setMaculaOI(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-md bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Plan Terapéutico y Conducta Médica
            </label>
            <textarea
              rows={3}
              value={planTratamiento}
              onChange={(e) => setPlanTratamiento(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500"
              placeholder="Describir indicaciones quirúrgicas o de control..."
            />
          </div>
        </div>

        {/* SECTION 4: Diagnósticos CIE-10 & Farmacología Oftálmica */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Diagnósticos CIE-10 Oftalmológicos</h3>
                <p className="text-[11px] text-slate-400">Codificación clínica oficial</p>
              </div>
            </div>
          </div>

          {/* Quick Click Diagnoses Pills */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Añadir Patología con un clic:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_DIAGNOSES.map(d => (
                <button
                  key={d.code}
                  onClick={() => addDiagnosis(d)}
                  className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  <strong className="text-sky-600 mr-1">{d.code}</strong> {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Diagnoses List */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase">
              Diagnósticos Activos para la Consulta:
            </div>
            {diagnosticos.map((diag, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-xs">
                    {cie10[index] || 'H52'}
                  </span>
                  <span className="font-medium text-slate-800">{diag}</span>
                </div>
                <button
                  onClick={() => removeDiagnosis(index)}
                  className="text-slate-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Prescription Drops */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Prescripción de Colirios Oftálmicos
              </span>
              <span className="text-[10px] text-slate-400">Posología médica</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {COMMON_DROPS.map((drop, idx) => (
                <button
                  key={idx}
                  onClick={() => addMedication(drop)}
                  className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200 transition-colors cursor-pointer"
                >
                  + {drop.nombre.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {medicamentos.map((med, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs">
                  <div>
                    <div className="font-bold text-emerald-900">{med.nombre}</div>
                    <div className="text-[11px] text-slate-600">
                      Ojo: <strong className="text-emerald-700">{med.ojo}</strong> · {med.dosis} · {med.frecuencia}
                    </div>
                  </div>
                  <button
                    onClick={() => removeMedication(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
