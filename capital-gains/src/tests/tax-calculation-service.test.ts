import { TaxCalculationService } from "../calculator"
import { Operation } from "../types";

describe('Tax Calculation Service Tests', () => {
  let service: TaxCalculationService;

  beforeEach(() => {
    service = new TaxCalculationService();
  });

  describe('Compatibilidade com casos existentes', () => {
    it('deve manter comportamento idêntico ao calcular original', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 20.00, quantity: 5000 },
      ];

      const results = service.calculateTaxes(operations);

      expect(results).toEqual([
        { tax: 0 },
        { tax: 10000 }
      ]);
    });

    it('deve processar todos os casos do desafio corretamente', () => {
      const operations: Operation[] = [
        { operation: 'buy', 'unit-cost': 10.00, quantity: 10000 },
        { operation: 'sell', 'unit-cost': 5.00, quantity: 5000 },
        { operation: 'sell', 'unit-cost': 20.00, quantity: 3000 }
      ];

      const results = service.calculateTaxes(operations);

      expect(results).toEqual([
        { tax: 0 },
        { tax: 0 },
        { tax: 1000 }
      ]);
    });
  });

  describe('Melhorias de design', () => {
   it('deve permitir injeção de portfolio para testes', () => {
    const { Portfolio } = require('../domain/entities/portfolio');
    const { Money } = require('../domain/value-objects/money');

    const portfolio = new Portfolio();
    portfolio.recordPurchase(1000, Money.fromNumber(15));

    const serviceWithPortfolio = new TaxCalculationService(portfolio);

    const operations: Operation[] = [
      { operation: 'sell', 'unit-cost': 20.00, quantity: 500 }
    ];

    const results = serviceWithPortfolio.calculateTaxes(operations);

    expect(results[0].tax).toBe(500); 
   });
  });
});