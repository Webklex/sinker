import { Colorizer, createColorizer } from '../output/colors';
import { printViolations } from '../output/reporter';
import { loadSinks } from '../scanner/sinks';
import { pathExistsSync, scanDir, scanFile, statSync } from '../scanner/scanFs';
import { loadConfig, SinkerConfig } from '../config';
import { CompiledSink } from '../scanner/types';

import { parseArgs, ParsedArgs } from './args';

async function _setup(argv: string[]): Promise<{
    args: ParsedArgs;
    config: SinkerConfig;
    useColor: boolean;
    contextDepth: number;
    c: Colorizer;
    sinks: CompiledSink[];
    count: number;
}> {
    const args = parseArgs(argv);
    const config = await loadConfig();

    const useColor = args.options.useColor && config.colors;
    const contextDepth =
        args.options.contextDepth >= 0
            ? args.options.contextDepth
            : config.contextDepth;

    const c = createColorizer(useColor);

    const { sinks, count } = loadSinks(config);

    return {
        args,
        config,
        useColor,
        contextDepth,
        c,
        sinks,
        count,
    };
}

function _validateCount(count: number, c: Colorizer): boolean {
    if (count === 0) {
        console.error(c.red('No sink rules found'));
        return false;
    }
    return true;
}

function _validateTarget(target: string, c: Colorizer): boolean {
    if (!pathExistsSync(target)) {
        console.error(c.red(`Path does not exist: ${target}`));
        return false;
    }
    return true;
}

function _printHelp(c: Colorizer): void {
    console.log(`
${c.blue('sinker')} - Minimalistic security tool to scan for potentially dangerous sinks and sources.

${c.bold('Usage:')}
  sinker [target] [options]

${c.bold('Arguments:')}
  target                Path to a file or directory to scan (default: .)

${c.bold('Options:')}
  -h, --help            Show this help message
  -nc, --no-color       Disable colored output
  --context-depth=N     Number of lines of context to show (default: from config)

${c.bold('Examples:')}
  sinker .
  sinker src/index.ts --context-depth=5
  sinker --no-color
`);
}

export async function main(argv: string[]): Promise<number> {
    const { args, config, contextDepth, c, sinks, count } = await _setup(argv);

    if (args.options.help) {
        _printHelp(c);
        return 0;
    }

    if (!_validateCount(count, c) || !_validateTarget(args.targetLocation, c)) {
        return 1;
    }

    console.log(
        c.blue(
            `Scanning ${args.targetLocation} for ${count} sinks (context-depth: ${contextDepth})...`
        )
    );

    const scanResult = statSync(args.targetLocation).isDirectory()
        ? await scanDir({
              dirPath: args.targetLocation,
              compiledSinks: sinks,
              contextDepth,
              ignored: config.ignored,
          })
        : await scanFile({
              filePath: args.targetLocation,
              compiledSinks: sinks,
              contextDepth,
              ignored: config.ignored,
          });

    console.log(c.blue(`Successfully scanned ${scanResult.count} files`));
    if (scanResult.violations.length > 0) {
        printViolations(scanResult, c);
        return 1;
    }

    console.log(c.green('Scan completed successfully. No violations found.'));
    return 0;
}
