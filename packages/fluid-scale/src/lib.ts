const DEFAULT_BASE_FONT_SIZE = 16;

const roundWithPrecision = (num: number, precision: number = 3): number => {
  const multiplier = Math.pow(10, precision);
  return Math.round(num * multiplier) / multiplier;
};

type TSizeValue = number | string;

const calculateClamp = (opts: {
  min: TSizeValue;
  max: TSizeValue;
  minViewport: TSizeValue;
  maxViewport: TSizeValue;
  calculateRem: (px: TSizeValue) => number;
}): string => {
  const min = opts.calculateRem(opts.min);
  const max = opts.calculateRem(opts.max);
  const minViewport = opts.calculateRem(opts.minViewport);
  const maxViewport = opts.calculateRem(opts.maxViewport);
  const slope = (max - min) / (maxViewport - minViewport);
  const intersection = -1 * minViewport * slope + min;

  return `clamp(${roundWithPrecision(min)}rem, ${roundWithPrecision(intersection)}rem + ${roundWithPrecision(slope * 100)}vw, ${roundWithPrecision(max)}rem)`;
};

const PX_VALUE_REGEX = /(\d*\.?\d+)px/;
const REM_VALUE_REGEX = /(\d*\.?\d+)rem/;

export const makeRemCalculator =
  (baseFontSize: number = DEFAULT_BASE_FONT_SIZE) =>
  (px: TSizeValue): number => {
    if (typeof px === 'number') return px / baseFontSize;

    if (px.match(PX_VALUE_REGEX)) {
      const num = parseFloat(px);
      return num / baseFontSize;
    }

    if (px.match(REM_VALUE_REGEX)) {
      return parseFloat(px);
    }

    throw new Error(`Invalid value: ${px}`);
  };

type TFluid = {
  fluid: (min: TSizeValue, max: TSizeValue) => string;
};

const ensurePx = (value: TSizeValue): number => {
  if (typeof value === 'number') return value;
  if (value.match(PX_VALUE_REGEX)) {
    return parseFloat(value);
  }

  throw new Error(`Invalid value: ${value}`);
};

export const createFluid = ({
  minViewport,
  maxViewport,
  baseFontSize = DEFAULT_BASE_FONT_SIZE,
}: {
  minViewport: TSizeValue;
  maxViewport: TSizeValue;
  baseFontSize?: TSizeValue;
}): TFluid => {
  const calculateRem = makeRemCalculator(ensurePx(baseFontSize));

  return {
    fluid: (min: TSizeValue, max: TSizeValue) =>
      calculateClamp({
        min,
        max,
        minViewport,
        maxViewport,
        calculateRem,
      }),
  };
};
