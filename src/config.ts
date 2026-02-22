import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';

import { Sink } from './sinks';
import { CONFIG_FILE } from './consts';

const _require = typeof require !== 'undefined' ? require : createRequire;

export interface SinkerConfig {
    ignoredSinks: string[];
    sinks: Sink[];
    ignored: string[];
    colors: boolean;
    minimal: boolean;
    contextDepth: number;
}

export interface OptionalSinkerConfig {
    ignoredSinks?: string[];
    sinks?: Sink[];
    ignored?: string[];
    colors?: boolean;
    minimal?: boolean;
    contextDepth?: number;
}

export const defaultConfig: SinkerConfig = {
    ignoredSinks: [],
    ignored: [
        '**/dist/**',
        '**/node_modules/**',
        '**/coverage/**',
        '*.test.js',
        '*.spec.js',
        '*.min.js',
        '*.map',
    ],
    sinks: [],
    colors: true,
    minimal: true,
    contextDepth: 3,
};

function _populateConfig(conf: OptionalSinkerConfig): SinkerConfig {
    return {
        ...defaultConfig,
        ...conf,
    };
}

function _logConfigLoadingWarning(configPath: string, err: Error | unknown) {
    console.warn(
        `Failed to load config from ${configPath}. Using default config.`,
        err
    );
}

function _getConfigPath(): string {
    return path.resolve(process.cwd(), CONFIG_FILE);
}

export function loadConfigSync(): SinkerConfig {
    const configPath = _getConfigPath();
    if (fs.existsSync(configPath)) {
        try {
            const module = _require(configPath);
            return _populateConfig(module.default || module);
        } catch (err) {
            _logConfigLoadingWarning(configPath, err);
        }
    }
    return defaultConfig;
}

export async function loadConfig(): Promise<SinkerConfig> {
    const configPath = _getConfigPath();
    if (fs.existsSync(configPath)) {
        try {
            // @safe-sink: no outside path manipulation possible here
            const configUrl: string = pathToFileURL(configPath).href;
            const module = await import(configUrl);
            return _populateConfig(module.default || module);
        } catch (err) {
            _logConfigLoadingWarning(configPath, err);
        }
    }
    return defaultConfig;
}
