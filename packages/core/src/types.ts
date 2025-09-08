import { formatters } from './lib/formatters';

export type TRuleName = string;
export type TRuleNameFunction =  ((name: string) => string);

export type TRuleResult = Record<string, string | number>

export type TRuleResultFunction = ((
      value: string | number | null,
      selector?: string,
    ) => Record<string, string | number> | string);

export type TRuleValue = [string, string | number] | RegExp;

export type TRuleOptions =
  | RegExp
  | Array<TRuleValue>
  | {
      explainer?: string;
      responsive?: boolean;
      values?: Array<TRuleValue>;
    };
export type TRule = [TRuleName, TRuleResult, TRuleOptions?] |
  [TRuleNameFunction, TRuleResultFunction, TRuleOptions?];

export type TCustomProperty = {
  key: string;
  value: string;
};

export type TUserConfig = {
  input: Array<string>;
  banner?: string | (() => string);
  entries?: Array<string>;
  output?: string | null;
  typeDefinitionsOutput?: string | false;
  cascadeLayer?: string | false;
  rules?: Array<TRule>;
  classNameFormat?:
    | keyof typeof formatters
    | ((props: TFormatterProps) => string);
  breakpoints?: Record<string, number | string>;
  minifyOutput?: boolean;
  plugins?: Array<TPlugin>;
};

export type TConfig = Required<TUserConfig>;

export type TUtilityStyle = {
  selector: string;
  css: string;
  media: string | null;
};

export type TBreakpoint = {
  name: string;
  media: string;
};

export type TParseResult = {
  classNames: Array<string>;
  generateTypeDefinitions: () => string;
  generateCSS: (classNames?: Array<string>) => string;
};

export type TFormatterProps = {
  breakpoint: string | null;
  className: string;
};

export type TPlugin = {
  name: string;
  generate?: (opts: {
    utilities: Array<TUtilityStyle>;
    foundClassNames: Array<string>;
    options: Omit<TConfig, 'plugins'>;
  }) => Promise<void>;
};
