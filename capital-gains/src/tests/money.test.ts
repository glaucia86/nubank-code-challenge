import { Money } from "../domain/value-objects/Money"

describe('Money Value Object', () => {
  describe('Criação e Factory Methods', () => {
    it('deve criar Money a partir de número', () => {
      const money = Money.fromNumber(100.50);
      expect(money.toNumber()).toBe(100.50);
    });

    it('deve criar Money zero', () => {
      const zero = Money.zero();
      expect(zero.isZero()).toBe(true);
      expect(zero.toNumber()).toBe(0);
    });
  });

  describe('Operações Aritméticas', () => {
    it('deve somar valores corretamente', () => {
      const money1 = Money.fromNumber(100);
      const money2 = Money.fromNumber(50.50);
      const result = money1.add(money2);

      expect(result.toNumber()).toBe(150.50);
    });
    
    it('deve subtrair valores corretamente', () => {
      const money1 = Money.fromNumber(100);
      const money2 = Money.fromNumber(50.50);
      const result = money1.subtract(money2);

      expect(result.toNumber()).toBe(49.50);
    });

    it('deve multiplicar por fator', () => {
      const money = Money.fromNumber(25);
      const result = money.multiply(4);

      expect(result.toNumber()).toBe(100);
    });

    it('deve dividir por divisor', () => {
      const money = Money.fromNumber(100);
      const result = money.divide(4);

      expect(result.toNumber()).toBe(25);
    });
  });

  describe('Comparações', () => {
    it('deve comparar valores corretamente', () => {
      const money1 = Money.fromNumber(100);
      const money2 = Money.fromNumber(50);

      expect(money1.isGreaterThan(money2)).toBe(true);
      expect(money2.isGreaterThan(money1)).toBe(false);
      expect(money1.isLessThanOrEqual(100)).toBe(true);
    });

    it('deve identificar valores negativos e zero', () => {
      const positive = Money.fromNumber(10);
      const zero = Money.zero();
      const negative = Money.fromNumber(10).subtract(Money.fromNumber(20));

      expect(positive.isNegative()).toBe(false);
      expect(zero.isZero()).toBe(true);
      expect(negative.isNegative()).toBe(true);
    });
  });

  describe('Precisão Decimal', () => {
    it('deve manter precisão em cálculos financeiros', () => {
      const money1 = Money.fromNumber(0.1);
      const money2 = Money.fromNumber(0.2);
      const result = money1.add(money2);

      expect(result.toNumber()).toBe(0.30);
      expect(result.toString()).toBe('0.30');
    });
  });
});