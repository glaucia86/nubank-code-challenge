import { Money } from "../value-objects/Money";

export class Portfolio {
  private shares: number = 0;
  private averagePrice: Money = Money.zero();
  private accumulatedLoss: Money = Money.zero();

  getShares(): number {
    return this.shares;
  }

  getAveragePrice(): Money {
    return this.averagePrice;
  }

  getAccumulatedLoss(): Money {
    return this.accumulatedLoss;
  }

  recordSale(quantity: number): void {
    if (quantity > this.shares) {
      throw new Error(`Cannot sell ${quantity} shares. Only ${this.shares} available.`);
    }

    this.shares -= quantity;

    if (this.shares === 0) {
      this.averagePrice = Money.zero();
    }
  }

  calculateCostBasis(quantity: number): Money {
    return this.averagePrice.multiply(quantity);
  }

  recordLoss(loss: Money): void {
    this.accumulatedLoss = this.accumulatedLoss.add(loss);
  }

  applyLossDeduction(grossProfit: Money): Money {
    if (this.accumulatedLoss.isZero()) {
      return grossProfit;
    }    

    if (grossProfit.isGreaterThanOrEqual(this.accumulatedLoss)) {
      const netProfit = grossProfit.subtract(this.accumulatedLoss);
      this.accumulatedLoss = Money.zero();
      return netProfit;
    } else {
      this.accumulatedLoss = this.accumulatedLoss.subtract(grossProfit);
      return Money.zero();
    }
  }

    static fromLegacyState(state: {
    shares: number;
    averagePrice: { toNumber(): number };
    accumulatedLoss: { toNumber(): number };
  }): Portfolio {
    const portfolio = new Portfolio();
    portfolio.shares = state.shares;
    portfolio.averagePrice = Money.fromNumber(state.averagePrice.toNumber());
    portfolio.accumulatedLoss = Money.fromNumber(state.accumulatedLoss.toNumber());
    return portfolio;
  }

  toLegacyState(): {
    shares: number;
    averagePrice: number;
    accumulatedLoss: number;
  } {
    return {
      shares: this.shares,
      averagePrice: this.averagePrice.toNumber(),
      accumulatedLoss: this.accumulatedLoss.toNumber(),
    };
  }
}