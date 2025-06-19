import { Portfolio } from "../domain/entities/Portfolio"

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
      portfolio.recordPurchase
    })
  })
})