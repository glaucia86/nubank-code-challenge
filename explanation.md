# Capital Gains Tax Calculator

- usando o pacote `decimal.js` para cálculos precisos para cálculos monetários
    - [https://www.npmjs.com/package/decimal.js](https://www.npmjs.com/package/decimal.js)


## 💡 Explicação das configurações:

`tsconfig.json`: Configurado para Node.js com verificações strict
`jest.config.js`: Configurado para TypeScript com cobertura mínima de 90%
`types.ts`: Interfaces simples e claras para type safety

## Explicação do código: `src/calculator.ts`

- `calculateTaxes`: calcula impostos sobre operações de ganho de capital. Esta função é a função principal que contém toda a lógica de negócio. 
  - @param operations: array de operações de compra/venda
  - @returns Array de resultados com impostos calculados

- `processBuy`: processa operação de compra. Atualiza a média ponderada e não gera imposto. A fórmula é: 
  - `(qtd_atual * média_atual) + (qtd_nova * preço_novo)) / (qtd_total)`

- `processSell`: processa operação de venda. Calcula lucro/prejuízo e aplica regras de imposto.

## Explicação do código: `src/index.ts`

- `main`: função principal que lê o arquivo de entrada, chama o `calculateTaxes` e escreve o resultado no arquivo de saída. 
  - @param inputFile: caminho do arquivo de entrada
  - @param outputFile: caminho do arquivo de saída