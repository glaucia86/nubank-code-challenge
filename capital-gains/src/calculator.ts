import Decimal from "decimal.js";
import { Operation, TaxResult } from "./types";
import { Portfolio } from "./domain/entities/portfolio";
import { Money } from "./domain/value-objects/money";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function calculateTaxes(operations: Operation[]): TaxResult[] {
  const portfolio = new Portfolio();

  return operations.map(operation => {
    if (operation.operation === 'buy') {
      return processBuyWithPortfolio(operation, portfolio);
    } else {
      return processSellWithPortfolio(operation, portfolio);
    }
  });
}

function processBuyWithPortfolio(operation: Operation, portfolio: Portfolio): TaxResult {
  const unitPrice = Money.fromNumber(operation['unit-cost']);
  portfolio.recordPurchase(operation.quantity, unitPrice);

  return { tax: 0 };
}

function processSellWithPortfolio(operation: Operation, portfolio: Portfolio): TaxResult {
  const unitPrice = Money.fromNumber(operation['unit-cost']);
  const quantity = operation.quantity;
  const saleValue = unitPrice.multiply(quantity);

  const costBasis = portfolio.calculateCostBasis(quantity);
  const operationResult = saleValue.subtract(costBasis);

  portfolio.recordSale(quantity);

  if (operationResult.isNegative() || operationResult.isZero()) {
    portfolio.recordLoss(operationResult.abs());

    return { tax: 0 };
  }

  const EXEMPTION_LIMIT = 20000;
  if (saleValue.isLessThanOrEqual(EXEMPTION_LIMIT)) {
    return { tax: 0 };
  }

  const netProfit = portfolio.applyLossDeduction(operationResult);

  if (netProfit.isZero()) {
    return { tax: 0 };
  }

  const TAX_RATE = 0.20;
  const tax = netProfit.multiply(TAX_RATE);

  return { tax: tax.toNumber() };
}

export default calculateTaxes;
