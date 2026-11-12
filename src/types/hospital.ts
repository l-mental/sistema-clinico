export type EyeSide = 'OD' | 'OI' | 'Ambos'; // OD: Ojo Derecho, OI: Ojo Izquierdo

export interface Patient {
  id: string;
  nhc: string; // Número de Historia Clínica
  dni: string;
  nombre: string;
  apellidos: string;
  edad: number;
  sexo: 'M' | 'F';
  telefono: string;
  email: string;
  seguro: string;
  antecedentesOculares: string[];
  antecedentesSistemicos: string[]; // Diabetes, Hipertensión, etc.
  alergias: string[];
  fechaRegistro: string;
  ultimaConsulta?: string;
  diagnosticoPrincipal?: string;
}

export interface Appointment {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  nhc: string;
  fecha: string;
  hora: string;
  tipo: 'Primera Consulta' | 'Control Postoperatorio' | 'Refracción y Agudeza' | 'Fondo de Ojo / Dilatación' | 'OCT / Diagnóstico' | 'Urgencia';
  especialista: string;
  consultorio: string;
  estado: 'En espera' | 'En dilatación' | 'En consulta' | 'Atendido' | 'Cancelado';
  motivo: string;
}

export interface RefractionData {
  esfera: string; // Ej: -2.50, +1.75
  cilindro: string; // Ej: -1.25
  eje: string; // 0 - 180°
  adicion?: string; // Ej: +2.00 para presbicia
  agudezaVisual: string; // Ej: 20/20, 20/40
}

export interface OphthalmologyExam {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  nhc: string;
  fecha: string;
  medico: string;
  
  // Agudeza Visual
  avSinCorreccionOD: string;
  avSinCorreccionOI: string;
  avConCorreccionOD: string;
  avConCorreccionOI: string;
  avEstenopeicoOD: string;
  avEstenopeicoOI: string;

  // Refracción
  refraccionOD: RefractionData;
  refraccionOI: RefractionData;
  distanciaInterpupilar: number; // en mm, ej: 62

  // Tonometría (Presión Intraocular en mmHg)
  pioOD: number; // Ej: 15
  pioOI: number; // Ej: 16
  metodoTonometria: 'Goldmann' | 'Neumotonometría (Aire)' | 'Tonopen / Icare';

  // Lámpara de Hendidura (Biomicroscopía)
  lamparaHendidura: {
    corneaOD: string;
    corneaOI: string;
    camaraAnteriorOD: string;
    camaraAnteriorOI: string;
    cristalinoOD: string;
    cristalinoOI: string;
    irisOD: string;
    irisOI: string;
  };

  // Fondo de Ojo (Retina y Nervio Óptico)
  fondoDeOjo: {
    papilaOD: string; // Excavación, ej: 0.3
    papilaOI: string;
    maculaOD: string;
    maculaOI: string;
    retinaPerifericaOD: string;
    retinaPerifericaOI: string;
  };

  // Diagnóstico y Plan
  diagnosticos: string[];
  cie10: string[];
  planTratamiento: string;
  recetaLentes?: boolean;
  medicamentosPrescritos: {
    nombre: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    ojo: EyeSide;
  }[];
}

export interface SurgeryRecord {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  nhc: string;
  edad: number;
  ojo: EyeSide;
  procedimiento: 'Facoemulsificación + LIO' | 'LASIK Refractivo (Femto)' | 'Vitrectomía Posterior 23G' | 'Pterigión con Autoinjerto' | 'Trabeculectomía Filtrante' | 'Inyección Intravítrea Anti-VEGF';
  cirujano: string;
  anestesiologo: string;
  quirofano: string;
  fechaHora: string;
  estado: 'Programada' | 'En preparación' | 'En quirófano' | 'Recuperación' | 'Alta';
  lenteIntraocular?: {
    marca: string;
    modelo: string;
    poderDioptrico: string; // Ej: +21.5 D
    constanteA: string;
  };
  observaciones: string;
}

export interface InventoryItem {
  id: string;
  codigo: string;
  nombre: string;
  categoria: 'Lentes Intraoculares (LIO)' | 'Colirios & Farmacia' | 'Viscoelásticos & Quirófano' | 'Insumos Descartables' | 'Equipos & Lámparas';
  stock: number;
  stockMinimo: number;
  unidad: string;
  lote: string;
  vencimiento: string;
  ubicacion: string;
  precioUnitario: number;
}

export interface EmergencyCase {
  id: string;
  pacienteNombre: string;
  edad: number;
  triage: 'Rojo - Crítico' | 'Naranja - Urgente' | 'Amarillo - Moderado' | 'Verde - Leve';
  motivo: string;
  ojoAfectado: EyeSide;
  horaIngreso: string;
  estado: 'En Espera' | 'En Atención Médica' | 'En Procedimiento Quirúrgico' | 'Estabilizado / Alta';
  medicoAsignado: string;
  detalles: string;
}

export interface DiagnosticStudy {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  nhc: string;
  tipo: 'OCT Macular / Retina' | 'OCT Nervio Óptico (Fibras RNFL)' | 'Campimetría Computarizada 24-2' | 'Topografía Corneal Pentacam' | 'Biometría IOL Master 700' | 'Ecografía Ocular Modo B';
  ojo: EyeSide;
  fecha: string;
  tecnicoOftalmico: string;
  estado: 'Pendiente' | 'Procesado' | 'Informado por Oftalmólogo';
  hallazgos: string;
  imagenReferencial?: string;
}
