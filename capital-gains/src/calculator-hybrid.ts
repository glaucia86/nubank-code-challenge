import Decimal from "decimal.js";
import { Operation, TaxResult } from "./types";
import { Money } from "./domain/value-objects/Money";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function calculateTaxes(operations: Operation[]): TaxResult[] {
  const portfolio = {
    shares: 0,
    averagePrice: new Decimal(0),
    accumulatedLoss: new Decimal(0)
  };

  return operations.map(operation => {
    if (operation.operation === 'buy') {
      return processBuyHybrid(operation, portfolio);
    } else {
      return processSellHybrid(operation, portfolio);
    }
  });
}

function processBuyHybrid(operation: Operation, portfolio: { shares: number; averagePrice: Decimal; accumulatedLoss: Decimal; }): TaxResult {
  const currentValue = Money.fromDecimal(portfolio.averagePrice).multiply(portfolio.shares);
  const purchaseValue = Money.fromNumber(operation['unit-cost']).multiply(operation.quantity);
  const newTotalShares = portfolio.shares + operation.quantity;

  const newAverage = currentValue.add(purchaseValue).divide(newTotalShares);

  portfolio.shares = newTotalShares;
  portfolio.averagePrice = newAverage.toDecimal();

  return { tax: 0 };
}

function processSellHybrid(operation: Operation, portfolio: { shares: number; averagePrice: Decimal; accumulatedLoss: Decimal; }): TaxResult {
  const salePrice = Money.fromNumber(operation['unit-cost']);
  const saleValue = salePrice.multiply(operation.quantity);
  const costBasis = Money.fromDecimal(portfolio.averagePrice).multiply(operation.quantity);

  portfolio.shares -= operation.quantity;
  if (portfolio.shares === 0) {
    portfolio.averagePrice = new Decimal(0);
  }

  const result = saleValue.subtract(costBasis);

  if (result.isNegative() || result.isZero()) {
    const loss = Money.fromDecimal(portfolio.accumulatedLoss).add(result.abs());
    portfolio.accumulatedLoss = loss.toDecimal();

    return { tax: 0 };
  }

  const EXEMPTION_LIMIT = 20000;
  if (saleValue.isLessThanOrEqual(EXEMPTION_LIMIT)) {
    return { tax: 0 };
  }

  let netProfit = result;
    const accumulatedLoss = Money.fromDecimal(portfolio.accumulatedLoss);

  if (!accumulatedLoss.isZero()) {
    if (netProfit.isGreaterThanOrEqual(accumulatedLoss)) {
      netProfit = netProfit.subtract(accumulatedLoss);
      portfolio.accumulatedLoss = new Decimal(0);
    } else {
      const remainingLoss = accumulatedLoss.subtract(netProfit);
      portfolio.accumulatedLoss = remainingLoss.toDecimal();
      netProfit = Money.zero();
    }
  }

  if (netProfit.isZero()) {
    return { tax: 0 };
  }

  const TAX_RATE = 0.20;
  const tax = netProfit.multiply(TAX_RATE);

  return { tax: tax.toNumber() };
}

export default calculateTaxes;

