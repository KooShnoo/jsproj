import './styles/main.css';
import * as monaco from 'monaco-editor';
import './webWorkerShim';
import { lint, formatDiagnostics } from './lint/lint';
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
  // run lints
  const lints = lint(editor.getValue());
  if (lints.length > 0) {
    const pos = editor.getModel()!.getPositionAt.bind(editor.getModel());
    errors_element.innerText = formatDiagnostics(lints, pos, problems[current_problem.index].slug);
    return;
  }
  // if the lints pass, run specs
  const report = await testCode(editor.getValue(), current_problem.problem.spec);
  // if the specs pass, unlock next stage
  if (report.runDetails.overallStatus === 'passed') return onPass();
  errors_element.innerText = formatSpecs(report);
}

function onPass() {
  editor.updateOptions({ readOnly: true });
  // Hide errors
  errors_element.parentElement!.style.display = 'none';
  // Unlock next level
  next_problem_element.hidden = false;
  dance();
}

async function nextProblem() {
  const next_index = current_problem.index + 1;
  current_problem = {problem: await loadProblem(problems[next_index].slug, editor, instructions_element), index: next_index};
  editor.updateOptions({ readOnly: false });
  await onWriteCode();
  errors_element.parentElement!.style.display = 'flex';
  next_problem_element.hidden = true;
  idle();
  upgrade();
}

editor.onDidChangeModelContent(onWriteCode);
onWriteCode();
idle();