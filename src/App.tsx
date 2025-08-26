import { useState, useCallback } from "react";
import ImageUpload from "./components/ImageUpload";
import NumberRange from "./components/NumberRange";
import ImagePreview from "./components/ImagePreview";
import TextEditor from "./components/TextEditor";
import PageSettings from "./components/PageSettings";
import ImageDimensionsControl from "./components/ImageDimensionsControl";
import { generatePDF } from "./utils/pdfGenerator";
import { useLayoutCalculation } from "./hooks/useLayoutCalculation";
import { useConfigPersistence, useInitialConfig } from "./hooks/useLocalStorage";
import type {
  DualPositions,
  TextStyle,
  PageLayout,
  SavedConfig,
  PDFGenerationParams,
  ImageDimensions,
} from "./types";
import { DEFAULT_TEXT_STYLE, DEFAULT_PAGE_LAYOUT, DEFAULT_IMAGE_DIMENSIONS } from "./constants";

function App() {
  // Carregar configurações iniciais
  const initialConfig = useInitialConfig();

  // Estados principais
  const [, setImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [dualPositions, setDualPositions] = useState<DualPositions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Estados de configuração com valores padrão
  const [startNumber, setStartNumber] = useState<number>(
    initialConfig?.startNumber ?? 1
  );
  const [endNumber, setEndNumber] = useState<number>(
    initialConfig?.endNumber ?? 100
  );
  const [zeroPadding, setZeroPadding] = useState<number>(
    initialConfig?.zeroPadding ?? 0
  );
  const [textStyle, setTextStyle] = useState<TextStyle>(
    initialConfig?.textStyle ?? DEFAULT_TEXT_STYLE
  );
  const [pageLayout, setPageLayout] = useState<PageLayout>(
    initialConfig?.pageLayout ?? DEFAULT_PAGE_LAYOUT
  );
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>(
    initialConfig?.imageDimensions ?? DEFAULT_IMAGE_DIMENSIONS
  );

  // Hook para cálculo de layout
  const { calculatedLayout, isCalculating } = useLayoutCalculation({
    imageSrc,
    pageLayout,
    startNumber,
    endNumber,
    imageDimensions,
  });

  // Hook para persistência de configurações
  const configToSave: SavedConfig = {
    textStyle,
    pageLayout,
    startNumber,
    endNumber,
    zeroPadding,
    imageDimensions,
  };
  useConfigPersistence(configToSave);

  // Handlers otimizados
  const handleImageSelect = useCallback((file: File, dataUrl: string) => {
    setImageFile(file);
    setImageSrc(dataUrl);
    setDualPositions(null);
  }, []);

  const handleGeneratePDF = useCallback(async () => {
    if (!imageSrc || !dualPositions?.primary || endNumber < startNumber) {
      alert("Por favor, complete todas as configurações antes de gerar o PDF.");
      return;
    }

    if (!calculatedLayout) {
      alert("Aguarde o cálculo do layout ser concluído.");
      return;
    }

    setIsGenerating(true);

    try {
      const params: PDFGenerationParams = {
        imageSrc,
        startNumber,
        endNumber,
        dualPositions,
        textStyle,
        pageLayout,
        calculatedLayout,
        zeroPadding,
      };

      await generatePDF(params);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  }, [
    imageSrc,
    dualPositions,
    endNumber,
    startNumber,
    calculatedLayout,
    textStyle,
    pageLayout,
    zeroPadding,
  ]);

  // Estados derivados
  const canGeneratePDF =
    imageSrc && dualPositions?.primary && endNumber >= startNumber;

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Numerador PDF
          </h1>
          <p className="text-sm text-gray-600">
            Crie itens numerados otimizados para impressão - múltiplos itens por
            página
          </p>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex gap-6 p-4">
          {/* Configurações com scroll */}
          <div className="w-1/2 overflow-y-auto pr-4">
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  1. Upload da Imagem
                </h2>
                <ImageUpload onImageSelect={handleImageSelect} />
              </div>

              {imageSrc && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <ImageDimensionsControl
                    dimensions={imageDimensions}
                    onDimensionsChange={setImageDimensions}
                    imageSrc={imageSrc}
                  />
                </div>
              )}

              <div className="bg-white rounded-lg shadow-md p-4">
                <NumberRange
                  startNumber={startNumber}
                  endNumber={endNumber}
                  onStartNumberChange={setStartNumber}
                  onEndNumberChange={setEndNumber}
                  zeroPadding={zeroPadding}
                  onZeroPaddingChange={setZeroPadding}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <PageSettings
                  layout={pageLayout}
                  onLayoutChange={setPageLayout}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-4">
                <TextEditor
                  textStyle={textStyle}
                  onTextStyleChange={setTextStyle}
                />
              </div>
            </div>
          </div>

          {/* Preview - Coluna direita fixa */}
          <div className="w-1/2 flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              {imageSrc && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    4. Posicionamento do Número
                  </h2>
                  <ImagePreview
                    imageSrc={imageSrc}
                    dualPositions={dualPositions}
                    onPositionSelect={setDualPositions}
                    textStyle={textStyle}
                    zeroPadding={zeroPadding}
                  />
                </div>
              )}

              {calculatedLayout && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-green-800 mb-2">
                    ✅ Layout Calculado Automaticamente
                    {isCalculating && (
                      <span className="ml-2 text-sm text-green-600">
                        (Recalculando...)
                      </span>
                    )}
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

                  {/* Visualização da grade simplificada */}
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
                        length: Math.min(calculatedLayout.totalItemsPerPage, 12),
                      }).map((_, index) => {
                        const row = Math.floor(
                          index / calculatedLayout.itemsPerRow
                        );
                        const col = index % calculatedLayout.itemsPerRow;

                        const itemWidth =
                          (calculatedLayout.actualItemWidth /
                            (pageLayout.orientation === "landscape"
                              ? pageLayout.pageSize.height
                              : pageLayout.pageSize.width)) *
                          100;
                        const itemHeight =
                          (calculatedLayout.actualItemHeight /
                            (pageLayout.orientation === "landscape"
                              ? pageLayout.pageSize.width
                              : pageLayout.pageSize.height)) *
                          100;

                        const totalGridWidthPercent =
                          calculatedLayout.itemsPerRow * itemWidth;
                        const totalGridHeightPercent =
                          calculatedLayout.itemsPerColumn * itemHeight;

                        const startXPercent = (100 - totalGridWidthPercent) / 2;
                        const startYPercent =
                          (100 - totalGridHeightPercent) / 2;

                        return (
                          <div
                            key={index}
                            className="absolute border border-green-500 bg-green-100 flex items-center justify-center"
                            style={{
                              left: `${startXPercent + col * itemWidth}%`,
                              top: `${startYPercent + row * itemHeight}%`,
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-base font-semibold text-blue-800 mb-2">
                  Como usar:
                </h3>
                <ol className="text-blue-700 space-y-1 text-sm">
                  <li>1. Upload da imagem de fundo</li>
                  <li>2. Defina faixa numérica</li>
                  <li>3. Configure página e espaçamento</li>
                  <li>4. Configure formatação do texto</li>
                  <li>5. Clique na imagem para posicionar número</li>
                  <li>6. Layout calculado automaticamente</li>
                  <li>7. Gere o PDF otimizado</li>
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