import './styles/main.css';
import * as monaco from 'monaco-editor';
import './webWorkerShim';
import { lint, formatDiagnostic } from './lint/lint';

const editor = monaco.editor.create(document.getElementById('container')!, {
  value: "function hello() {\n\talert('Hello world!');\n}",
  language: 'javascript',
  automaticLayout: true,
  theme: 'vs-dark',
});

const logLint = () => {
  const diagnostics = lint(editor.getValue());
  console.log(diagnostics, '\n', diagnostics.map(formatDiagnostic).join('\n'));
};

editor.onDidChangeModelContent(logLint);