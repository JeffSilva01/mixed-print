import type { PageSize, TextStyle, PageLayout } from '../types';

// Constantes de armazenamento
export const STORAGE_KEY = 'numerador-pdf-config';

// Configurações padrão
export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontSize: 24,
  fontFamily: 'Arial',
  bold: true,
  italic: false,
  color: '#000000',
};

export const DEFAULT_PAGE_LAYOUT: PageLayout = {
  pageSize: { name: 'A4', width: 210, height: 297 },
  cropMarks: false,
  orientation: 'portrait',
  groupForCutting: true,
};

// Opções disponíveis
export const PAGE_SIZES: PageSize[] = [
  { name: 'A4', width: 210, height: 297 },
  { name: 'A3', width: 297, height: 420 },
  { name: 'Personalizado', width: 0, height: 0 },
];

export const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Georgia',
  'Verdana',
  'Impact',
  'Comic Sans MS',
];

export const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

// Configurações de drag
export const DRAG_THRESHOLD = 5; // pixels
export const DRAG_DELAY = 100; // ms

// DPI padrão para cálculos
export const DEFAULT_DPI = 254;

// Configurações de preview
export const PREVIEW_SAMPLE_NUMBER = 123;
export const MIN_PREVIEW_FONT_SIZE = 12;