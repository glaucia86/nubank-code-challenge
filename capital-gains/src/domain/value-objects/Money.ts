import Decimal from "decimal.js";

export class Money {
  private readonly amount: Decimal;

  constructor(value: number | string | Decimal) {
    Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP});
    this.amount = new Decimal(value);
  }

  static zero(): Money {
    return new Money(0);
  }

  static fromNumber(value: number): Money {
    return new Money(value);
  }

  static fromDecimal(decimal: Decimal): Money {
    return new Money(decimal);
  }

  toDecimal(): Decimal {
    return new Decimal(this.amount);
  }

  add(other: Money): Money {
    return new Money(this.amount.plus(other.amount));
  }

  subtract(other: Money): Money {
    return new Money(this.amount.minus(other.amount));
  }

  multiply(factor: number): Money {
    return new Money(this.amount.times(factor));
  }

  divide(divisor: number): Money {
    return new Money(this.amount.dividedBy(divisor));
  }

  isGreaterThan(other: Money): boolean {
    return this.amount.greaterThan(other.amount);
  }

  isGreaterThanOrEqual(other: Money): boolean {
    return this.amount.greaterThanOrEqualTo(other.amount);
  }

  isLessThanOrEqual(value: number): boolean {
    return this.amount.lessThanOrEqualTo(value);
  }

  isNegative(): boolean {
    return this.amount.isNegative();
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  abs(): Money {
    return new Money(this.amount.abs());
  }

  toNumber(): number {
    return Number(this.amount.toFixed(2));
  }

  toString(): string {
    return this.amount.toFixed(2);
  }
}