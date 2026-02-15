import * as path from 'node:path';
import * as fsSync from 'node:fs';
import { promises as fs } from 'node:fs';

import type { CompiledSink, ScanResult, Violation } from './types';
import { extractHtmlScriptBlocks } from './html';
import { scanText } from './scanText';

const JS_TS_EXTENSIONS = [
    '.ts',
    '.js',
    '.mts',
    '.cts',
    '.mjs',
    '.cjs',
    '.tsx',
    '.jsx',
];

export function pathExistsSync(p: string): boolean {
    return fsSync.existsSync(p);
}

export function statSync(p: string): fsSync.Stats {
    return fsSync.statSync(p);
}

function isJsTsFile(fileNameOrPath: string): boolean {
    return JS_TS_EXTENSIONS.some(ext => fileNameOrPath.endsWith(ext));
}

function shouldRecurseIntoDir(
    dirName: string,
    fullPath: string,
    ignored: string[]
): boolean {
    return !dirName.startsWith('.') && !isIgnored(fullPath, ignored);
}

function isIgnored(path: string, ignored: string[]): boolean {
    return ignored.some(pattern => {
        const _str: string =
            '^' +
            pattern
                .split('*')
                .map(s => s.replace(/[|\\{}()[\]^$+?.]/g, '\\$&'))
                .join('.*') +
            '$';
        const regex = new RegExp(_str);
        const fileName = path.split(/[/\\]/).pop() || '';
        return (
            regex.test(path) || regex.test(fileName) || path.endsWith(pattern)
        );
    });
}

export async function scanFile(params: {
    filePath: string;
    compiledSinks: CompiledSink[];
    contextDepth: number;
    ignored?: string[];
}): Promise<ScanResult> {
    const { filePath, compiledSinks, contextDepth, ignored = [] } = params;

    if (isIgnored(filePath, ignored)) {
        return { violations: [], count: 0 };
    }

    const content = await fs.readFile(filePath, 'utf-8');

    if (isJsTsFile(filePath)) {
        return {
            violations: scanText({
                text: content,
                displayPath: filePath,
                compiledSinks,
                lineOffset: 0,
                options: { contextDepth },
            }),
            count: 1,
        };
    }

    if (filePath.endsWith('.html')) {
        const blocks = extractHtmlScriptBlocks(content);
        const all: Violation[] = [];

        for (const b of blocks) {
            all.push(
                ...scanText({
                    text: b.code,
                    displayPath: `${filePath} (<script>)`,
                    compiledSinks,
                    lineOffset: b.startLine - 1,
                    options: { contextDepth },
                })
            );
        }

        return {
            violations: all,
            count: 1,
        };
    }

    return { violations: [], count: 1 };
}

async function scanEntry(
    entry: fsSync.Dirent,
    dirPath: string,
    compiledSinks: CompiledSink[],
    contextDepth: number,
    ignored: string[]
): Promise<ScanResult> {
    // @safe-sink: entry.name is only set internally
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
        // @safe-sink: entry.name is only set internally
        if (shouldRecurseIntoDir(entry.name, fullPath, ignored)) {
            return scanDir({
                dirPath: fullPath,
                compiledSinks,
                contextDepth,
                ignored,
            });
        }
    } else if (
        entry.isFile() &&
        // @safe-sink: entry.name is only set internally
        (isJsTsFile(entry.name) || entry.name.endsWith('.html'))
    ) {
        return scanFile({
            filePath: fullPath,
            compiledSinks,
            contextDepth,
            ignored,
        });
    }

    return {
        violations: [],
        count: 0,
    };
}

export async function scanDir(params: {
    dirPath: string;
    compiledSinks: CompiledSink[];
    contextDepth: number;
    ignored?: string[];
}): Promise<ScanResult> {
    const { dirPath, compiledSinks, contextDepth, ignored = [] } = params;

    if (isIgnored(dirPath, ignored)) {
        return { violations: [], count: 0 };
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const scanResult: ScanResult = {
        violations: [],
        count: 0,
    };

    for (const entry of entries) {
        const result = await scanEntry(
            entry,
            dirPath,
            compiledSinks,
            contextDepth,
            ignored
        );
        scanResult.violations.push(...result.violations);
        scanResult.count += result.count;
    }

    return scanResult;
}
