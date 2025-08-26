import React, { memo, useCallback } from 'react';
import type { TextEditorProps } from '../types';
import { FONT_FAMILIES, FONT_SIZES } from '../constants';

const TextEditor: React.FC<TextEditorProps> = memo(({ 
  textStyle, 
  onTextStyleChange 
}) => {
  const updateStyle = useCallback((updates: Partial<typeof textStyle>) => {
    onTextStyleChange({ ...textStyle, ...updates });
  }, [textStyle, onTextStyleChange]);

  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStyle({ fontSize: parseInt(e.target.value) });
  }, [updateStyle]);

  const handleFontFamilyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStyle({ fontFamily: e.target.value });
  }, [updateStyle]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle({ color: e.target.value });
  }, [updateStyle]);

  const handleBoldToggle = useCallback(() => {
    updateStyle({ bold: !textStyle.bold });
  }, [updateStyle, textStyle.bold]);

  const handleItalicToggle = useCallback(() => {
    updateStyle({ italic: !textStyle.italic });
  }, [updateStyle, textStyle.italic]);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Formatação do Número</h3>
      
      {/* Preview do texto - compacto */}
      <div className="bg-gray-100 border rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-1">Preview:</p>
        <span 
          style={{
            fontSize: `${Math.min(textStyle.fontSize, 20)}px`,
            fontFamily: textStyle.fontFamily,
            fontWeight: textStyle.bold ? 'bold' : 'normal',
            fontStyle: textStyle.italic ? 'italic' : 'normal',
            color: textStyle.color,
          }}
        >
          123
        </span>
      </div>

      {/* Controles de formatação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tamanho da fonte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamanho da Fonte
          </label>
          <select
            value={textStyle.fontSize}
            onChange={handleFontSizeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FONT_SIZES.map(size => (
              <option key={size} value={size}>{size}px</option>
            ))}
          </select>
        </div>

        {/* Família da fonte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fonte
          </label>
          <select
            value={textStyle.fontFamily}
            onChange={handleFontFamilyChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FONT_FAMILIES.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cor e estilo do texto - layout compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cor do texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor do Texto
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={textStyle.color}
              onChange={handleColorChange}
              className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={textStyle.color}
              onChange={handleColorChange}
              className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Estilo do texto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estilo do Texto
          </label>
          <div className="flex space-x-1">
            <button
              onClick={handleBoldToggle}
              className={`
                px-3 py-1 text-sm rounded font-bold border transition-colors
                ${textStyle.bold 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              B
            </button>
            
            <button
              onClick={handleItalicToggle}
              className={`
                px-3 py-1 text-sm rounded italic border transition-colors
                ${textStyle.italic 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              I
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;