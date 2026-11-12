import { 
  Patient, 
  Appointment, 
  OphthalmologyExam, 
  SurgeryRecord, 
  InventoryItem, 
  EmergencyCase, 
  DiagnosticStudy 
} from '../types/hospital';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-001',
    nhc: 'OFT-10492',
    dni: '45892314',
    nombre: 'Elena',
    apellidos: 'Vargas Mendoza',
    edad: 68,
    sexo: 'F',
    telefono: '+34 612 345 678',
    email: 'elena.vargas@email.com',
    seguro: 'Sanitas Oro',
    antecedentesOculares: ['Catarata senil OD', 'Presbicia'],
    antecedentesSistemicos: ['Hipertensión arterial controlada'],
    alergias: ['Penicilina'],
    fechaRegistro: '2026-08-14',
    ultimaConsulta: '2026-11-10',
    diagnosticoPrincipal: 'H25.1 Catarata senil nuclear incipiente OD'
  },
  {
    id: 'p-002',
    nhc: 'OFT-10493',
    dni: '78239011',
    nombre: 'Carlos',
    apellidos: 'Santillana Ríos',
    edad: 42,
    sexo: 'M',
    telefono: '+34 689 443 219',
    email: 'carlos.santillana@email.com',
    seguro: 'Adeslas Plena',
    antecedentesOculares: ['Astigmatismo miópico bilateral', 'Uso de lentes de contacto'],
    antecedentesSistemicos: ['Ninguno'],
    alergias: ['Ninguna conocida'],
    fechaRegistro: '2026-09-02',
    ultimaConsulta: '2026-11-12',
    diagnosticoPrincipal: 'H52.2 Astigmatismo miópico compuesto'
  },
  {
    id: 'p-003',
    nhc: 'OFT-10494',
    dni: '12458963',
    nombre: 'Margarita',
    apellidos: 'Fernández Alarcón',
    edad: 74,
    sexo: 'F',
    telefono: '+34 671 902 334',
    email: 'margarita.f@email.com',
    seguro: 'Mapfre Salud',
    antecedentesOculares: ['Glaucoma de ángulo abierto bilateral', 'Cirugía de pterigión OI (2020)'],
    antecedentesSistemicos: ['Diabetes Mellitus tipo 2 (HbA1c 6.8%)'],
    alergias: ['Sulfamidas'],
    fechaRegistro: '2025-03-11',
    ultimaConsulta: '2026-11-05',
    diagnosticoPrincipal: 'H40.1 Glaucoma primario de ángulo abierto'
  },
  {
    id: 'p-004',
    nhc: 'OFT-10495',
    dni: '53902188',
    nombre: 'Javier',
    apellidos: 'Gómez Navarro',
    edad: 29,
    sexo: 'M',
    telefono: '+34 655 789 012',
    email: 'javier.gomez@email.com',
    seguro: 'DKV Modular',
    antecedentesOculares: ['Miopía moderada -4.25D', 'Candidato a Cirugía Refractiva LASIK'],
    antecedentesSistemicos: ['Ninguno'],
    alergias: ['AINEs (Ibuprofeno)'],
    fechaRegistro: '2026-10-18',
    ultimaConsulta: '2026-11-11',
    diagnosticoPrincipal: 'H52.1 Miopía axial moderada'
  },
  {
    id: 'p-005',
    nhc: 'OFT-10496',
    dni: '38192837',
    nombre: 'Beatriz',
    apellidos: 'Peralta Silva',
    edad: 55,
    sexo: 'F',
    telefono: '+34 644 112 390',
    email: 'beatriz.peralta@email.com',
    seguro: 'Asisa Salud',
    antecedentesOculares: ['Ojo seco evaporativo', 'Blefaritis crónica'],
    antecedentesSistemicos: ['Hipotiroidismo en tratamiento con Levotiroxina'],
    alergias: ['Ninguna'],
    fechaRegistro: '2026-11-01',
    ultimaConsulta: '2026-11-09',
    diagnosticoPrincipal: 'H04.1 Síndrome de disfunción lagrimal (Ojo Seco)'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    pacienteId: 'p-001',
    pacienteNombre: 'Elena Vargas Mendoza',
    nhc: 'OFT-10492',
    fecha: '2026-11-12',
    hora: '09:00',
    tipo: 'Control Postoperatorio',
    especialista: 'Dr. Gonzalo Huanca',
    consultorio: 'Consultorio 1 - Lámpara de Hendidura',
    estado: 'En consulta',
    motivo: 'Control postoperatorio a las 48h tras facoemulsificación OD + LIO'
  },
  {
    id: 'apt-002',
    pacienteId: 'p-002',
    pacienteNombre: 'Carlos Santillana Ríos',
    nhc: 'OFT-10493',
    fecha: '2026-11-12',
    hora: '09:30',
    tipo: 'Refracción y Agudeza',
    especialista: 'Dra. Sofía Valdés',
    consultorio: 'Consultorio 3 - Gabinete Optométrico',
    estado: 'En dilatación',
    motivo: 'Graduación de gafas por fatiga visual y astenopía en pantalla'
  },
  {
    id: 'apt-003',
    pacienteId: 'p-003',
    pacienteNombre: 'Margarita Fernández Alarcón',
    nhc: 'OFT-10494',
    fecha: '2026-11-12',
    hora: '10:15',
    tipo: 'OCT / Diagnóstico',
    especialista: 'Dr. Gonzalo Huanca',
    consultorio: 'Sala 4 - Unidad de Imagen Diagnóstica',
    estado: 'En espera',
    motivo: 'Seguimiento de presión intraocular y revisión de campimetría'
  },
  {
    id: 'apt-004',
    pacienteId: 'p-004',
    pacienteNombre: 'Javier Gómez Navarro',
    nhc: 'OFT-10495',
    fecha: '2026-11-12',
    hora: '11:00',
    tipo: 'Primera Consulta',
    especialista: 'Dr. Roberto Méndez',
    consultorio: 'Consultorio 2 - Unidad Refractiva',
    estado: 'En espera',
    motivo: 'Evaluación prequirúrgica para Cirugía Refractiva Láser (Femto-LASIK)'
  },
  {
    id: 'apt-005',
    pacienteId: 'p-005',
    pacienteNombre: 'Beatriz Peralta Silva',
    nhc: 'OFT-10496',
    fecha: '2026-11-12',
    hora: '11:45',
    tipo: 'Fondo de Ojo / Dilatación',
    especialista: 'Dra. Carmen Morales',
    consultorio: 'Consultorio 1 - Lámpara de Hendidura',
    estado: 'En espera',
    motivo: 'Revisión de superficie ocular y test de Schirmer'
  }
];

