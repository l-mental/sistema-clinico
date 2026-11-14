import React, { useState, useEffect, useMemo } from 'react';
import { 
  Patient, 
  Appointment, 
  OphthalmologyExam, 
  SurgeryRecord, 
  InventoryItem, 
  EmergencyCase, 
  DiagnosticStudy,
  AuthUser,
  UserRole,
  OpticalFrame,
  OpticalSaleOrder,
  OpticalOrderStatus
} from './types/hospital';
import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_EXAMS, 
  INITIAL_SURGERIES, 
  INITIAL_INVENTORY, 
  INITIAL_EMERGENCIES, 
  INITIAL_DIAGNOSTICS,
  INITIAL_OPTICAL_FRAMES,
  INITIAL_OPTICAL_ORDERS,
  getStoredData,
  saveStoredData
} from './data/mockHospitalData';
import { Header } from './components/Header';
import { Sidebar, ActiveView } from './components/Sidebar';
import { DashboardGrid } from './components/DashboardGrid';
import { LoginScreen } from './components/LoginScreen';
import { ClinicalConsultationModule } from './components/modules/ClinicalConsultationModule';
import { AppointmentsModule } from './components/modules/AppointmentsModule';
import { PatientsModule } from './components/modules/PatientsModule';
import { OperatingTheatreModule } from './components/modules/OperatingTheatreModule';
import { EmergencyModule } from './components/modules/EmergencyModule';
import { DiagnosticsOCTModule } from './components/modules/DiagnosticsOCTModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { DischargeTemplatesModule } from './components/modules/DischargeTemplatesModule';
import { OpticaModule } from './components/modules/OpticaModule';
import { PrescriptionModal } from './components/PrescriptionModal';
import { NewPatientModal } from './components/NewPatientModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { NewSurgeryModal } from './components/NewSurgeryModal';
import { 
  ArrowLeft,
  Menu
} from 'lucide-react';

const VALID_ROLES: UserRole[] = ['Administrador', 'Doctor', 'Operador'];

function isValidAuthUser(user: AuthUser | null): user is AuthUser {
  return Boolean(user && VALID_ROLES.includes(user.rol));
}

function canAccessView(role: UserRole, view: ActiveView): boolean {
  if (role === 'Administrador') return true;
  if (role === 'Operador') {
    return view === 'optica' || view === 'patients';
  }
  const doctorViews: ActiveView[] = [
    'dashboard',
    'appointments',
    'patients',
    'clinical',
    'daycare',
    'emergency',
    'surgery',
    'procedures',
    'laboratory',
    'imaging',
    'discharge',
    'templates'
  ];
  return doctorViews.includes(view);
}

