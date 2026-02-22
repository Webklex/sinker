import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { ScanResult, Violation } from '../scanner/types';

import { printViolations } from './reporter';
import { createColorizer } from './colors';

describe('reporter', () => {
    const c = createColorizer(false);
    let consoleErrorSpy: any;

    beforeEach(() => {
        consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should not print anything if there are no violations', () => {
        const result: ScanResult = {
            violations: [],
            count: 1,
        };
        printViolations(result, c, false);
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should print violations when found', () => {
        const violation: Violation = {
            file: 'test.js',
            line: 10,
            sink: {
                sink: 'eval(',
                metadata: {
                    name: 'JS Injection',
                    description: 'Execution of arbitrary JS',
                    link: 'http://example.com',
                    displayContextBefore: true,
                    displayContextAfter: true,
                    sinks: ['eval('],
                },
            },
            context: {
                before: [{ line: 8, text: 'const x = 1;' }],
                offendingLine: 'eval(userInput);',
                after: [{ line: 10, text: 'console.log(x);' }],
            },
        };

        const result: ScanResult = {
            violations: [violation],
            count: 1,
        };

        printViolations(result, c, false);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Found 1 violations')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Violation found in')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('test.js:10')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Sink:')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('eval(')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Category:')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('JS Injection')
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Line 9:')
        ); // 8 + 1
        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('(>>) eval(userInput)')
        );
    });

    it('should handle violations without before/after context', () => {
        const violation: Violation = {
            file: 'test.js',
            line: 1,
            sink: {
                sink: 'eval(',
                metadata: {
                    name: 'N',
                    description: 'D',
                    link: 'L',
                    displayContextBefore: true,
                    displayContextAfter: true,
                    sinks: ['eval('],
                },
            },
            context: {
                before: null,
                offendingLine: 'eval(1)',
                after: null,
            },
        };

        printViolations({ violations: [violation], count: 1 }, c, false);
        expect(consoleErrorSpy).toHaveBeenCalled();
    });
});
