//   ┓ ┓        ┓┓           ┓   
// ┏┓┃┏┫  ┏┏┓┏┓┏┫┣┓┏┓┓┏  ┏┏┓┏┫┏┓•
// ┗┛┗┗┻  ┛┗┻┛┗┗┻┗┛┗┛┛┗  ┗┗┛┗┻┗ •
// I toyed with sandboxing the user's code. It's not worth it. 
// What's even the risk anyway? It's only as dangerous as the devtools console, right?

// const sandbox_iframe = document.createElement('iframe');
// document.body.appendChild(sandbox_iframe);
// sandbox_iframe.sandbox.add('allow-scripts');
// sandbox_iframe.hidden = true;
// if (!sandbox_iframe.contentWindow) throw new Error('no global on the codebox!');
// export const sandboxGlobal = sandbox_iframe.contentWindow;
// // @ts-expect-error adding property to window
// window._finishExecuteUserCode = () => {
//   const doc = sandbox_iframe.contentDocument;
//   if (!doc) throw new Error('no doc on the codebox!');
//   doc.head.innerHTML = '';
//   // @ts-expect-error adding property to window
//   window._resolveExecute();
// };

// function createUserScriptElement(src: string, doc: Document) {
//   const userScript = doc.createElement('script');
//   userScript.type = 'module';
//   src += `parent._finishExecuteUserCode()`;
//   userScript.text = src;
//   doc.head.appendChild(userScript);
// }

// export default async function execute(src: string) {
//   // @ts-expect-error adding property to window
//   const executeResult = new Promise(resolve => window._resolveExecute = resolve);
//   const doc = sandbox_iframe.contentDocument;
//   if (!doc) throw new Error('no doc on the codebox!');
//   createUserScriptElement(src, doc);
//   return executeResult;
// }

import initJasmine from "../test/jasmine_setup";
import { JsApiReporter } from "../types/jasmine_setup";

const enc = new TextEncoder();

export function formatSpecs(report: JsApiReporter) {
  return report.specs().map(spec => 
    `${spec.status == 'passed' ? 
      `You are passing the spec '${spec.description}'` 
      :
      `You are not passing the spec '${spec.description}' because:\n${
        spec.failedExpectations
          .filter(expec => expec.message.length > 5)
          .map(expec => expec.message.replace(/in blob.*(?=\(line)/, ''))
          .join('\n')
      }` 
    }`).join('\n');
}

// Tests the user's code with the given specs
export default async function testCode(src: string, spec: string) {
  // Jasmime must be reinitialized every time you run it.
  const runTests = initJasmine();
  // Cut out the first line, which tries to `import` the example code. We'll use objectURIs instead.
  const spec_trimmed = spec.replace(/[\w\W]+?\n+?/,"");
  
  // turn our source code string into a URI we can import in JS
  const src_bin = enc.encode(src);
  const src_blob = new Blob([src_bin], { type: 'application/javascript' });
  const srcURI =  URL.createObjectURL(src_blob);

  // before we run the specs, we need to replicate the original module import.
  // to do that we apply the user's exports to the local scope.
  const script = `
    const exports = await import("${srcURI}");
    for (const export_ in exports) {
      this[export_] = exports[export_];
    }
    ${spec_trimmed}
  `;

  // run script async
  await Object.getPrototypeOf(async function () {}).constructor(script)();
  URL.revokeObjectURL(srcURI);
  return runTests();
}


