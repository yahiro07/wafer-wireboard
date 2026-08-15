import {
  Class,
  CSSObject,
  CSSProperties,
  Falsey,
  TxFunction,
  css,
  tx,
} from "@twind/core";

type StyleObject = CSSProperties & {
  [K in
    | `&${string}`
    | `${string} &${string}`
    | `@media ${string}`
    | `@supports ${string}`
    | `@layer ${string}`]?: StyleObject;
} & {
  [K in `@keyframes ${string}`]?: {
    [offset: string]: CSSProperties;
  };
};

// oxlint-disable-next-line typescript/no-redundant-type-constituents
type TzArg = string | number | boolean | StyleObject | Falsey | TzArg[];

type TzFunction = (...args: TzArg[]) => string;

type CssFunction = typeof css;

function createTz(tx: TxFunction, css: CssFunction): TzFunction {
  function normalize(arg: TzArg): Class {
    if (Array.isArray(arg)) {
      return arg.map(normalize);
    }
    if (arg && typeof arg === "object") {
      return css(arg as CSSObject);
    }
    return arg as Exclude<TzArg, StyleObject | TzArg[]>;
  }

  return (...args) => tx(...args.map(normalize));
}
export const tz = createTz(tx, css);
