import { promises as fs } from 'node:fs';
import * as fsSync from 'node:fs';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CompiledSink } from './types';
import { scanFile, scanDir, pathExistsSync, statSync } from './scanFs';

vi.mock('node:fs', async () => {
    const actual = await vi.importActual('node:fs');
    return {
        ...actual,
        existsSync: vi.fn(),
        statSync: vi.fn(),
        promises: {
            readFile: vi.fn(),
            readdir: vi.fn(),
        },
    };
});

describe('scanFs', () => {
    // ...
    const mockSink: CompiledSink = {
        sink: 'eval',
        regex: /eval\(/,
        metadata: {
            name: 'JS',
            description: 'desc',
            link: 'link',
            displayContextBefore: true,
            displayContextAfter: true,
            sinks: ['eval('],
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fs helpers', () => {
        it('pathExistsSync should call fs.existsSync', () => {
            vi.mocked(fsSync.existsSync).mockReturnValue(true);
            expect(pathExistsSync('test')).toBe(true);
            expect(fsSync.existsSync).toHaveBeenCalledWith('test');
        });

        it('statSync should call fs.statSync', () => {
            const mockStats = { isFile: () => true } as any;
            vi.mocked(fsSync.statSync).mockReturnValue(mockStats);
            expect(statSync('test')).toBe(mockStats);
            expect(fsSync.statSync).toHaveBeenCalledWith('test');
        });
    });

    describe('scanFile', () => {
        it('should scan a JS file and return violations', async () => {
            vi.mocked(fs.readFile).mockResolvedValue('eval("x")');

            const result = await scanFile({
                filePath: 'test.js',
                compiledSinks: [mockSink],
                contextDepth: 0,
            });

            expect(result.violations).toHaveLength(1);
            expect(result.count).toBe(1);
            expect(result.violations[0].file).toBe('test.js');
        });

        it('should scan an HTML file and return violations from script blocks', async () => {
            vi.mocked(fs.readFile).mockResolvedValue(
                '<html><script>eval("x")</script></html>'
            );

            const result = await scanFile({
                filePath: 'test.html',
                compiledSinks: [mockSink],
                contextDepth: 0,
            });

            expect(result.violations).toHaveLength(1);
            expect(result.count).toBe(1);
            expect(result.violations[0].file).toBe('test.html (<script>)');
        });

        it('should return 0 violations for ignored files', async () => {
            const result = await scanFile({
                filePath: 'ignored.js',
                compiledSinks: [mockSink],
                contextDepth: 0,
                ignored: ['ignored.js'],
            });

            expect(result.violations).toHaveLength(0);
            expect(result.count).toBe(0);
            expect(fs.readFile).not.toHaveBeenCalled();
        });

        it('should return 0 violations for non-JS/TS/HTML files', async () => {
            vi.mocked(fs.readFile).mockResolvedValue('some text');

            const result = await scanFile({
                filePath: 'test.txt',
                compiledSinks: [mockSink],
                contextDepth: 0,
            });

            expect(result.violations).toHaveLength(0);
            expect(result.count).toBe(1);
        });
    });

    describe('scanDir', () => {
        it('should scan files in a directory recursively', async () => {
            vi.mocked(fs.readdir).mockResolvedValueOnce([
                {
                    name: 'file1.js',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
                {
                    name: 'subdir',
                    isFile: () => false,
                    isDirectory: () => true,
                } as any,
            ]);
            vi.mocked(fs.readdir).mockResolvedValueOnce([
                {
                    name: 'file2.js',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
            ]);
            vi.mocked(fs.readFile).mockResolvedValue('eval("x")');

            const result = await scanDir({
                dirPath: 'root',
                compiledSinks: [mockSink],
                contextDepth: 0,
            });

            expect(result.violations).toHaveLength(2);
            expect(result.count).toBe(2);
        });

        it('should respect ignored directories', async () => {
            vi.mocked(fs.readdir).mockResolvedValueOnce([
                {
                    name: 'node_modules',
                    isFile: () => false,
                    isDirectory: () => true,
                } as any,
                {
                    name: 'file1.js',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
            ]);
            vi.mocked(fs.readFile).mockResolvedValue('eval("x")');

            const result = await scanDir({
                dirPath: 'root',
                compiledSinks: [mockSink],
                contextDepth: 0,
                ignored: ['node_modules'],
            });

            expect(result.violations).toHaveLength(1);
            expect(result.count).toBe(1);
            // node_modules should not have been scanned
            expect(fs.readdir).toHaveBeenCalledTimes(1);
        });

        it('should handle ignore patterns with wildcards', async () => {
            vi.mocked(fs.readdir).mockResolvedValueOnce([
                {
                    name: 'test_file.js',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
                {
                    name: 'other.js',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
            ]);
            vi.mocked(fs.readFile).mockResolvedValue('eval("x")');

            const result = await scanDir({
                dirPath: 'root',
                compiledSinks: [mockSink],
                contextDepth: 0,
                ignored: ['test_*'],
            });

            expect(result.violations).toHaveLength(1);
            expect(result.count).toBe(1);
            expect(result.violations[0].file).toContain('other.js');
        });

        it('should return 0 violations if dir is ignored', async () => {
            const result = await scanDir({
                dirPath: 'ignored_dir',
                compiledSinks: [mockSink],
                contextDepth: 0,
                ignored: ['ignored_dir'],
            });

            expect(result.violations).toHaveLength(0);
            expect(result.count).toBe(0);
        });

        it('should handle entries that are neither files nor directories', async () => {
            vi.mocked(fs.readdir).mockResolvedValueOnce([
                {
                    name: 'symlink',
                    isFile: () => false,
                    isDirectory: () => false,
                } as any,
                {
                    name: 'file.js',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
                {
                    name: 'some.other',
                    isFile: () => true,
                    isDirectory: () => false,
                } as any,
            ]);
            vi.mocked(fs.readFile).mockResolvedValue('eval("x")');

            const result = await scanDir({
                dirPath: 'root',
                compiledSinks: [mockSink],
                contextDepth: 0,
            });

            expect(result.violations).toHaveLength(1);
            expect(result.count).toBe(1);
            expect(result.violations[0].file).toContain('file.js');
        });
    });

    describe('isIgnored edge cases', () => {
        it('should handle empty filename in isIgnored', async () => {
            // isIgnored is private, but it's called by scanFile
            // To trigger path.split(/[/\\]/).pop() || '' where pop() is undefined,
            // we can pass an empty string as filePath.
            const result = await scanFile({
                filePath: '',
                compiledSinks: [mockSink],
                contextDepth: 0,
                ignored: ['*'],
            });
            expect(result.count).toBe(0);
        });
    });
});
