import { useState, useEffect } from "react";
import ImageUpload from "./components/ImageUpload";
import NumberRange from "./components/NumberRange";
import ImagePreview from "./components/ImagePreview";
import TextEditor, { type TextStyle } from "./components/TextEditor";
import PageSettings, { type PageLayout } from "./components/PageSettings";
import { generatePDF } from "./utils/pdfGenerator";
import {
  calculateOptimalLayout,
  type CalculatedLayout,
} from "./utils/layoutCalculator";

interface Position {
  x: number;
  y: number;
}

interface DualPositions {
  primary: Position;
  secondary?: Position;
}

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [startNumber, setStartNumber] = useState<number>(1);
  const [endNumber, setEndNumber] = useState<number>(100);
  const [dualPositions, setDualPositions] = useState<DualPositions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 24,
    fontFamily: "Arial",
    bold: true,
    italic: false,
    color: "#FF0000",
  });
  const [pageLayout, setPageLayout] = useState<PageLayout>({
    pageSize: { name: "A4", width: 210, height: 297 },
    spacing: 5,
    cropMarks: false,
    orientation: "portrait",
    groupForCutting: false,
  });
  const [calculatedLayout, setCalculatedLayout] =
    useState<CalculatedLayout | null>(null);

  const recalculateLayout = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      // Usar DPI fixo de 254 para arquivos JPG (padrão de design gráfico)
      const dpi = 254;
      console.log(`Usando DPI padrão para JPG: ${dpi}`);
      
      const imageSizeMM = {
        width: (img.width * 25.4) / dpi,
        height: (img.height * 25.4) / dpi,
      };
      
      console.log('Informações da imagem JPG:', {
        nomeArquivo: imageFile ? imageFile.name : 'desconhecido',
        larguraPx: img.width,
        alturaPx: img.height,
        dpi: dpi,
        larguraMM: imageSizeMM.width.toFixed(2),
        alturaMM: imageSizeMM.height.toFixed(2)
      });

      const totalRaffles = endNumber - startNumber + 1;
      const layout = calculateOptimalLayout(
        pageLayout,
        imageSizeMM,
        totalRaffles,
      );
      setCalculatedLayout(layout);
    };
    img.src = imageSrc;
  };

  // Recalcular layout quando orientação, tamanhos de página ou números mudarem
  useEffect(() => {
    if (imageSrc) {
      recalculateLayout();
    }
  }, [
    pageLayout.orientation,
    pageLayout.pageSize,
    pageLayout.customWidth,
    pageLayout.customHeight,
    pageLayout.spacing,
    startNumber,
    endNumber,
  ]);

  const handleImageSelect = (file: File, dataUrl: string) => {
    setImageFile(file);
    setImageSrc(dataUrl);
    setDualPositions(null);

    // Calcular tamanho da imagem em mm e layout ótimo
    const img = new Image();
    img.onload = () => {
      // Usar DPI fixo de 254 para arquivos JPG (padrão de design gráfico)
      const dpi = 254;
      console.log(`Usando DPI padrão para JPG: ${dpi}`);
      
      const imageSizeMM = {
        width: (img.width * 25.4) / dpi,
        height: (img.height * 25.4) / dpi,
      };
      
      console.log('Upload de imagem JPG:', {
        nomeArquivo: file ? file.name : 'desconhecido',
        larguraPx: img.width,
        alturaPx: img.height,
        dpi: dpi,
        larguraMM: imageSizeMM.width.toFixed(2),
        alturaMM: imageSizeMM.height.toFixed(2)
      });

      const totalRaffles = endNumber - startNumber + 1;
      const layout = calculateOptimalLayout(
        pageLayout,
        imageSizeMM,
        totalRaffles,
      );
      setCalculatedLayout(layout);
    };
    img.src = dataUrl;
  };

  const handleGeneratePDF = async () => {
    if (!imageSrc || !dualPositions?.primary || endNumber < startNumber) {
      alert("Por favor, complete todas as configurações antes de gerar o PDF.");
      return;
    }

    setIsGenerating(true);

    try {
      if (!calculatedLayout) {
        alert("Aguarde o cálculo do layout ser concluído.");
        return;
      }

      await generatePDF({
        imageSrc,
        startNumber,
        endNumber,
        dualPositions,
        textStyle,
        pageLayout,
        calculatedLayout,
      });

      alert("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const canGeneratePDF = imageSrc && dualPositions?.primary && endNumber >= startNumber;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-6 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Numerador PDF
          </h1>
          <p className="text-gray-600">
            Crie itens numerados otimizados para impressão - múltiplos itens por
            página
          </p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex gap-8 p-6">
            {/* Configurações com scroll */}
            <div className="w-1/2 overflow-y-auto pr-4">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  1. Upload da Imagem
                </h2>
                <ImageUpload onImageSelect={handleImageSelect} />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <NumberRange
                  startNumber={startNumber}
                  endNumber={endNumber}
                  onStartNumberChange={setStartNumber}
                  onEndNumberChange={setEndNumber}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <PageSettings
                  layout={pageLayout}
                  onLayoutChange={setPageLayout}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <TextEditor
                  textStyle={textStyle}
                  onTextStyleChange={setTextStyle}
                />
              </div>
            </div>
          </div>

          {/* Preview - Coluna direita fixa */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 space-y-6 overflow-y-auto">
              {imageSrc && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    4. Posicionamento do Número
                  </h2>
                  <ImagePreview
                    imageSrc={imageSrc}
                    dualPositions={dualPositions}
                    onPositionSelect={setDualPositions}
                    textStyle={textStyle}
                  />
                </div>
              )}

              {calculatedLayout && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    ✅ Layout Calculado Automaticamente
                  </h3>
                  <div className="text-sm text-green-700 space-y-2">
                    <p>
                      <span className="font-medium">Grade:</span>{" "}
                      {calculatedLayout.itemsPerColumn}x
                      {calculatedLayout.itemsPerRow}={" "}
                      <span className="font-bold">
                        {calculatedLayout.totalItemsPerPage} itens por página
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Total de páginas:</span>{" "}
                      {calculatedLayout.totalPages}
                    </p>
                    <p>
                      <span className="font-medium">Tamanho de cada item:</span>{" "}
                      {Math.round(calculatedLayout.actualItemWidth)}x
                      {Math.round(calculatedLayout.actualItemHeight)}mm
                    </p>
                  </div>

                  {/* Visualização da grade com espaçamento */}
                  <div className="mt-4 flex justify-center">
                    <div
                      className="border-2 border-green-400 bg-white relative"
                      style={{
                        width: "120px",
                        height: `${
                          120 *
                          (pageLayout.orientation === "landscape"
                            ? pageLayout.pageSize.width /
                              pageLayout.pageSize.height
                            : pageLayout.pageSize.height /
                              pageLayout.pageSize.width)
                        }px`,
                        maxHeight: "160px",
                      }}
                    >
                      {Array.from({
                        length: calculatedLayout.totalItemsPerPage,
                      }).map((_, index) => {
                        const row = Math.floor(
                          index / calculatedLayout.itemsPerRow,
                        );
                        const col = index % calculatedLayout.itemsPerRow;

                        // Debug apenas para o primeiro item
                        if (index === 0) {
                          console.log("Debug Preview:", {
                            totalItems: calculatedLayout.totalItemsPerPage,
                            rows: calculatedLayout.itemsPerColumn,
                            cols: calculatedLayout.itemsPerRow,
                            orientation: pageLayout.orientation,
                          });
                        }

                        // Obter dimensões reais da página considerando orientação
                        let realPageWidth = pageLayout.pageSize.width;
                        let realPageHeight = pageLayout.pageSize.height;

                        if (pageLayout.pageSize.name === "Personalizado") {
                          realPageWidth = pageLayout.customWidth || 210;
                          realPageHeight = pageLayout.customHeight || 297;
                        }

                        // Aplicar orientação
                        if (pageLayout.orientation === "landscape") {
                          [realPageWidth, realPageHeight] = [
                            realPageWidth,
                            realPageHeight,
                          ];
                        }

                        // Calcular posição com espaçamento e centralização
                        const spacingPercent =
                          (pageLayout.spacing / realPageWidth) * 100;
                        const itemWidth =
                          (calculatedLayout.actualItemWidth / realPageWidth) *
                          100;
                        const itemHeight =
                          (calculatedLayout.actualItemHeight / realPageHeight) *
                          100;
                        const spacingPercentVertical =
                          (pageLayout.spacing / realPageHeight) * 100;

                        // Calcular dimensões totais do grid
                        const totalGridWidthPercent =
                          calculatedLayout.itemsPerRow * itemWidth +
                          (calculatedLayout.itemsPerRow - 1) * spacingPercent;
                        const totalGridHeightPercent =
                          calculatedLayout.itemsPerColumn * itemHeight +
                          (calculatedLayout.itemsPerColumn - 1) *
                            spacingPercentVertical;

                        // Centralizar o grid
                        const startXPercent = (100 - totalGridWidthPercent) / 2;
                        const startYPercent =
                          (100 - totalGridHeightPercent) / 2;

                        return (
                          <div
                            key={index}
                            className="absolute border border-green-500 bg-green-100 flex items-center justify-center"
                            style={{
                              left: `${startXPercent + col * (itemWidth + spacingPercent)}%`,
                              top: `${startYPercent + row * (itemHeight + spacingPercentVertical)}%`,
                              width: `${itemWidth}%`,
                              height: `${itemHeight}%`,
                              fontSize: "8px",
                              color: "#059669",
                            }}
                          >
                            {index + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Instruções */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Como usar:
                </h3>
                <ol className="text-blue-700 space-y-2">
                  <li>1. Faça upload da imagem que será o fundo do item</li>
                  <li>2. Defina a faixa numérica (número inicial e final)</li>
                  <li>
                    3. Configure o tamanho da página e espaçamento entre itens
                  </li>
                  <li>
                    4. Configure a formatação do texto (fonte, tamanho, cor,
                    etc.)
                  </li>
                  <li>
                    5. Clique na imagem para definir onde o número deve aparecer
                  </li>
                  <li>
                    6. O sistema calculará automaticamente quantos itens cabem
                    por página
                  </li>
                  <li>
                    7. Clique em "Gerar PDF" para baixar o arquivo otimizado
                  </li>
                </ol>
              </div>
            </div>

            {/* Botão fixo na parte inferior */}
            <div className="bg-white border-t p-4 mt-4">
              <button
                onClick={handleGeneratePDF}
                disabled={!canGeneratePDF || isGenerating}
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold text-white transition-all
                  ${
                    canGeneratePDF && !isGenerating
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Gerando PDF...
                  </span>
                ) : (
                  "Gerar PDF"
                )}
              </button>

              {!canGeneratePDF && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Complete todas as configurações para habilitar a geração do
                  PDF
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
