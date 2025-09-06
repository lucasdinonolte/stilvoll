import type { TFormatterProps } from '../types';

/**
 * Formats a class name with optional breakpoint as snake case
 *
 * @example
 * md_col_12 (breakpoint_class_name)
 */
const snakeCaseFormatter = ({
  breakpoint,
  className,
}: TFormatterProps): string => {
  const name = className
    .replaceAll('_', '-')
    .split('-')
    .filter((i) => i.toString().length > 0)
    .map((i) => i.toLowerCase())
    .join('_');

  return breakpoint ? `${name}_${breakpoint}` : name;
};

/**
 * Formats a class name with optional breakpoint following
 * tailwind convention
 *
 * @example
 * md:col-12 (breakpoint:class-name)
 */
const tailwindFormatter = ({
  breakpoint,
  className,
}: TFormatterProps): string => {
  const name = className
    .replaceAll('_', '-')
    .split('-')
    .filter((i) => i.toString().length > 0)
    .map((i) => i.toLowerCase())
    .join('-');
  return breakpoint ? `${breakpoint}:${name}` : name;
};

export const formatters = {
  snakeCase: snakeCaseFormatter,
  tailwind: tailwindFormatter,
};
