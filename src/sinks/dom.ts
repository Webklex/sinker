import { Sink } from './types';

export const domSinks: Sink = {
    name: 'DOM-Data Manipulation Sink',
    description:
        'Manipulating the document dom can lead to cross-domain attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/dom-data-manipulation',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: [
        '.setAttribute',
        '.search',
        '.text',
        '.textContent',
        '.innerText',
        '.outerText',
        '.value',
        '.name',
        '.target',
        '.method',
        '.type',
        '.backgroundImage',
        '.cssText',
        '.codebase',
        'document.title',
        'document.implementation.createHTMLDocument',
        'history.pushState',
        'history.replaceState',
    ],
};
