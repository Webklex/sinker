import { describe, it, expect } from 'vitest';

import { extractHtmlScriptBlocks } from './html';

describe('html', () => {
    describe('extractHtmlScriptBlocks', () => {
        it('should extract a single script block', () => {
            const html = `
                <html>
                    <body>
                        <script>
                            const x = 1;
                        </script>
                    </body>
                </html>
            `;
            const blocks = extractHtmlScriptBlocks(html);
            expect(blocks).toHaveLength(1);
            expect(blocks[0].code).toContain('const x = 1;');
            expect(blocks[0].startLine).toBe(4);
        });

        it('should extract multiple script blocks', () => {
            const html = `
                <script>
                    const x = 1;
                </script>
                <div></div>
                <script type="module">
                    const y = 2;
                </script>
            `;
            const blocks = extractHtmlScriptBlocks(html);
            expect(blocks).toHaveLength(2);
            expect(blocks[0].code).toContain('const x = 1;');
            expect(blocks[0].startLine).toBe(2);
            expect(blocks[1].code).toContain('const y = 2;');
            expect(blocks[1].startLine).toBe(6);
        });

        it('should handle scripts with attributes', () => {
            const html = '<script defer src="test.js">console.log(1)</script>';
            const blocks = extractHtmlScriptBlocks(html);
            expect(blocks).toHaveLength(1);
            expect(blocks[0].code).toBe('console.log(1)');
        });

        it('should return empty array if no scripts', () => {
            const html = '<div>No script here</div>';
            const blocks = extractHtmlScriptBlocks(html);
            expect(blocks).toHaveLength(0);
        });

        it('should handle unclosed script tags gracefully', () => {
            const html = '<script>const x = 1;';
            const blocks = extractHtmlScriptBlocks(html);
            expect(blocks).toHaveLength(0);
        });
    });
});
