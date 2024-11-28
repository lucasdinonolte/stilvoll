export type TRuleName = string | ((name: string) => string);
export type TRuleResult =
  | Record<string, string | number>
  | ((
      value: string | number | null,
      selector?: string,
    ) => Record<string, string | number> | string);

export type TRuleOptions = {
  explainer?: string;
  responsive?: boolean;
  values?: Record<string, string | number | RegExp>;
};
export type TRule = [TRuleName, TRuleResult, TRuleOptions?];
export type TCustomProperty = {
  key: string;
  value: string;
};

export type TUserConfig = {
  input: Array<string>;
  entries?: Array<string>;
  output?: string | null;
  typeDefinitionsOutput?: string | false;
  cascadeLayer?: string | false;
  rules?: Array<TRule>;
  classNameFormat?:
    | 'snakeCase'
    | 'tailwind'
    | ((props: TFormatterProps) => string);
  breakpoints?: Record<string, number>;
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
