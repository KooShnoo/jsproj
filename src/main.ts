import './styles/main.css';
import * as monaco from 'monaco-editor';
import './webWorkerShim';
// import { lint, formatDiagnostic } from './lint/lint';
import * as manifest from '@exercism/javascript/config.json';
import tsetSpec from '@exercism/javascript/exercises/practice/hello-world/hello-world.spec?raw';
import tset from '@exercism/javascript/exercises/practice/hello-world/hello-world?raw';
import instructions from '@exercism/javascript/exercises/practice/hello-world/.docs/instructions.md?raw';
import testCode from './test/test';

const editor = monaco.editor.create(document.getElementById('container')!, {
  value: tset,
  language: 'javascript',
  automaticLayout: true,
  theme: 'vs-dark',
});

console.log(instructions);
console.log(manifest.exercises.practice.map( problem => problem.slug ));

const onWriteCode = async () => {
  const report = await testCode(editor.getValue(), tsetSpec);
  console.log(report.specs().map(spec => spec.failedExpectations.map (failure => failure.message)).join('\n'));
};

editor.onDidChangeModelContent(onWriteCode);