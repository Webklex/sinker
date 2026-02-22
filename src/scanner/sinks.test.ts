import { describe, it, expect } from 'vitest';

import { Sink } from '../sinks';

import { compileSinks, getUniqueSinks, loadSinks } from './sinks';

describe('sinks', () => {
    describe('compileSinks', () => {
        it('should compile a simple sink to a regex', () => {
            const sinks = [{ sink: 'eval(', metadata: {} as any }];
            const compiled = compileSinks(sinks);
            expect(compiled).toHaveLength(1);
            const regex = compiled[0].regex;
            expect(regex.test('eval(')).toBe(true);
            expect(regex.test(' eval(')).toBe(true);
            expect(regex.test('myeval(')).toBe(false);
        });

        it('should handle sinks starting with a dot', () => {
            const sinks = [{ sink: '.innerHTML', metadata: {} as any }];
            const compiled = compileSinks(sinks);
            expect(compiled).toHaveLength(1);
            expect(compiled[0].regex.test('el.innerHTML = "x"')).toBe(true);
            expect(compiled[0].regex.test('innerHTML = "x"')).toBe(false);
        });

        it('should escape regex special characters', () => {
            const sinks = [{ sink: 'obj.func$', metadata: {} as any }];
            const compiled = compileSinks(sinks);
            expect(compiled).toHaveLength(1);
            expect(compiled[0].regex.test('obj.func$')).toBe(true);
            // It should NOT match if it's not an exact match for the sink (escaped $)
            expect(compiled[0].regex.test('obj.func1')).toBe(false);
        });
    });

    describe('getUniqueSinks', () => {
        it('should return sinks from allSinkGroups', () => {
            const unique = getUniqueSinks(new Set());
            expect(unique.length).toBeGreaterThan(0);
        });

        it('should respect ignoredSinks', () => {
            const all = getUniqueSinks(new Set());
            const firstSink = all[0].sink;
            const unique = getUniqueSinks(new Set([firstSink]));
            expect(unique.find(s => s.sink === firstSink)).toBeUndefined();
            expect(unique.length).toBe(all.length - 1);
        });
    });

    describe('loadSinks', () => {
        it('should load default sinks when config is null', () => {
            const result = loadSinks(null);
            expect(result.count).toBeGreaterThan(0);
            expect(result.sinks.length).toBe(result.count);
        });

        it('should throw if sink is empty', () => {
            const customSink: Sink = {
                name: 'Custom',
                description: 'desc',
                link: 'link',
                displayContextBefore: true,
                displayContextAfter: true,
                sinks: [''],
            };
            expect(() => loadSinks({ sinks: [customSink] } as any)).toThrow(
                'Sink cannot be empty'
            );
        });

        it('should throw if sink is already defined', () => {
            const customSink: Sink = {
                name: 'Custom',
                description: 'desc',
                link: 'link',
                displayContextBefore: true,
                displayContextAfter: true,
                sinks: ['eval('],
            };
            // eval( is already in default sinks
            expect(() => loadSinks({ sinks: [customSink] } as any)).toThrow(
                /already defined/
            );
        });

        it('should add custom sinks from config', () => {
            const customSink: Sink = {
                name: 'Custom',
                description: 'desc',
                link: 'link',
                displayContextBefore: true,
                displayContextAfter: true,
                sinks: ['customFunc('],
            };
            const result = loadSinks({ sinks: [customSink] } as any);
            expect(
                result.sinks.find(s => s.sink === 'customFunc(')
            ).toBeDefined();
        });
    });
});
