import type { TFormatterProps } from '../types';

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
