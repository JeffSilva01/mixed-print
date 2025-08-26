// Tipos base
export interface Position {
  x: number;
  y: number;
}

export interface DualPositions {
  primary: Position;
  secondary?: Position;
}

// Tipos de configuração de texto
export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
}

// Tipos de página
export interface PageSize {
  name: string;
  width: number; // em mm
  height: number; // em mm
}

export interface PageLayout {
  pageSize: PageSize;
  customWidth?: number;
  customHeight?: number;
  cropMarks: boolean;
  orientation: 'portrait' | 'landscape';
  groupForCutting: boolean;
}

// Tipos de layout calculado
export interface CalculatedLayout {
  itemsPerRow: number;
  itemsPerColumn: number;
  totalItemsPerPage: number;
  totalPages: number;
  actualItemWidth: number;
  actualItemHeight: number;
}

// Tipos de configuração salva
export interface SavedConfig {
  textStyle: TextStyle;
  pageLayout: PageLayout;
  startNumber: number;
  endNumber: number;
  zeroPadding: number;
  imageDimensions?: ImageDimensions;
}

// Props dos componentes
export interface NumberRangeProps {
  startNumber: number;
  endNumber: number;
  onStartNumberChange: (value: number) => void;
  onEndNumberChange: (value: number) => void;
  zeroPadding: number;
  onZeroPaddingChange: (value: number) => void;
}

export interface TextEditorProps {
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
}

export interface PageSettingsProps {
  layout: PageLayout;
  onLayoutChange: (layout: PageLayout) => void;
}

export interface ImagePreviewProps {
  imageSrc: string;
  dualPositions: DualPositions | null;
  onPositionSelect: (positions: DualPositions) => void;
  textStyle: TextStyle;
  zeroPadding?: number;
}

// Configuração de dimensões da imagem
export interface ImageDimensions {
  widthMM: number;
  heightMM: number;
  maintainAspectRatio: boolean;
  useAutoCalculation: boolean;
}

export interface ImageUploadProps {
  onImageSelect: (file: File, dataUrl: string) => void;
}

// Tipos para geração de PDF
export interface PDFGenerationParams {
  imageSrc: string;
  startNumber: number;
  endNumber: number;
  dualPositions: DualPositions;
  textStyle: TextStyle;
  pageLayout: PageLayout;
  calculatedLayout: CalculatedLayout;
  zeroPadding: number;
}