import * as manifest from '@exercism/javascript/config.json';
import { editor } from 'monaco-editor';
import { marked } from 'marked';
import { Problem, ProblemInfo } from '../types/problems';

export const problems: ProblemInfo[] = manifest.exercises.practice.sort((p1, p2)=> p1.difficulty < p2.difficulty ? -1 : p1.difficulty === p2.difficulty? 0 : 1);
// let current_problem = await loadProblem(problems[0].slug);

export async function loadProblem(problem_slug: string, editor: editor.IStandaloneCodeEditor, instructions_element: HTMLElement): Promise<Problem> {
  const code: string = (await import(`../../node_modules/@exercism/javascript/exercises/practice/${problem_slug}/${problem_slug}.js?raw`)).default;
  const spec: string = (await import(`../../node_modules/@exercism/javascript/exercises/practice/${problem_slug}/${problem_slug}.spec.js?raw`)).default;
  const instructions: string = (await import(`../../node_modules/@exercism/javascript/exercises/practice/${problem_slug}/.docs/instructions.md?raw`)).default;
  editor.updateOptions({ readOnly: false });
  editor.setValue(code);
  instructions_element.innerHTML = await marked.parse(instructions);
  return {code, spec, instructions};
}

