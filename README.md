# 💰 Ganho de Capital - Desafio de Código (CLI)

## 📌 Descrição

Este projeto é uma aplicação de linha de comando que calcula o imposto sobre ganho de capital em operações de compra e venda de ações no mercado financeiro. Ele foi desenvolvido como parte de um desafio técnico com foco em clareza, simplicidade e elegância arquitetural.

A aplicação recebe entradas via `stdin` no formato JSON e retorna a saída também em JSON, seguindo as regras descritas no enunciado do desafio.

## 🧠 Decisões Técnicas

- Utilizei uma estrutura baseada em **funções puras** e **transparência referencial** para manter o código testável e com baixo acoplamento.
- O **estado da carteira** (quantidade, média ponderada, prejuízo acumulado) é armazenado em memória e reiniciado a cada linha de entrada, garantindo independência entre simulações.
- As operações são processadas sequencialmente, respeitando a ordem cronológica dos eventos.

## 🧱 Arquitetura

- `main.ts` / `main.py` / `main.rs`: entrada e saída padrão.
- `parser.ts`: parser de entrada JSON.
- `tax-calculator.ts`: lógica central de cálculo de impostos.
- `portfolio.ts`: controle do estado da carteira.
- `tests/`: testes unitários e de integração com múltiplos cenários.

## 📚 Bibliotecas Utilizadas

- ⚙️ [Linguagem padrão do projeto] — sem frameworks desnecessários.
- ✅ [Biblioteca de testes, se aplicável]: utilizada para garantir cobertura e robustez.

> Justificativa: o uso foi limitado a bibliotecas nativas ou extremamente leves, para evitar sobrecarga desnecessária.

## 🧪 Testes

Rodar testes (ajustar conforme a linguagem):

```bash
# Exemplo com Node.js + Jest
npm install
npm run test

# Exemplo com Python + pytest
pip install -r requirements.txt
pytest
````

Os testes cobrem:

* Operações simples de compra/venda
* Casos com prejuízo acumulado
* Casos com isenção até R\$20.000,00
* Casos de lucro tributável com e sem prejuízo deduzido

## ▶️ Execução

Você pode rodar o programa redirecionando um arquivo ou digitando diretamente no terminal:

```bash
# Redirecionando input
./capital-gains < input.txt

# Ou manualmente
node main.js
```

### Exemplo de entrada (stdin):

```json
[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},
 {"operation":"sell", "unit-cost":20.00, "quantity": 5000}]
```

### Exemplo de saída (stdout):

```json
[{"tax": 0.0}, {"tax": 10000.0}]
```

## 📏 Regras Implementadas

* Nenhum imposto para operações de compra.
* Nenhum imposto para vendas com valor total ≤ R\$20.000,00.
* Imposto de 20% sobre lucro em vendas com valor > R\$20.000,00.
* Prejuízos acumulados são deduzidos de lucros futuros.
* O cálculo do preço médio ponderado é atualizado a cada compra.
* Nenhuma operação vende mais ações do que existem no portfólio.

## 🧼 Boas Práticas Adotadas

* Código limpo e modularizado.
* Separação clara de responsabilidades.
* Testes automatizados.
* Tipagem forte (se aplicável).
* Arredondamento para duas casas decimais.
* Sem dependência externa de banco de dados.

## 💬 Observações Finais

* Toda a solução foi escrita de forma **anônima**, sem metadados, nomes, comentários ou anotações pessoais.
* O projeto é **executável em ambiente Unix/Mac**.
* Se desejar buildar uma imagem Docker (opcional), use:

```bash
docker build -t capital-gains .
```

---

📁 **Nota**: Para submeter, gere o arquivo zipado com:

```bash
git archive --format=zip --output=./capital-gains.zip HEAD
```

---

## ✨ Obrigado pela oportunidade!

Se quiser, posso adaptar esse `README.md` para uma linguagem específica (Node.js, Python, Rust etc.) e criar os comandos adequados de instalação, execução e testes com base no seu projeto. Deseja isso?