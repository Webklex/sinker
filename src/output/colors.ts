import pc from 'picocolors';

export type Colorizer = Pick<
    typeof pc,
    'red' | 'yellow' | 'blue' | 'cyan' | 'gray' | 'bold' | 'dim' | 'green'
>;

export function createColorizer(useColor: boolean): Colorizer {
    if (useColor) return pc;

    type FormatterInput = Parameters<typeof pc.red>[0];
    const ident = (input: FormatterInput): string => String(input ?? '');

    return {
        red: ident,
        yellow: ident,
        blue: ident,
        cyan: ident,
        gray: ident,
        bold: ident,
        dim: ident,
        green: ident,
    };
}
