/**
 * Formata um número com zeros à esquerda
 */
export const formatNumberWithPadding = (number: number, padding: number): string => {
  if (padding <= 0) {
    return number.toString();
  }
  return number.toString().padStart(padding, '0');
};

/**
 * Converte pixels para milímetros usando DPI
 */
export const pixelsToMM = (pixels: number, dpi: number): number => {
  return (pixels * 25.4) / dpi;
};

/**
 * Converte milímetros para pixels usando DPI
 */
export const mmToPixels = (mm: number, dpi: number): number => {
  return (mm * dpi) / 25.4;
};

/**
 * Clamp um valor entre min e max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Calcula a distância euclidiana entre dois pontos
 */
export const calculateDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number }
): number => {
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
};

/**
 * Debounce function para otimizar performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Valida se um arquivo é uma imagem válida
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Converte um arquivo para Data URL
 */
export const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};