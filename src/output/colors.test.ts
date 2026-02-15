import { describe, it, expect } from 'vitest';
import { createColorizer } from './colors';
import pc from 'picocolors';

describe('colors', () => {
    it('should return real colorizer when useColor is true', () => {
        const c = createColorizer(true);
        // picocolors might disable colors if it detects no TTY,
        // but it should still be the same object or functional.
        expect(c).toBe(pc);
    });

    it('should return identity colorizer when useColor is false', () => {
        const c = createColorizer(false);
        expect(c.red('test')).toBe('test');
        expect(c.yellow('test')).toBe('test');
        expect(c.blue('test')).toBe('test');
        expect(c.cyan('test')).toBe('test');
        expect(c.gray('test')).toBe('test');
        expect(c.bold('test')).toBe('test');
        expect(c.dim('test')).toBe('test');
        expect(c.green('test')).toBe('test');
    });

    it('should handle null or undefined in identity colorizer', () => {
        const c = createColorizer(false);
        // @ts-ignore
        expect(c.red(null)).toBe('');
        // @ts-ignore
        expect(c.red(undefined)).toBe('');
    });
});
