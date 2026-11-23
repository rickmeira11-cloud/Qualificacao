// Testa as regras de pontuação/classificação do index.html. Rode: node --test tests/classify.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const consts = html.match(/var CUT_A = \d+, CUT_B = \d+;/)[0];
const weights = html.match(/var critWeights = \{[^}]*\};/)[0];
const fn = html.slice(html.indexOf('function classify('), html.indexOf('function computeAndRender'));
const { classify, critWeights, CUT_A, CUT_B } = new Function(
  `${consts}\n${weights}\n${fn}\nreturn { classify, critWeights, CUT_A, CUT_B };`
)();

test('pontuação máxima é 40', () => {
  const max = Object.values(critWeights).reduce((s, w) => s + 2 * w, 0);
  assert.equal(max, 40);
});

test('faixas A/B/C nos limites', () => {
  assert.equal(classify(CUT_A, false, false, 0).cls, 'A');
  assert.equal(classify(CUT_A - 1, false, false, 0).cls, 'B');
  assert.equal(classify(CUT_B, false, false, 0).cls, 'B');
  assert.equal(classify(CUT_B - 1, false, false, 0).cls, 'C');
  assert.equal(classify(0, false, false, 0).cls, 'C');
  assert.equal(classify(40, false, false, 0).cls, 'A');
});

test('flags desqualificam mesmo com nota máxima', () => {
  assert.equal(classify(40, true, false, 0).cls, 'C');
  assert.equal(classify(40, false, true, 0).cls, 'C');
  assert.match(classify(40, true, false, 0).action, /financeira/);
  assert.match(classify(40, false, true, 0).action, /técnica/);
});

test('critério não avaliado vira Incompleta, mas flag ainda desqualifica', () => {
  assert.equal(classify(40, false, false, 1).cls, 'I');
  assert.equal(classify(40, true, false, 1).cls, 'C');
});
