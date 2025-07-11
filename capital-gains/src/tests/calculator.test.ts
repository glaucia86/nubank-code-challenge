import { Operation } from '../types';
import { calculateTaxes } from '../calculator';

describe('Calcular Impostos', () => {
  describe('Operações Básicas', () => {
    it('deve retornar 0 de imposto para operação de compra', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 100 }
      ];

      expect(calculateTaxes(operations)).toEqual([ { tax: 0 } ]);
    });

    it('deve calcular 20% de imposto sobre o lucro na operação de venda', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20.00, quantity: 5000 }
      ];

      expect(calculateTaxes(operations)).toEqual([ { tax: 0 }, { tax: 10000 } ]);
    });
  });

  it('deve retornar 0 de imposto para venda com prejuízo', () => {
    const operations: Operation[] = [
      { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
      { operation: 'sell', 'unit-cost': 5.00, quantity: 5000 }
    ];

    expect(calculateTaxes(operations)).toEqual([ { tax: 0 }, { tax: 0 } ]);
  });

  describe('Regra de Isenção (≤ R$ 20.000)', () => {
    it('deve isentar transações com valor total ≤ R$ 20.000', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 100},
        { operation: 'sell', 'unit-cost': 15.00, quantity: 50},
      ];

      expect(calculateTaxes(operations)).toEqual([ { tax: 0 }, { tax: 0 } ]);
    });

    it('deve cobrar imposto sobre transações > R$ 20.000', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 50.00, quantity: 10000 }
      ];
        expect(calculateTaxes(operations)).toEqual([
          { tax: 0 },
          { tax: 80000 }
      ]);
    });
  });

  describe('Cálculo de Média Ponderada', () => {
    it('deve calcular média ponderada corretamente com múltiplas compras', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'buy', 'unit-cost': 25.00, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 15.00, quantity: 10000 }
      ];
      expect(calculateTaxes(operations)).toEqual([
        { tax: 0 },
        { tax: 0 },
        { tax: 0 }
      ]);
    });
  });

  describe('Dedução de Prejuízos Acumulados', () => {
    it('deve deduzir prejuízo acumulado de lucros futuros', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 5.00, quantity: 5000 },   // Prejuízo: 25000
        { operation: 'sell', 'unit-cost': 20.00, quantity: 3000 }   // Lucro: 30000
      ];
      expect(calculateTaxes(operations)).toEqual([
        { tax: 0 },
        { tax: 0 },
        { tax: 1000 }
      ]);
    });

    it('deve acumular múltiplos prejuízos', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 20.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 10.00, quantity: 5000 },   // Prejuízo: 50000
        { operation: 'sell', 'unit-cost': 15.00, quantity: 3000 },   // Prejuízo: 15000
        { operation: 'sell', 'unit-cost': 30.00, quantity: 2000 }    // Lucro: 20000
      ];
      expect(calculateTaxes(operations)[3].tax).toBe(0);
    });
  });

  describe('Reset de Portfolio', () => {
    it('deve resetar média ponderada quando vender todas as ações', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 15.00, quantity: 10000 },  // Vende tudo
        { operation: 'buy', 'unit-cost': 20.00, quantity: 10000 },   // Nova compra
        { operation: 'sell', 'unit-cost': 25.00, quantity: 5000 }
      ];
      expect(calculateTaxes(operations)[3].tax).toBe(5000);
    });
  });

  describe('Edge Cases', () => {
    it('deve lidar com array vazio', () => {
      expect(calculateTaxes([])).toEqual([]);
    });

    it('deve lidar com valores decimais precisos', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.33, quantity: 100 },
        { operation: 'sell', 'unit-cost': 15.67, quantity: 50 }
      ];
      // total venda: 783.5 (<20000, isento)
      expect(calculateTaxes(operations)[1].tax).toBe(0);
    });

    it('deve arredondar imposto para 2 casas decimais', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 10.33, quantity: 10000 }
      ];
      // Lucro: 0.33 * 10000 = 3300. Imposto: 20% = 660.00
      expect(calculateTaxes(operations)[1].tax).toBe(660);
    });
  });

  describe('Caso Completo Nubank', () => {
    it('deve passar no caso mais complexo do desafio', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 5000.00, quantity: 10 },
        { operation: 'sell', 'unit-cost': 4000.00, quantity: 5 },
        { operation: 'buy', 'unit-cost': 15000.00, quantity: 5 },
        { operation: 'buy', 'unit-cost': 4000.00, quantity: 2 },
        { operation: 'buy', 'unit-cost': 23000.00, quantity: 2 },
        { operation: 'sell', 'unit-cost': 20000.00, quantity: 1 },
        { operation: 'sell', 'unit-cost': 12000.00, quantity: 10 },
        { operation: 'sell', 'unit-cost': 15000.00, quantity: 3 }
      ];
      expect(calculateTaxes(operations)).toEqual([
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 0 },
        { tax: 1000 },
        { tax: 2400 }
      ]);
    });
  });

});
