import Decimal from "decimal.js"; 
import { TaxConstants } from "./domain/constants/tax-constants";
import { Operation, TaxResult } from "./types";
import { Portfolio } from "./domain/entities/portfolio";
import { Money } from "./domain/value-objects/money";

Decimal.set(TaxConstants.DECIMAL_CONFIG);

export function calculateTaxes(operations: Operation[]): TaxResult[] {
  const portfolio = new Portfolio();

  return operations.map(operation => {
    if (operation.operation === 'buy') {
      return processBuy(operation, portfolio);
    } else {
      return processSell(operation, portfolio);
    }
  });
}

function processBuy(operation: Operation, portfolio: Portfolio): TaxResult {
  const unitPrice = Money.fromNumber(operation['unit-cost']);
  portfolio.recordPurchase(operation.quantity, unitPrice);
  return { tax: 0 };
}

function processSell(operation: Operation, portfolio: Portfolio): TaxResult {
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

  if (saleValue.isLessThanOrEqual(TaxConstants.EXEMPTION_THRESHOLD)) {
    return { tax: 0 };
  }

  const netProfit = portfolio.applyLossDeduction(operationResult);

  if (netProfit.isZero()) {
    return { tax: 0 };
  }

  const tax = netProfit.multiply(TaxConstants.CAPITAL_GAINS_TAX_RATE);

  return { tax: tax.toNumber() };
}

export default calculateTaxes;
