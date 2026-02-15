import { Sink } from './types';

export const jsonSinks: Sink = {
    name: 'Client-Side JSON Injection Sinks',
    description:
        'Manipulating the document domain can lead to cross-domain attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/client-side-json-injection',
    displayContextBefore: true,
    displayContextAfter: true,
    sinks: ['JSON.parse', 'jQuery.parseJSON', '$.parseJSON'],
};
