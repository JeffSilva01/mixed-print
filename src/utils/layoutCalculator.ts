interface PageLayout {
  pageSize: { name: string; width: number; height: number };
  customWidth?: number;
  customHeight?: number;
  spacing: number;
  cropMarks: boolean;
  orientation: 'portrait' | 'landscape';
}

export interface CalculatedLayout {
  itemsPerRow: number;
  itemsPerColumn: number;
  totalItemsPerPage: number;
  actualItemWidth: number;
  actualItemHeight: number;
  totalPages: number;
}

export const calculateOptimalLayout = (
  pageLayout: PageLayout, 
  imageSizeMM: { width: number; height: number },
  totalRaffles: number
): CalculatedLayout => {
  // Obter dimensões reais da página
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
  
  // Usar toda a área da página (será centralizado posteriormente)
  const availableWidth = pageWidth;
  const availableHeight = pageHeight;
  
  // Usar o tamanho exato da imagem como referência
  const imageWidth = imageSizeMM.width;
  const imageHeight = imageSizeMM.height;
  
  // Começar testando diferentes configurações
  let bestLayout: CalculatedLayout | null = null;
  let maxItemsPerPage = 0;
  
  // Testar configurações de 1x1 até 10x10
  for (let rows = 1; rows <= 10; rows++) {
    for (let cols = 1; cols <= 10; cols++) {
      // Calcular espaço total necessário incluindo espaçamentos
      const totalWidthNeeded = cols * imageWidth + (cols - 1) * pageLayout.spacing;
      const totalHeightNeeded = rows * imageHeight + (rows - 1) * pageLayout.spacing;
      
      // Verificar se cabe na área disponível
      if (totalWidthNeeded > availableWidth || totalHeightNeeded > availableHeight) {
        continue;
      }
      
      const itemsPerPage = rows * cols;
      
      // Preferir layouts que maximizem o uso da página
      if (itemsPerPage > maxItemsPerPage) {
        maxItemsPerPage = itemsPerPage;
        bestLayout = {
          itemsPerRow: cols,
          itemsPerColumn: rows,
          totalItemsPerPage: itemsPerPage,
          actualItemWidth: imageWidth,  // Usar tamanho exato da imagem
          actualItemHeight: imageHeight, // Usar tamanho exato da imagem
          totalPages: Math.ceil(totalRaffles / itemsPerPage)
        };
      }
    }
  }
  
  // Se não encontrou layout viável, usar 1x1 (a imagem sempre deve caber em 1x1)
  if (!bestLayout) {
    bestLayout = {
      itemsPerRow: 1,
      itemsPerColumn: 1,
      totalItemsPerPage: 1,
      actualItemWidth: imageWidth,
      actualItemHeight: imageHeight,
      totalPages: totalRaffles
    };
  }
  
  return bestLayout;
};