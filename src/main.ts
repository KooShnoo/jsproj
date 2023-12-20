import './styles/main.css';
import * as monaco from 'monaco-editor';
import './webWorkerShim';
// import { lint, formatDiagnostic } from './lint/lint';
// import * as manifest from '@exercism/javascript/config.json';
import testCode, { formatSpecs } from './test/test';
import { idle, dance, upgrade } from './three/scene';
import { problems, loadProblem } from './problems/problems';

const instructions_element = document.getElementById('instructions')!;
const editor_element = document.getElementById('editor')!;
const errors_element = document.getElementById('errors')!;
const next_problem_element = document.getElementById('next')!;
const title_element = document.getElementById('title')!;
const about_element = document.getElementById('about')!;

const toggleAbout = () => about_element.classList.toggle('hidden');
title_element.onclick = toggleAbout;
about_element.onclick = toggleAbout;

next_problem_element.onclick = nextProblem;

const editor = monaco.editor.create(editor_element, {
  value: 'Loading...',
  language: 'javascript',
  automaticLayout: true,
  theme: 'vs-dark',
});

let current_problem = {problem: await loadProblem(problems[0].slug, editor, instructions_element), index: 0};

async function onWriteCode() {
  const report = await testCode(editor.getValue(), current_problem.problem.spec);
  if (report.runDetails.overallStatus === 'passed') return successful();
  const failures = formatSpecs(report);
  errors_element.innerHTML = '';
  errors_element.appendChild(failures);
  // console.log(report);
}

function successful() {
  editor.updateOptions({ readOnly: true });
  errors_element.style.display = 'none';
  next_problem_element.hidden = false;
  // alert('you passed! 🥳');
  dance();
}

async function nextProblem() {
  const next_index = current_problem.index + 1;
  current_problem = {problem: await loadProblem(problems[next_index].slug, editor, instructions_element), index: next_index};
  editor.updateOptions({ readOnly: false });
  await onWriteCode();
  errors_element.style.display = 'flex';
  next_problem_element.hidden = true;
  idle();
  upgrade();
}

editor.onDidChangeModelContent(onWriteCode);
onWriteCode();
idle();