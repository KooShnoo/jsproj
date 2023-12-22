// Copyright (C) 2020  Matthew "strager" Glazar
// See end of file for extended copyright information.
// MODIFIED by KooShnoo, Dec 14 2023
// see the original source at https://github.com/quick-lint/quick-lint-js/

import { Position } from 'monaco-editor';
import createProcessFactoryAsync, { DiagnosticSeverity } from './quick-lint-js';

const factory = await createProcessFactoryAsync();
const qljsProcess = await factory.createProcessAsync();

const quickLintDoc = await qljsProcess.createDocumentForWebDemoAsync();
const configDoc = await qljsProcess.createDocumentForWebDemoAsync();
configDoc.setText(`{"global-groups": false}`);
quickLintDoc.setConfig(configDoc);

interface LintDiagnostic {
  code: string;
  message: string;
  severity: number;
  begin: number;
  end: number;
}

export function lint(code: string) {
  quickLintDoc.setText(code);
  const diagnostics: LintDiagnostic[] = quickLintDoc.lint();
  return diagnostics;
}

export function formatDiagnostics(diagnostics: LintDiagnostic[], pos: (ofs: number) => Position, fileName:string) {
  return diagnostics.map(d => 
    `${d.message} in ${fileName}.js:${pos(d.begin).lineNumber}:${pos(d.begin).column}`
  ).join('\n');
}

function _severityString(severity: number) {
  switch (severity) {
  case DiagnosticSeverity.ERROR:
    return "error";
  case DiagnosticSeverity.WARNING:
    return "warning";
  default:
    return `??? (severity ${severity})`;
  }
}

// quick-lint-js finds bugs in JavaScript programs.
// Copyright (C) 2020  Matthew "strager" Glazar
//
// This file is part of quick-lint-js.
//
// quick-lint-js is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// quick-lint-js is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with quick-lint-js.  If not, see <https://www.gnu.org/licenses/>.
