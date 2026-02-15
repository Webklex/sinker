export interface ScanOptions {
    useColor: boolean;
    contextDepth: number;
    help: boolean;
}

export interface ParsedArgs {
    targetLocation: string;
    options: ScanOptions;
}

function _parseContextDepth(args: string[]): number {
    const contextDepthArg = args.find(a => a.startsWith('--context-depth='));
    const rawDepth = contextDepthArg
        ? contextDepthArg.split('=')[1]
        : undefined;
    const parsedDepth = rawDepth ? Number.parseInt(rawDepth, 10) : -1;
    return Number.isFinite(parsedDepth) && parsedDepth >= 0 ? parsedDepth : -1;
}

export function parseArgs(argv: string[]): ParsedArgs {
    const args = argv.slice(2);
    const useColor = !args.includes('--no-color') && !args.includes('-nc');
    const help = args.includes('--help') || args.includes('-h');
    const targetLocation =
        args.find(a => !a.startsWith('--') && !a.startsWith('-')) ?? '.';
    const contextDepth = _parseContextDepth(args);

    return {
        targetLocation,
        options: {
            useColor,
            contextDepth,
            help,
        },
    };
}
