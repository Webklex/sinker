import { Sink } from './types';

export const dosSinks: Sink = {
    name: 'Denial Of Service Sink',
    description:
        'Denial of Service attacks can cause significant disruptions to services and systems.',
    link: 'https://portswigger.net/web-security/dom-based/denial-of-service',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: ['RegExp(', 'requestFileSystem'],
};
