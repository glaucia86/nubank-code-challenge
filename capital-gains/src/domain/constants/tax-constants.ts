export const TaxConstants = {
  CAPITAL_GAINS_TAX_RATE: 0.20,
  EXEMPTION_THRESHOLD: 20000,
  DECIMAL_CONFIG: {
    precision: 20,
    rounding: 8
  }
} as const;

export type TaxConstantsType = typeof TaxConstants;