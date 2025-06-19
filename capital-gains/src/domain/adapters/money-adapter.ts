import Decimal from "decimal.js";
import { Money } from "../value-objects/money";

export class MoneyAdapter {
  static calculateWithMoney(
    operation: (money: Money) => Money, decimalValue: Decimal
  ): Decimal {
    const money = Money.fromDecimal(decimalValue);
    const result = operation(money);
    return result.toDecimal();
  }

  static multiply(decimal: Decimal, factor: number): Decimal {
    return this.calculateWithMoney(money => money.multiply(factor), decimal);
  }

  static add(decimal1: Decimal, decimal2: Decimal): Decimal {
    const money1 = Money.fromDecimal(decimal1);
    const money2 = Money.fromDecimal(decimal2);
    return money1.add(money2).toDecimal();
  }

  static subtract(decimal1: Decimal, decimal2: Decimal): Decimal {
    const money1 = Money.fromDecimal(decimal1);
    const money2 = Money.fromDecimal(decimal2);
    return money1.subtract(money2).toDecimal();
  }
}