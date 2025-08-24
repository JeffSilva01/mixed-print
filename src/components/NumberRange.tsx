import React from 'react';

interface NumberRangeProps {
  startNumber: number;
  endNumber: number;
  onStartNumberChange: (value: number) => void;
  onEndNumberChange: (value: number) => void;
}

const NumberRange: React.FC<NumberRangeProps> = ({
  startNumber,
  endNumber,
  onStartNumberChange,
  onEndNumberChange
}) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onStartNumberChange(value);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onEndNumberChange(value);
  };

  const totalNumbers = endNumber >= startNumber ? endNumber - startNumber + 1 : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Faixa Numérica</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
      {totalNumbers > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Total de rifas:</span> {totalNumbers}
          </p>
          {totalNumbers > 1000 && (
            <p className="text-xs text-blue-600 mt-1">
              ⚠️ Grande quantidade de páginas pode tornar a geração do PDF mais lenta
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberRange;