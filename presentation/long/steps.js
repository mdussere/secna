/* The live talk, as slides: each sequence is a list of steps [what appears, seconds, click].
 * A step's animation plays within its seconds; a step marked C ends on a pause: the speaker talks, then
 * clicks to go on. Steps without C chain on by themselves (a build that belongs to the same click).
 * The speaker's text is references/0309_01_speaker_text_fr.md: the clicks here follow its [clic] marks.
 * The narrated video (script.md, tools/voice.py, voice/) is a separate, frozen output: not used here. */
(function () {
'use strict';
const C = 1;
const PARTS = ['The recipe', 'The code', 'Why it matters'];
const SEQS = [
  // ── Part 1 · the recipe
  [1, 'title', 'Title', [['the title', 1.8], ['the speaker', 1.4, C]]],
  [1, 'pile', 'The pile', [['the kicker, text pours in', .6], ['four sources', 2], ['every day, more', 1.2, C], ['nobody reads it all', 1.4, C]]],
  [1, 'wall', 'Reflex 1 · give the model everything', [['three reflexes', .8], ['01 · give the model everything', 1], ['the calculation', 2.6],
    ['the largest context window', 2], ['it does not fit', 2.2, C], ['bigger models: three points', 2.6, C]]],
  [1, 'dead', 'Reflexes 2 and 3, and the recap', [['01 struck · 02 take a sample', 1.8], ['three points · weak signals vanish', 2.2, C],
    ['02 struck · 03 one LLM call per document', 1.8], ['three points', 2.4, C], ['the three, side by side, all struck', 2.4, C]]],
  [1, 'clio', 'Clio', [['Clio', 2.4], ['millions of conversations', .8], ['too many to read', .8], ['private', 1.4, C], ['understand a whole corpus: time to read it before SECNA forms', 5]]],
  [1, 'secna', 'SECNA, letter by letter', [['the word SECNA', 1.6], ['the five letters', 1, C], ['S · Summarise', 3.2, C], ['E · Embed', 3.4, C],
    ['C · Cluster', 2.6, C], ['N · Name', 3, C], ['A · Aggregate, and the recap', 3.2, C], ['a map: themes, clusters, examples', 2.8], ['data science · the LLM', 2, C]]],
  [1, 'bill', 'The bill', [['$48.81', 2.6], ['92 % is S', 1.6, C], ['short texts', 1.4], ['S becomes plain code · the cut', 2.4], ['$3.81', 2, C]]],
  [1, 'curve', 'The curve', [['the axes', 1], ['the LLM reads every document', 2.2], ['the LLM reads the clusters', 2, C], ['the bill follows the clusters', 1.6, C]]],
  [1, 'others', 'Not an isolated case', [['the kicker', .6], ['Urania', .8], ['LangSmith', .8], ['Intercom', .8], ['the same shape', 1.6, C]]],
  [1, 'turn', 'Within reach?', [["within everyone's reach?", 1.2], ['yes · five lines', 2.4, C]]],
  // ── Part 2 · the code (the notebook)
  [2, 'nb0', 'The notebook', [['the notebook, at the top', 1], ['the QR code, top right, for all of Part 2', .8],
    ['the sweep, down and back up: the whole notebook, its line count', 6.4, C]]],
  [2, 'nb1', 'The code, block by block', [['configuration · change REPOS', 2, C], ['the corpus · GitHub’s public API', 2, C],
    ['S · a short text, no LLM', 2, C], ['E · a local model, no bill', 2, C], ['C · one line of k-means', 2, C],
    ['N · one LLM call per cluster', 2, C], ['A · one single call', 2, C]]],
  [2, 'nb2', 'The result, and its bill', [['the themes chart', 1.6, C], ['the bill · gpt-6-luna · ≈ $0.15', 2.2, C]]],
  [2, 'nb12', 'Leaving the notebook', [['the notebook, seen whole', 2, C], ['in practice, what does it let us do?', 2.6, C], ['search vs a map (GraphRAG)', 2.6, C]]],
  // ── Part 3 · why it matters
  [3, 'voices', 'Use 1 · you · the voice of your users', [['the sources', 2.2], ['what they write, and say elsewhere', 2, C], ['nobody reads it all', 1.6, C],
    ['what rises', 1.6], ['counted, trends · Intercom', 1.6, C]]],
  [3, 'assistants', 'Use 2 · your product team · your own AI products', [['the assistant', 1.2], ['thousands of conversations', 2, C], ['the recurring use cases', 2],
    ['industrialise what comes back', 2, C]]],
  [3, 'factory', 'Use 3 · your agents · the agentic software factory', [['the code', 1.2], ['a cycle of agents', 1.2], ['back to the code, again', 1.4],
    ['the pile grows', 2, C], ['the question no search answers', 2.2], ['SECNA: the overview · the notebook’s map', 2, C], ['computed once, kept in memory', 1.8, C],
    ['distillation', 1.6, C]]],
  [3, 'end', 'End', [['prepare the data your agents navigate', 2.6, C], ['the message', 2.4, C], ['thank you · the QR code', 2, C]]],
];
const LEAD = .25, GAP = .12, TAIL = .6;
window.SECNA_SCRIPT = {
  source: 'steps.js',
  parts: PARTS.map((title, k) => ({ n: k + 1, title })),
  seqs: SEQS.map(([part, id, title, steps]) => {
    let t = LEAD;
    const lines = steps.map(([text, d, click], k) => { const l = { text, t: +t.toFixed(3), d, click: !!click }; t += d + (k < steps.length - 1 ? GAP : TAIL); return l; });
    return { id, title, part, notes: [], lines, dur: +t.toFixed(3) };
  }),
};
})();
