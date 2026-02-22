import { type ScanResult } from '../scanner/types';

import type { Colorizer } from './colors';
import { formatViolation } from './formatter';

export function printViolations(
    scanResult: ScanResult,
    c: Colorizer,
    minimal: boolean,
    printFilename: boolean = true
): void {
    if (scanResult.violations.length > 0) {
        console.error(
            c.red(c.bold(`Found ${scanResult.violations.length} violations`))
        );

        for (const v of scanResult.violations) {
            console.error(formatViolation(v, c, minimal, printFilename));
            if (!minimal) console.log('');
        }
    }
}
