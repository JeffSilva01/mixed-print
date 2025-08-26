import { useState, useCallback } from 'react';
import type { Position } from '../types';
import { DRAG_THRESHOLD, DRAG_DELAY } from '../constants';
import { calculateDistance } from '../utils/helpers';

interface UseDragAndDropProps {
  imageSize: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook para gerenciar funcionalidade de drag and drop
 */
export const useDragAndDrop = ({ imageSize, containerRef }: UseDragAndDropProps) => {
  const [isDragging, setIsDragging] = useState<'primary' | 'secondary' | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);

  const getRelativePosition = useCallback(
    (clientX: number, clientY: number): Position | null => {
      if (!containerRef.current) return null;

      const img = containerRef.current.querySelector('img');
      if (!img) return null;

      const imgRect = img.getBoundingClientRect();

      // Calcular posição relativa à imagem
      const x = ((clientX - imgRect.left) / imgRect.width) * imageSize.width;
      const y = ((clientY - imgRect.top) / imgRect.height) * imageSize.height;

      // Garantir que as coordenadas estejam dentro dos limites da imagem
      return {
        x: Math.max(0, Math.min(imageSize.width, x)),
        y: Math.max(0, Math.min(imageSize.height, y)),
      };
    },
    [imageSize, containerRef]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, type: 'primary' | 'secondary', currentPos: Position) => {
      e.preventDefault();
      e.stopPropagation();

      if (!containerRef.current) return;

      const img = containerRef.current.querySelector('img');
      if (!img) return;

      const imgRect = img.getBoundingClientRect();

      // Salvar posição inicial do drag para detectar se realmente arrastou
      setDragStartPosition({ x: e.clientX, y: e.clientY });
      setHasDragged(false);

      // Calcular offset entre a posição do mouse e o centro do elemento
      const elementX = (currentPos.x / imageSize.width) * imgRect.width + imgRect.left;
      const elementY = (currentPos.y / imageSize.height) * imgRect.height + imgRect.top;

      setDragOffset({
        x: e.clientX - elementX,
        y: e.clientY - elementY,
      });

      setIsDragging(type);
    },
    [imageSize, containerRef]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent): Position | null => {
      if (!isDragging) return null;

      // Detectar se realmente arrastou
      const distance = calculateDistance(
        { x: e.clientX, y: e.clientY },
        dragStartPosition
      );

      if (distance > DRAG_THRESHOLD) {
        setHasDragged(true);
      }

      return getRelativePosition(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    },
    [isDragging, dragStartPosition, dragOffset, getRelativePosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setDragOffset({ x: 0, y: 0 });

    // Adicionar delay para prevenir click event após drag
    if (hasDragged) {
      setTimeout(() => setHasDragged(false), DRAG_DELAY);
    }
  }, [hasDragged]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): Position | null => {
      // Não processar cliques se estamos arrastando ou acabamos de arrastar
      if (isDragging || hasDragged) return null;

      return getRelativePosition(e.clientX, e.clientY);
    },
    [isDragging, hasDragged, getRelativePosition]
  );

  return {
    isDragging,
    hasDragged,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    getRelativePosition,
  };
};