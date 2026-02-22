import { Sink } from './types';

export const openRedirectSinks: Sink = {
    name: 'Open Redirect Sink',
    description: 'This sink can be used to perform open redirects.',
    link: 'https://portswigger.net/web-security/dom-based/open-redirection',
    displayContextBefore: true,
    displayContextAfter: true,
    sinks: [
        '.location',
        'location.host',
        'location.hostname',
        'location.href',
        'location.pathname',
        'location.search',
        'location.protocol',
        'location.assign(',
        'location.replace(',
        'open(',
        '.srcdoc',
        'jQuery.ajax(',
        '$.ajax(',
    ],
};
