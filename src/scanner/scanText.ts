import { CompiledSink, Violation, ViolationContext } from './types';

export interface ScanTextOptions {
    contextDepth: number;
}

function isIgnorableCommentLine(trimmedLine: string): boolean {
    return (
        trimmedLine.startsWith('//') ||
        trimmedLine.startsWith('/*') ||
        trimmedLine.startsWith('*') ||
        trimmedLine.startsWith('<!--')
    );
}

function hasSafeSinkerAbove(
    lines: string[],
    fromIndexExclusive: number
): boolean {
    let i = fromIndexExclusive;

    while (i >= 0) {
        const prev = lines[i].trim();

        if (prev.includes('@safe-sink')) return true;

        const canSkip = prev === '' || isIgnorableCommentLine(prev);
        if (!canSkip) return false;

        i--;
    }

    return false;
}

function getViolationContext(
    lines: string[],
    currentLineIndex: number,
    totalLines: number,
    lineOffset: number,
    options: ScanTextOptions,
    sink: CompiledSink
): ViolationContext {
    const context: ViolationContext = {
        before: null,
        offendingLine: lines[currentLineIndex].trim(),
        after: null,
    };

    if (sink.metadata.displayContextBefore) {
        const start = Math.max(0, currentLineIndex - options.contextDepth);
        context.before = Array.from(
            { length: currentLineIndex - start },
            (_, k) => {
                const i = start + k;
                return { line: lineOffset + i, text: lines[i].trim() };
            }
        );
    }

    if (sink.metadata.displayContextAfter) {
        const start = Math.max(currentLineIndex + 1);
        const end = Math.min(totalLines, start + options.contextDepth);
        context.after = Array.from({ length: end - start }, (_, k) => {
            const i = start + k;
            return { line: lineOffset + i, text: lines[i].trim() };
        });
    }

    return context;
}

export function scanText(params: {
    text: string;
    displayPath: string;
    compiledSinks: CompiledSink[];
    lineOffset: number;
    options: ScanTextOptions;
}): Violation[] {
    const { text, displayPath, compiledSinks, lineOffset, options } = params;

    const lines = text.split(/\r?\n/);
    const violations: Violation[] = [];
    const totalLines = lines.length;

    for (
        let currentLineIndex = 0;
        currentLineIndex < totalLines;
        currentLineIndex++
    ) {
        const line = lines[currentLineIndex];
        const trimmed = line.trim();

        if (isIgnorableCommentLine(trimmed)) continue;

        for (const sink of compiledSinks) {
            if (!sink.regex.test(line)) continue;
            if (hasSafeSinkerAbove(lines, currentLineIndex - 1)) continue;

            violations.push({
                file: displayPath,
                line: lineOffset + currentLineIndex + 1,
                sink: sink,
                context: getViolationContext(
                    lines,
                    currentLineIndex,
                    totalLines,
                    lineOffset,
                    options,
                    sink
                ),
            });
        }
    }

    return violations;
}
