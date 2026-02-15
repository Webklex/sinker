import { Sink } from './types';

export const webSocketSinks: Sink = {
    name: 'WebSocket-URL Poisoning Sinks',
    description:
        'Manipulating the WebSocket URL can lead to cross-domain attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/websocket-url-poisoning',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: ['WebSocket'],
};
