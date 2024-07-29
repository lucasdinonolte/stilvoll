import type { TFormatterProps } from '../types';

export const snakeCaseFormatter = ({
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

export const tailwindFormatter = ({
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
