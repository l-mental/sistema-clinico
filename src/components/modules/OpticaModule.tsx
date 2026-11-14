import React, { useState } from 'react';
import {
  OpticalFrame,
  OpticalSaleOrder,
  OpticalOrderStatus,
  Patient,
  OphthalmologyExam
} from '../../types/hospital';
import {
  Glasses,
  ArrowLeft,
  ShoppingBag,
  ClipboardList,
  Package,
  DollarSign,
  Search,
  Plus,
  Minus,
  Printer,
  CheckCircle2,
  FileText,
  Sparkles,
  UserCheck,
  AlertTriangle,
  X,
  CreditCard,
  Clock
} from 'lucide-react';

interface OpticaModuleProps {
  frames: OpticalFrame[];
  orders: OpticalSaleOrder[];
  patients: Patient[];
  exams: OphthalmologyExam[];
  sellerName: string;
  canReturnDashboard: boolean;
  onCreateOrder: (order: OpticalSaleOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: OpticalOrderStatus) => void;
  onCollectBalance: (orderId: string) => void;
  onUpdateFrameStock: (frameId: string, delta: number) => void;
  onAddFrame: (frame: OpticalFrame) => void;
  onBack: () => void;
}

type OpticaTab = 'pos' | 'orders' | 'catalog' | 'cashbox';

const LENS_TYPES: { label: OpticalSaleOrder['tipoLuna']; basePrice: number; desc: string }[] = [
  { label: 'Monofocal', basePrice: 45, desc: 'Visión de lejos o lectura (1 foco)' },
  { label: 'Bifocal Invisible / Flap-Top', basePrice: 95, desc: 'Lejos y cerca en un mismo lente' },
  { label: 'Progresivo Digital HD', basePrice: 185, desc: 'Transición continua todas las distancias' }
];

const LENS_MATERIALS: { label: OpticalSaleOrder['materialLuna']; extraPrice: number }[] = [
  { label: 'CR-39 Orgánico', extraPrice: 0 },
  { label: 'Policarbonato Irrompible', extraPrice: 30 },
  { label: 'Alto Índice 1.67', extraPrice: 65 },
  { label: 'Ultra Delgado 1.74', extraPrice: 115 }
];

const LENS_TREATMENTS: { label: string; extraPrice: number }[] = [
  { label: 'Antirreflejante AR', extraPrice: 20 },
  { label: 'Filtro Luz Azul', extraPrice: 25 },
  { label: 'Fotocromático Transitions', extraPrice: 75 },
  { label: 'Polarizado UV400', extraPrice: 60 },
  { label: 'Tratamiento Hidrofóbico Anti-rayas', extraPrice: 15 }
];

