import { loadSinks } from '../../src/scanner/sinks';
import { scanText } from '../../src/scanner/scanText';
import { createColorizer } from '../../src/output/colors';
import { formatViolation } from '../../src/output/formatter';
import { loadConfigSync, SinkerConfig } from '../../src/config';
import { isIgnored } from '../../src/scanner/scanFs';
import { SINKER_VERSION } from '../../src/consts';

const { sinks: compiledSinks } = loadSinks(null);

type RuleOptions = {
    contextDepth: number;
    colors: boolean;
    minimal: boolean;
    config: SinkerConfig;
};

const defaultRuleOptions: RuleOptions = {
    contextDepth: 3,
    colors: true,
    minimal: true,
    config: loadConfigSync(),
};

function _resolveOptions(options: RuleOptions[]): RuleOptions {
    const ruleOptions = (options && options[0]) || ({} as RuleOptions);

    return {
        contextDepth:
            ruleOptions.contextDepth ?? defaultRuleOptions.contextDepth,
        colors: ruleOptions.colors ?? defaultRuleOptions.colors,
        minimal: ruleOptions.minimal ?? defaultRuleOptions.minimal,
        config: defaultRuleOptions.config,
    };
}

export const sinkerPlugin = {
    meta: {
        name: '@webklex/eslint-plugin-sinker',
        version: SINKER_VERSION,
        namespace: 'sinker',
    },
    processors: {},
    rules: {
        'no-sink': {
            meta: {
                type: 'suggestion',
                docs: {
                    description:
                        'Scans your code for potentially dangerous sinks and sources.',
                    category: 'Security',
                    recommended: true,
                },
                schema: [
                    {
                        type: 'object',
                        properties: {
                            contextDepth: {
                                type: 'number',
                                minimum: 0,
                                maximum: 10,
                            },
                            colors: { type: 'boolean' },
                            minimal: { type: 'boolean' },
                        },
                        additionalProperties: false,
                    },
                ],
            },
            create(context: {
                // ESLint 10: `sourceCode` exists; older ESLint had `getSourceCode()`
                sourceCode?: { text: string };
                getSourceCode?: () => { text: string };
                options: RuleOptions[];
                getFilename?: () => string;
                filename?: string;
                report: (descriptor: {
                    loc: {
                        start: { line: number; column: number };
                        end: { line: number; column: number };
                    };
                    message: string;
                }) => void;
            }) {
                const ro = _resolveOptions(context.options);
                const c = createColorizer(ro.colors);

                return {
                    Program() {
                        const displayPath =
                            context.getFilename?.() ?? context.filename ?? '';
                        if (isIgnored(displayPath, ro.config.ignored)) {
                            return;
                        }

                        const text =
                            context.sourceCode?.text ??
                            context.getSourceCode?.().text ??
                            '';
                        const violations = scanText({
                            text,
                            displayPath,
                            compiledSinks,
                            lineOffset: 0,
                            options: { contextDepth: ro.contextDepth },
                        });

                        for (const v of violations) {
                            const msg = formatViolation(
                                v,
                                c,
                                ro.minimal,
                                false
                            );

                            context.report({
                                loc: {
                                    start: { line: v.line, column: 0 },
                                    end: {
                                        line: v.line,
                                        column: v.context.offendingLine.length,
                                    },
                                },
                                message: msg,
                            });
                        }
                    },
                };
            },
        },
    },
    configs: {
        recommended: {
            plugins: ['sinker'],
            rules: {
                'sinker/no-sink': [
                    'warn',
                    { contextDepth: 3, colors: true, minimal: true },
                ],
            },
        },
    },
};