export const INITIAL_EXAMS: OphthalmologyExam[] = [
  {
    id: 'ex-001',
    pacienteId: 'p-001',
    pacienteNombre: 'Elena Vargas Mendoza',
    nhc: 'OFT-10492',
    fecha: '2026-11-10',
    medico: 'Dr. Gonzalo Huanca',
    avSinCorreccionOD: '20/200',
    avSinCorreccionOI: '20/40',
    avConCorreccionOD: '20/25',
    avConCorreccionOI: '20/20',
    avEstenopeicoOD: '20/25',
    avEstenopeicoOI: '20/20',
    refraccionOD: {
      esfera: '+2.50',
      cilindro: '-0.75',
      eje: '85',
      adicion: '+2.50',
      agudezaVisual: '20/25'
    },
    refraccionOI: {
      esfera: '+1.50',
      cilindro: '-0.50',
      eje: '90',
      adicion: '+2.50',
      agudezaVisual: '20/20'
    },
    distanciaInterpupilar: 62,
    pioOD: 15,
    pioOI: 14,
    metodoTonometria: 'Goldmann',
    lamparaHendidura: {
      corneaOD: 'Transparente, sin edema ni queratopatía',
      corneaOI: 'Transparente',
      camaraAnteriorOD: 'Profunda, Van Herick IV, Tyndall negativo',
      camaraAnteriorOI: 'Profunda, Tyndall 0',
      cristalinoOD: 'Opacidad nuclear moderada (Catarata N2C1)',
      cristalinoOI: 'Esclerosis nuclear fisiológica para la edad',
      irisOD: 'Normorreactivo, pupila central, buena dilatación farmacológica',
      irisOI: 'Isocórico, normorreactivo'
    },
    fondoDeOjo: {
      papilaOD: 'Nervio óptico rosado, excavación fisiológica 0.3, bordes netos',
      papilaOI: 'Papila rosada, bordes definidos, E/P 0.3',
      maculaOD: 'Brillo foveolar presente, sin drusas ni exudados',
      maculaOI: 'Normal, reflejo foveolar presente',
      retinaPerifericaOD: 'Retina aplicada en 360°, sin desgarros ni hemorragias',
      retinaPerifericaOI: 'Retina aplicada en 360°'
    },
    diagnosticos: ['Catarata senil nuclear OD', 'Presbicia bilateral'],
    cie10: ['H25.1', 'H52.4'],
    planTratamiento: 'Se programa para facoemulsificación OD con implante de LIO plegable asférico mono focal.',
    recetaLentes: true,
    medicamentosPrescritos: [
      {
        nombre: 'Moxifloxacino 0.5% (Vigamox)',
        dosis: '1 gota',
        frecuencia: 'Cada 8 horas',
        duracion: '7 días previos a cirugía',
        ojo: 'OD'
      },
      {
        nombre: 'Prednisolona acetato 1% (Prednefrin)',
        dosis: '1 gota',
        frecuencia: 'Cada 6 horas',
        duracion: 'Postoperatorio',
        ojo: 'OD'
      }
    ]
  }
];

