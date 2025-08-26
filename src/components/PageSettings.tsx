import React, { memo, useCallback } from 'react';
import type { PageSettingsProps, PageLayout } from '../types';
import { PAGE_SIZES } from '../constants';

const PageSettings: React.FC<PageSettingsProps> = memo(({ layout, onLayoutChange }) => {
  const updateLayout = useCallback((updates: Partial<PageLayout>) => {
    onLayoutChange({ ...layout, ...updates });
  }, [layout, onLayoutChange]);

  const handlePageSizeChange = useCallback((pageSizeName: string) => {
    const pageSize = PAGE_SIZES.find(p => p.name === pageSizeName);
    if (pageSize) {
      updateLayout({ pageSize });
    }
  }, [updateLayout]);

  const handleOrientationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLayout({ orientation: e.target.value as 'portrait' | 'landscape' });
  }, [updateLayout]);

  const handleCustomWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayout({ customWidth: parseInt(e.target.value) || 210 });
  }, [updateLayout]);

  const handleCustomHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayout({ customHeight: parseInt(e.target.value) || 297 });
  }, [updateLayout]);

  const handleCropMarksChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayout({ cropMarks: e.target.checked });
  }, [updateLayout]);

  const handleGroupForCuttingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateLayout({ groupForCutting: e.target.checked });
  }, [updateLayout]);

  const isCustomSize = layout.pageSize.name === 'Personalizado';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Configuração da Página</h3>
      
      {/* Tamanho da página e Orientação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho da Página
          </label>
          <select
            value={layout.pageSize.name}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZES.map(size => (
              <option key={size.name} value={size.name}>
                {size.name} {size.name !== 'Personalizado' && `(${size.width} x ${size.height}mm)`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Orientação
          </label>
          <select
            value={layout.orientation}
            onChange={handleOrientationChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="portrait">Retrato (↑)</option>
            <option value="landscape">Paisagem (→)</option>
          </select>
        </div>
      </div>

      {/* Dimensões personalizadas */}
      {isCustomSize && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Largura (mm)
            </label>
            <input
              type="number"
              value={layout.customWidth || 210}
              onChange={handleCustomWidthChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="50"
              max="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Altura (mm)
            </label>
            <input
              type="number"
              value={layout.customHeight || 297}
              onChange={handleCustomHeightChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="50"
              max="1000"
            />
          </div>
        </div>
      )}

      {/* Opções de Corte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marcas de Corte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Marcas de Corte
          </label>
          
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="cropMarks"
              checked={layout.cropMarks}
              onChange={handleCropMarksChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="cropMarks" className="text-sm text-gray-700">
              Adicionar marcas de corte
            </label>
          </div>

          {layout.cropMarks && (
            <div className="text-xs text-gray-500 mt-2">
              Marcas aparecem nas bordas (5mm fixo), sem sobrepor as imagens
            </div>
          )}
        </div>

        {/* Agrupamento para Corte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Agrupamento para Corte
          </label>
          
          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="groupForCutting"
              checked={layout.groupForCutting}
              onChange={handleGroupForCuttingChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="groupForCutting" className="text-sm text-gray-700">
              Agrupar números para facilitar montagem
            </label>
          </div>

          {layout.groupForCutting && (
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>• Número 1 na 1ª posição da 1ª página</p>
              <p>• Número 2 na 1ª posição da 2ª página</p>
              <p>• E assim por diante...</p>
              <p className="text-blue-600 font-medium">Facilita a montagem dos blocos após o corte!</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview das configurações */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-800 mb-2">Configurações da Página:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <span className="font-medium">Página:</span> {layout.pageSize.name} 
            {isCustomSize 
              ? ` (${layout.customWidth || 210} x ${layout.customHeight || 297}mm)`
              : ` (${layout.pageSize.width} x ${layout.pageSize.height}mm)`
            }
          </p>
          <p>
            <span className="font-medium">Orientação:</span> {layout.orientation === 'portrait' ? 'Retrato' : 'Paisagem'}
          </p>
          <p>
            <span className="font-medium">Centralização:</span> Automática
          </p>
          <p>
            <span className="font-medium">Marcas de corte:</span> {layout.cropMarks ? 'Sim (5mm)' : 'Não'}
          </p>
          <p>
            <span className="font-medium">Agrupamento para corte:</span> {layout.groupForCutting ? 'Sim' : 'Não'}
          </p>
          <p className="text-blue-600 font-medium mt-2">
            ✨ O layout será calculado automaticamente usando o tamanho exato da imagem!
          </p>
        </div>
      </div>
    </div>
  );
});

PageSettings.displayName = 'PageSettings';

export default PageSettings;