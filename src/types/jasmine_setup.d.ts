/* eslint-disable @typescript-eslint/no-explicit-any */ 
type StatusType = 'loaded' | 'started' | 'done';

interface SuiteResult {
  id: string;
  description: string;
  fullName: string;
  parentSuiteId: string | null;
  filename: string;
  failedExpectations: Expectation[];
  deprecationWarnings: Expectation[];
  status: string;
  duration: number;
  properties: Record<string, any>;
}

interface Expectation {
  matcherName: string;
  message: string;
  stack: string;
  passed: boolean;
  expected: Record<string, any>;
  actual: Record<string, any>;
  globalErrorType?: 'afterAll' | 'load' | 'lateExpectation' | 'lateError' | undefined;
}

interface SpecResult {
  id: string;
  description: string;
  fullName: string;
  parentSuiteId: string | null;
  filename: string;
  failedExpectations: Expectation[];
  passedExpectations: Expectation[];
  deprecationWarnings: Expectation[];
  pendingReason: string;
  status: string;
  duration: number;
  properties: Record<string, any>;
  debugLogs: DebugLogEntry[] | null;
}

interface DebugLogEntry {
  message: string;
  timestamp: number;
}

interface JsApiReporterOptions {
  timer?: Timer;
}

declare class JsApiReporter {
  started: boolean;
  finished: boolean;
  runDetails: Record<string, any>;

  jasmineStarted: () => void;
  jasmineDone: (runDetails: Record<string, any>) => void;
  status: () => StatusType;
  suiteStarted: (result: SuiteResult) => void;
  suiteDone: (result: SuiteResult) => void;
  suiteResults: (index: number, length: number) => SuiteResult[];
  suites: () => Record<string, SuiteResult>;
  specDone: (result: SpecResult) => void;
  specResults: (index: number, length: number) => SpecResult[];
  specs: () => SpecResult[];
  executionTime: () => number;
}

interface Timer {
  start(): void;
  elapsed(): number;
}

type soa =  number;

export default function initJasmine(): () => Promise<JsApiReporter>;