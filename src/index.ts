import pc from 'picocolors';

import { main } from './cli/main';

main(process.argv)
    .then(code => {
        process.exitCode = code;
    })
    .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        // Keep output simple and safe for CI logs
        console.error(pc.red(`Unexpected error: ${message}`));
        process.exitCode = 1;
    });