export const INITIAL_SURGERIES: SurgeryRecord[] = [
  {
    id: 'srg-001',
    pacienteId: 'p-001',
    pacienteNombre: 'Elena Vargas Mendoza',
    nhc: 'OFT-10492',
    edad: 68,
    ojo: 'OD',
    procedimiento: 'Facoemulsificación + LIO',
    cirujano: 'Dr. Gonzalo Huanca',
    anestesiologo: 'Dra. M. Arévalo',
    quirofano: 'Quirófano Oftalmológico 1 (Microscopio Lumera 700)',
    fechaHora: '2026-11-12 12:30',
    estado: 'En preparación',
    lenteIntraocular: {
      marca: 'Alcon AcrySof IQ',
      modelo: 'SN60WF',
      poderDioptrico: '+21.5 D',
      constanteA: '118.7'
    },
    observaciones: 'Pupila dilata > 7mm. Incisión temporal en córnea clara 2.2mm.'
  },
  {
    id: 'srg-002',
    pacienteId: 'p-004',
    pacienteNombre: 'Javier Gómez Navarro',
    nhc: 'OFT-10495',
    edad: 29,
    ojo: 'Ambos',
    procedimiento: 'LASIK Refractivo (Femto)',
    cirujano: 'Dr. Roberto Méndez',
    anestesiologo: 'Tópica (Dra. M. Arévalo supervisión)',
    quirofano: 'Sala Quirófano Láser Femtosegundo',
    fechaHora: '2026-11-12 14:00',
    estado: 'Programada',
    observaciones: 'Ablación miópica calculada OD: -4.25D, OI: -4.00D. Flap de 110 micras.'
  },
  {
    id: 'srg-003',
    pacienteId: 'p-003',
    pacienteNombre: 'Margarita Fernández Alarcón',
    nhc: 'OFT-10494',
    edad: 74,
    ojo: 'OI',
    procedimiento: 'Trabeculectomía Filtrante',
    cirujano: 'Dr. Gonzalo Huanca',
    anestesiologo: 'Dra. M. Arévalo',
    quirofano: 'Quirófano Oftalmológico 2',
    fechaHora: '2026-11-13 08:30',
    estado: 'Programada',
    observaciones: 'Uso de Mitomicina C al 0.02% durante 2 minutos subconjuntival.'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-001',
    codigo: 'LIO-ALC-215',
    nombre: 'Lente Intraocular Plegable Alcon AcrySof IQ +21.5D',
    categoria: 'Lentes Intraoculares (LIO)',
    stock: 14,
    stockMinimo: 5,
    unidad: 'Unidad',
    lote: 'L-202688',
    vencimiento: '2029-05-30',
    ubicacion: 'Quirófano 1 - Vitrina Fría LIOs',
    precioUnitario: 320.00
  },
  {
    id: 'inv-002',
    codigo: 'LIO-ALC-220',
    nombre: 'Lente Intraocular Plegable Alcon AcrySof IQ +22.0D',
    categoria: 'Lentes Intraoculares (LIO)',
    stock: 18,
    stockMinimo: 5,
    unidad: 'Unidad',
    lote: 'L-202691',
    vencimiento: '2029-07-15',
    ubicacion: 'Quirófano 1 - Vitrina Fría LIOs',
    precioUnitario: 320.00
  },
  {
    id: 'inv-003',
    codigo: 'LIO-TOR-205',
    nombre: 'LIO Tórico Zeiss AT LISA Tri Toric +20.5D Cil 2.0',
    categoria: 'Lentes Intraoculares (LIO)',
    stock: 3,
    stockMinimo: 2,
    unidad: 'Unidad',
    lote: 'ZT-9941',
    vencimiento: '2028-11-10',
    ubicacion: 'Vitrina Alta Especialidad',
    precioUnitario: 890.00
  },
  {
    id: 'inv-004',
    codigo: 'MED-VIG-005',
    nombre: 'Moxifloxacino Oftálmico 0.5% (Vigamox) 5ml',
    categoria: 'Colirios & Farmacia',
    stock: 45,
    stockMinimo: 15,
    unidad: 'Frasco Gotero',
    lote: 'M-44102',
    vencimiento: '2027-09-01',
    ubicacion: 'Farmacia Hospitalaria - Estante A1',
    precioUnitario: 24.50
  },
  {
    id: 'inv-005',
    codigo: 'MED-PRE-010',
    nombre: 'Prednisolona Acetato 1% Colirio 5ml',
    categoria: 'Colirios & Farmacia',
    stock: 38,
    stockMinimo: 12,
    unidad: 'Frasco Gotero',
    lote: 'P-88319',
    vencimiento: '2027-12-10',
    ubicacion: 'Farmacia Hospitalaria - Estante A2',
    precioUnitario: 18.20
  },
  {
    id: 'inv-006',
    codigo: 'MED-TIM-005',
    nombre: 'Timolol 0.5% Solución Oftálmica 5ml',
    categoria: 'Colirios & Farmacia',
    stock: 29,
    stockMinimo: 10,
    unidad: 'Frasco',
    lote: 'T-55201',
    vencimiento: '2028-03-20',
    ubicacion: 'Farmacia Hospitalaria - Estante A3',
    precioUnitario: 14.00
  },
  {
    id: 'inv-007',
    codigo: 'VIS-HEA-GV',
    nombre: 'Viscoelástico Healon GV Hialuronato Sódico 1.8%',
    categoria: 'Viscoelásticos & Quirófano',
    stock: 22,
    stockMinimo: 8,
    unidad: 'Jeringa Precargada',
    lote: 'HGV-1092',
    vencimiento: '2028-06-30',
    ubicacion: 'Quirófano - Nevera Insumos 4°C',
    precioUnitario: 85.00
  },
  {
    id: 'inv-008',
    codigo: 'COL-TRO-01',
    nombre: 'Tropicamida + Fenilefrina (Midriáticos Dilatación)',
    categoria: 'Colirios & Farmacia',
    stock: 50,
    stockMinimo: 20,
    unidad: 'Frasco',
    lote: 'TF-6632',
    vencimiento: '2027-10-15',
    ubicacion: 'Gabinete Triaje & Consultorios',
    precioUnitario: 16.50
  }
];

