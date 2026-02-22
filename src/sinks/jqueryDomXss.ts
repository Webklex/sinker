import { Sink } from './types';

export const jqueryDomXssSinks: Sink = {
    name: 'jQuery DOM-XSS Sink',
    description:
        'Applying user input to DOM without proper sanitization can lead to jQuery DOM-based XSS.',
    link: 'https://portswigger.net/web-security/cross-site-scripting/dom-based',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: [
        'add(',
        'after(',
        'append(',
        'animate(',
        'insertAfter(',
        'insertBefore(',
        'before(',
        'html(',
        'prepend(',
        'replaceAll(',
        'replaceWith(',
        'wrap(',
        'wrapInner(',
        'wrapAll(',
        'has(',
        'constructor(',
        'init(',
        'index(',
        'jQuery.parseHTML(',
        '$.parseHTML(',
        'jQuery.globalEval(',
        '$.globalEval(',
    ],
};
