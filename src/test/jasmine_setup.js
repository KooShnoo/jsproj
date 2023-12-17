import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine';
// import { sandboxGlobal } from '../executer/executer';

export default function initJasmine() {
  const jasmine = jasmineRequire.core(jasmineRequire);
  // jasmine.getGlobal = () => sandboxGlobal;
  jasmine.getGlobal = () => window;
  const env = jasmine.getEnv();
  const rep = new jasmine.JsApiReporter({ timer: new jasmine.Timer() });
  env.addReporter(rep);
  const jasmineInterface = jasmineRequire.interface(jasmine, env);

  // add jasmine testing functions to global scope
  for (const property in jasmineInterface) {
    window[property] = jasmineInterface[property];
  }
  window.test = window.it;

  return async () => {
    await env.execute();
    return rep;
  };
}
