import { allSinkGroups, Sink } from '../sinks';
import type { SinkerConfig } from '../config';

import type { CompiledSink, SinkMatch } from './types';

function escapeRegExpLiteral(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _filterUniqueSinks(sinks: SinkMatch[]) {
    const uniqueMap = new Map<string, SinkMatch>();
    for (const s of sinks) {
        uniqueMap.set(s.sink, s);
    }
    return uniqueMap;
}

export function loadSinks(config: SinkerConfig | null): {
    sinks: CompiledSink[];
    count: number;
} {
    const sinks = getUniqueSinks(new Set(config?.ignoredSinks ?? []));
    if (config?.sinks) {
        const uniqueMap = _filterUniqueSinks(sinks);

        for (const def of config.sinks) {
            for (const rawSink of def.sinks) {
                addSinkToMap(rawSink, uniqueMap, def);
            }
        }

        return {
            sinks: compileSinks([...uniqueMap.values()]),
            count: uniqueMap.size,
        };
    }

    const compiledSinks = compileSinks(sinks);

    return {
        sinks: compiledSinks,
        count: compiledSinks.length,
    };
}

function addSinkToMap(
    sink: string,
    sinks: Map<string, SinkMatch>,
    def: Sink
): asserts sink is SinkMatch['sink'] {
    if (!sink) throw new Error('Sink cannot be empty');
    if (sinks.has(sink)) throw new Error(`Sink "${sink}" is already defined`);

    sinks.set(sink, {
        sink: sink,
        metadata: def,
    });
}

export function getUniqueSinks(ignoredSinks: Set<string>): SinkMatch[] {
    const uniqueSinks = new Map<string, SinkMatch>();

    for (const def of allSinkGroups) {
        for (const rawSink of def.sinks) {
            if (ignoredSinks.has(rawSink)) continue;
            addSinkToMap(rawSink, uniqueSinks, def);
        }
    }

    return [...uniqueSinks.values()];
}

export function compileSinks(sinks: SinkMatch[]): CompiledSink[] {
    return sinks.map(s => {
        const escaped = escapeRegExpLiteral(s.sink);
        // If the sink starts with a dot, we want to match it even if preceded by a word character (e.g., el.innerHTML)
        // while ensuring it's not part of a larger word (handled by the escaped dot itself).
        // If it doesn't start with a dot, we want to ensure it's not part of another word,
        // but we allow it to be preceded by a dot (e.g., window.localStorage).
        const prefix = s.sink.startsWith('.')
            ? '(^|[^\\w]|(?<=\\w))'
            : '(^|[^\\w])';
        const regex = new RegExp(prefix + escaped + '([^\\w]|$)');
        return { ...s, regex };
    });
}
