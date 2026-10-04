import { spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRAITS } from '../src/dice/engine.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const compiler = process.env.TWEEGO_BINARY || resolve(root, '.tools/tweego/tweego.exe');
if (!existsSync(compiler)) throw new Error('Tweego is missing. Follow README.md to install the pinned local compiler.');
const out = resolve(root, 'dist');
mkdirSync(resolve(out, 'assets'), { recursive: true });
mkdirSync(resolve(out, 'dice'), { recursive: true });
for (const file of ['index.html', 'engine.mjs', 'combinations.mjs', 'deep-forms.mjs', 'playful-forms.mjs', 'guests.mjs', 'guest-views.mjs', 'form-views.mjs', 'board-view.mjs', 'art.mjs', 'app.mjs', 'table.css']) {
  copyFileSync(resolve(root, 'src/dice', file), resolve(out, 'dice', file));
}
copyFileSync(resolve(root, 'assets/dice/house-map-v3.png'), resolve(out, 'dice/house-map-v3.png'));
mkdirSync(resolve(out, 'dice/forms'), { recursive: true });
for (const trait of TRAITS) {
  copyFileSync(resolve(root, 'assets/dice/forms', trait.id + '.png'), resolve(out, 'dice/forms', trait.id + '.png'));
}
for (const [source, destination] of [
  ['assets/concepts/second-nature-cast-cel-v3.png', 'cast.png'],
  ['assets/characters/mara-honey-slime-v2.png', 'mara.png'],
  ['assets/scenes/honey-onset.png', 'honey-onset.png'],
  ['assets/scenes/honey-spreading.png', 'honey-spreading.png'],
  ['assets/scenes/honey-settled.png', 'honey-settled.png'],
  ['assets/scenes/apartment-arrival.png', 'apartment-arrival.png'],
  ['assets/scenes/theo-radio-v2.png', 'theo-radio.png'],
  ...['nadia-walk', 'inez-bea'].map(name => ['assets/scenes/' + name + '.png', name + '.png']),
  ...['robot-study', 'cup-nadia', 'espresso-night', 'moth-study', 'shadow-study', 'shadow-nadia'].map(name => ['assets/scenes/' + name + '.png', name + '.png']),
  ...['cafe-welcome', 'counter-training', 'golden-hour-cup', 'nadia-honey', 'nadia-human', 'apartment-honey-evening', 'morning-human', 'robot-sequence', 'cup-sequence', 'espresso-sequence', 'moth-sequence', 'shadow-sequence', 'robot-service', 'cup-service', 'cup-service-theo', 'espresso-service'].map(name => ['assets/scenes/' + name + '.png', name + '.png'])
]) {
  if (!existsSync(resolve(root, source))) throw new Error(`Missing art: ${source}`);
  copyFileSync(resolve(root, source), resolve(out, 'assets', destination));
}
const result = spawnSync(compiler, ['-f', 'sugarcube-2', '--head', 'src/head.html', '-o', 'dist/index.html', 'src/story', 'src/styles.css', 'src/systems.js', 'src/interface.js'], {
  cwd: root, encoding: 'utf8', env: { ...process.env, TWEEGO_PATH: resolve(root, '.tools/formats') }
});
if (result.error) throw result.error;
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status) process.exit(result.status);
const html = readFileSync(resolve(out, 'index.html'), 'utf8');
if (!html.includes('format-version="2.37.3"')) throw new Error('Build did not use pinned SugarCube 2.37.3.');
copyFileSync(resolve(root, '.tools/formats/sugarcube-2/LICENSE'), resolve(out, 'SUGARCUBE-LICENSE.txt'));
writeFileSync(resolve(out, '.nojekyll'), '');
console.log('Built dist/index.html with SugarCube 2.37.3.');
