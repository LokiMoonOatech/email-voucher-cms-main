import type { AWS } from '@serverless/typescript';

type Functions = AWS['functions'];
type DefinedFunctions = NonNullable<Functions>;
export type FunctionEntry = DefinedFunctions[keyof DefinedFunctions];

type EventEntry = NonNullable<
  FunctionEntry['events']
>[keyof FunctionEntry['events']];

type DocumentedHttpEvent = Extract<EventEntry, { http: any }>['http'] & {
  documentation: any;
};

type DocumentedEventEntry = Extract<EventEntry, { http: any }> & {
  http: DocumentedHttpEvent;
};

export type DocumentedFunctionEntry = Omit<FunctionEntry, 'events'> & {
  events: DocumentedEventEntry[];
};

export interface HttpFunctionReturnType {
  statusCode: number;
  body: string | Record<string, unknown>;
}
