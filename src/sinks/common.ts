import { Sink } from './types';

export const commonSinks: Sink = {
    name: 'Common Source',
    description:
        'A source that can be controlled by an attacker and can lead to XSS if not properly sanitized.',
    link: 'https://portswigger.net/web-security/dom-based',
    displayContextBefore: true,
    displayContextAfter: true,
    sinks: [
        'document.URL',
        'document.documentURI',
        'document.URLUnencoded',
        'document.baseURI',
        'document.referrer',
        'window.name',
        'localStorage',
        'sessionStorage',
        'mozIndexedDB',
        'webkitIndexedDB',
        'msIndexedDB',
        'IndexedDB',
        'Database',
    ],
};
