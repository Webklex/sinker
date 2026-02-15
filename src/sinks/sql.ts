import { Sink } from './types';

export const sqlSinks: Sink = {
    name: 'Client-Side SQL-Injection Sink',
    description:
        'Manipulating SQL queries can lead to SQL injection vulnerabilities.',
    link: 'https://portswigger.net/web-security/dom-based/client-side-sql-injection',
    displayContextBefore: true,
    displayContextAfter: false,
    sinks: ['executeSql'],
};
