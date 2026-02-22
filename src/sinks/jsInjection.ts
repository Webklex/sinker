import { Sink } from './types';

export const jsInjectionSinks: Sink = {
    name: 'JavaScript Injection Sink',
    description:
        'One of the most dangerous sinks in DOM-based XSS attacks, allowing for arbitrary code execution.',
    link: 'https://portswigger.net/web-security/dom-based/javascript-injection',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: [
        'eval(',
        'Function(',
        'setTimeout(',
        'setInterval(',
        'setImmediate(',
        'execCommand(',
        'execScript(',
        'msSetImmediate(',
        'range.createContextualFragment(',
        'crypto.generateCRMFRequest(',
    ],
};
