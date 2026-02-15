import { Sink } from './types';

export const xpathSinks: Sink = {
    name: 'XPath Injection Sinks',
    description:
        'Manipulating XPath expressions can lead to XPath injection vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/client-side-xpath-injection',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: ['.evaluate'],
};
