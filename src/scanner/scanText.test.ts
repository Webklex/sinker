import { describe, it, expect } from 'vitest';

import { scanText } from './scanText';
import { CompiledSink } from './types';

describe('scanText', () => {
    const mockSink: CompiledSink = {
        sink: 'eval',
        regex: /eval\(/,
        metadata: {
            name: 'JS Injection',
            description: 'eval() can lead to arbitrary code execution',
            link: 'https://example.com',
            displayContextBefore: true,
            displayContextAfter: true,
            sinks: ['eval('],
        },
    };

    const options = { contextDepth: 2 };

    it('should detect a sink in text', () => {
        const text = 'const x = eval("1+1");';
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(1);
        expect(violations[0].sink.sink).toBe('eval');
        expect(violations[0].line).toBe(1);
    });

    it('should ignore @safe-sink comments', () => {
        const text = `
            // @safe-sink: trusted input
            eval(input);
        `;
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(0);
    });

    it('should provide context for violations', () => {
        const text = `
            line 1
            line 2
            eval(data);
            line 4
            line 5
        `;
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(1);
        const context = violations[0].context;
        expect(context.before).toHaveLength(2);
        expect(context.before?.[0].text).toBe('line 1');
        expect(context.before?.[1].text).toBe('line 2');
        expect(context.offendingLine).toBe('eval(data);');
        expect(context.after).toHaveLength(2);
        expect(context.after?.[0].text).toBe('line 4');
        expect(context.after?.[1].text).toBe('line 5');
    });

    it('should respect lineOffset', () => {
        const text = 'eval(x);';
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 10,
            options,
        });

        expect(violations).toHaveLength(1);
        expect(violations[0].line).toBe(11);
    });

    it('should handle displayContextBefore false', () => {
        const sinkNoBefore: CompiledSink = {
            ...mockSink,
            metadata: { ...mockSink.metadata, displayContextBefore: false },
        };
        const text = 'line1\nline2\neval(x)\nline4';
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [sinkNoBefore],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(1);
        expect(violations[0].context.before).toBeNull();
    });

    it('should handle displayContextAfter false', () => {
        const sinkNoAfter: CompiledSink = {
            ...mockSink,
            metadata: { ...mockSink.metadata, displayContextAfter: false },
        };
        const text = 'line1\nline2\neval(x)\nline4';
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [sinkNoAfter],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(1);
        expect(violations[0].context.after).toBeNull();
    });

    it('should handle @safe-sink with empty lines and other comments in between', () => {
        const text = `
            // @safe-sink: reason
            
            // some other comment
            
            eval(input);
        `;
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(0);
    });

    it('should not ignore if @safe-sink is followed by non-ignorable content', () => {
        const text = `
            // @safe-sink: reason
            const x = 1;
            eval(input);
        `;
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(1);
    });

    it('should handle HTML comments as ignorable', () => {
        const text = `
            <!-- @safe-sink: reason -->
            <!-- another comment -->
            eval(input);
        `;
        const violations = scanText({
            text,
            displayPath: 'test.js',
            compiledSinks: [mockSink],
            lineOffset: 0,
            options,
        });

        expect(violations).toHaveLength(0);
    });
});
