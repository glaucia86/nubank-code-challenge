export interface Operation {
  operation: 'buy' | 'sell';
  'unit-cost': number;
  quantity: number;
}

export interface TaxResult {
  tax: number;
}

export interface PortfolioState {
  shares: number;
  averagePrice: number;
  accumulatedLoss: number;
}