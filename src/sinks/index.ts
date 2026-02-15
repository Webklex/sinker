import { Sink } from './types';
import { commonSinks } from './common';
import { domXssSinks } from './domXss';
import { jqueryDomXssSinks } from './jqueryDomXss';
import { openRedirectSinks } from './openRedirect';
import { cookieSinks } from './cookie';
import { jsInjectionSinks } from './jsInjection';
import { domainSinks } from './domain';
import { webSocketSinks } from './webSocket';
import { linkSinks } from './link';
import { ajaxSinks } from './ajax';
import { localFileSinks } from './localFile';
import { sqlSinks } from './sql';
import { html5Sinks } from './html5';
import { xpathSinks } from './xpath';
import { jsonSinks } from './json';
import { domSinks } from './dom';
import { dosSinks } from './dos';

export const allSinkGroups: Sink[] = [
    commonSinks,
    domXssSinks,
    jqueryDomXssSinks,
    openRedirectSinks,
    cookieSinks,
    jsInjectionSinks,
    domainSinks,
    webSocketSinks,
    linkSinks,
    ajaxSinks,
    localFileSinks,
    sqlSinks,
    html5Sinks,
    xpathSinks,
    jsonSinks,
    domSinks,
    dosSinks,
];

export * from './types';
