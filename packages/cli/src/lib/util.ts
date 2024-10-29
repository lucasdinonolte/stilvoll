export const roundWithPrecision = (num, decimalPlaces = 0) => {
  const p = Math.pow(10, decimalPlaces);
  return Math.round(num * p) / p;
};
