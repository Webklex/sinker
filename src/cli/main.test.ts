import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { main } from './main';
import * as scanFs from '../scanner/scanFs';
import * as config from '../config';
import * as sinks from '../scanner/sinks';

vi.mock('../scanner/scanFs');
vi.mock('../config');
vi.mock('../scanner/sinks');

describe('main', () => {
    const mockConfig = {
        ignoredSinks: [],
        sinks: [],
        ignored: [],
        colors: true,
        contextDepth: 3,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(config.loadConfig).mockResolvedValue(mockConfig);
        vi.mocked(sinks.loadSinks).mockReturnValue({ sinks: [], count: 0 });
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should show help and return 0 if --help is passed', async () => {
        const code = await main(['node', 'sinker', '--help']);
        expect(code).toBe(0);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('Usage:')
        );
    });

    it('should return 1 if no sinks are found', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({ sinks: [], count: 0 });
        const code = await main(['node', 'sinker', '.']);
        expect(code).toBe(1);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('No sink rules found')
        );
    });

    it('should return 1 if target path does not exist', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(false);
        const code = await main(['node', 'sinker', 'invalid-path']);
        expect(code).toBe(1);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Path does not exist')
        );
    });

    it('should return 1 if violations are found in a directory', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(true);
        vi.mocked(scanFs.statSync).mockReturnValue({
            isDirectory: () => true,
        } as any);
        vi.mocked(scanFs.scanDir).mockResolvedValue({
            violations: [
                {
                    file: 'test.js',
                    line: 1,
                    sink: {
                        sink: 's',
                        metadata: {
                            name: 'n',
                            description: 'd',
                            link: 'l',
                            displayContextBefore: true,
                            displayContextAfter: true,
                            sinks: ['s'],
                        },
                    },
                    context: { before: [], offendingLine: 's', after: [] },
                },
            ],
            count: 1,
        });

        const code = await main(['node', 'sinker', '.']);
        expect(code).toBe(1);
        expect(scanFs.scanDir).toHaveBeenCalled();
    });

    it('should handle scanDir returning no violations (explicitly)', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(true);
        vi.mocked(scanFs.statSync).mockReturnValue({
            isDirectory: () => true,
        } as any);
        vi.mocked(scanFs.scanDir).mockResolvedValue({
            violations: [],
            count: 1,
        });

        const code = await main(['node', 'sinker', '.']);
        expect(code).toBe(0);
        expect(scanFs.scanDir).toHaveBeenCalled();
    });

    it('should return 0 if --help is passed (alternate check)', async () => {
        // This is to cover branches in parseArgs if needed, but here we just ensure main handles it
        const code = await main(['node', 'sinker', '-h']);
        expect(code).toBe(0);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('Usage:')
        );
    });

    it('should scan directory and return 0 if no violations found', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(true);
        vi.mocked(scanFs.statSync).mockReturnValue({
            isDirectory: () => true,
        } as any);
        vi.mocked(scanFs.scanDir).mockResolvedValue({
            violations: [],
            count: 5,
        });

        const code = await main(['node', 'sinker', '.']);
        expect(code).toBe(0);
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('No violations found')
        );
        expect(scanFs.scanDir).toHaveBeenCalled();
    });

    it('should scan file and return 1 if violations found', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(true);
        vi.mocked(scanFs.statSync).mockReturnValue({
            isDirectory: () => false,
        } as any);
        vi.mocked(scanFs.scanFile).mockResolvedValue({
            violations: [
                {
                    file: 'test.js',
                    line: 1,
                    sink: {
                        sink: 's',
                        metadata: {
                            name: 'n',
                            description: 'd',
                            link: 'l',
                            displayContextBefore: true,
                            displayContextAfter: true,
                            sinks: ['s'],
                        },
                    },
                    context: { before: [], offendingLine: 's', after: [] },
                },
            ],
            count: 1,
        });

        const code = await main(['node', 'sinker', 'test.js']);
        expect(code).toBe(1);
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('Found 1 violations')
        );
        expect(scanFs.scanFile).toHaveBeenCalled();
    });

    it('should use contextDepth from config if not provided in args', async () => {
        vi.mocked(config.loadConfig).mockResolvedValue({
            ...mockConfig,
            contextDepth: 5,
        });
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(true);
        vi.mocked(scanFs.statSync).mockReturnValue({
            isDirectory: () => true,
        } as any);
        vi.mocked(scanFs.scanDir).mockResolvedValue({
            violations: [],
            count: 1,
        });

        await main(['node', 'sinker', '.']);
        expect(scanFs.scanDir).toHaveBeenCalledWith(
            expect.objectContaining({
                contextDepth: 5,
            })
        );
    });

    it('should use contextDepth from args if provided', async () => {
        vi.mocked(sinks.loadSinks).mockReturnValue({
            sinks: [{} as any],
            count: 1,
        });
        vi.mocked(scanFs.pathExistsSync).mockReturnValue(true);
        vi.mocked(scanFs.statSync).mockReturnValue({
            isDirectory: () => true,
        } as any);
        vi.mocked(scanFs.scanDir).mockResolvedValue({
            violations: [],
            count: 1,
        });

        await main(['node', 'sinker', '.', '--context-depth=10']);
        expect(scanFs.scanDir).toHaveBeenCalledWith(
            expect.objectContaining({
                contextDepth: 10,
            })
        );
    });
});