export const INITIAL_EMERGENCIES: EmergencyCase[] = [
  {
    id: 'emg-001',
    pacienteNombre: 'Mateo Morales Castro',
    edad: 34,
    triage: 'Rojo - Crítico',
    motivo: 'Quemadura química ocular por salpicadura de sosa cáustica (álcali)',
    ojoAfectado: 'OD',
    horaIngreso: '08:40',
    estado: 'En Atención Médica',
    medicoAsignado: 'Dr. Gonzalo Huanca',
    detalles: 'Lavado profuso de superficie con Ringer Lactato en curso. Medición de pH conjuntival: 8.5. Isquemia limbar < 1/3.'
  },
  {
    id: 'emg-002',
    pacienteNombre: 'Rosa Gil Carrasco',
    edad: 61,
    triage: 'Naranja - Urgente',
    motivo: 'Sospecha de Glaucoma Agudo de Ángulo Cerrado (Dolor periorbitario + halo coloreado)',
    ojoAfectado: 'OI',
    horaIngreso: '09:15',
    estado: 'En Espera',
    medicoAsignado: 'Dra. Carmen Morales',
    detalles: 'PIO OI: 48 mmHg a la palpación. Pupila en midriasis media fija. Náuseas y cefalea hemicraneal.'
  },
  {
    id: 'emg-003',
    pacienteNombre: 'Andrés Luján Ramos',
    edad: 26,
    triage: 'Amarillo - Moderado',
    motivo: 'Cuerpo extraño corneal metálico tras esmerilar sin gafas protectoras',
    ojoAfectado: 'OD',
    horaIngreso: '09:40',
    estado: 'En Espera',
    medicoAsignado: 'Dr. Roberto Méndez',
    detalles: 'Fotofobia y epífora. Proyectil visible en estroma anterior con anillo de óxido superficial.'
  }
];

