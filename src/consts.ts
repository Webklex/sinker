declare const __SINKER_PLUGIN_VERSION__: string;
export const PLUGIN_VERSION =
    typeof __SINKER_PLUGIN_VERSION__ !== 'undefined'
        ? __SINKER_PLUGIN_VERSION__
        : (process.env.npm_package_version ?? '0.0.0');
