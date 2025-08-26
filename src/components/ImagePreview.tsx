import React, { useRef, useState, memo, useCallback } from "react";
import type { ImagePreviewProps } from "../types";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { formatNumberWithPadding } from "../utils/helpers";
import { PREVIEW_SAMPLE_NUMBER, MIN_PREVIEW_FONT_SIZE } from "../constants";

const ImagePreview: React.FC<ImagePreviewProps> = memo(({
  imageSrc,
  dualPositions,
  onPositionSelect,
  textStyle,
  zeroPadding = 0,
}) => {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDualMode, setIsDualMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isDragging,
    // hasDragged,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
  } = useDragAndDrop({ imageSize, containerRef });

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  }, []);

  const handleDualModeChange = useCallback((checked: boolean) => {
    setIsDualMode(checked);
    if (!checked && dualPositions?.primary) {
      // Se desabilitar modo duplo, manter apenas a posição primária
      onPositionSelect({ primary: dualPositions.primary });
    }
  }, [dualPositions, onPositionSelect]);

  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const newPosition = handleClick(e);
    if (!newPosition) return;

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
          secondary: newPosition,
        });
      } else {
        // Se já tem duas posições, substitui pela nova como primária
        onPositionSelect({ primary: newPosition });
      }
    }
  }, [handleClick, isDualMode, dualPositions, onPositionSelect]);

  const handleContainerMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dualPositions) return;

    const newPos = handleMouseMove(e);
    if (!newPos) return;

    if (isDragging === "primary") {
      onPositionSelect({
        primary: newPos,
        secondary: dualPositions.secondary,
      });
    } else if (isDragging === "secondary" && dualPositions.secondary) {
      onPositionSelect({
        primary: dualPositions.primary,
        secondary: newPos,
      });
    }
  }, [isDragging, dualPositions, handleMouseMove, onPositionSelect]);

  const handleNumberMouseDown = useCallback((
    e: React.MouseEvent,
    type: "primary" | "secondary"
  ) => {
    if (!dualPositions) return;
    const currentPos = type === "primary" ? dualPositions.primary : dualPositions.secondary;
    if (!currentPos) return;
    handleMouseDown(e, type, currentPos);
  }, [dualPositions, handleMouseDown]);

  const handleNumberClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Renderizar posição de número
  const renderNumberPosition = useCallback((
    position: { x: number; y: number },
    type: "primary" | "secondary"
  ) => (
    <div
      className={`absolute select-none ${
        isDragging === type ? "cursor-grabbing" : "cursor-grab hover:scale-110"
      } transition-transform`}
      style={{
        left: `${(position.x / imageSize.width) * 100}%`,
        top: `${(position.y / imageSize.height) * 100}%`,
        zIndex: isDragging === type ? 20 : 10,
        transform: "translateX(-50%) translateY(-75%)",
      }}
      onMouseDown={(e) => handleNumberMouseDown(e, type)}
      onClick={handleNumberClick}
    >
      <span
        style={{
          fontSize: `${Math.max(textStyle.fontSize * 0.5, MIN_PREVIEW_FONT_SIZE)}px`,
          fontFamily: textStyle.fontFamily,
          fontWeight: textStyle.bold ? "bold" : "normal",
          fontStyle: textStyle.italic ? "italic" : "normal",
          color: textStyle.color,
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "4px 8px",
          borderRadius: "4px",
          border: `3px solid ${
            isDragging === type
              ? type === "primary"
                ? "#1D4ED8"
                : "#059669"
              : type === "primary"
              ? "#3B82F6"
              : "#10B981"
          }`,
          boxShadow:
            isDragging === type
              ? "0 4px 12px rgba(0,0,0,0.3)"
              : "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        {formatNumberWithPadding(PREVIEW_SAMPLE_NUMBER, zeroPadding)}
      </span>
    </div>
  ), [
    imageSize,
    isDragging,
    textStyle,
    zeroPadding,
    handleNumberMouseDown,
    handleNumberClick
  ]);

  return (
    <div className="space-y-4">
      {/* Controle para modo duplo */}
      <div className="flex items-center space-x-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isDualMode}
            onChange={(e) => handleDualModeChange(e.target.checked)}
            className="mr-2"
          />
          Número duplicado (para itens com canhoto)
        </label>
      </div>

      <div className="text-sm text-gray-600 space-y-2">
        <p>
          {isDualMode
            ? "Clique duas vezes na imagem para definir onde o número deve aparecer (primeira posição e canhoto)"
            : "Clique na imagem para definir onde o número da rifa deve aparecer"}
        </p>
        {dualPositions?.primary && (
          <p className="text-blue-600 font-medium">
            💡 Arraste os números para ajustar a posição com precisão
          </p>
        )}
      </div>

      <div
        ref={containerRef}
        className={`relative inline-block border-2 border-gray-300 rounded-lg overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-crosshair"
        }`}
        onClick={handleContainerClick}
        onMouseMove={handleContainerMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={imageSrc}
          alt="Preview da rifa"
          className="max-w-full max-h-64 object-contain"
          onLoad={handleImageLoad}
        />

        {/* Posição primária */}
        {dualPositions?.primary && imageSize.width > 0 && 
          renderNumberPosition(dualPositions.primary, "primary")
        }

        {/* Posição secundária (canhoto) */}
        {dualPositions?.secondary && imageSize.width > 0 &&
          renderNumberPosition(dualPositions.secondary, "secondary")
        }
      </div>

      {dualPositions?.primary && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 space-y-2">
          <p className="text-sm text-green-800">
            <span className="font-medium">Posição principal:</span> X:{" "}
            {Math.round(dualPositions.primary.x)}, Y:{" "}
            {Math.round(dualPositions.primary.y)}
          </p>
          {dualPositions.secondary && (
            <p className="text-sm text-green-800">
              <span className="font-medium">Posição do canhoto:</span> X:{" "}
              {Math.round(dualPositions.secondary.x)}, Y:{" "}
              {Math.round(dualPositions.secondary.y)}
            </p>
          )}
          <p className="text-xs text-green-600 mt-1">
            ✓ O número aparecerá{" "}
            {dualPositions.secondary
              ? "nas duas posições"
              : "na posição selecionada"}{" "}
            em todas as páginas
          </p>
          {isDualMode && !dualPositions.secondary && (
            <p className="text-xs text-yellow-600">
              ⚠️ Clique novamente na imagem para definir a segunda posição
              (canhoto)
            </p>
          )}
        </div>
      )}
    </div>
  );
});

ImagePreview.displayName = 'ImagePreview';

export default ImagePreview;