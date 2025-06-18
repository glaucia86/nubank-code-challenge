Com certeza! Aqui está um **README.md** revisado, detalhado e alinhado ao desafio (execução e testes automatizados), além do exemplo de script `test-calculator.sh` pronto para facilitar a avaliação.

---

# 💰 Ganho de Capital - Desafio de Código (CLI)

## 📌 Descrição

Esta aplicação de linha de comando calcula o imposto sobre ganho de capital em operações de compra e venda de ações no mercado financeiro, conforme especificação do desafio técnico Nubank.

A entrada é recebida via **stdin** (padrão do terminal), e a saída é impressa no **stdout**, ambos no formato JSON. A solução foi desenvolvida com foco em clareza, simplicidade e cobertura total das regras de negócio solicitadas.

---

## 🧠 Decisões Técnicas

* Uso de **funções puras** e **transparência referencial** para facilitar testes e manutenção.
* O **estado da carteira** (ações, preço médio, prejuízo acumulado) é gerenciado em memória, reiniciado a cada simulação.
* O processamento das operações segue rigorosamente a ordem cronológica.
* Não há dependências externas além do necessário para o build e testes.

---

## 🧱 Estrutura do Projeto

* `src/index.ts` — Entrada e saída padrão do programa (CLI).
* `src/calculator.ts` — Lógica central do cálculo de impostos.
* `src/types.ts` — Tipagem forte para operações e estados.
* `tests/` — Testes unitários com cobertura de todos os cenários do desafio.

---

## 📚 Bibliotecas Utilizadas

* **decimal.js** — Para precisão em cálculos financeiros.
* **Jest** — Para testes unitários automatizados.

Justificativa: Uso restrito de bibliotecas para garantir leveza e portabilidade, focando em robustez e precisão dos cálculos.

---

## ▶️ Como Executar

### 1. **Instalar dependências e buildar**

Execute o script de preparação:

```bash
./run.sh
```

Esse comando irá instalar as dependências e compilar o projeto.

### 2. **Rodar a aplicação**

#### **Modo Interativo (entrada manual no terminal):**

```bash
npm start
```

Digite cada linha de operações (um array JSON por linha) e pressione ENTER.
Finalize a entrada com uma linha vazia.

#### **Modo Automático (usando um arquivo de entrada):**

```bash
npm start < entrada-completa.json
```

Ou diretamente:

```bash
node dist/index.js < entrada-completa.json
```

Cada linha do arquivo deve conter um array JSON de operações, conforme exemplo abaixo.

---

### **Exemplo de entrada (`stdin` ou arquivo):**

```json
[{"operation":"buy", "unit-cost":10.00, "quantity": 10000}, {"operation":"sell", "unit-cost":20.00, "quantity": 5000}]
```

### **Exemplo de saída (`stdout`):**

```json
[{"tax":0},{"tax":10000}]
```

---

## 🧪 Testes Automatizados

**Rodando todos os testes com cobertura:**

Execute o script:

```bash
./test-calculator.sh
```

Ou rode manualmente:

```bash
npm run test
```

**O que é testado?**

* Operações de compra e venda (simples e combinadas)
* Regra de isenção até R\$20.000
* Dedução de prejuízo acumulado
* Cálculo de preço médio ponderado
* Casos complexos e edge cases do desafio

---

## 📏 Regras Implementadas

* **Compra:** nunca paga imposto.
* **Venda:** isenta se valor total ≤ R\$20.000,00.
* **Imposto:** 20% sobre o lucro em vendas acima do limite.
* **Prejuízo:** deduzido de lucros futuros.
* **Preço médio:** recalculado a cada compra.
* **Validação:** nunca vende mais ações do que existem no portfólio.
* **Precisão:** todos os valores arredondados para duas casas decimais.

---

## 🧼 Boas Práticas Adotadas

* Código limpo, modular, bem tipado e com testes automatizados.
* Separação clara de responsabilidades.
* Sem dependência de banco de dados ou serviços externos.
* Sem prompts, mensagens extras ou arquivos de configuração desnecessários.

---

## ▶️ Scripts de Execução

### `run.sh`

```bash
#!/bin/bash
set -e

npm install
npm run build
```

### `test-calculator.sh`

```bash
#!/bin/bash

npm run test:coverage tests/calculator.test.ts
```

*(Você pode incluir o modo watch se quiser facilitar desenvolvimento, mas geralmente para avaliação basta cobertura.)*

---

## 📁 Como Submeter

Para enviar sua solução:

```bash
git archive --format=zip --output=./capital-gains.zip HEAD
```

---

## ✨ Obrigada pela oportunidade!

Espero que este desafio tenha sido tão enriquecedor para você quanto foi para mim. Estou à disposição para qualquer dúvida ou feedback!
