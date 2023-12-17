import './styles/main.css';
import * as monaco from 'monaco-editor';
import './webWorkerShim';
// import { lint, formatDiagnostic } from './lint/lint';
import * as manifest from '@exercism/javascript/config.json';
import tsetSpec from '@exercism/javascript/exercises/practice/hello-world/hello-world.spec?raw';
import tset from '@exercism/javascript/exercises/practice/hello-world/hello-world?raw';
import instructions from '@exercism/javascript/exercises/practice/hello-world/.docs/instructions.md?raw';
import testCode from './test/test';
import './three/scene'

const devMessage = '// open the console for instructions and feedback! :)\n// this is just a test right now.\n// thanks to excercism for the coding problems!\n\n';
const editor = monaco.editor.create(document.getElementById('editor')!, {
  value: devMessage + tset,
  language: 'javascript',
  automaticLayout: true,
  theme: 'vs-dark',
});

console.log('Other problems: ' + manifest.exercises.practice.map( problem => problem.name ).join(', '));
console.log(instructions);

const onWriteCode = async () => {
  const report = await testCode(editor.getValue(), tsetSpec);
  const failures = report.specs().map(spec => spec.failedExpectations.map (failure => failure.message)).join('\n');
  if (!failures) alert('you passed! 🥳\nunfortunately there\'s nothing much for you to do now.\nmaybe implement a feature yourself and submit a PR?')
  console.log( failures || 'yay, you did it! :)');
};

editor.onDidChangeModelContent(onWriteCode);