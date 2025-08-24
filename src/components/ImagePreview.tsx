import React, { useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DualPositions {
  primary: Position;
  secondary?: Position;
}

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
}

interface ImagePreviewProps {
  imageSrc: string;
  dualPositions: DualPositions | null;
  onPositionSelect: (positions: DualPositions) => void;
  textStyle: TextStyle;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  dualPositions,
  onPositionSelect,
  textStyle
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDualMode, setIsDualMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    containerRef.current.getBoundingClientRect();
    const img = containerRef.current.querySelector('img');
    
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    
    // Calcular posição relativa à imagem
    const x = ((e.clientX - imgRect.left) / imgRect.width) * imageSize.width;
    const y = ((e.clientY - imgRect.top) / imgRect.height) * imageSize.height;

    const newPosition = { x, y };

    if (!isDualMode) {
      // Modo simples: apenas uma posição
      onPositionSelect({ primary: newPosition });
    } else {
      // Modo duplo: adicionar segunda posição ou substituir a primeira
      if (!dualPositions?.primary) {
        onPositionSelect({ primary: newPosition });
      } else if (!dualPositions?.secondary) {
        onPositionSelect({ 
          primary: dualPositions.primary, 
          secondary: newPosition 
        });
      } else {
        // Se já tem duas posições, substitui pela nova como primária
        onPositionSelect({ primary: newPosition });
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Posicionamento do Número
      </h3>
      
      {/* Controle para modo duplo */}
      <div className="flex items-center space-x-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isDualMode}
            onChange={(e) => {
              setIsDualMode(e.target.checked);
              if (!e.target.checked && dualPositions?.primary) {
                // Se desabilitar modo duplo, manter apenas a posição primária
                onPositionSelect({ primary: dualPositions.primary });
              }
            }}
            className="mr-2"
          />
          Número duplicado (para itens com canhoto)
        </label>
      </div>
      
      <div className="text-sm text-gray-600">
        {isDualMode 
          ? "Clique duas vezes na imagem para definir onde o número deve aparecer (primeira posição e canhoto)"
          : "Clique na imagem para definir onde o número da rifa deve aparecer"
        }
      </div>

      <div 
        ref={containerRef}
        className="relative inline-block cursor-crosshair border-2 border-gray-300 rounded-lg overflow-hidden"
        onClick={handleClick}
      >
        <img
          src={imageSrc}
          alt="Preview da rifa"
          className="max-w-full max-h-96 object-contain"
          onLoad={handleImageLoad}
        />
        
        {/* Posição primária */}
        {dualPositions?.primary && imageSize.width > 0 && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${(dualPositions.primary.x / imageSize.width) * 100}%`,
              top: `${(dualPositions.primary.y / imageSize.height) * 100}%`,
            }}
          >
            <span
              style={{
                fontSize: `${Math.max(textStyle.fontSize * 0.5, 12)}px`,
                fontFamily: textStyle.fontFamily,
                fontWeight: textStyle.bold ? 'bold' : 'normal',
                fontStyle: textStyle.italic ? 'italic' : 'normal',
                color: textStyle.color,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: '2px 4px',
                borderRadius: '3px',
                border: '2px solid #3B82F6', // Borda azul para posição primária
              }}
            >
              123
            </span>
          </div>
        )}
        
        {/* Posição secundária (canhoto) */}
        {dualPositions?.secondary && imageSize.width > 0 && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${(dualPositions.secondary.x / imageSize.width) * 100}%`,
              top: `${(dualPositions.secondary.y / imageSize.height) * 100}%`,
            }}
          >
            <span
              style={{
                fontSize: `${Math.max(textStyle.fontSize * 0.5, 12)}px`,
                fontFamily: textStyle.fontFamily,
                fontWeight: textStyle.bold ? 'bold' : 'normal',
                fontStyle: textStyle.italic ? 'italic' : 'normal',
                color: textStyle.color,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                padding: '2px 4px',
                borderRadius: '3px',
                border: '2px solid #10B981', // Borda verde para posição secundária
              }}
            >
              123
            </span>
          </div>
        )}
      </div>

      {dualPositions?.primary && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-2">
          <p className="text-sm text-green-800">
            <span className="font-medium">Posição principal:</span> X: {Math.round(dualPositions.primary.x)}, Y: {Math.round(dualPositions.primary.y)}
          </p>
          {dualPositions.secondary && (
            <p className="text-sm text-green-800">
              <span className="font-medium">Posição do canhoto:</span> X: {Math.round(dualPositions.secondary.x)}, Y: {Math.round(dualPositions.secondary.y)}
            </p>
          )}
          <p className="text-xs text-green-600 mt-1">
            ✓ O número aparecerá {dualPositions.secondary ? 'nas duas posições' : 'na posição selecionada'} em todas as páginas
          </p>
          {isDualMode && !dualPositions.secondary && (
            <p className="text-xs text-yellow-600">
              ⚠️ Clique novamente na imagem para definir a segunda posição (canhoto)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;