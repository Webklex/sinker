import path from 'node:path';

import {
    type ScanResult,
    Violation,
    ViolationContextLine,
} from '../scanner/types';

import type { Colorizer } from './colors';

function _printViolationHeader(c: Colorizer, v: Violation): void {
    const file = path.resolve(process.cwd(), v.file);
    console.error(c.red(c.bold(`Violation found in ${file}:${v.line}`)));
    console.error(`  ${c.cyan('Sink:')}\t\t${c.yellow(v.sink.sink)}`);
    // @safe-sink: metadata.name is an attribute only set internally without any outside access
    console.error(`  ${c.cyan('Category:')}\t${v.sink.metadata.name}`);
    console.error(
        `  ${c.cyan('Description:')}\t${v.sink.metadata.description}`
    );
    console.error(`  ${c.cyan('Link:')}\t\t${v.sink.metadata.link}`);
}

function _printCodeLines(
    c: Colorizer,
    lines: ViolationContextLine[] | null
): void {
    for (const ctx of lines ?? []) {
        console.error(
            // @safe-sink: ctx.text gets not interpreted
            `  ${c.gray(`Line ${ctx.line + 1}:`)}\t${c.dim(ctx.text)}`
        );
    }
}

function _printViolationContext(c: Colorizer, v: Violation): void {
    _printCodeLines(c, v.context.before);
    console.error(
        '\t\tAdd ' +
            c.yellow(
                c.bold(`// @safe-sink: a short explanation why its safe`)
            ) +
            ` here to suppress this finding.`
    );
    console.error(
        `  ${c.gray(`Line ${v.line}:`)}\t${c.red('(>>) ' + c.bold(v.context.offendingLine))}`
    );
    _printCodeLines(c, v.context.after);
}

export function printViolations(scanResult: ScanResult, c: Colorizer): void {
    if (scanResult.violations.length > 0) {
        console.error(
            c.red(c.bold(`Found ${scanResult.violations.length} violations`))
        );

        for (const v of scanResult.violations) {
            _printViolationHeader(c, v);
            _printViolationContext(c, v);
            console.log('');
        }
    }
}
