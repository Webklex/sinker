import * as generated from './consts.generated';

export const SINKER_VERSION =
    generated.SINKER_VERSION ?? process.env.npm_package_version ?? '0.0.0';

export const CONFIG_FILE = generated.CONFIG_FILE ?? 'sinker.config.js';
