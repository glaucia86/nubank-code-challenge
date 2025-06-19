import { Portfolio } from "../domain/entities/portfolio";
import { Money } from "../domain/value-objects/money";

describe('Portfolio Entity', () => {
  let portfolio: Portfolio;

  beforeEach(() => {
    portfolio = new Portfolio();
  });

  describe('Estado Inicial', () => {
    it('deve iniciar com zero ações e valores zerados', () => {
      expect(portfolio.getShares()).toBe(0);
      expect(portfolio.getAveragePrice().isZero()).toBe(true);
      expect(portfolio.getAccumulatedLoss().isZero()).toBe(true);
    });
  });

  describe('Operações de Compra', () => {
    it('deve registrar primeira compra corretamente', () => {
      portfolio.recordPurchase(100, Money.fromNumber(10));

      expect(portfolio.getShares()).toBe(100);
      expect(portfolio.getAveragePrice().toNumber()).toBe(10);
    });

    it('deve calcular média ponderada com múltiplas compras', () => {
      portfolio.recordPurchase(10000, Money.fromNumber(10));
      portfolio.recordPurchase(5000, Money.fromNumber(25));

      expect(portfolio.getShares()).toBe(15000);
      expect(portfolio.getAveragePrice().toNumber()).toBe(15);
    });
  });

  describe('Operações de Venda', () => {
    beforeEach(() => {
      portfolio.recordPurchase(100, Money.fromNumber(10));
    });

    it('deve registrar venda parcial', () => {
      portfolio.recordSale(50);

      expect((portfolio.getShares())).toBe(50);
      expect(portfolio.getAveragePrice().toNumber()).toBe(10);
    });

    it('deve resetar média ao vender todas as ações', () => {
      portfolio.recordSale(100);

      expect(portfolio.getShares()).toBe(0);
      expect(portfolio.getAveragePrice().isZero()).toBe(true);
    });

    it('deve lançar erro ao tentar vender mais do que possui', () => {
      expect(() => portfolio.recordSale(200)).toThrow('Cannot sell 200 shares. Only 100 available.'); 
    });
  });

  describe('Cálculo de Cost Basis', () => {
    it('deve calcular cost basis corretamente', () => {
      portfolio.recordPurchase(100, Money.fromNumber(10));

      const costBasis = portfolio.calculateCostBasis(50);
      expect(costBasis.toNumber()).toBe(500);
    });
  });

  //
  describe('Gestão de Prejuízos', () => {
    it('deve acumular prejuízos', () => {
      portfolio.recordLoss(Money.fromNumber(1000));
      portfolio.recordLoss(Money.fromNumber(500));

      expect(portfolio.getAccumulatedLoss().toNumber()).toBe(1500);
    });

    it('deve reduzir prejuízo de lucro maior', () => {
      portfolio.recordLoss(Money.fromNumber(1000));

      const netProfit = portfolio.applyLossDeduction(Money.fromNumber(1500));

      expect(netProfit.toNumber()).toBe(500);
      expect(portfolio.getAccumulatedLoss().isZero()).toBe(true);
    });

    it('deve manter prejuízo residual quando lucro é menor', () => {
      portfolio.recordLoss(Money.fromNumber(1000));

      const netProfit = portfolio.applyLossDeduction(Money.fromNumber(300));

      expect(netProfit.isZero()).toBe(true);
      expect(portfolio.getAccumulatedLoss().toNumber()).toBe(700);
    });
  });

  describe('Interoperabilidade com código legado', () => {
    it('deve criar Portfolio a partir de estado legado', () => {
      const legacyState = {
        shares: 100,
        averagePrice: { toNumber: () => 15.50 },
        accumulatedLoss: { toNumber: () => 500 }
      }

      const portfolio = Portfolio.fromLegacyState(legacyState);

      expect(portfolio.getShares()).toBe(100);
      expect(portfolio.getAveragePrice().toNumber()).toBe(15.50);
      expect(portfolio.getAccumulatedLoss().toNumber()).toBe(500);
    });

    it('deve exportar para formato legado', () => {
      portfolio.recordPurchase(100, Money.fromNumber(10));
      portfolio.recordLoss(Money.fromNumber(200));

      const legacyState = portfolio.toLegacyState();

      expect(legacyState.shares).toBe(100);
      expect(legacyState.averagePrice).toBe(10);
      expect(legacyState.accumulatedLoss).toBe(200);
    });
  });
})