export const OpticaModule: React.FC<OpticaModuleProps> = ({
  frames,
  orders,
  patients,
  exams,
  sellerName,
  canReturnDashboard,
  onCreateOrder,
  onUpdateOrderStatus,
  onCollectBalance,
  onUpdateFrameStock,
  onAddFrame,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<OpticaTab>('pos');

  // POS State
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteDni, setClienteDni] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');
  const [medicoPrescriptor, setMedicoPrescriptor] = useState('');

  // Optical Formula State
  const [odEsf, setOdEsf] = useState('-1.25');
  const [odCil, setOdCil] = useState('-0.50');
  const [odEje, setOdEje] = useState('90');
  const [odAdd, setOdAdd] = useState('');

  const [oiEsf, setOiEsf] = useState('-1.00');
  const [oiCil, setOiCil] = useState('-0.50');
  const [oiEje, setOiEje] = useState('85');
  const [oiAdd, setOiAdd] = useState('');
  const [dip, setDip] = useState<number>(62);

  // Frame & Lens Selection
  const [frameSearch, setFrameSearch] = useState('');
  const [frameCategoryFilter, setFrameCategoryFilter] = useState<string>('todos');
  const [selectedFrameId, setSelectedFrameId] = useState<string>(frames[0]?.id || '');
  const [tipoLuna, setTipoLuna] = useState<OpticalSaleOrder['tipoLuna']>('Monofocal');
  const [materialLuna, setMaterialLuna] = useState<OpticalSaleOrder['materialLuna']>('Policarbonato Irrompible');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>(['Antirreflejante AR', 'Filtro Luz Azul']);

  // Billing State
  const [descuento, setDescuento] = useState<number>(0);
  const [acuenta, setAcuenta] = useState<number>(0);
  const [acuentaTouched, setAcuentaTouched] = useState(false);
  const [metodoPago, setMetodoPago] = useState<OpticalSaleOrder['metodoPago']>('Efectivo');
  const [fechaEntrega, setFechaEntrega] = useState('2026-11-16');
  const [notas, setNotas] = useState('');

  // Orders & Catalog Search State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('todos');
  const [catalogSearch, setCatalogSearch] = useState('');

  // Printable Order Ticket Modal
  const [ticketOrder, setTicketOrder] = useState<OpticalSaleOrder | null>(null);
  const [saleBanner, setSaleBanner] = useState<string>('');

  // New Frame Modal
  const [showNewFrameModal, setShowNewFrameModal] = useState(false);
  const [newMarca, setNewMarca] = useState('');
  const [newModelo, setNewModelo] = useState('');
  const [newCategoria, setNewCategoria] = useState<OpticalFrame['categoria']>('Oftálmico Clásico');
  const [newColor, setNewColor] = useState('');
  const [newMedidas, setNewMedidas] = useState('52-18-140');
  const [newPrecio, setNewPrecio] = useState(95);
  const [newStock, setNewStock] = useState(6);

  const selectedFrame = frames.find(f => f.id === selectedFrameId);

  // Calculate Pricing
  const baseLensPrice = LENS_TYPES.find(t => t.label === tipoLuna)?.basePrice || 0;
  const materialExtra = LENS_MATERIALS.find(m => m.label === materialLuna)?.extraPrice || 0;
  const treatmentsExtra = selectedTreatments.reduce((acc, tr) => {
    const found = LENS_TREATMENTS.find(item => item.label === tr);
    return acc + (found?.extraPrice || 0);
  }, 0);
  const precioLunas = baseLensPrice + materialExtra + treatmentsExtra;
  const precioMontura = selectedFrame?.precio || 0;
  const subtotal = precioMontura + precioLunas;
  const total = Math.max(0, subtotal - descuento);
  const effectiveAcuenta = acuentaTouched ? Math.min(total, Math.max(0, acuenta)) : total;
  const saldo = Math.max(0, total - effectiveAcuenta);

  const handleImportPatientOrExam = (patientId: string) => {
    setSelectedPatientId(patientId);
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    setClienteNombre(`${patient.nombre} ${patient.apellidos}`);
    setClienteDni(patient.dni);
    setClienteTelefono(patient.telefono);

    // Look for latest ophthalmology exam with refraction
    const patientExam = exams.find(e => e.pacienteId === patient.id);
    if (patientExam) {
      setMedicoPrescriptor(patientExam.medico);
      setOdEsf(patientExam.refraccionOD.esfera);
      setOdCil(patientExam.refraccionOD.cilindro);
      setOdEje(patientExam.refraccionOD.eje);
      setOdAdd(patientExam.refraccionOD.adicion || '');

      setOiEsf(patientExam.refraccionOI.esfera);
      setOiCil(patientExam.refraccionOI.cilindro);
      setOiEje(patientExam.refraccionOI.eje);
      setOiAdd(patientExam.refraccionOI.adicion || '');
      setDip(patientExam.distanciaInterpupilar);

      if (patientExam.refraccionOD.adicion || patientExam.refraccionOI.adicion) {
        setTipoLuna('Progresivo Digital HD');
      }
    } else {
      setMedicoPrescriptor('Evaluación Optométrica en Óptica');
    }
  };

  const toggleTreatment = (label: string) => {
    setSelectedTreatments(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNombre.trim() || !selectedFrame) return;

    const now = new Date();
    const orderNum = `OPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: OpticalSaleOrder = {
      id: `opt-${Date.now()}`,
      numeroOrden: orderNum,
      fecha: now.toISOString().split('T')[0],
      hora: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vendedor: sellerName,
      pacienteId: selectedPatientId || undefined,
      clienteNombre: clienteNombre.trim(),
      clienteDni: clienteDni.trim() || 'S/D',
      clienteTelefono: clienteTelefono.trim() || 'Sin teléfono',
      medicoPrescriptor: medicoPrescriptor || 'Receta Externa / Óptica',
      graduacionOD: { esfera: odEsf, cilindro: odCil, eje: odEje, adicion: odAdd || undefined },
      graduacionOI: { esfera: oiEsf, cilindro: oiCil, eje: oiEje, adicion: oiAdd || undefined },
      dip,
      monturaId: selectedFrame.id,
      monturaNombre: `${selectedFrame.marca} ${selectedFrame.modelo} (${selectedFrame.color})`,
      monturaPrecio: selectedFrame.precio,
      tipoLuna,
      materialLuna,
      tratamientos: selectedTreatments,
      precioLunas,
      descuento,
      total,
      acuenta: effectiveAcuenta,
      saldo,
      metodoPago,
      estado: 'En Laboratorio',
      fechaEntregaEstimada: fechaEntrega,
      notas: notas.trim() || undefined
    };

    onCreateOrder(newOrder);
    setTicketOrder(newOrder);
    setSaleBanner(`Orden ${orderNum} registrada exitosamente.`);
    setTimeout(() => setSaleBanner(''), 4000);

    // Reset client fields for next sale
    setSelectedPatientId('');
    setClienteNombre('');
    setClienteDni('');
    setClienteTelefono('');
    setNotas('');
    setDescuento(0);
    setAcuentaTouched(false);
  };

  const handleCreateNewFrame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarca.trim() || !newModelo.trim()) return;

    const frame: OpticalFrame = {
      id: `frm-${Date.now()}`,
      codigo: `MON-${newMarca.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 899)}`,
      marca: newMarca.trim(),
      modelo: newModelo.trim(),
      categoria: newCategoria,
      color: newColor.trim() || 'Negro',
      medidas: newMedidas.trim() || '52-18-140',
      precio: Number(newPrecio),
      stock: Number(newStock),
      stockMinimo: 3
    };

    onAddFrame(frame);
    setShowNewFrameModal(false);
    setNewMarca('');
    setNewModelo('');
    setNewColor('');
  };

  // Filtered Lists
  const filteredFramesPOS = frames.filter(f => {
    const matchesCat = frameCategoryFilter === 'todos' || f.categoria === frameCategoryFilter;
    const matchesSearch =
      f.marca.toLowerCase().includes(frameSearch.toLowerCase()) ||
      f.modelo.toLowerCase().includes(frameSearch.toLowerCase()) ||
      f.codigo.toLowerCase().includes(frameSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'todos' || o.estado === orderStatusFilter;
    const matchesSearch =
      o.clienteNombre.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.numeroOrden.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.clienteDni.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredCatalog = frames.filter(f =>
    f.marca.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    f.modelo.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    f.codigo.toLowerCase().includes(catalogSearch.toLowerCase()) ||
    f.categoria.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  // Cashbox Metrics
  const totalSalesAmount = orders.reduce((acc, o) => acc + o.total, 0);
  const totalCollected = orders.reduce((acc, o) => acc + o.acuenta, 0);
  const totalPendingBalance = orders.reduce((acc, o) => acc + o.saldo, 0);
  const readyForDeliveryCount = orders.filter(o => o.estado === 'Listo para Entrega').length;

  const getStatusStyle = (status: OpticalOrderStatus) => {
    switch (status) {
      case 'En Laboratorio':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'En Biselado / Montaje':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Listo para Entrega':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Entregado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1520px] mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          {canReturnDashboard && (
            <button
              onClick={onBack}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Volver al Menú Principal"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-sky-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 shrink-0">
            <Glasses className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">
                Óptica Hospitalaria
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Operador: {sellerName}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Óptica · Venta de Lentes, Monturas y Taller
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'pos' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Nueva Venta (POS)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Órdenes de Taller ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'catalog' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Monturas ({frames.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cashbox')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'cashbox' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Caja & Ventas</span>
          </button>
        </div>
      </div>

      {saleBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saleBanner}</span>
          </div>
          <button onClick={() => setActiveTab('orders')} className="underline text-emerald-700 cursor-pointer">
            Ver en Órdenes de Taller
          </button>
        </div>
      )}

      {/* TAB 1: POS - NUEVA VENTA DE LENTES */}
      {activeTab === 'pos' && (
        <form onSubmit={handleConfirmSale} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Client, Prescription, Frame & Lens Configuration */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Datos del Cliente / Importar Receta del Oftalmólogo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-black text-slate-900">
                    1. Cliente y Receta Oftalmológica
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Importe la graduación directa de consulta médica o ingrese un cliente externo.
                  </p>
                </div>

                {/* Quick Import from Hospital Patients/Exams */}
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <select
                    value={selectedPatientId}
                    onChange={(e) => handleImportPatientOrExam(e.target.value)}
                    className="text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-200 rounded-lg px-2.5 py-1.5 cursor-pointer"
                  >
                    <option value="">Importar Receta de Paciente...</option>
                    {patients.map(p => {
                      const hasExam = exams.some(ex => ex.pacienteId === p.id);
                      return (
                        <option key={p.id} value={p.id}>
                          {p.nombre} {p.apellidos} ({p.nhc}) {hasExam ? '★ Con Receta' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Nombre y apellidos del cliente"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">DNI / Documento</label>
                  <input
                    type="text"
                    value={clienteDni}
                    onChange={(e) => setClienteDni(e.target.value)}
                    placeholder="Ej: 45892314"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={clienteTelefono}
                    onChange={(e) => setClienteTelefono(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Formula Optical Grid */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 uppercase tracking-wider">
                    Fórmula Óptica (Graduación)
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">
                      Prescriptor:{' '}
                      <input
                        type="text"
                        value={medicoPrescriptor}
                        onChange={(e) => setMedicoPrescriptor(e.target.value)}
                        placeholder="Dr. / Receta externa"
                        className="px-2 py-0.5 border border-slate-200 rounded-md text-xs font-medium w-40"
                      />
                    </span>
                    <span className="text-[11px] font-bold text-slate-700">
                      DIP:{' '}
                      <input
                        type="number"
                        value={dip}
                        onChange={(e) => setDip(Number(e.target.value))}
                        className="w-12 px-1 py-0.5 border border-slate-300 rounded-md text-center font-mono"
                      />{' '}
                      mm
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* OD */}
                  <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-xl">
                    <div className="font-bold text-sky-900 mb-2">OJO DERECHO (OD)</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Esfera</label>
                        <input type="text" value={odEsf} onChange={e => setOdEsf(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Cilindro</label>
                        <input type="text" value={odCil} onChange={e => setOdCil(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Eje (°)</label>
                        <input type="text" value={odEje} onChange={e => setOdEje(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Adición</label>
                        <input type="text" value={odAdd} onChange={e => setOdAdd(e.target.value)} placeholder="-" className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                    </div>
                  </div>

                  {/* OI */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                    <div className="font-bold text-indigo-900 mb-2">OJO IZQUIERDO (OI)</div>
                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Esfera</label>
                        <input type="text" value={oiEsf} onChange={e => setOiEsf(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Cilindro</label>
                        <input type="text" value={oiCil} onChange={e => setOiCil(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Eje (°)</label>
                        <input type="text" value={oiEje} onChange={e => setOiEje(e.target.value)} className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block">Adición</label>
                        <input type="text" value={oiAdd} onChange={e => setOiAdd(e.target.value)} placeholder="-" className="w-full px-2 py-1 bg-white border border-slate-200 rounded-md font-mono" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Selección de Montura / Armazón */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-black text-slate-900">2. Selección de Montura / Armazón</h2>
                  <p className="text-[11px] text-slate-500">Descuenta stock automáticamente al confirmar la venta.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={frameSearch}
                      onChange={(e) => setFrameSearch(e.target.value)}
                      placeholder="Buscar marca o modelo..."
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-44"
                    />
                  </div>
                  <select
                    value={frameCategoryFilter}
                    onChange={(e) => setFrameCategoryFilter(e.target.value)}
                    className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  >
                    <option value="todos">Todas las Líneas</option>
                    <option value="Oftálmico Clásico">Oftálmico Clásico</option>
                    <option value="Titanio / Ultraligero">Titanio / Ultraligero</option>
                    <option value="Acetato Premium">Acetato Premium</option>
                    <option value="Pediátrico">Pediátrico</option>
                    <option value="Solar Graduable">Solar Graduable</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                {filteredFramesPOS.map(frame => {
                  const isSelected = frame.id === selectedFrameId;
                  const outOfStock = frame.stock <= 0;
                  return (
                    <button
                      type="button"
                      key={frame.id}
                      disabled={outOfStock}
                      onClick={() => setSelectedFrameId(frame.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20'
                          : outOfStock
                            ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-slate-400">{frame.codigo}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                            frame.stock <= frame.stockMinimo ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            Stock: {frame.stock}
                          </span>
                        </div>
                        <div className="text-xs font-black text-slate-900 mt-1">{frame.marca}</div>
                        <div className="text-[11px] font-medium text-slate-700 line-clamp-1">{frame.modelo}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{frame.color} · {frame.medidas}</div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">{frame.categoria}</span>
                        <span className="text-sm font-black font-mono text-teal-700">${frame.precio.toFixed(2)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Selección de Lunas / Cristales y Tratamientos */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="text-sm font-black text-slate-900">3. Diseño de Lunas (Cristales) y Tratamientos</h2>
                <p className="text-[11px] text-slate-500">Configure el diseño óptico, material e índice de refracción.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {LENS_TYPES.map(lt => (
                  <button
                    type="button"
                    key={lt.label}
                    onClick={() => setTipoLuna(lt.label)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tipoLuna === lt.label
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{lt.label}</span>
                      <span className="text-xs font-mono font-bold text-sky-700">${lt.basePrice}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{lt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Material / Índice de Refracción</label>
                  <div className="space-y-1.5">
                    {LENS_MATERIALS.map(mat => (
                      <button
                        type="button"
                        key={mat.label}
                        onClick={() => setMaterialLuna(mat.label)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                          materialLuna === mat.label
                            ? 'bg-teal-50 border-teal-500 font-bold text-teal-900'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{mat.label}</span>
                        <span className="font-mono">+${mat.extraPrice}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Tratamientos y Filtros</label>
                  <div className="space-y-1.5">
                    {LENS_TREATMENTS.map(tr => {
                      const active = selectedTreatments.includes(tr.label);
                      return (
                        <button
                          type="button"
                          key={tr.label}
                          onClick={() => toggleTreatment(tr.label)}
                          className={`w-full px-3 py-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer ${
                            active
                              ? 'bg-indigo-50 border-indigo-500 font-bold text-indigo-900'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                              active ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                            }`}>
                              {active && '✓'}
                            </span>
                            {tr.label}
                          </span>
                          <span className="font-mono">+${tr.extraPrice}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Sticky Order Summary & Payment Box */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-md sticky top-20 space-y-4">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">Resumen de Venta Óptica</h3>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-teal-50 text-teal-800 rounded-md">
                  POS Óptica
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Montura Seleccionada</div>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {selectedFrame ? `${selectedFrame.marca} ${selectedFrame.modelo}` : 'Sin montura'}
                  </div>
                  <div className="flex justify-between mt-1 text-slate-500">
                    <span>{selectedFrame?.color}</span>
                    <span className="font-mono font-bold text-slate-900">${precioMontura.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Lunas y Tratamientos</div>
                  <div className="font-bold text-slate-800 mt-0.5">{tipoLuna} · {materialLuna}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {selectedTreatments.length > 0 ? selectedTreatments.join(', ') : 'Sin tratamientos extra'}
                  </div>
                  <div className="flex justify-end mt-1 font-mono font-bold text-slate-900">
                    ${precioLunas.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Financial Inputs */}
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-mono font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="text-slate-600 font-medium">Descuento ($)</label>
                  <input
                    type="number"
                    min="0"
                    max={subtotal}
                    value={descuento}
                    onChange={(e) => setDescuento(Number(e.target.value))}
                    className="w-24 px-2 py-1 text-right font-mono border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-sm font-black text-slate-900">TOTAL A PAGAR</span>
                  <span className="text-xl font-black font-mono text-teal-700">${total.toFixed(2)}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">A Cuenta / Abono ($)</label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAcuentaTouched(true);
                          setAcuenta(Math.round(total * 0.5));
                        }}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded-sm font-semibold cursor-pointer"
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAcuentaTouched(true);
                          setAcuenta(total);
                        }}
                        className="text-[10px] px-1.5 py-0.5 bg-teal-100 hover:bg-teal-200 text-teal-800 rounded-sm font-semibold cursor-pointer"
                      >
                        100%
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={total}
                    value={effectiveAcuenta}
                    onChange={(e) => {
                      setAcuentaTouched(true);
                      setAcuenta(Number(e.target.value));
                    }}
                    className="w-full px-3 py-2 text-right font-mono font-bold border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900">Saldo Pendiente al Recoger:</span>
                  <span className="font-mono font-black text-amber-900">${saldo.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Método de Pago</label>
                    <select
                      value={metodoPago}
                      onChange={(e: any) => setMetodoPago(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta Crédito/Débito">Tarjeta</option>
                      <option value="Transferencia / Yape / Plin">Transferencia / App</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Entrega Estimada</label>
                    <input
                      type="date"
                      value={fechaEntrega}
                      onChange={(e) => setFechaEntrega(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Notas para Taller / Biselado</label>
                  <input
                    type="text"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej: Altura pupilar 18mm, estuche rígido"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedFrame || !clienteNombre.trim()}
                className="w-full py-3 px-4 text-xs font-black text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-lg shadow-teal-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                Registrar Venta y Enviar a Taller
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: ÓRDENES DE TALLER Y ENTREGAS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Buscar orden por cliente, DNI o N° Orden..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 w-full md:w-auto"
            >
              <option value="todos">Todos los Estados</option>
              <option value="En Laboratorio">En Laboratorio</option>
              <option value="En Biselado / Montaje">En Biselado / Montaje</option>
              <option value="Listo para Entrega">Listo para Entrega</option>
              <option value="Entregado">Entregado</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-slate-900 text-white">
                      {order.numeroOrden}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusStyle(order.estado)}`}>
                      {order.estado}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Entrega: {order.fechaEntregaEstimada}
                    </span>
                  </div>

                  <div className="text-sm font-black text-slate-900">
                    {order.clienteNombre} <span className="text-xs font-normal text-slate-500">· DNI: {order.clienteDni} · {order.clienteTelefono}</span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <strong>Montura:</strong> {order.monturaNombre} · <strong>Lunas:</strong> {order.tipoLuna} ({order.materialLuna})
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span><strong className="text-sky-700">OD:</strong> Esf {order.graduacionOD.esfera} / Cil {order.graduacionOD.cilindro} x {order.graduacionOD.eje}° {order.graduacionOD.adicion ? `Add ${order.graduacionOD.adicion}` : ''}</span>
                    <span className="text-slate-300">|</span>
                    <span><strong className="text-indigo-700">OI:</strong> Esf {order.graduacionOI.esfera} / Cil {order.graduacionOI.cilindro} x {order.graduacionOI.eje}° {order.graduacionOI.adicion ? `Add ${order.graduacionOI.adicion}` : ''}</span>
                    <span className="text-slate-300">|</span>
                    <span><strong>DIP:</strong> {order.dip} mm</span>
                  </div>
                </div>

                {/* Financials & Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2.5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-500">
                      Total: <strong className="font-mono text-slate-900">${order.total.toFixed(2)}</strong> · A cuenta: <strong className="font-mono text-emerald-700">${order.acuenta.toFixed(2)}</strong>
                    </div>
                    {order.saldo > 0 ? (
                      <div className="text-xs font-black text-amber-700 font-mono">
                        Saldo pendiente: ${order.saldo.toFixed(2)}
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-emerald-700">Pagado al 100%</div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {order.saldo > 0 && (
                      <button
                        onClick={() => onCollectBalance(order.id)}
                        className="px-2.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Cobrar Saldo (${order.saldo.toFixed(0)})</span>
                      </button>
                    )}

                    {order.estado === 'En Laboratorio' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'En Biselado / Montaje')}
                        className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer"
                      >
                        Pasar a Montaje
                      </button>
                    )}
                    {order.estado === 'En Biselado / Montaje' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Listo para Entrega')}
                        className="px-2.5 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg cursor-pointer"
                      >
                        Listo para Entrega
                      </button>
                    )}
                    {order.estado === 'Listo para Entrega' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Entregado')}
                        className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
                      >
                        Entregar al Cliente
                      </button>
                    )}

                    <button
                      onClick={() => setTicketOrder(order)}
                      className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE MONTURAS */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Buscar marca, modelo o código..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              onClick={() => setShowNewFrameModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Montura al Catálogo</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Marca y Modelo</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Color / Medidas</th>
                    <th className="py-3 px-4 text-right">Precio PVP</th>
                    <th className="py-3 px-4 text-center">Stock</th>
                    <th className="py-3 px-4 text-right">Ajustar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCatalog.map(frame => {
                    const lowStock = frame.stock <= frame.stockMinimo;
                    return (
                      <tr key={frame.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{frame.codigo}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{frame.marca}</div>
                          <div className="text-[11px] text-slate-500">{frame.modelo}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {frame.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {frame.color} · <span className="font-mono">{frame.medidas}</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-black text-teal-700">
                          ${frame.precio.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-mono font-bold px-2.5 py-0.5 rounded-full ${
                            lowStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {frame.stock} und
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => onUpdateFrameStock(frame.id, -1)}
                              disabled={frame.stock <= 0}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer disabled:opacity-40"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onUpdateFrameStock(frame.id, 1)}
                              className="w-7 h-7 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CAJA & RESUMEN DE VENTAS */}
      {activeTab === 'cashbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Total Facturado en Óptica</span>
              <div className="text-3xl font-black text-slate-900 mt-1 font-mono tabular-nums">${totalSalesAmount.toFixed(2)}</div>
              <span className="text-xs text-slate-500">{orders.length} órdenes registradas</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Ingresos Cobrados (Caja)</span>
              <div className="text-3xl font-black text-emerald-600 mt-1 font-mono tabular-nums">${totalCollected.toFixed(2)}</div>
              <span className="text-xs text-emerald-700">Abonos y pagos al contado</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Saldo por Cobrar (Entregas)</span>
              <div className="text-3xl font-black text-amber-600 mt-1 font-mono tabular-nums">${totalPendingBalance.toFixed(2)}</div>
              <span className="text-xs text-slate-500">Pendiente al retirar lentes</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Lentes Listos para Retiro</span>
              <div className="text-3xl font-black text-sky-700 mt-1 font-mono tabular-nums">{readyForDeliveryCount}</div>
              <span className="text-xs text-sky-600">Esperando al cliente en óptica</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 font-bold text-sm text-slate-900">
              Registro de Transacciones de Óptica
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Orden</th>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Detalle</th>
                    <th className="py-3 px-4">Método Pago</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-right">Cobrado</th>
                    <th className="py-3 px-4 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-800">{o.numeroOrden}</td>
                      <td className="py-3 px-4 text-slate-500">{o.fecha} {o.hora}</td>
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">{o.clienteNombre}</td>
                      <td className="py-3 px-4 font-sans text-slate-600">{o.monturaNombre} · {o.tipoLuna}</td>
                      <td className="py-3 px-4 font-sans text-slate-600">{o.metodoPago}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">${o.total.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">${o.acuenta.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold text-amber-700">${o.saldo.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE OPTICAL ORDER TICKET MODAL */}
      {ticketOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <span className="text-xs font-bold text-slate-700 uppercase">Comprobante de Orden Óptica</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button onClick={() => setTicketOrder(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 p-5 border-2 border-slate-800 rounded-2xl space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-slate-300 pb-3">
                <div>
                  <div className="text-lg font-black text-slate-900">
                    <span className="text-sky-600">e</span>Hospital · Óptica Especializada
                  </div>
                  <div className="text-[11px] text-slate-500">Laboratorio Óptico & Venta de Lentes</div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-black text-slate-900">{ticketOrder.numeroOrden}</div>
                  <div className="text-[11px] text-slate-500">{ticketOrder.fecha} {ticketOrder.hora}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div><span className="text-slate-400 block text-[10px]">CLIENTE</span><strong>{ticketOrder.clienteNombre}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">DNI / TELÉFONO</span><strong>{ticketOrder.clienteDni} · {ticketOrder.clienteTelefono}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">ATENDIDO POR</span><strong>{ticketOrder.vendedor}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">ENTREGA ESTIMADA</span><strong className="text-teal-700">{ticketOrder.fechaEntregaEstimada}</strong></div>
              </div>

              <div>
                <div className="font-bold text-slate-800 uppercase text-[10px] mb-1">Fórmula Aplicada (DIP: {ticketOrder.dip} mm)</div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px] border border-slate-200 p-2.5 rounded-xl">
                  <div><strong>OD:</strong> Esf {ticketOrder.graduacionOD.esfera} · Cil {ticketOrder.graduacionOD.cilindro} · Eje {ticketOrder.graduacionOD.eje}° {ticketOrder.graduacionOD.adicion ? `· Add ${ticketOrder.graduacionOD.adicion}` : ''}</div>
                  <div><strong>OI:</strong> Esf {ticketOrder.graduacionOI.esfera} · Cil {ticketOrder.graduacionOI.cilindro} · Eje {ticketOrder.graduacionOI.eje}° {ticketOrder.graduacionOI.adicion ? `· Add ${ticketOrder.graduacionOI.adicion}` : ''}</div>
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span>Montura: <strong>{ticketOrder.monturaNombre}</strong></span>
                  <span className="font-mono font-bold">${ticketOrder.monturaPrecio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lunas: <strong>{ticketOrder.tipoLuna} ({ticketOrder.materialLuna})</strong></span>
                  <span className="font-mono font-bold">${ticketOrder.precioLunas.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Tratamientos: {ticketOrder.tratamientos.join(', ') || 'Estándar'}
                </div>
                {ticketOrder.descuento > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento aplicado</span>
                    <span className="font-mono">-${ticketOrder.descuento.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-slate-800 pt-3 space-y-1 font-mono">
                <div className="flex justify-between text-sm font-black">
                  <span>TOTAL</span>
                  <span>${ticketOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>A CUENTA ({ticketOrder.metodoPago})</span>
                  <span>${ticketOrder.acuenta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-black">
                  <span>SALDO PENDIENTE AL RECOGER</span>
                  <span>${ticketOrder.saldo.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW FRAME MODAL */}
      {showNewFrameModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Agregar Montura al Catálogo</h3>
              <button onClick={() => setShowNewFrameModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewFrame} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marca *</label>
                  <input type="text" required value={newMarca} onChange={e => setNewMarca(e.target.value)} placeholder="Ej: Armani Exchange" className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modelo *</label>
                  <input type="text" required value={newModelo} onChange={e => setNewModelo(e.target.value)} placeholder="Ej: AX3089" className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                <select value={newCategoria} onChange={(e: any) => setNewCategoria(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl">
                  <option value="Oftálmico Clásico">Oftálmico Clásico</option>
                  <option value="Titanio / Ultraligero">Titanio / Ultraligero</option>
                  <option value="Acetato Premium">Acetato Premium</option>
                  <option value="Pediátrico">Pediátrico</option>
                  <option value="Solar Graduable">Solar Graduable</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color</label>
                  <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} placeholder="Negro Mate" className="w-full px-3 py-2 border border-slate-300 rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medidas</label>
                  <input type="text" value={newMedidas} onChange={e => setNewMedidas(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio PVP ($)</label>
                  <input type="number" min="1" value={newPrecio} onChange={e => setNewPrecio(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Inicial</label>
                  <input type="number" min="1" value={newStock} onChange={e => setNewStock(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowNewFrameModal(false)} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl cursor-pointer">
                  Guardar Montura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
