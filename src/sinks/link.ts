import { Sink } from './types';

export const linkSinks: Sink = {
    name: 'Link Manipulation Sink',
    description:
        'Manipulating links can lead to cross-site scripting (XSS) attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/link-manipulation',
    displayContextBefore: true,
    displayContextAfter: true,
    sinks: ['.href', '.src', '.action'],
};
