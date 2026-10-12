export interface CodePart {
  kind: "code";
  text: string;
}

export interface LinesPart<Region extends string> {
  kind: "lines";
  region: Region;
}

export type TextPart<Region extends string = string> =
  string | CodePart | LinesPart<Region>;

export type RichText<Region extends string = string> =
  readonly TextPart<Region>[];

export function code(text: string | number): CodePart {
  return { kind: "code", text: String(text) };
}

export function linesOf<Region extends string>(
  region: Region,
): LinesPart<Region> {
  return { kind: "lines", region };
}

export function rich<Region extends string = never>(
  literals: TemplateStringsArray,
  ...interpolations: (TextPart<Region> | number)[]
): RichText<Region> {
  return literals.flatMap((literal, literalIndex) => {
    if (literalIndex >= interpolations.length) return [literal];

    const interpolation = interpolations[literalIndex];
    const part =
      typeof interpolation === "number" ? String(interpolation) : interpolation;

    return [literal, part];
  });
}
