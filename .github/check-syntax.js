// Fails if the map page, the Apps Script or the tap page it builds contains a
// JavaScript syntax error, so a typo can't take the map down. Run by
// .github/workflows/pages.yml before the map is published.
const fs = require('fs');
const vm = require('vm');

let failed = false;
function check(label, code) {
  try {
    new vm.Script(code, {filename: label});
    console.log('ok    ' + label);
  } catch (e) {
    failed = true;
    console.error('FAIL  ' + label + ': ' + e.message + '\n' + (e.stack.split('\n')[0] || ''));
  }
}

// Scripts written into a page (not the library files it loads with src=)
function inlineScripts(html) {
  return [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
}

// The public map
inlineScripts(fs.readFileSync('index.html', 'utf8'))
  .forEach((code, i) => check('index.html script ' + (i + 1), code));

// The Apps Script itself
const gas = fs.readFileSync('Map-script', 'utf8');
check('Map-script', gas);

// The tap page's own scripts, built by the Apps Script. Its top level only
// defines constants and functions, so it can run here without Google's services.
if (!failed) {
  const ctx = vm.createContext({});
  vm.runInContext(gas, ctx);
  const tree = {id: '1', species: 'Test tree', location: 'Test street'};
  const pages = {
    'tap page': ctx.buildConfirmHtml({ok: true, mapUrl: 'https://example.org/', heading: 'Watered', tree: tree,
      lines: ['Line'], litres: {token: '2.1.sig', current: null, defaultLitres: 5}, undoToken: '2.1.sig',
      dataUrl: 'https://example.org/data'}),
    'tag not recognised page': ctx.buildConfirmHtml({ok: false, mapUrl: 'https://example.org/',
      heading: 'Tag not recognised', lines: ['Line']})
  };
  for (const name in pages) {
    inlineScripts(pages[name]).forEach((code, i) => check(name + ' script ' + (i + 1), code));
  }
}

if (failed) {
  console.error('\nSyntax error found: fix it before the map is published.');
  process.exit(1);
}
