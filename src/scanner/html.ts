function _sliceBlock(
    scriptOpenRe: RegExp,
    closeMatch: RegExpExecArray,
    html: string
): {
    code: string;
    startLine: number;
} {
    const codeStartIndex = scriptOpenRe.lastIndex;
    const codeEndIndex = closeMatch.index;
    const code = html.slice(codeStartIndex, codeEndIndex);

    const prefix = html.slice(0, codeStartIndex);
    const startLine = prefix.split(/\r?\n/).length;
    return {
        code,
        startLine,
    };
}

function _getScriptRegex(): {
    scriptOpenRe: RegExp;
    scriptCloseRe: RegExp;
} {
    return {
        scriptOpenRe: /<script\b[^>]*>/gi,
        scriptCloseRe: /<\/script\s*>/gi,
    };
}

function _getNextBlock(
    scriptOpenRe: RegExp,
    scriptCloseRe: RegExp,
    html: string
): {
    code: string;
    startLine: number;
} | null {
    const closeMatch = scriptCloseRe.exec(html);
    if (!closeMatch) return null;
    return _sliceBlock(scriptOpenRe, closeMatch, html);
}

export function extractHtmlScriptBlocks(
    html: string
): Array<{ code: string; startLine: number }> {
    const blocks: Array<{ code: string; startLine: number }> = [];
    const { scriptOpenRe, scriptCloseRe } = _getScriptRegex();

    while (scriptOpenRe.exec(html) !== null) {
        scriptCloseRe.lastIndex = scriptOpenRe.lastIndex;
        const block = _getNextBlock(scriptOpenRe, scriptCloseRe, html);
        if (!block) break;
        blocks.push(block);
        scriptOpenRe.lastIndex = scriptCloseRe.lastIndex;
    }

    return blocks;
}
