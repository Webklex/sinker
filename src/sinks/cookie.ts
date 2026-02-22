import { Sink } from './types';

export const cookieSinks: Sink = {
    name: 'Cookie Sink',
    description:
        'An improper sanitized or validated value can lead to cookie theft, XSS, open redirects and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/cookie-manipulation',
    displayContextBefore: true,
    displayContextAfter: true,
    sinks: ['document.cookie'],
};
