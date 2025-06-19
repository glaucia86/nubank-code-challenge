import { TaxConstants } from "../domain/constants/tax-constants";
import { Portfolio } from "../domain/entities/portfolio";
import { Money } from "../domain/value-objects/money";
import { Operation, TaxResult } from "../types";

export class TaxCalculationService {
  private readonly portfolio: Portfolio;

  constructor(portfolio?: Portfolio) {
    this.portfolio = portfolio || new Portfolio();
  }

  calculateTaxes(operations: Operation[]): TaxResult[] {
    return operations.map(operation => this.processOperation(operation));
  }

  private processOperation(operation: Operation): TaxResult {
    return operation.operation === 'buy'
      ? this.processBuyOperation(operation)
      : this.processSellOperation(operation);
  }

  processBuyOperation(operation: Operation): TaxResult {
    const unitPrice = Money.fromNumber(operation['unit-cost']);
    this.portfolio.recordPurchase(operation.quantity, unitPrice);
    return { tax: 0 };
  }

    processSellOperation(operation: Operation): TaxResult {
    const salesDetails = this.calculateSaleDetails(operation);
    const operationResult = this.calculateOperationResult(salesDetails);

    this.portfolio.recordSale(salesDetails.quantity);

    if (this.isLossOperation(operationResult)) {
      return this.handleLoss(operationResult);
    }

    return this.handleProfit(operationResult, salesDetails.totalValue);
  }

  private calculateSaleDetails(operation: Operation) {
    const unitPrice = Money.fromNumber(operation['unit-cost']);
    const quantity = operation.quantity;
    const totalValue = unitPrice.multiply(quantity);
    const costBasis = this.portfolio.calculateCostBasis(quantity);

    return { unitPrice, quantity, totalValue, costBasis };
  }

  private calculateOperationResult(salesDetails: { totalValue: Money, costBasis: Money }): Money {
    return salesDetails.totalValue.subtract(salesDetails.costBasis);
  }

  private isLossOperation(result: Money): boolean {
    return result.isNegative() || result.isZero();
  }

  private handleLoss(loss: Money): TaxResult {
    this.portfolio.recordLoss(loss.abs());
    return { tax: 0 };
  }

  private handleProfit(grossProfit: Money, saleValue: Money): TaxResult {
    if (this.isExemptOperation(saleValue)) {
      return { tax: 0 };
    }

    const netProfit = this.portfolio.applyLossDeduction(grossProfit);

    return this.calculateTax(netProfit);
  }
  
  private isExemptOperation(saleValue: Money): boolean {
    return saleValue.isLessThanOrEqual(TaxConstants.EXEMPTION_THRESHOLD);
  }

  private calculateTax(netProfit: Money): TaxResult {
    if (netProfit.isZero()) {
      return { tax: 0 };
    }

    const tax = netProfit.multiply(TaxConstants.CAPITAL_GAINS_TAX_RATE);
    return { tax: tax.toNumber() };
  }
}