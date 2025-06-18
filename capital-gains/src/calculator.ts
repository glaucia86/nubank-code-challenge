import Decimal from "decimal.js";
import { Operation, TaxResult } from "./types";

Decimal.set({precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function calculateTaxes(operations: Operation[]): TaxResult[] {

  const portfolio = {
    shares: 0,
    averagePrice: new Decimal(0),
    accumulatedLoss: new Decimal(0)
  };

  return operations.map(operation => {
    if (operation.operation === 'buy') {
      return processBuy(operation, portfolio);
    } else {
      return processSell(operation, portfolio);
    }
  });

}

function processBuy(
  operation: Operation, 
  portfolio: { shares: number; averagePrice: Decimal; accumulatedLoss: Decimal}): TaxResult {
    const currentTotalValue = portfolio.averagePrice.times(portfolio.shares);
    const newPurchaseValue = new Decimal(operation['unit-cost']).times(operation.quantity);
    const newTotalShares = portfolio.shares + operation.quantity;

    portfolio.shares = newTotalShares;
    portfolio.averagePrice = currentTotalValue
      .plus(newPurchaseValue)
      .dividedBy(newTotalShares);

    return {
      tax: 0
    };
}

function processSell(
  operation: Operation,
  portfolio: { shares: number; averagePrice: Decimal; accumulatedLoss: Decimal }
): TaxResult {
  const salePrice = new Decimal(operation['unit-cost']);
  const saleQuantity = operation.quantity;
  const saleValue = salePrice.times(saleQuantity);
  const costBasis = portfolio.averagePrice.times(saleQuantity);

  portfolio.shares -= saleQuantity;
  if (portfolio.shares === 0) {
    portfolio.averagePrice = new Decimal(0);
  }

  const result = saleValue.minus(costBasis);

  if (result.isNegative() || result.isZero()) {
    portfolio.accumulatedLoss = portfolio.accumulatedLoss.plus(result.abs());
    return { tax: 0 };
  }

  const EXEMPTION_LIMIT = 20000;
  if (saleValue.lessThanOrEqualTo(EXEMPTION_LIMIT)) {
    return { tax: 0 };
  }

  let netProfit = result;
  if (portfolio.accumulatedLoss.greaterThan(0)) {
    if (netProfit.greaterThanOrEqualTo(portfolio.accumulatedLoss)) {
      netProfit = netProfit.minus(portfolio.accumulatedLoss);
      portfolio.accumulatedLoss = new Decimal(0);
    } else {
      portfolio.accumulatedLoss = portfolio.accumulatedLoss.minus(netProfit);
      netProfit = new Decimal(0);
    }
  }

  if (netProfit.isZero()) {
    return { tax: 0 };
  }

  const TAX_RATE = 0.20;
  const tax = netProfit.times(TAX_RATE);

  return {
    tax: Number(tax.toFixed(2))
  };
}

export default calculateTaxes;