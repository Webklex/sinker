import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadConfig, defaultConfig } from './config';
import * as fs from 'node:fs';
import * as path from 'node:path';

vi.mock('node:fs', async () => {
    const actual = await vi.importActual('node:fs');
    return {
        ...actual,
        existsSync: vi.fn(),
    };
});

vi.mock('node:path', async () => {
    const actual = await vi.importActual('node:path');
    return {
        ...actual,
        // @ts-ignore
        resolve: vi.fn(actual.resolve),
    };
});

describe('config', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return default config if no config file exists', async () => {
        vi.mocked(fs.existsSync).mockReturnValue(false);
        const config = await loadConfig();
        expect(config).toEqual(defaultConfig);
    });

    it('should return default config and warn if loading fails', async () => {
        vi.mocked(fs.existsSync).mockReturnValue(true);
        vi.mocked(path.resolve).mockReturnValue(
            '/non/existent/path/sinker.config.js'
        );
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const config = await loadConfig();

        expect(config).toEqual(defaultConfig);
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('should load config from sinker.config.js if it exists', async () => {
        // Reset all mocks to test real config loading
        vi.restoreAllMocks();
        const config = await loadConfig();
        expect(config).toHaveProperty('ignored');
        expect(Array.isArray(config.ignored)).toBe(true);
    });
});
