import { useState, useEffect, useCallback } from 'react';
import type { CalculatedLayout, PageLayout } from '../types';
import { calculateOptimalLayout } from '../utils/layoutCalculator';
import { DEFAULT_DPI } from '../constants';
import { pixelsToMM } from '../utils/helpers';
import { debounce } from '../utils/helpers';

interface UseLayoutCalculationProps {
  imageSrc: string;
  pageLayout: PageLayout;
  startNumber: number;
  endNumber: number;
}

/**
 * Hook para gerenciar cálculo de layout
 */
export const useLayoutCalculation = ({
  imageSrc,
  pageLayout,
  startNumber,
  endNumber,
}: UseLayoutCalculationProps) => {
  const [calculatedLayout, setCalculatedLayout] = useState<CalculatedLayout | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLayout = useCallback(
    debounce(() => {
      if (!imageSrc) {
        setCalculatedLayout(null);
        return;
      }

      setIsCalculating(true);

      const img = new Image();
      img.onload = () => {
        try {
          const imageSizeMM = {
            width: pixelsToMM(img.width, DEFAULT_DPI),
            height: pixelsToMM(img.height, DEFAULT_DPI),
          };

          console.log('Informações da imagem:', {
            larguraPx: img.width,
            alturaPx: img.height,
            dpi: DEFAULT_DPI,
            larguraMM: imageSizeMM.width.toFixed(2),
            alturaMM: imageSizeMM.height.toFixed(2),
          });

          const totalRaffles = endNumber - startNumber + 1;
          const layout = calculateOptimalLayout(pageLayout, imageSizeMM, totalRaffles);
          
          setCalculatedLayout(layout);
        } catch (error) {
          console.error('Erro no cálculo do layout:', error);
          setCalculatedLayout(null);
        } finally {
          setIsCalculating(false);
        }
      };

      img.onerror = () => {
        console.error('Erro ao carregar imagem para cálculo');
        setCalculatedLayout(null);
        setIsCalculating(false);
      };

      img.src = imageSrc;
    }, 300),
    [imageSrc, pageLayout, startNumber, endNumber]
  );

  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  return {
    calculatedLayout,
    isCalculating,
    recalculateLayout: calculateLayout,
  };
};