export default function App() {
  // User Authentication State (validate against current 3-role schema)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const stored = getStoredData<AuthUser | null>('auth_user', null);
    return isValidAuthUser(stored) ? stored : null;
  });

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>(() =>
    currentUser?.rol === 'Operador' ? 'optica' : 'dashboard'
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeCenter, setActiveCenter] = useState(
    () => currentUser?.sede || 'Centro Oftalmológico Láser & Visión - Sede Central'
  );

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

  const [opticalFrames, setOpticalFrames] = useState<OpticalFrame[]>(() =>
    getStoredData('optical_frames', INITIAL_OPTICAL_FRAMES)
  );

  const [opticalOrders, setOpticalOrders] = useState<OpticalSaleOrder[]>(() =>
    getStoredData('optical_orders', INITIAL_OPTICAL_ORDERS)
  );

  const [doctorPatientLinks, setDoctorPatientLinks] = useState<Record<string, string[]>>(() =>
    getStoredData('doctor_patient_links', {})
  );

  const [diagnostics] = useState<DiagnosticStudy[]>(INITIAL_DIAGNOSTICS);

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

  useEffect(() => {
    saveStoredData('optical_frames', opticalFrames);
  }, [opticalFrames]);

  useEffect(() => {
    saveStoredData('optical_orders', opticalOrders);
  }, [opticalOrders]);

  useEffect(() => {
    saveStoredData('doctor_patient_links', doctorPatientLinks);
  }, [doctorPatientLinks]);

  // Role-Scoped Clinical Data Filtering (Doctor sees ONLY their own data)
  const isDoctor = currentUser?.rol === 'Doctor';
  const currentDoctorName = isDoctor
    ? currentUser.doctorName || `${currentUser.nombre} ${currentUser.apellidos}`.trim()
    : undefined;

  const visibleAppointments = useMemo(() => {
    if (!isDoctor || !currentDoctorName) return appointments;
    return appointments.filter(a => a.especialista === currentDoctorName);
  }, [appointments, isDoctor, currentDoctorName]);

  const visibleSurgeries = useMemo(() => {
    if (!isDoctor || !currentDoctorName) return surgeries;
    return surgeries.filter(s => s.cirujano === currentDoctorName);
  }, [surgeries, isDoctor, currentDoctorName]);

  const visibleExams = useMemo(() => {
    if (!isDoctor || !currentDoctorName) return exams;
    return exams.filter(e => e.medico === currentDoctorName);
  }, [exams, isDoctor, currentDoctorName]);

  const visibleEmergencies = useMemo(() => {
    if (!isDoctor || !currentDoctorName) return emergencies;
    return emergencies.filter(em => em.medicoAsignado === currentDoctorName);
  }, [emergencies, isDoctor, currentDoctorName]);

  const visiblePatients = useMemo(() => {
    if (!isDoctor || !currentDoctorName) return patients;
    const allowedIds = new Set<string>(doctorPatientLinks[currentDoctorName] || []);
    visibleAppointments.forEach(a => allowedIds.add(a.pacienteId));
    visibleSurgeries.forEach(s => allowedIds.add(s.pacienteId));
    visibleExams.forEach(e => allowedIds.add(e.pacienteId));
    return patients.filter(p => allowedIds.has(p.id));
  }, [patients, isDoctor, currentDoctorName, doctorPatientLinks, visibleAppointments, visibleSurgeries, visibleExams]);

  const effectiveSelectedPatient = useMemo(() => {
    if (selectedPatient && visiblePatients.some(p => p.id === selectedPatient.id)) {
      return selectedPatient;
    }
    return visiblePatients[0] || null;
  }, [selectedPatient, visiblePatients]);

  // Auth Handlers
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveCenter(user.sede);
    setActiveView(user.rol === 'Operador' ? 'optica' : 'dashboard');
    saveStoredData('auth_user', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredData('auth_user', null);
  };

  // Clinical Handlers
  const handleAddPatient = (newP: Patient) => {
    setPatients(prev => [newP, ...prev]);
    setSelectedPatient(newP);
    if (isDoctor && currentDoctorName) {
      setDoctorPatientLinks(prev => ({
        ...prev,
        [currentDoctorName]: [newP.id, ...(prev[currentDoctorName] || [])]
      }));
    }
  };

  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleUpdateAppointmentStatus = (aptId: string, newStatus: Appointment['estado']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === aptId ? { ...apt, estado: newStatus } : apt
    ));
  };

  const handleSaveExam = (exam: OphthalmologyExam) => {
    setExams(prev => [exam, ...prev]);
    setPatients(prev => prev.map(p => 
      p.id === exam.pacienteId
        ? { ...p, ultimaConsulta: exam.fecha, diagnosticoPrincipal: exam.diagnosticos[0] }
        : p
    ));
  };

  const handleAddSurgery = (srg: SurgeryRecord) => {
    setSurgeries(prev => [srg, ...prev]);
  };

  const handleUpdateSurgeryStatus = (id: string, status: SurgeryRecord['estado']) => {
    setSurgeries(prev => prev.map(s => 
      s.id === id ? { ...s, estado: status } : s
    ));
  };

  const handleUpdateInventoryStock = (itemId: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, stock: Math.max(0, item.stock + delta) } : item
    ));
  };

  const handleAddEmergency = (emg: EmergencyCase) => {
    setEmergencies(prev => [emg, ...prev]);
  };

  const handleUpdateEmergencyStatus = (id: string, status: EmergencyCase['estado']) => {
    setEmergencies(prev => prev.map(e => 
      e.id === id ? { ...e, estado: status } : e
    ));
  };

  // Óptica Handlers
  const handleCreateOpticalOrder = (order: OpticalSaleOrder) => {
    setOpticalOrders(prev => [order, ...prev]);
    setOpticalFrames(prev =>
      prev.map(frame =>
        frame.id === order.monturaId
          ? { ...frame, stock: Math.max(0, frame.stock - 1) }
          : frame
      )
    );
  };

  const handleUpdateOpticalOrderStatus = (orderId: string, status: OpticalOrderStatus) => {
    setOpticalOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, estado: status } : o))
    );
  };

  const handleCollectOpticalBalance = (orderId: string) => {
    setOpticalOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, acuenta: o.total, saldo: 0 } : o))
    );
  };

  const handleUpdateFrameStock = (frameId: string, delta: number) => {
    setOpticalFrames(prev =>
      prev.map(f => (f.id === frameId ? { ...f, stock: Math.max(0, f.stock + delta) } : f))
    );
  };

  const handleAddOpticalFrame = (frame: OpticalFrame) => {
    setOpticalFrames(prev => [frame, ...prev]);
  };

  // If not logged in, show Hospital Login Screen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const defaultHomeView: ActiveView = currentUser.rol === 'Operador' ? 'optica' : 'dashboard';
  const safeActiveView: ActiveView = canAccessView(currentUser.rol, activeView)
    ? activeView
    : defaultHomeView;

  const userDisplayName = `${currentUser.nombre} ${currentUser.apellidos}`.trim();
  const activeOrdersCount = opticalOrders.filter(o => o.estado !== 'Entregado').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Header */}
      <Header
        onOpenNewPatient={() => setShowNewPatientModal(true)}
        onOpenNewAppointment={() => setShowNewAppointmentModal(true)}
        onOpenConsultation={() => setActiveView('clinical')}
        onOpenOptica={() => setActiveView('optica')}
        onSelectPatient={(p) => {
          setSelectedPatient(p);
          setActiveView('patients');
        }}
        patients={visiblePatients}
        activeCenter={activeCenter}
        setActiveCenter={setActiveCenter}
        onNavigateHome={() => setActiveView(defaultHomeView)}
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
          {safeActiveView.toUpperCase()}
        </span>
      </div>

      <div className="flex-1 flex">
        {/* Dark Left Sidebar */}
        <Sidebar
          activeView={safeActiveView}
          setActiveView={setActiveView}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          userRole={currentUser.rol}
          counts={{
            appointments: visibleAppointments.length,
            surgeries: visibleSurgeries.filter(s => s.estado !== 'Alta').length,
            emergencies: visibleEmergencies.filter(e => e.estado !== 'Estabilizado / Alta').length,
            opticaOrders: activeOrdersCount
          }}
        />

        {/* Central Workspace Area */}
        <main className="flex-1 md:ml-16 lg:ml-20 overflow-x-hidden min-h-[calc(100vh-4rem)] pb-12">
          
          {/* Main Dashboard (Administrador & Doctor) */}
          {safeActiveView === 'dashboard' && (
            <DashboardGrid
              onNavigate={(view) => setActiveView(view)}
              userRole={currentUser.rol}
              userDisplayName={userDisplayName}
              stats={{
                appointmentsCount: visibleAppointments.length,
                patientsCount: visiblePatients.length,
                activeSurgeries: visibleSurgeries.filter(s => s.estado !== 'Alta').length,
                emergenciesCount: visibleEmergencies.filter(e => e.estado !== 'Estabilizado / Alta').length,
                inventoryLowCount: inventory.filter(i => i.stock <= i.stockMinimo).length,
                opticaOrdersCount: activeOrdersCount
              }}
            />
          )}

          {/* Module: Óptica · Venta de Lentes (Operador & Administrador) */}
          {safeActiveView === 'optica' && (
            <OpticaModule
              frames={opticalFrames}
              orders={opticalOrders}
              patients={patients}
              exams={exams}
              sellerName={userDisplayName}
              canReturnDashboard={currentUser.rol === 'Administrador'}
              onCreateOrder={handleCreateOpticalOrder}
              onUpdateOrderStatus={handleUpdateOpticalOrderStatus}
              onCollectBalance={handleCollectOpticalBalance}
              onUpdateFrameStock={handleUpdateFrameStock}
              onAddFrame={handleAddOpticalFrame}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Citas & Agenda */}
          {safeActiveView === 'appointments' && (
            <AppointmentsModule
              appointments={visibleAppointments}
              patients={visiblePatients}
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
          {safeActiveView === 'patients' && (
            <PatientsModule
              patients={visiblePatients}
              selectedPatient={effectiveSelectedPatient}
              onSelectPatient={setSelectedPatient}
              onOpenNewPatient={() => setShowNewPatientModal(true)}
              onStartConsultation={(p) => {
                setSelectedPatient(p);
                setActiveView('clinical');
              }}
              canStartConsultation={currentUser.rol !== 'Operador'}
              onOpenOptica={() => setActiveView('optica')}
              onBack={() => setActiveView(defaultHomeView)}
            />
          )}

          {/* Module: Consulta Oftalmológica */}
          {safeActiveView === 'clinical' && (
            <ClinicalConsultationModule
              patients={visiblePatients}
              selectedPatient={effectiveSelectedPatient}
              onSelectPatient={setSelectedPatient}
              exams={visibleExams}
              onSaveExam={handleSaveExam}
              onOpenPrescription={(exam) => setPrescriptionExam(exam)}
              onBack={() => setActiveView('dashboard')}
              currentDoctorName={currentDoctorName}
            />
          )}

          {/* Module: Quirófano Ocular */}
          {safeActiveView === 'surgery' && (
            <OperatingTheatreModule
              surgeries={visibleSurgeries}
              patients={visiblePatients}
              onOpenNewSurgery={() => setShowNewSurgeryModal(true)}
              onUpdateSurgeryStatus={handleUpdateSurgeryStatus}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Urgencias Oculares */}
          {safeActiveView === 'emergency' && (
            <EmergencyModule
              emergencies={visibleEmergencies}
              onAddEmergency={handleAddEmergency}
              onUpdateStatus={handleUpdateEmergencyStatus}
              onBack={() => setActiveView('dashboard')}
              currentDoctorName={currentDoctorName}
            />
          )}

          {/* Module: Diagnósticos, OCT & Imágenes */}
          {(safeActiveView === 'laboratory' || safeActiveView === 'imaging') && (
            <DiagnosticsOCTModule
              diagnostics={
                isDoctor
                  ? diagnostics.filter(d => visiblePatients.some(p => p.id === d.pacienteId))
                  : diagnostics
              }
              patients={visiblePatients}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Inventario & Farmacia (Administrador) */}
          {(safeActiveView === 'inventory' || safeActiveView === 'inventory-setup') && (
            <InventoryModule
              inventory={inventory}
              onUpdateStock={handleUpdateInventoryStock}
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: MIS Reports (Administrador) */}
          {safeActiveView === 'reports' && (
            <ReportsModule
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Module: Epicrisis & Plantillas */}
          {(safeActiveView === 'discharge' || safeActiveView === 'templates') && (
            <DischargeTemplatesModule
              onBack={() => setActiveView('dashboard')}
            />
          )}

          {/* Secondary Specialized Ophthalmology Modules */}
          {safeActiveView === 'daycare' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
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

          {safeActiveView === 'procedures' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
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

          {safeActiveView === 'corneabank' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
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

          {safeActiveView === 'insurance' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
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

          {safeActiveView === 'nursing' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
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

          {safeActiveView === 'management' && (
            <div className="p-4 md:p-8 max-w-[1520px] mx-auto space-y-6">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('dashboard')} className="p-2 text-slate-500 hover:text-slate-800 cursor-pointer">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900">Gestión Médica y Configuración del Sistema</h1>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Staff Médico y Roles de Acceso Habilitados</h3>
                <div className="divide-y divide-slate-100">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Carlos Mendoza (Administrador)</span>
                      <span className="text-slate-500 block text-[11px]">Director Administrativo · Control global de clínica, reportes y óptica</span>
                    </div>
                    <span className="font-mono text-xs text-indigo-700 font-bold">Rol: Administrador</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Dr. Gonzalo Huanca</span>
                      <span className="text-slate-500 block text-[11px]">Catarata & Cirugía de Segmento Anterior (Solo su agenda y pacientes)</span>
                    </div>
                    <span className="font-mono text-xs text-sky-700 font-bold">CMP: 49812 · RNE: 24190</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Dra. Sofía Valdés</span>
                      <span className="text-slate-500 block text-[11px]">Refracción, Optometría y Córnea (Solo su agenda y pacientes)</span>
                    </div>
                    <span className="font-mono text-xs text-sky-700 font-bold">CMP: 51204 · RNE: 28410</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Andrea Paredes (Operador)</span>
                      <span className="text-slate-500 block text-[11px]">Óptica Hospitalaria · Venta de lentes, monturas, taller y caja</span>
                    </div>
                    <span className="font-mono text-xs text-teal-700 font-bold">Rol: Operador</span>
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
          patients={visiblePatients}
          onAddAppointment={handleAddAppointment}
          onClose={() => setShowNewAppointmentModal(false)}
          lockedDoctorName={currentDoctorName}
        />
      )}

      {showNewSurgeryModal && (
        <NewSurgeryModal
          patients={visiblePatients}
          onAddSurgery={handleAddSurgery}
          onClose={() => setShowNewSurgeryModal(false)}
          lockedDoctorName={currentDoctorName}
        />
      )}
    </div>
  );
}
