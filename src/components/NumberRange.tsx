import React, { memo, useCallback } from 'react';
import type { NumberRangeProps } from '../types';

const NumberRange: React.FC<NumberRangeProps> = memo(({
  startNumber,
  endNumber,
  onStartNumberChange,
  onEndNumberChange,
  zeroPadding,
  onZeroPaddingChange
}) => {
  const handleStartChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onStartNumberChange(value);
  }, [onStartNumberChange]);

  const handleEndChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onEndNumberChange(value);
  }, [onEndNumberChange]);

  const handlePaddingChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onZeroPaddingChange(value);
  }, [onZeroPaddingChange]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Faixa Numérica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número Inicial
          </label>
          <input
            type="number"
            value={startNumber}
            onChange={handleStartChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 1"
            min="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número Final
          </label>
          <input
            type="number"
            value={endNumber}
            onChange={handleEndChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 100"
            min={startNumber}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Dígitos
          </label>
          <input
            type="number"
            value={zeroPadding}
            onChange={handlePaddingChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: 3"
            min="0"
            max="10"
          />
          <p className="text-xs text-gray-500 mt-1">
            0 = tamanho natural, 3 = força 3 dígitos (001, 002...)
          </p>
        </div>
      </div>
    </div>
  );
});

NumberRange.displayName = 'NumberRange';

export default NumberRange;