import { Sink } from './types';

export const domainSinks: Sink = {
    name: 'Document-Domain Manipulation Sinks',
    description:
        'Manipulating the document domain can lead to cross-domain attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/document-domain-manipulation',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: ['document.domain'],
};
