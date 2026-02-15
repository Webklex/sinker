import { Sink } from './types';

export const domXssSinks: Sink = {
    name: 'DOM-XSS Sinks',
    description:
        'Applying user input to DOM without proper sanitization can lead to DOM-based XSS.',
    link: 'https://portswigger.net/web-security/cross-site-scripting/dom-based',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: [
        'document.write(',
        'document.writeln(',
        '.innerHTML',
        '.outerHTML',
        '.insertAdjacentHTML',
        '.onevent',
    ],
};
