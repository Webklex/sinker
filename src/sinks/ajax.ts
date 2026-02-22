import { Sink } from './types';

export const ajaxSinks: Sink = {
    name: 'Ajax Request-Header Manipulation Sink',
    description:
        'Manipulating request headers can lead to cross-site scripting (XSS) attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/ajax-request-header-manipulation',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: [
        'XMLHttpRequest.setRequestHeader(',
        'XMLHttpRequest.open(',
        'XMLHttpRequest.send(',
    ],
};
