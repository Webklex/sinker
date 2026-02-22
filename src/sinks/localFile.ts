import { Sink } from './types';

export const localFileSinks: Sink = {
    name: 'Local File-Path Manipulation Sink',
    description:
        'Manipulating local file paths can lead to cross-site scripting (XSS) attacks and other vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/local-file-path-manipulation',
    displayContextBefore: true,
    displayContextAfter: true,
    sinks: [
        'FileReader.readAsArrayBuffer(',
        'FileReader.readAsBinaryString(',
        'FileReader.readAsDataURL(',
        'FileReader.readAsText(',
        'FileReader.readAsFile(',
        'FileReader.root.getFile(',
    ],
};
