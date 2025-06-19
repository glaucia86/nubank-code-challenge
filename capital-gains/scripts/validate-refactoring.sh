#!/bin/bash
set -e

echo "🔍 Validando refatoração"

echo "📦 Compilando TypeScript..."
npm run build

echo "🧪 Executando testes..."
npm test

echo "🔄 Comparando outputs..."
npm start < entrada-completa.json > output-current.json

if diff -q output-baseline.json output-current.json > /dev/null; then
  echo "✅ Output idêntico ao baseline"
else
  echo "❌ Output diferente do baseline"
  echo "Veja as diferenças:"
  diff output-baseline.json output-current.json
  exit 1
fi

echo "🎉 Validação de refatoração concluída com sucesso!"