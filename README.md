# Capital Gains Tax Calculator

CLI para cálculo de impostos sobre ganhos de capital em operações de compra e venda de ações.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Instalação
```bash
# Instalar dependências e compilar
./run.sh

# Ou manualmente:
npm install
npm run build
```

### Execução

#### Arquivo de entrada
```bash
npm start < entrada-completa.json
```

#### Modo interativo
```bash
npm start
# Digite as operações JSON e pressione Ctrl+D para processar
```

#### Pipeline
```bash
echo '[{"operation":"buy", "unit-cost":10.00, "quantity": 100}]' | npm start
```

## 📋 Formato de Dados

### Entrada
```json
[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},
 {"operation":"sell", "unit-cost":20.00, "quantity": 5000}]
```

### Saída
```json
[{"tax":0},{"tax":10000}]
```

## 🧪 Testes

```bash
# Executar todos os testes com cobertura
npm run test:coverage

# Testes específicos
npm test src/tests/calculator.test.ts    # Unitários
npm test src/tests/ci.test.ts   # Integração
```

Cobertura: **>90%** em todas as métricas

## 🏗️ Arquitetura

```
src/
├── index.ts         # Entry point CLI
├── calculator.ts    # Lógica de cálculo de impostos
├── types.ts         # Definições TypeScript
└── tests/           # Testes unitários e integração
```

### Decisões Técnicas

1. **TypeScript**: Type safety para cálculos financeiros críticos
2. **Decimal.js**: Precisão monetária (evita erros de ponto flutuante)
3. **Arquitetura Funcional**: Funções puras, sem side effects
4. **Streaming I/O**: Processamento eficiente de grandes volumes

## 📐 Regras de Negócio

- **Imposto**: 20% sobre lucro líquido
- **Isenção**: Operações ≤ R$ 20.000
- **Média Ponderada**: Recalculada a cada compra
- **Prejuízos**: Acumulados e deduzidos de lucros futuros
- **Reset**: Média zerada ao vender todas as ações

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run build` | Compila TypeScript |
| `npm start` | Executa o CLI |
| `npm test` | Roda os testes |
| `npm run test:coverage` | Testes com cobertura |
| `npm run clean` | Limpa artefatos |

## 📦 Estrutura de Envio

```bash
# Gerar arquivo para submissão
git archive --format=zip --output=./capital-gains.zip HEAD
```

---

**Observação**: Esta implementação foca em corretude, manutenibilidade e aderência total às especificações do desafio.