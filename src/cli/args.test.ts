import { describe, it, expect } from 'vitest';
import { parseArgs } from './args';

describe('args', () => {
    it('should parse target location', () => {
        const parsed = parseArgs(['node', 'bin', 'src']);
        expect(parsed.targetLocation).toBe('src');
    });

    it('should default to . if no target location provided', () => {
        const parsed = parseArgs(['node', 'bin']);
        expect(parsed.targetLocation).toBe('.');
    });

    it('should parse --no-color and -nc', () => {
        expect(parseArgs(['node', 'bin', '--no-color']).options.useColor).toBe(
            false
        );
        expect(parseArgs(['node', 'bin', '-nc']).options.useColor).toBe(false);
        expect(parseArgs(['node', 'bin']).options.useColor).toBe(true);
    });

    it('should parse --help and -h', () => {
        expect(parseArgs(['node', 'bin', '--help']).options.help).toBe(true);
        expect(parseArgs(['node', 'bin', '-h']).options.help).toBe(true);
        expect(parseArgs(['node', 'bin']).options.help).toBe(false);
    });

    it('should parse --context-depth', () => {
        expect(
            parseArgs(['node', 'bin', '--context-depth=5']).options.contextDepth
        ).toBe(5);
        expect(
            parseArgs(['node', 'bin', '--context-depth=0']).options.contextDepth
        ).toBe(0);
        expect(
            parseArgs(['node', 'bin', '--context-depth=invalid']).options
                .contextDepth
        ).toBe(-1);
        expect(parseArgs(['node', 'bin']).options.contextDepth).toBe(-1);
    });

    it('should handle target location with flags', () => {
        const parsed = parseArgs([
            'node',
            'bin',
            '--no-color',
            'dist',
            '--context-depth=10',
        ]);
        expect(parsed.targetLocation).toBe('dist');
        expect(parsed.options.useColor).toBe(false);
        expect(parsed.options.contextDepth).toBe(10);
    });
});
