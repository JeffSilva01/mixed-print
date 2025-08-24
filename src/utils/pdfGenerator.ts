import jsPDF from 'jspdf';

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

interface PageSize {
  name: string;
  width: number;
  height: number;
}

interface PageLayout {
  pageSize: PageSize;
  customWidth?: number;
  customHeight?: number;
  spacing: number;
  cropMarks: boolean;
  orientation: 'portrait' | 'landscape';
  groupForCutting: boolean;
}

interface CalculatedLayout {
  itemsPerRow: number;
  itemsPerColumn: number;
  totalItemsPerPage: number;
  actualItemWidth: number;
  actualItemHeight: number;
  totalPages: number;
}

interface PDFGeneratorOptions {
  imageSrc: string;
  startNumber: number;
  endNumber: number;
  dualPositions: DualPositions;
  textStyle: TextStyle;
  pageLayout: PageLayout;
  calculatedLayout: CalculatedLayout;
}

// Função para desenhar marcas de corte ao redor da montagem e entre imagens
const drawCropMarks = (
  pdf: any, 
  startX: number, 
  startY: number, 
  itemWidth: number, 
  itemHeight: number, 
  spacing: number, 
  rows: number, 
  cols: number
) => {
  // Configurar estilo das marcas
  pdf.setDrawColor(0, 0, 0); // Cor preta
  pdf.setLineWidth(0.3); // Linha visível
  
  const markOffset = 2; // 2mm de afastamento das bordas
  const markLength = 5; // 5mm fixo para todas as marcas
  
  console.log('Desenhando marcas de corte completas:', { startX, startY, itemWidth, itemHeight, spacing, rows, cols, markLength });
  
  // Calcular dimensões totais da montagem
  const totalWidth = cols * itemWidth + (cols - 1) * spacing;
  const totalHeight = rows * itemHeight + (rows - 1) * spacing;
  
  // Coordenadas das bordas da montagem com afastamento
  const leftEdge = startX - markOffset;
  const rightEdge = startX + totalWidth + markOffset;
  const topEdge = startY - markOffset;
  const bottomEdge = startY + totalHeight + markOffset;
  
  // === MARCAS DE CORTE NOS CANTOS DA MONTAGEM ===
  // Canto superior esquerdo
  pdf.line(leftEdge - markLength, startY, leftEdge, startY); // Horizontal esquerda
  pdf.line(startX, topEdge - markLength, startX, topEdge); // Vertical superior
  
  // Canto superior direito
  pdf.line(rightEdge, startY, rightEdge + markLength, startY); // Horizontal direita
  pdf.line(startX + totalWidth, topEdge - markLength, startX + totalWidth, topEdge); // Vertical superior
  
  // Canto inferior esquerdo
  pdf.line(leftEdge - markLength, startY + totalHeight, leftEdge, startY + totalHeight); // Horizontal esquerda
  pdf.line(startX, bottomEdge, startX, bottomEdge + markLength); // Vertical inferior
  
  // Canto inferior direito
  pdf.line(rightEdge, startY + totalHeight, rightEdge + markLength, startY + totalHeight); // Horizontal direita
  pdf.line(startX + totalWidth, bottomEdge, startX + totalWidth, bottomEdge + markLength); // Vertical inferior
  
  // === MARCAS DE CORTE ENTRE AS IMAGENS (APENAS NAS BORDAS) ===
  // Marcas verticais entre colunas - apenas nas bordas superior e inferior
  if (cols > 1) {
    for (let col = 1; col < cols; col++) {
      const xDivision = startX + col * itemWidth + (col - 1) * spacing + spacing / 2;
      
      console.log(`Desenhando marca vertical entre colunas ${col-1} e ${col} em x: ${xDivision}`);
      
      // Marcas apenas na borda superior e inferior da montagem
      pdf.line(xDivision, topEdge - markLength, xDivision, topEdge);
      pdf.line(xDivision, bottomEdge, xDivision, bottomEdge + markLength);
    }
  }
  
  // Marcas horizontais entre linhas - apenas nas bordas esquerda e direita
  if (rows > 1) {
    for (let row = 1; row < rows; row++) {
      const yDivision = startY + row * itemHeight + (row - 1) * spacing + spacing / 2;
      
      console.log(`Desenhando marca horizontal entre linhas ${row-1} e ${row} em y: ${yDivision}`);
      
      // Marcas apenas na borda esquerda e direita da montagem
      pdf.line(leftEdge - markLength, yDivision, leftEdge, yDivision);
      pdf.line(rightEdge, yDivision, rightEdge + markLength, yDivision);
    }
  }
  
  console.log('Marcas de corte desenhadas: cantos da montagem e entre imagens');
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// Função para gerar a sequência de números baseada no agrupamento
const generateNumberSequence = (
  startNumber: number,
  endNumber: number,
  layout: CalculatedLayout,
  groupForCutting: boolean
): number[] => {
  const totalNumbers = endNumber - startNumber + 1;
  const sequence: number[] = [];
  
  if (!groupForCutting) {
    // Sequência normal: 1, 2, 3, 4, ...
    for (let i = startNumber; i <= endNumber; i++) {
      sequence.push(i);
    }
    return sequence;
  }
  
  // Sequência agrupada para facilitar corte
  const itemsPerPage = layout.totalItemsPerPage;
  const itemsPerRow = layout.itemsPerRow;
  const itemsPerColumn = layout.itemsPerColumn;
  
  console.log('Gerando sequência agrupada:', {
    totalNumbers,
    itemsPerPage,
    itemsPerRow,
    itemsPerColumn,
    totalPages: layout.totalPages
  });
  
  // Criar matriz para armazenar os números por posição
  const matrix: number[][] = Array(itemsPerPage).fill(null).map(() => []);
  
  // Distribuir os números sequenciais por posição
  let currentNumber = startNumber;
  
  // Para cada posição na grade (0 a itemsPerPage-1)
  for (let position = 0; position < itemsPerPage && currentNumber <= endNumber; position++) {
    const row = Math.floor(position / itemsPerRow);
    const col = position % itemsPerRow;
    
    // Para cada página, adicionar o próximo número nesta posição
    for (let page = 0; page < layout.totalPages && currentNumber <= endNumber; page++) {
      matrix[position].push(currentNumber);
      console.log(`Número ${currentNumber} -> Posição [${row},${col}] página ${page + 1}`);
      currentNumber++;
    }
  }
  
  // Converter matriz para sequência final (página por página)
  for (let page = 0; page < layout.totalPages; page++) {
    for (let position = 0; position < itemsPerPage; position++) {
      if (matrix[position][page] !== undefined) {
        sequence.push(matrix[position][page]);
      }
    }
  }
  
  console.log('Sequência agrupada final:', sequence.slice(0, 20), '...(total:', sequence.length, ')');
  return sequence;
};

const getFontName = (fontFamily: string, bold: boolean, italic: boolean): string => {
  const fontMap: { [key: string]: string } = {
    'Arial': 'helvetica',
    'Helvetica': 'helvetica',
    'Times New Roman': 'times',
    'Courier New': 'courier',
    'Georgia': 'times',
    'Verdana': 'helvetica',
    'Impact': 'helvetica',
    'Comic Sans MS': 'helvetica'
  };
  
  let fontName = fontMap[fontFamily] || 'helvetica';
  
  if (bold && italic) {
    fontName += '-bolditalic';
  } else if (bold) {
    fontName += '-bold';
  } else if (italic) {
    fontName += '-oblique';
  } else {
    fontName += '-normal';
  }
  
  return fontName;
};

export const generatePDF = async (options: PDFGeneratorOptions): Promise<void> => {
  const { imageSrc, startNumber, endNumber, dualPositions, textStyle, pageLayout, calculatedLayout } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        // Converter imagem para base64
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Não foi possível obter contexto do canvas');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        // Obter dimensões da página
        let pageWidth = pageLayout.pageSize.width;
        let pageHeight = pageLayout.pageSize.height;
        
        if (pageLayout.pageSize.name === 'Personalizado') {
          pageWidth = pageLayout.customWidth || 210;
          pageHeight = pageLayout.customHeight || 297;
        }
        
        // Aplicar orientação (trocar largura e altura se paisagem)
        if (pageLayout.orientation === 'landscape') {
          [pageWidth, pageHeight] = [pageHeight, pageWidth];
        }
        
        // Criar PDF
        const pdf = new jsPDF({
          orientation: pageLayout.orientation === 'landscape' ? 'landscape' : 'portrait',
          unit: 'mm',
          format: [pageWidth, pageHeight]
        });
        
        // Usar o layout calculado
        const itemsPerPage = calculatedLayout.totalItemsPerPage;
        const scaledItemWidth = calculatedLayout.actualItemWidth;
        const scaledItemHeight = calculatedLayout.actualItemHeight;
        
        // Converter cor hex para RGB
        const rgb = hexToRgb(textStyle.color);
        
        // Gerar sequência de números baseada no agrupamento
        const numberSequence = generateNumberSequence(
          startNumber, 
          endNumber, 
          calculatedLayout, 
          pageLayout.groupForCutting
        );
        
        let sequenceIndex = 0;
        
        for (let page = 0; page < calculatedLayout.totalPages; page++) {
          if (page > 0) {
            pdf.addPage([pageWidth, pageHeight]);
          }
          
          // Calcular dimensões totais do grid
          const totalGridWidth = calculatedLayout.itemsPerRow * scaledItemWidth + (calculatedLayout.itemsPerRow - 1) * pageLayout.spacing;
          const totalGridHeight = calculatedLayout.itemsPerColumn * scaledItemHeight + (calculatedLayout.itemsPerColumn - 1) * pageLayout.spacing;
          
          // Centralizar o grid na página
          const startX = (pageWidth - totalGridWidth) / 2;
          const startY = (pageHeight - totalGridHeight) / 2;
          
          console.log('PDF Generation - Layout info:', {
            itemsPerColumn: calculatedLayout.itemsPerColumn,
            itemsPerRow: calculatedLayout.itemsPerRow,
            totalItemsPerPage: calculatedLayout.totalItemsPerPage,
            currentPage: page + 1,
            sequenceIndex,
            endNumber,
            pageWidth,
            pageHeight,
            orientation: pageLayout.orientation
          });

          // Iterar por cada posição na grade da página
          for (let row = 0; row < calculatedLayout.itemsPerColumn; row++) {
            for (let col = 0; col < calculatedLayout.itemsPerRow; col++) {
              if (sequenceIndex >= numberSequence.length) break;
              
              const currentNumber = numberSequence[sequenceIndex];
              console.log(`Adicionando item ${currentNumber} na posição [${row}, ${col}]`);
              
              // Calcular posição de cada item
              const x = startX + col * (scaledItemWidth + pageLayout.spacing);
              const y = startY + row * (scaledItemHeight + pageLayout.spacing);
              
              // Adicionar imagem
              pdf.addImage(imgData, 'JPEG', x, y, scaledItemWidth, scaledItemHeight);
              
              // Configurar fonte e estilo do texto
              const fontName = getFontName(textStyle.fontFamily, textStyle.bold, textStyle.italic);
              pdf.setFont(fontName.split('-')[0], textStyle.bold ? 'bold' : (textStyle.italic ? 'italic' : 'normal'));
              
              // Ajustar tamanho da fonte baseado no tamanho da rifa
              const scaleFactor = Math.min(scaledItemWidth / 100, scaledItemHeight / 100);
              const adjustedFontSize = Math.max(8, (textStyle.fontSize * scaleFactor * 72) / 96);
              pdf.setFontSize(adjustedFontSize);
              
              // Definir cor do texto
              pdf.setTextColor(rgb.r, rgb.g, rgb.b);
              
              // Calcular posições do número na rifa atual
              const primaryNumberX = x + (dualPositions.primary.x / img.width) * scaledItemWidth;
              const primaryNumberY = y + (dualPositions.primary.y / img.height) * scaledItemHeight;
              
              // Adicionar número na posição primária
              const text = currentNumber.toString();
              const textWidth = pdf.getTextWidth(text);
              pdf.text(text, primaryNumberX - (textWidth / 2), primaryNumberY);
              
              // Se houver posição secundária (canhoto), adicionar número lá também
              if (dualPositions.secondary) {
                const secondaryNumberX = x + (dualPositions.secondary.x / img.width) * scaledItemWidth;
                const secondaryNumberY = y + (dualPositions.secondary.y / img.height) * scaledItemHeight;
                pdf.text(text, secondaryNumberX - (textWidth / 2), secondaryNumberY);
              }
              
              sequenceIndex++;
            }
            if (sequenceIndex >= numberSequence.length) break;
          }
          
          console.log(`Página ${page + 1} completada. Índice da sequência: ${sequenceIndex}`);
          
          // Desenhar marcas de corte se habilitado
          if (pageLayout.cropMarks) {
            console.log('Marcas de corte habilitadas, chamando drawCropMarks...');
            console.log('Parâmetros:', {
              pageLayout: pageLayout.cropMarks,
              spacing: pageLayout.spacing,
              itemsPerColumn: calculatedLayout.itemsPerColumn,
              itemsPerRow: calculatedLayout.itemsPerRow
            });
            
            drawCropMarks(
              pdf, 
              startX, 
              startY, 
              scaledItemWidth, 
              scaledItemHeight, 
              pageLayout.spacing, 
              calculatedLayout.itemsPerColumn, 
              calculatedLayout.itemsPerRow
            );
          } else {
            console.log('Marcas de corte desabilitadas ou sem espaçamento');
          }
        }
        
        // Fazer download do PDF com timestamp
        const now = new Date();
        const timestamp = now.toLocaleString('pt-BR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Sao_Paulo'
        }).replace(/[\/\s:]/g, '-');
        
        pdf.save(`numeracao-${startNumber}-${endNumber}-${itemsPerPage}por-pagina-${timestamp}.pdf`);
        resolve();
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Erro ao carregar a imagem'));
    };
    
    img.src = imageSrc;
  });
};