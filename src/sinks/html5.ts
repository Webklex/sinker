import { Sink } from './types';

export const html5Sinks: Sink = {
    name: 'HTML5 Storage Manipulation Sinks',
    description:
        'Manipulating HTML5 storage can lead to cross-site scripting (XSS) attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/html5-storage-manipulation',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: ['sessionStorage.setItem', 'localStorage.setItem'],
};
