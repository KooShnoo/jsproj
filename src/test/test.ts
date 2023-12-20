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

const enc = new TextEncoder();
import initJasmine from "../test/jasmine_setup";
import { JsApiReporter } from "../types/jasmine_setup";

export function formatSpecs(report: JsApiReporter) {
  const spec_results = document.createElement('div');
  // i miss react...
  report.specs().forEach(spec => {
    const spec_result_element = document.createElement('p');
    spec_result_element.innerText = `${spec.status == 'passed' ? 
      `You are passing the spec '${spec.description}'` 
      :
      `You are not passing the spec '${spec.description}' because:\n${spec.failedExpectations
        .filter(expec => expec.message.length > 5)
        .map(expec => expec.message.replace(/in blob.*(?=\(line)/, ''))
        .join('\n')
      }` }`;
    spec_results.appendChild(spec_result_element);
  });

  return spec_results;
}

/**
 * calls `import` on {@link src}, then puts its exports to the global scope. 
 * @param src 
 */
async function exportToGlobal(src: string) {
  const srcBin = enc.encode(src);
  const srcBlob = new Blob([srcBin], { type: 'application/javascript' });
  const srcDataURI = URL.createObjectURL(srcBlob);
  const exports = await import(/* @vite-ignore */srcDataURI);
  for (const export_ in exports) {
  // @ts-expect-error Adding exported item to the window. It's probably fine.
    window[export_] = exports[export_];
  }
}


export default async function testCode(src: string, spec: string) {
  // Jasmime must be reinitialized every time you run it.
  const runTests = initJasmine();
  // Cut out the first line, which tries to `import` the example code. We'll use global scope instead.
  const spec_trimmed = spec.replace(/[\w\W]+?\n+?/,"");
  await exportToGlobal(src);
  // `eval` is probably a bad idea. Oh well!
  eval(spec_trimmed);
  return runTests();
}


