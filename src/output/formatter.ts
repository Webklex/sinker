import path from 'node:path';

import { Violation, ViolationContext } from '../scanner/types';

import type { Colorizer } from './colors';

export function formatViolation(
    v: Violation,
    c: Colorizer,
    minimal: boolean,
    printFilename: boolean = true
): string {
    const { sink, context: ctx } = v;
    const file: string = path.resolve(process.cwd(), v.file);

    let msg: string = '';
    if (minimal) {
        if (printFilename) msg += c.gray(`File: ${file}:${v.line}\n`);
        return (
            msg +
            // @safe-sink: no data is being written to .name
            `Sinker found a potential ${c.red(v.sink.metadata.name.toLowerCase())} '${c.yellow(v.sink.sink)}'`
        );
    }
    msg += `\n${c.red(c.bold(`Violation found in: ${file}:${v.line}`))}`;
    msg += `\n  ${c.cyan('Sink:')}\t\t${c.yellow(sink.sink)}`;
    // @safe-sink: no data is being written to .name
    msg += `\n  ${c.cyan('Category:')}\t${sink.metadata.name}`;

    if (sink.metadata.description) {
        msg += `\n  ${c.cyan('Description:')}\t${sink.metadata.description}`;
    }
    if (sink.metadata.link) {
        msg += `\n  ${c.cyan('Link:')}\t\t${sink.metadata.link}`;
    }

    msg += _appendContextBefore(ctx, c);

    msg +=
        '\n\t\tAdd ' +
        c.yellow(c.bold(`// @safe-sink: a short explanation why its safe`)) +
        ` here to suppress this finding.`;

    msg += `\n  ${c.gray(`Line ${v.line}:`)}\t${c.red('(>>) ' + c.bold(ctx.offendingLine))}`;

    msg += _appendContextAfter(ctx, c);

    return msg;
}

function _appendContextBefore(ctx: ViolationContext, c: Colorizer): string {
    let msg: string = '';
    if (ctx.before && ctx.before.length) {
        for (const b of ctx.before) {
            // @safe-sink: no data is being written to .text, it is used for formatting the output
            msg += `\n  ${c.gray(`Line ${b.line + 1}:`)}\t${c.dim(b.text)}`;
        }
    }
    return msg;
}

function _appendContextAfter(ctx: ViolationContext, c: Colorizer): string {
    let msg: string = '';
    if (ctx.after && ctx.after.length) {
        for (const a of ctx.after) {
            // @safe-sink: no data is being written to .text, it is used for formatting the output
            msg += `\n  ${c.gray(`Line ${a.line + 1}:`)}\t${c.dim(a.text)}`;
        }
    }
    return msg;
}
