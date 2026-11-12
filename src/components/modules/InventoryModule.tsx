import React, { useState } from 'react';
import { InventoryItem } from '../../types/hospital';
import { 
  Boxes, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Search, 
  AlertTriangle, 
  PackageCheck, 
  Calendar,
  Layers
} from 'lucide-react';

interface InventoryModuleProps {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, delta: number) => void;
  onBack: () => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({
  inventory,
  onUpdateStock,
  onBack
}) => {
  const [category, setCategory] = useState<string>('todos');
  const [search, setSearch] = useState('');

  const filtered = inventory.filter(item => {
    const matchesCat = category === 'todos' || item.categoria === category;
    const matchesSearch = item.nombre.toLowerCase().includes(search.toLowerCase()) ||
                          item.codigo.toLowerCase().includes(search.toLowerCase()) ||
                          item.lote.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Almacén & Farmacia
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">Lentes Intraoculares, Colirios & Quirúrgico</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">
              Inventario de Insumos Oftalmológicos
            </h1>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por insumo, lote o código..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5"
          >
            <option value="todos">Todas las Categorías</option>
            <option value="Lentes Intraoculares (LIO)">Lentes Intraoculares (LIO)</option>
            <option value="Colirios & Farmacia">Colirios & Farmacia</option>
            <option value="Viscoelásticos & Quirófano">Viscoelásticos & Quirófano</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Código / Lote</th>
                <th className="py-3 px-4">Insumo Oftalmológico</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Vencimiento</th>
                <th className="py-3 px-4 text-center">Stock Actual</th>
                <th className="py-3 px-4 text-right">Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(item => {
                const isLow = item.stock <= item.stockMinimo;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-800">{item.codigo}</div>
                      <div className="text-[10px] text-slate-400">Lote: {item.lote}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.nombre}</div>
                      <div className="text-[11px] text-slate-500">Unidad: {item.unidad}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700 text-[11px]">
                        {item.categoria}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {item.ubicacion}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {item.vencimiento}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold text-sm px-2.5 py-0.5 rounded-full ${
                        isLow ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {item.stock} {item.unidad[0]}
                      </span>
                      {isLow && (
                        <span className="block text-[10px] text-red-600 font-bold mt-0.5">
                          ¡Bajo Mínimo ({item.stockMinimo})!
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, -1)}
                          disabled={item.stock <= 0}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer disabled:opacity-40"
                          title="Restar 1 por uso quirúrgico"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
                          title="Sumar 1 por ingreso de almacén"
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
  );
};
