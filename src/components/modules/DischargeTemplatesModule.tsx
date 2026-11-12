import React, { useState } from 'react';
import { 
  FileCheck2, 
  ArrowLeft, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  ScrollText, 
  Eye, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface DischargeTemplatesModuleProps {
  onBack: () => void;
}

export const DischargeTemplatesModule: React.FC<DischargeTemplatesModuleProps> = ({ onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'faco' | 'lasik' | 'glaucoma'>('faco');

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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                Epicrisis & Documentación
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Resumen de Alta y Consentimientos Informados</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Alta Médica & Plantillas Quirúrgicas Oftalmológicas
            </h1>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-sky-600" />
          <span>Imprimir Plantilla Oficial</span>
        </button>
      </div>

      {/* Template Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/60 rounded-xl max-w-fit">
        <button
          onClick={() => setSelectedTemplate('faco')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedTemplate === 'faco' 
              ? 'bg-white text-slate-900 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Facoemulsificación + LIO (Catarata)
        </button>
        <button
          onClick={() => setSelectedTemplate('lasik')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedTemplate === 'lasik' 
              ? 'bg-white text-slate-900 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cirugía Refractiva Femto-LASIK
        </button>
        <button
          onClick={() => setSelectedTemplate('glaucoma')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            selectedTemplate === 'glaucoma' 
              ? 'bg-white text-slate-900 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cirugía Filtrante (Trabeculectomía)
        </button>
      </div>

      {/* Document Sheet Printable Preview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md max-w-4xl mx-auto space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900 tracking-tight">
                <span className="text-sky-600">e</span>Hospital · Oftalmología
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Centro Oftalmológico Especializado en Microcirugía Ocular
            </p>
          </div>
          <div className="text-right text-xs">
            <div className="font-bold text-slate-800">INFORME DE ALTA MÉDICA</div>
            <div className="text-slate-500 font-mono text-[11px]">EPICRISIS QUIRÚRGICA #2026-991</div>
          </div>
        </div>

        {/* Content based on selected template */}
        {selectedTemplate === 'faco' && (
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
              <h3 className="font-black text-sky-900 text-sm mb-1">
                Procedimiento: Facoemulsificación con Implante de Lente Intraocular (LIO)
              </h3>
              <p className="text-sky-800">
                Cirugía realizada por incisión corneal de 2.2 mm bajo anestesia tópica sin complicaciones. Se implanta LIO monofocal plegable en saco capsular íntegro.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                1. Tratamiento Farmacológico Postoperatorio:
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Moxifloxacino 0.5% (Vigamox):</strong> 1 gota cada 8 horas en el ojo operado durante 10 días.</li>
                <li><strong>Prednisolona acetato 1% (Prednefrin):</strong> 1 gota cada 6 horas en pauta descendente (4 semanas).</li>
                <li><strong>Lágrimas artificiales sin conservantes:</strong> Según necesidad por sensación de arenilla.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                2. Cuidados y Restricciones Físicas:
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uso de protector ocular rígido transparente durante el sueño nocturno por 7 días.</li>
                <li>No frotar ni presionar el ojo bajo ninguna circunstancia.</li>
                <li>Evitar esfuerzos físicos pesados, agacharse bruscamente o levantar más de 5 kg durante 2 semanas.</li>
                <li>No sumergir la cabeza en piscinas, saunas o mar por 1 mes.</li>
              </ul>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
              <h4 className="font-black flex items-center gap-1.5 mb-1 text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Signos de Alarma que Requieren Acudir de Inmediato a Urgencias:
              </h4>
              <p>
                Dolor ocular intenso que no cede con analgésicos habituales, disminución súbita de la agudeza visual, aumento progresivo de enrojecimiento o secreción purulenta abundante.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold block">Próximo Control Oftalmológico:</span>
                <span className="text-slate-600">A las 24 horas y a los 7 días en Consultorio 1.</span>
              </div>
              <div className="text-right">
                <div className="w-40 border-b border-slate-400 mb-1"></div>
                <span className="font-bold text-slate-800 block">Dr. Gonzalo Huanca</span>
                <span className="text-[10px] text-slate-500 font-mono">CMP: 49812 · Oftalmólogo</span>
              </div>
            </div>
          </div>
        )}

        {selectedTemplate === 'lasik' && (
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <h3 className="font-black text-indigo-900 text-sm mb-1">
                Procedimiento: Cirugía Refractiva Láser (Femto-LASIK Bilateral)
              </h3>
              <p className="text-indigo-800">
                Creación de flap con láser de femtosegundo de 110 micras y fotoablación estromal excímer para corrección de miopía y astigmatismo bilateral. Flap reposicionado sin pliegues.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                1. Tratamiento Postoperatorio:
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tobramicina + Dexametasona colirio:</strong> 1 gota cada 4 horas por 7 días.</li>
                <li><strong>Lágrimas de Hialuronato al 0.4%:</strong> 1 gota cada 2 horas el primer día, luego cada 3 horas.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                2. Recomendaciones:
              </h4>
              <p>Reposo con ojos cerrados las primeras 6 horas. Uso de gafas de sol con filtro UV400 en exteriores.</p>
            </div>
          </div>
        )}

        {selectedTemplate === 'glaucoma' && (
          <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
              <h3 className="font-black text-teal-900 text-sm mb-1">
                Procedimiento: Trabeculectomía Filtrante con Mitomicina C
              </h3>
              <p className="text-teal-800">
                Creación de ampolla filtrante superior con esclerectomía y aplicación de antimetabolito para control de glaucoma no controlado farmacológicamente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
