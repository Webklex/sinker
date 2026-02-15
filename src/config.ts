import * as path from 'node:path';
import * as fs from 'node:fs';
import { pathToFileURL } from 'node:url';

import { Sink } from './sinks';

export interface SinkerConfig {
    ignoredSinks: string[];
    sinks: Sink[];
    ignored: string[];
    colors: boolean;
    contextDepth: number;
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
        '*.map'
    ],
    sinks: [],
    colors: true,
    contextDepth: 3,
};

export async function loadConfig(): Promise<SinkerConfig> {
    const configPath = path.resolve(process.cwd(), 'sinker.config.js');
    if (fs.existsSync(configPath)) {
        try {
            const configUrl = pathToFileURL(configPath).href;
            const module = await import(configUrl);
            const conf = module.default || module;
            return {
                ...defaultConfig,
                ...conf,
            };
        } catch (err) {
            console.warn(`Failed to load config from ${configPath}:`, err);
        }
    }
    return defaultConfig;
}
