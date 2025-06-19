import { TaxCalculationService } from "./services/tax-calculation.services";
import { Operation, TaxResult } from "./types";

export function calculateTaxes(operations: Operation[]): TaxResult [] {
  const service = new TaxCalculationService();
  return service.calculateTaxes(operations);
}

export default calculateTaxes;

export { TaxCalculationService } from "./services/tax-calculation.services";
export { Portfolio } from './domain/entities/portfolio';
export { Money } from './domain/value-objects/money';
export { TaxConstants } from './domain/constants/tax-constants';