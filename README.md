# 📄 Numerador PDF

Sistema inteligente para criação de itens numerados otimizados para impressão, com suporte a múltiplos itens por página e agrupamento especial para facilitar o corte e montagem de blocos numerados.

## ✨ Funcionalidades

### 🎯 **Geração de PDFs Numerados**
- Upload de imagem de fundo personalizada
- Definição de faixa numérica (início e fim)
- Posicionamento preciso dos números na imagem
- Suporte a texto duplo (principal + canhoto)

### 📐 **Configuração Inteligente de Layout**
- **Tamanhos de página**: A4, A3 ou personalizado
- **Orientação**: Retrato ou paisagem
- **Espaçamento**: Controle preciso entre itens
- **Cálculo automático**: Sistema determina quantos itens cabem por página
- **Centralização automática**: Conteúdo sempre centralizado na página

### ✂️ **Agrupamento para Corte (Exclusivo!)**
Funcionalidade especial que reorganiza a numeração para facilitar a montagem após o corte:

**Sem agrupamento (normal):**
```
Página 1: 1, 2, 3, 4, 5, 6
Página 2: 7, 8, 9, 10, 11, 12
```

**Com agrupamento ativado:**
```
Página 1: 1, 7, 13, 19, 25, 31
Página 2: 2, 8, 14, 20, 26, 32
Página 3: 3, 9, 15, 21, 27, 33
```

**Resultado:** Após cortar, os blocos já ficam na ordem numérica perfeita!

### 🎨 **Personalização Avançada**
- **Fontes**: Arial, Helvetica, Times New Roman, Courier, Georgia, etc.
- **Estilos**: Negrito, itálico, tamanhos variados
- **Cores**: Seletor de cor completo
- **Marcas de corte**: Guias para facilitar o recorte (5mm padrão)

### 📊 **Visualização em Tempo Real**
- Preview da imagem com posicionamento dos números
- Cálculo automático do layout da página
- Visualização da grade de distribuição
- Informações detalhadas do resultado final

## 🚀 Como Usar

### 1. **Upload da Imagem**
- Faça upload da imagem que será o fundo dos itens
- Sistema detecta automaticamente o tamanho e calcula o DPI

### 2. **Defina os Números**
- Configure o número inicial e final da sequência
- Ex: de 1 a 1000 para rifas

### 3. **Configure a Página**
- Escolha o tamanho da página (A4, A3 ou personalizado)
- Defina a orientação (retrato/paisagem)
- Ajuste o espaçamento entre itens
- **Ative "Agrupar ao Recortar"** se quiser facilitar a montagem

### 4. **Personalize o Texto**
- Escolha fonte, tamanho e cor
- Configure negrito/itálico conforme necessário

### 5. **Posicione os Números**
- Clique na imagem para definir onde os números devem aparecer
- Configure posição secundária se necessário (para canhotos)

### 6. **Gere o PDF**
- Clique em "Gerar PDF"
- Arquivo será baixado com timestamp único

## 🛠️ Tecnologias

- **React 19** - Interface moderna e responsiva
- **TypeScript** - Tipagem estática para maior confiabilidade
- **Tailwind CSS** - Estilização utilitária
- **jsPDF** - Geração de PDFs no cliente
- **Vite** - Build tool rápido e eficiente

## 🏃‍♂️ Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/mixed-print.git

# Entre na pasta do projeto
cd mixed-print

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Comandos Disponíveis
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview

# Lint do código
npm run lint
```

O projeto estará disponível em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ImageUpload.tsx   # Upload de imagens
│   ├── NumberRange.tsx   # Configuração de números
│   ├── PageSettings.tsx  # Configurações de página
│   ├── TextEditor.tsx    # Editor de texto
│   └── ImagePreview.tsx  # Preview e posicionamento
├── utils/
│   ├── pdfGenerator.ts   # Geração de PDFs
│   └── layoutCalculator.ts # Cálculos de layout
├── App.tsx              # Componente principal
└── main.tsx            # Entry point
```

## 🎯 Casos de Uso

### 📄 **Rifas e Sorteios**
- Crie rifas numeradas com logo personalizado
- Agrupamento especial facilita distribuição
- Controle preciso de quantidade

### 🏷️ **Etiquetas e Tags**
- Etiquetas numeradas para produtos
- Tags de identificação
- Cupons numerados

### 🎫 **Ingressos e Vouchers**
- Ingressos numerados para eventos
- Vouchers com numeração sequencial
- Controle de entrada

### 📋 **Documentos Numerados**
- Formulários com numeração
- Recibos sequenciais
- Documentos de controle

## 💡 Dicas de Uso

1. **Para melhor qualidade**: Use imagens com pelo menos 300 DPI
2. **Agrupamento**: Ative apenas se for cortar e montar blocos
3. **Marcas de corte**: Úteis quando há espaçamento entre itens
4. **Posicionamento**: Clique próximo ao centro do local desejado
5. **Preview**: Sempre confira o preview antes de gerar

## 📝 Exemplos de Nomes de Arquivos Gerados

```
numeracao-1-100-6por-pagina-24-08-2025-16-23-45.pdf
numeracao-1-1000-12por-pagina-24-08-2025-16-25-12.pdf
numeracao-501-1000-8por-pagina-24-08-2025-16-27-33.pdf
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔧 Desenvolvimento

O projeto utiliza:
- **ESLint** para linting
- **TypeScript** para tipagem
- **Vite** para desenvolvimento rápido
- **PostCSS** para processamento de CSS

## 🌟 Funcionalidades Especiais

### 🧮 **Cálculo Inteligente**
- Detecta automaticamente quantos itens cabem por página
- Ajusta proporções mantendo a qualidade da imagem
- Centralização automática do conteúdo

### 🎯 **Agrupamento Inovador**
- Funcionalidade única para facilitar montagem pós-corte
- Reorganização automática da sequência numérica
- Ideal para produção em larga escala

### 🖼️ **Suporte a Múltiplos Formatos**
- JPG, PNG, GIF suportados
- Detecção automática de DPI
- Redimensionamento inteligente

---

⭐ **Se este projeto foi útil, deixe uma estrela no GitHub!**