import React, { memo, useCallback, useEffect, useState } from 'react';
import type { ImageDimensions } from '../types';

interface ImageDimensionsControlProps {
  dimensions: ImageDimensions;
  onDimensionsChange: (dimensions: ImageDimensions) => void;
  imageSrc?: string;
  onAutoCalculate?: (widthMM: number, heightMM: number) => void;
}

const ImageDimensionsControl: React.FC<ImageDimensionsControlProps> = memo(({
  dimensions,
  onDimensionsChange,
  imageSrc,
  onAutoCalculate
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1);

  // Função para formatar valor com máximo 2 casas decimais (remove zeros desnecessários)
  const formatDisplayValue = useCallback((value: number): string => {
    if (value === 0) return '';
    const fixed = value.toFixed(2);
    return parseFloat(fixed).toString(); // Remove zeros desnecessários
  }, []);

  // Calcular dimensões automáticas quando a imagem é carregada
  useEffect(() => {
    if (!imageSrc || !dimensions.useAutoCalculation) return;

    const img = new Image();
    img.onload = () => {
      const DEFAULT_DPI = 254; // mesmo valor usado no projeto
      const pixelsToMM = (pixels: number, dpi: number) => (pixels * 25.4) / dpi;
      
      const autoWidthMM = pixelsToMM(img.width, DEFAULT_DPI);
      const autoHeightMM = pixelsToMM(img.height, DEFAULT_DPI);
      
      setAspectRatio(img.width / img.height);
      
      if (onAutoCalculate) {
        onAutoCalculate(autoWidthMM, autoHeightMM);
      }

      onDimensionsChange({
        ...dimensions,
        widthMM: autoWidthMM,
        heightMM: autoHeightMM
      });
    };
    img.src = imageSrc;
  }, [imageSrc, dimensions.useAutoCalculation, onDimensionsChange, onAutoCalculate]);

  const handleWidthChange = useCallback((inputValue: string) => {
    // Permitir entrada vazia ou números com máximo 2 casas decimais
    if (inputValue === '' || /^\d*\.?\d{0,2}$/.test(inputValue)) {
      const numericValue = parseFloat(inputValue) || 0;
      const newDimensions = { ...dimensions, widthMM: numericValue };
      
      if (dimensions.maintainAspectRatio && aspectRatio && numericValue > 0) {
        newDimensions.heightMM = parseFloat((numericValue / aspectRatio).toFixed(2));
      }
      
      onDimensionsChange(newDimensions);
    }
  }, [dimensions, aspectRatio, onDimensionsChange]);

  const handleHeightChange = useCallback((inputValue: string) => {
    // Permitir entrada vazia ou números com máximo 2 casas decimais
    if (inputValue === '' || /^\d*\.?\d{0,2}$/.test(inputValue)) {
      const numericValue = parseFloat(inputValue) || 0;
      const newDimensions = { ...dimensions, heightMM: numericValue };
      
      if (dimensions.maintainAspectRatio && aspectRatio && numericValue > 0) {
        newDimensions.widthMM = parseFloat((numericValue * aspectRatio).toFixed(2));
      }
      
      onDimensionsChange(newDimensions);
    }
  }, [dimensions, aspectRatio, onDimensionsChange]);

  const handleMaintainAspectRatioChange = useCallback((maintain: boolean) => {
    onDimensionsChange({
      ...dimensions,
      maintainAspectRatio: maintain
    });
  }, [dimensions, onDimensionsChange]);

  const handleUseAutoCalculationChange = useCallback((useAuto: boolean) => {
    onDimensionsChange({
      ...dimensions,
      useAutoCalculation: useAuto
    });
  }, [dimensions, onDimensionsChange]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Dimensões da Imagem
      </h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useAutoCalculation"
              checked={dimensions.useAutoCalculation}
              onChange={(e) => handleUseAutoCalculationChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label htmlFor="useAutoCalculation" className="text-sm font-medium text-gray-700">
              Usar cálculo automático
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="maintainAspectRatio"
              checked={dimensions.maintainAspectRatio}
              onChange={(e) => handleMaintainAspectRatioChange(e.target.checked)}
              disabled={dimensions.useAutoCalculation}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="maintainAspectRatio" className={`text-sm font-medium ${dimensions.useAutoCalculation ? 'text-gray-400' : 'text-gray-700'}`}>
              Manter proporção
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Largura (mm)
            </label>
            <input
              type="text"
              value={formatDisplayValue(dimensions.widthMM)}
              onChange={(e) => handleWidthChange(e.target.value)}
              disabled={dimensions.useAutoCalculation}
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Altura (mm)
            </label>
            <input
              type="text"
              value={formatDisplayValue(dimensions.heightMM)}
              onChange={(e) => handleHeightChange(e.target.value)}
              disabled={dimensions.useAutoCalculation}
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          {dimensions.useAutoCalculation ? (
            <p>⚡ Dimensões calculadas automaticamente baseadas no DPI da imagem (254 DPI)</p>
          ) : (
            <p>✏️ Ajuste manual das dimensões. {dimensions.maintainAspectRatio ? 'Proporção mantida automaticamente.' : 'Ajuste independente de largura e altura.'}</p>
          )}
        </div>
      </div>
    </div>
  );
});

ImageDimensionsControl.displayName = 'ImageDimensionsControl';

export default ImageDimensionsControl;