import { Sink } from '../sinks';

export interface SinkMatch {
    sink: string;
    metadata: Sink;
}

export interface CompiledSink extends SinkMatch {
    regex: RegExp;
}

export interface ViolationContextLine {
    line: number;
    text: string;
}

export interface HtmlScriptBlock {
    code: string;
    startLine: number;
}

export interface ViolationContext {
    before: Array<ViolationContextLine> | null;
    offendingLine: string;
    after: Array<ViolationContextLine> | null;
}

export interface Violation {
    file: string;
    line: number;
    sink: SinkMatch;
    context: ViolationContext;
}

export interface ScanResult {
    violations: Violation[];
    count: number;
}
