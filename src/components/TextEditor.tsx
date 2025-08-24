import React from 'react';

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
}

interface TextEditorProps {
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
}

const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Impact',
  'Comic Sans MS'
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

const TextEditor: React.FC<TextEditorProps> = ({ textStyle, onTextStyleChange }) => {
  const updateStyle = (updates: Partial<TextStyle>) => {
    onTextStyleChange({ ...textStyle, ...updates });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Formatação do Número</h3>
      
      {/* Preview do texto */}
      <div className="bg-gray-100 border rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-2">Preview:</p>
        <span 
          style={{
            fontSize: `${textStyle.fontSize}px`,
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
            onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) })}
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
            onChange={(e) => updateStyle({ fontFamily: e.target.value })}
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

      {/* Cor do texto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cor do Texto
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="color"
            value={textStyle.color}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={textStyle.color}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="#FF0000"
          />
        </div>
      </div>

      {/* Botões de estilo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Estilo do Texto
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => updateStyle({ bold: !textStyle.bold })}
            className={`
              px-4 py-2 rounded font-bold border transition-colors
              ${textStyle.bold 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            B
          </button>
          
          <button
            onClick={() => updateStyle({ italic: !textStyle.italic })}
            className={`
              px-4 py-2 rounded italic border transition-colors
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
  );
};

export default TextEditor;