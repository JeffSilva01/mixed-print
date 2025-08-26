# Arquitetura do Projeto

## Estrutura de Pastas

```
src/
├── components/          # Componentes React otimizados
│   ├── ImageUpload.tsx     # Upload de imagens com validação
│   ├── ImagePreview.tsx    # Preview e posicionamento de números
│   ├── NumberRange.tsx     # Configuração de faixa numérica
│   ├── PageSettings.tsx    # Configurações de página
│   └── TextEditor.tsx      # Editor de estilo de texto
├── hooks/               # Hooks personalizados
│   ├── useDragAndDrop.ts   # Lógica de arrastar e soltar
│   ├── useImageUpload.ts   # Gerenciamento de upload
│   ├── useLayoutCalculation.ts # Cálculo de layouts
│   └── useLocalStorage.ts  # Persistência de dados
├── types/               # Tipos TypeScript centralizados
│   └── index.ts           # Todas as interfaces e tipos
├── constants/           # Constantes e configurações
│   └── index.ts           # Valores padrão e opções
├── services/            # Serviços e APIs
│   └── storage.ts         # Serviço de localStorage
├── utils/               # Utilitários e helpers
│   ├── helpers.ts         # Funções utilitárias
│   ├── layoutCalculator.ts # Cálculo de layouts
│   └── pdfGenerator.ts    # Geração de PDF
└── App.tsx              # Componente principal
```

## Principais Melhorias Implementadas

### 1. Organização Estrutural
- **Separação de responsabilidades**: Cada pasta tem um propósito específico
- **Imports otimizados**: Uso de `import type` para tipos TypeScript
- **Centralização**: Tipos, constantes e utilitários centralizados

### 2. Performance
- **React.memo**: Todos os componentes foram otimizados com memo
- **useCallback**: Callbacks otimizados para evitar re-renders
- **Debounce**: Implementado para cálculos de layout
- **Lazy evaluation**: Carregamento sob demanda de recursos

### 3. Hooks Personalizados
- **useDragAndDrop**: Gerencia toda lógica de arrastar e soltar
- **useImageUpload**: Validação e processamento de upload
- **useLayoutCalculation**: Cálculo otimizado de layouts
- **useLocalStorage**: Persistência automática de configurações

### 4. Validação e Tratamento de Erros
- **Validação de arquivos**: Tipo, tamanho e formato
- **Estados de loading**: Feedback visual durante operações
- **Tratamento robusto**: Try/catch em operações críticas

### 5. Tipagem Forte
- **Interfaces centralizadas**: Todos os tipos em um local
- **Type safety**: Tipagem rigorosa em todo o projeto
- **Props tipadas**: Todas as props dos componentes

## Hooks Personalizados

### useDragAndDrop
Gerencia a funcionalidade completa de arrastar e soltar:
- Detecção de movimento
- Cálculo de posições relativas
- Estados de drag (arrastrando, clicando)

### useLayoutCalculation
Calcula layouts automaticamente:
- Debounce para performance
- Recálculo automático quando necessário
- Estados de loading

### useImageUpload
Gerencia upload de imagens:
- Validação de tipo e tamanho
- Conversão para DataURL
- Estados de erro e loading

### useLocalStorage
Persistência automática:
- Salvamento automático de configurações
- Carregamento na inicialização
- Tratamento de erros

## Componentes Otimizados

Todos os componentes foram refatorados com:
- **React.memo** para otimização de re-renders
- **useCallback** para handlers otimizados
- **Composição melhorada** com menos props drilling
- **Estados locais otimizados**

## Utilitários

### helpers.ts
- Formatação de números
- Conversões de unidades
- Validações
- Debounce
- Utilitários matemáticos

### storage.ts
Serviço de localStorage com:
- Métodos para salvar/carregar
- Tratamento de erros
- Verificação de disponibilidade

## Benefícios da Nova Arquitetura

1. **Manutenibilidade**: Código mais limpo e organizado
2. **Performance**: Otimizações em todos os níveis
3. **Escalabilidade**: Fácil adição de novas funcionalidades
4. **Testabilidade**: Hooks e utilitários isolados
5. **Developer Experience**: Melhor experiência de desenvolvimento
6. **Type Safety**: Tipagem forte reduz bugs

## Configurações Salvas

O sistema agora salva automaticamente:
- Estilo do texto (fonte, tamanho, cor, etc.)
- Configurações de página
- Faixa numérica
- Padding de zeros

## Performance

Otimizações implementadas:
- Debounce em cálculos pesados
- Memo em componentes
- Callbacks otimizados
- Lazy loading de recursos
- Minimização de re-renders