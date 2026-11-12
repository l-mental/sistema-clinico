import React, { useState, useEffect } from 'react';
import { 
  Patient, 
  Appointment, 
  OphthalmologyExam, 
  SurgeryRecord, 
  InventoryItem, 
  EmergencyCase, 
  DiagnosticStudy,
  AuthUser 
} from './types/hospital';
import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_EXAMS, 
  INITIAL_SURGERIES, 
  INITIAL_INVENTORY, 
  INITIAL_EMERGENCIES, 
  INITIAL_DIAGNOSTICS,
  getStoredData,
  saveStoredData
} from './data/mockHospitalData';
import { Header } from './components/Header';
import { Sidebar, ActiveView } from './components/Sidebar';
import { DashboardGrid } from './components/DashboardGrid';
import { LoginScreen, PRESET_USERS } from './components/LoginScreen';
import { ClinicalConsultationModule } from './components/modules/ClinicalConsultationModule';
import { AppointmentsModule } from './components/modules/AppointmentsModule';
import { PatientsModule } from './components/modules/PatientsModule';
import { OperatingTheatreModule } from './components/modules/OperatingTheatreModule';
import { EmergencyModule } from './components/modules/EmergencyModule';
import { DiagnosticsOCTModule } from './components/modules/DiagnosticsOCTModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { DischargeTemplatesModule } from './components/modules/DischargeTemplatesModule';
import { PrescriptionModal } from './components/PrescriptionModal';
import { NewPatientModal } from './components/NewPatientModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { NewSurgeryModal } from './components/NewSurgeryModal';
import { 
  Bed, 
  Syringe, 
  Droplet, 
  UserCheck, 
  Wrench, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Menu
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeCenter, setActiveCenter] = useState('Centro Oftalmológico Láser & Visión - Sede Central');

  // Core Clinical State with LocalStorage Persistence
  const [patients, setPatients] = useState<Patient[]>(() => 
    getStoredData('patients', INITIAL_PATIENTS)
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(patients[0] || null);

  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    getStoredData('appointments', INITIAL_APPOINTMENTS)
  );

  const [exams, setExams] = useState<OphthalmologyExam[]>(() => 
    getStoredData('exams', INITIAL_EXAMS)
  );

  const [surgeries, setSurgeries] = useState<SurgeryRecord[]>(() => 
    getStoredData('surgeries', INITIAL_SURGERIES)
  );

  const [inventory, setInventory] = useState<InventoryItem[]>(() => 
    getStoredData('inventory', INITIAL_INVENTORY)
  );

  const [emergencies, setEmergencies] = useState<EmergencyCase[]>(() => 
    getStoredData('emergencies', INITIAL_EMERGENCIES)
  );

  const [diagnostics] = useState<DiagnosticStudy[]>(INITIAL_DIAGNOSTICS);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => 
    getStoredData<AuthUser | null>('auth_user', PRESET_USERS[0])
  );

  // Modals State
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showNewSurgeryModal, setShowNewSurgeryModal] = useState(false);
  const [prescriptionExam, setPrescriptionExam] = useState<OphthalmologyExam | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    saveStoredData('patients', patients);
  }, [patients]);

  useEffect(() => {
    saveStoredData('appointments', appointments);
  }, [appointments]);

  useEffect(() => {
    saveStoredData('exams', exams);
  }, [exams]);

  useEffect(() => {
    saveStoredData('surgeries', surgeries);
  }, [surgeries]);

  useEffect(() => {
    saveStoredData('inventory', inventory);
  }, [inventory]);

  useEffect(() => {
    saveStoredData('emergencies', emergencies);
  }, [emergencies]);

  // Auth Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveCenter(user.sede);
    saveStoredData('auth_user', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredData('auth_user', null);
  };

  // Handlers
  const handleAddPatient = (newP: Patient) => {
    setPatients([newP, ...patients]);
    setSelectedPatient(newP);
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments([newApt, ...appointments]);
  };

  const handleUpdateAppointmentStatus = (aptId: string, newStatus: Appointment['estado']) => {
    setAppointments(appointments.map(apt => 
      apt.id === aptId ? { ...apt, estado: newStatus } : apt
    ));
  };

  const handleSaveExam = (exam: OphthalmologyExam) => {
    setExams([exam, ...exams]);
    // update patient last consult
    setPatients(patients.map(p => 
      p.id === exam.pacienteId ? { ...p, ultimaConsulta: exam.fecha, diagnosticoPrincipal: exam.diagnosticos[0] } : p
    ));
  };

  const handleAddSurgery = (srg: SurgeryRecord) => {
    setSurgeries([srg, ...surgeries]);
  };

  const handleUpdateSurgeryStatus = (id: string, status: SurgeryRecord['estado']) => {
    setSurgeries(surgeries.map(s => 
      s.id === id ? { ...s, estado: status } : s
    ));
  };

  const handleUpdateInventoryStock = (itemId: string, delta: number) => {
    setInventory(inventory.map(item => 
      item.id === itemId ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  const handleAddEmergency = (emg: EmergencyCase) => {
    setEmergencies([emg, ...emergencies]);
  };

  const handleUpdateEmergencyStatus = (id: string, status: EmergencyCase['estado']) => {
    setEmergencies(emergencies.map(e => 
      e.id === id ? { ...e, estado: status } : e
    ));
  };

  // If not logged in, show Hospital Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onOpenNewPatient={() => setShowNewPatientModal(true)}
        onOpenNewAppointment={() => setShowNewAppointmentModal(true)}
        onOpenConsultation={() => setActiveView('clinical')}
        onSelectPatient={(p) => {
          setSelectedPatient(p);
          setActiveView('patients');
        }}
        patients={patients}
        activeCenter={activeCenter}
        setActiveCenter={setActiveCenter}
        onNavigateHome={() => setActiveView('dashboard')}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Mobile Toggle Button */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 p-1 font-semibold"
        >
          <Menu className="w-4 h-4" />
          <span>Módulos y Menú Lateral</span>
        </button>
        <span className="text-[11px] text-sky-400 font-mono">
          {activeView.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 flex">
        {/* Dark Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Central Workspace Area */}
        <main className="flex-1 md:ml-16 lg:ml-20 overflow-x-hidden min-h-[calc(100vh-4rem)] pb-12">
          
          {/* Main 18-Module Dashboard */}
          {activeView === 'dashboard' && (
            <DashboardGrid
              onNavigate={(view) => setActiveView(view)}
              stats={{
                appointmentsCount: appointments.length,
                patientsCount: patients.length,
                activeSurgeries: surgeries.filter(s => s.estado !== 'Alta').length,
                emergenciesCount: emergencies.filter(e => e.estado !== 'Estabilizado / Alta').length,
                inventoryLowCount: inventory.filter(i => i.stock <= i.stockMinimo).length
              }}
            />
          )}

          {/* Module: Citas & Agenda */}
          {activeView === 'appointments' && (
            <AppointmentsModule
              appointments={appointments}
              patients={patients}
              onOpenNewAppointment={() => setShowNewAppointmentModal(true)}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setActiveView('clinical');
              }}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Registro de Pacientes */}
          {activeView === 'patients' && (
            <PatientsModule
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onStartConsultation={(p) => {
                setSelectedPatient(p);
                setActiveView('clinical');
              }}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Consulta Oftalmológica (The Clinical Flagship) */}
          {activeView === 'clinical' && (
            <ClinicalConsultationModule
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              exams={exams}
              onSaveExam={handleSaveExam}
              onOpenPrescription={(exam) => setPrescriptionExam(exam)}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Quirófano Ocular */}
          {activeView === 'surgery' && (
            <OperatingTheatreModule
              surgeries={surgeries}
              patients={patients}
              onOpenNewSurgery={() => setShowNewSurgeryModal(true)}
              onUpdateSurgeryStatus={handleUpdateSurgeryStatus}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Urgencias Oculares */}
          {activeView === 'emergency' && (
            <EmergencyModule
              emergencies={emergencies}
              onAddEmergency={handleAddEmergency}
              onUpdateStatus={handleUpdateEmergencyStatus}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Diagnósticos, OCT & Imágenes */}
          {(activeView === 'laboratory' || activeView === 'imaging') && (
            <DiagnosticsOCTModule
              diagnostics={diagnostics}
              patients={patients}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Inventario & Farmacia */}
          {(activeView === 'inventory' || activeView === 'inventory-setup') && (
            <InventoryModule
              inventory={inventory}
              onUpdateStock={handleUpdateInventoryStock}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: MIS Reports */}
          {activeView === 'reports' && (
            <ReportsModule
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Epicrisis & Plantillas */}
          {(activeView === 'discharge' || activeView === 'templates') && (
            <DischargeTemplatesModule
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Secondary Specialized Ophthalmology Modules */}
          {activeView === 'daycare' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Hospitalización de Día & Recuperación</h1>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Box Post-Faco 1</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Ocupado</span>
                  </div>
                  <p className="text-xs text-slate-600">Elena Vargas Mendoza · Reposo con protector rígido tras facoemulsificación OD + LIO.</p>
                  <div className="text-[11px] font-mono text-slate-400">Ingreso: 13:10h · Control de apósito en 45 min</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Box Post-LASIK 2</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">Disponible</span>
                  </div>
                  <p className="text-xs text-slate-600">Sillón reclinable con luz tenue para reposo con ojos cerrados post-ablación excímer.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Box 3 - Recuperación Vitrectomía</span>
                    <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">Disponible</span>
                  </div>
                  <p className="text-xs text-slate-600">Equipado para posicionamiento prono / decúbito ventral por gas intraocular C3F8.</p>
                </div>
              </div>
            </div>
          )}

          {activeView === 'procedures' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Procedimientos Menores & Inyecciones Intravítreas</h1>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Procedimientos Ambulatorios Oftalmológicos Disponibles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Inyección Intravítrea de Anti-VEGF (Aflibercept / Ranibizumab)</div>
                    <p className="text-slate-500 mt-1">Sala limpia con blefarostato estéril y povidona yodada 5% para DMAE y edema macular.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Capsulotomía YAG Láser</div>
                    <p className="text-slate-500 mt-1">Tratamiento de opacidad de cápsula posterior (catarata secundaria) post-LIO.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Iridotomía Periférica con Láser YAG</div>
                    <p className="text-slate-500 mt-1">Prevención y tratamiento de bloqueo pupilar en ángulos estrechos sospechosos de glaucoma.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Sondaje y Lavado de Vía Lagrimal</div>
                    <p className="text-slate-500 mt-1">Para epífora obstructiva con cánula de vías lagrimales y suero fisiológico.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'corneabank' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Banco de Córneas & Tejido Ocular</h1>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Botón Corneal C-041</span>
                  <div className="text-sm font-bold text-slate-900">Tejido Corneal Preservado en Optisol-GS</div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Densidad Endotelial: <strong className="text-slate-900">2,850 células/mm²</strong> (Óptima)</p>
                    <p>Serología donante: Negativa para VIH, VHB, VHC, Sífilis.</p>
                    <p>Destino: Queratoplastia Lamelar Posterior (DMEK) programada.</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md uppercase">Membrana Amniótica Liofilizada</span>
                  <div className="text-sm font-bold text-slate-900">Parches para Reconstrucción de Superficie Ocular</div>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Stock: 4 unidades estériles en nitrógeno.</p>
                    <p>Indicación: Defectos epiteliales persistentes y quemaduras químicas agudas.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'insurance' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Seguros Médicos & Cobertura eClaim</h1>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Convenios Oftalmológicos Activos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Sanitas Seguros</div>
                    <p className="text-slate-500 mt-1">Cobertura 100% en Faco + LIO Monofocal. Copago 15% en LIO Tórico/Trifocal.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Adeslas Plena</div>
                    <p className="text-slate-500 mt-1">Autorización directa de pruebas OCT y Campimetría Humphrey sin carencia.</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900">Mapfre Salud</div>
                    <p className="text-slate-500 mt-1">Convenio de Cirugía Refractiva Láser con tarifa preferencial concertada.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'nursing' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Estación de Enfermería & Triaje Visual</h1>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Protocolo de Midriasis para Examen de Fondo de Ojo</h3>
                <p className="text-slate-600 leading-relaxed">
                  1. Instilar 1 gota de Tropicamida al 1% en ambos ojos.<br />
                  2. Pasados 5 minutos, instilar 1 gota de Fenilefrina al 10% (verificar previamente que el paciente no sea hipertenso no controlado).<br />
                  3. Esperar 20 minutos en sala de espera con luz atenuada.<br />
                  4. Comprobar midriasis pupilar &ge; 7 mm antes de pasar con el oftalmólogo.
                </p>
              </div>
            </div>
          )}

          {activeView === 'management' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Gestión Médica y Configuración del Sistema</h1>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Staff Médico Oftalmológico Habilitado</h3>
                <div className="divide-y divide-slate-100">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Dr. Gonzalo Huanca Luna</span>
                      <span className="text-slate-500 block text-[11px]">Director Médico · Catarata & Cirugía de Segmento Anterior</span>
                    </div>
                    <span className="font-mono text-xs text-sky-700 font-bold">CMP: 49812 · RNE: 24190</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Dr. Roberto Méndez</span>
                      <span className="text-slate-500 block text-[11px]">Cirugía Refractiva Láser (Femto-LASIK & PRK)</span>
                    </div>
                    <span className="font-mono text-xs text-sky-700 font-bold">CMP: 38201 · RNE: 19802</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Dra. Carmen Morales</span>
                      <span className="text-slate-500 block text-[11px]">Especialista en Retina Quirúrgica & Vítreo</span>
                    </div>
                    <span className="font-mono text-xs text-sky-700 font-bold">CMP: 52190 · RNE: 27411</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Printable Optical & Medical Prescription Modal */}
      <PrescriptionModal
        exam={prescriptionExam}
        onClose={() => setPrescriptionExam(null)}
      />

      {/* Modals */}
      {showNewPatientModal && (
        <NewPatientModal
          onAddPatient={handleAddPatient}
          onClose={() => setShowNewPatientModal(false)}
        />
      )}

      {showNewAppointmentModal && (
        <NewAppointmentModal
          patients={patients}
          onAddAppointment={handleAddAppointment}
          onClose={() => setShowNewAppointmentModal(false)}
        />
      )}

      {showNewSurgeryModal && (
        <NewSurgeryModal
          patients={patients}
          onAddSurgery={handleAddSurgery}
          onClose={() => setShowNewSurgeryModal(false)}
        />
      )}
    </div>
  );
}