export const INITIAL_DIAGNOSTICS: DiagnosticStudy[] = [
  {
    id: 'diag-001',
    pacienteId: 'p-001',
    pacienteNombre: 'Elena Vargas Mendoza',
    nhc: 'OFT-10492',
    tipo: 'Biometría IOL Master 700',
    ojo: 'OD',
    fecha: '2026-11-08',
    tecnicoOftalmico: 'Tec. Lucía Benítez',
    estado: 'Informado por Oftalmólogo',
    hallazgos: 'Longitud axial: 23.45 mm. Queratometría K1: 43.50D @ 90°, K2: 44.25D @ 180°. Profundidad de cámara anterior: 3.22 mm. Potencia de LIO recomendada emetropía (+21.50 D, fórmula Barrett Universal II).'
  },
  {
    id: 'diag-002',
    pacienteId: 'p-003',
    pacienteNombre: 'Margarita Fernández Alarcón',
    nhc: 'OFT-10494',
    tipo: 'OCT Nervio Óptico (Fibras RNFL)',
    ojo: 'Ambos',
    fecha: '2026-11-05',
    tecnicoOftalmico: 'Tec. Lucía Benítez',
    estado: 'Informado por Oftalmólogo',
    hallazgos: 'Adelgazamiento del grosor de la capa de fibras nerviosas de la retina (RNFL) en sector inferotemporal de ambos ojos, compatible con neuropatía glaucomatosa incipiente/moderada.'
  },
  {
    id: 'diag-003',
    pacienteId: 'p-004',
    pacienteNombre: 'Javier Gómez Navarro',
    nhc: 'OFT-10495',
    tipo: 'Topografía Corneal Pentacam',
    ojo: 'Ambos',
    fecha: '2026-11-10',
    tecnicoOftalmico: 'Tec. Marcos Silva',
    estado: 'Informado por Oftalmólogo',
    hallazgos: 'Astigmatismo regular con la regla en OD y OI. Elevación anterior y posterior dentro de rangos normales. Paquimetría en punto más delgado: OD 548 μm, OI 552 μm. Apto para ablación Femto-LASIK.'
  }
];

// LocalStorage helpers for full state persistence
export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`ehospital_${key}`);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`ehospital_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}
