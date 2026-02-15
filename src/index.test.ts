import { describe, it, expect, vi, beforeEach } from 'vitest';
import { main } from './cli/main';

vi.mock('./cli/main', () => ({
    main: vi.fn(),
}));

describe('index', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call main and set exitCode', async () => {
        vi.mocked(main).mockResolvedValue(0);

        // Triggers the code in index.ts
        await import('./index?test=' + Date.now());

        // We wait a bit for the promise to resolve
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(main).toHaveBeenCalled();
        expect(process.exitCode).toBe(0);
    });

    it('should handle errors and set exitCode to 1', async () => {
        vi.mocked(main).mockRejectedValue(new Error('test error'));
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await import('./index?test=' + (Date.now() + 1));

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(main).toHaveBeenCalled();
        expect(process.exitCode).toBe(1);
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Unexpected error: test error')
        );
        consoleSpy.mockRestore();
    });

    it('should handle non-Error exceptions and set exitCode to 1', async () => {
        vi.mocked(main).mockRejectedValue('string error');
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await import('./index?test=' + (Date.now() + 2));

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(main).toHaveBeenCalled();
        expect(process.exitCode).toBe(1);
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Unexpected error: string error')
        );
        consoleSpy.mockRestore();
    });
});
