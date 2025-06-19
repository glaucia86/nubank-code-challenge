import { spawn } from 'child_process';
import { join } from 'path';

function runCLI(input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const cliPath = join(__dirname, '..', 'dist', 'index.js');
    const child = spawn('node', [cliPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let error = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`CLI exited with code ${code}: ${error}`));
      } else {
        resolve(output.trim());
      }
    });
    
    child.stdin.write(input);
    child.stdin.end();
  });
}

describe('Integration Tests - Specification Cases', () => {
  beforeAll(() => {
    const { execSync } = require('child_process');
    execSync('npm run build', { stdio: 'ignore' });
  });

  describe('Caso #1 - Operações com isenção', () => {
    test('deve isentar operações ≤ R$ 20.000', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 100},{"operation":"sell", "unit-cost":15.00, "quantity": 50},{"operation":"sell", "unit-cost":15.00, "quantity": 50}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 }
      ]);
    });
  });

  describe('Caso #2 - Lucro e prejuízo na mesma sequência', () => {
    test('deve calcular imposto no lucro e zero no prejuízo', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":20.00, "quantity": 5000},{"operation":"sell", "unit-cost":5.00, "quantity": 5000}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 10000.0 },
        { tax: 0.0 }
      ]);
    });
  });

  describe('Caso #3 - Dedução de prejuízo acumulado', () => {
    test('deve deduzir prejuízo acumulado de lucros futuros', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":5.00, "quantity": 5000},{"operation":"sell", "unit-cost":20.00, "quantity": 3000}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 1000.0 }
      ]);
    });
  });

  describe('Caso #4 - Múltiplas compras e média ponderada', () => {
    test('deve calcular média ponderada corretamente', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"buy", "unit-cost":25.00, "quantity": 5000},{"operation":"sell", "unit-cost":15.00, "quantity": 10000}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 }
      ]);
    });
  });

  describe('Caso #5 - Média ponderada com lucro na segunda venda', () => {
    test('deve calcular imposto apenas na venda com lucro', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"buy", "unit-cost":25.00, "quantity": 5000},{"operation":"sell", "unit-cost":15.00, "quantity": 10000},{"operation":"sell", "unit-cost":25.00, "quantity": 5000}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 10000.0 }
      ]);
    });
  });

  describe('Caso #6 - Múltiplas operações com dedução progressiva', () => {
    test('deve processar dedução progressiva de prejuízos', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":2.00, "quantity": 5000},{"operation":"sell", "unit-cost":20.00, "quantity": 2000},{"operation":"sell", "unit-cost":20.00, "quantity": 2000},{"operation":"sell", "unit-cost":25.00, "quantity": 1000}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 3000.0 }
      ]);
    });
  });

  describe('Caso #7 - Reset de portfolio', () => {
    test('deve resetar média quando todas ações são vendidas', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":2.00, "quantity": 5000},{"operation":"sell", "unit-cost":20.00, "quantity": 2000},{"operation":"sell", "unit-cost":20.00, "quantity": 2000},{"operation":"sell", "unit-cost":25.00, "quantity": 1000},{"operation":"buy", "unit-cost":20.00, "quantity": 10000},{"operation":"sell", "unit-cost":15.00, "quantity": 5000},{"operation":"sell", "unit-cost":30.00, "quantity": 4350},{"operation":"sell", "unit-cost":30.00, "quantity": 650}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 3000.0 },
        { tax: 0.0 },
        { tax: 0.0 },
        { tax: 3700.0 },
        { tax: 0.0 }
      ]);
    });
  });

  describe('Caso #8 - Operações independentes após vender tudo', () => {
    test('deve tratar novas compras como independentes', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 10000},{"operation":"sell", "unit-cost":50.00, "quantity": 10000},{"operation":"buy", "unit-cost":20.00, "quantity": 10000},{"operation":"sell", "unit-cost":50.00, "quantity": 10000}]`;
      
      const output = await runCLI(input);
      
      expect(JSON.parse(output)).toEqual([
        { tax: 0.0 },
        { tax: 80000.0 },
        { tax: 0.0 },
        { tax: 60000.0 }
      ]);
    });
  });

  describe('Múltiplos batches', () => {
    test('deve processar múltiplas linhas independentemente', async () => {
      const input = `[{"operation":"buy", "unit-cost":10.00, "quantity": 100}]
[{"operation":"buy", "unit-cost":20.00, "quantity": 200}]`;
      
      const output = await runCLI(input);
      const lines = output.split('\n');
      
      expect(JSON.parse(lines[0])).toEqual([{ tax: 0.0 }]);
      expect(JSON.parse(lines[1])).toEqual([{ tax: 0.0 }]);
    });
  });

  describe('Tratamento de erros', () => {
    test('deve retornar array vazio para JSON inválido', async () => {
      const input = 'invalid json';
      const output = await runCLI(input);
      expect(output).toBe('[]');
    });

    test('deve retornar array vazio para formato incorreto', async () => {
      const input = '{"not": "an array"}';
      const output = await runCLI(input);
      expect(output).toBe('[]');
    });
  });
});