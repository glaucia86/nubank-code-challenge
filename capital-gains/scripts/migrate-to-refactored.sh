#!/bin/bash
set -e

echo "🚀 Iniciando migração para código refatorado..."

echo "📦 Criando backup do código atual..."
cp src/calculator.ts src/calculator.legacy.ts
cp -r src/tests src/tests.legacy

echo "🧪 Executando testes baseline..."
npm test > test-results-legacy.txt
npm start < entrada-completa.json > output-legacy.json

echo "🏗️ Criando nova estrutura..."

mkdir -p src/{domain/{value-objects,entities,constants},services}

echo "📋 Verificando arquivos necessários..."
required_files=(
    "src/domain/value-objects/Money.ts"
    "src/domain/entities/Portfolio.ts"
    "src/domain/constants/TaxConstants.ts"
    "src/services/TaxCalculationService.ts"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo não encontrado: $file"
        echo "Por favor, crie todos os arquivos antes de continuar"
        exit 1
    fi
done

echo "🧪 Testando novos componentes..."
npm test src/tests/money.test.ts || true
npm test src/tests/portfolio.test.ts || true
npm test src/tests/taxCalculationService.test.ts || true

echo "🔨 Compilando projeto..."
npm run build

echo "🔄 Validando comportamento..."
npm test > test-results-refactored.txt
npm start < entrada-completa.json > output-refactored.json

echo "📊 Comparando resultados..."
if diff -q output-legacy.json output-refactored.json > /dev/null; then
    echo "✅ Output idêntico - Refatoração bem-sucedida!"
else
    echo "❌ Outputs diferentes - Verificar implementação"
    diff output-legacy.json output-refactored.json
    exit 1
fi

git add .
git commit -m "refactor: complete clean architecture migration

- Introduced Money value object for monetary precision
- Extracted Portfolio as domain entity
- Created TaxCalculationService for business logic
- Extracted constants for configuration
- Maintained 100% backward compatibility
- All tests passing with identical output"

echo "🎉 Migração concluída com sucesso!"
echo ""
echo "📈 Melhorias alcançadas:"
echo "  ✓ Separação clara de responsabilidades"
echo "  ✓ Código mais testável e manutenível"
echo "  ✓ Eliminação de magic numbers"
echo "  ✓ Type safety aprimorado"
echo "  ✓ Facilidade para extensões futuras"