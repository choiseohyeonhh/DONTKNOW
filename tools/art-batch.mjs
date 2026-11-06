#!/usr/bin/env node
// tools/art-batch.json을 순서대로 생성(순차 실행)하고 중앙 크롭본을 만든다.
// 사용: node tools/art-batch.mjs [--only id1,id2] [--force]
// 출력: assets/generated/raw/<id>.jpg (1024 정사각), assets/generated/crops/<id>.jpg (게임 비율)
import { readFileSync, existsSync, mkdirSync, appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const cfg = JSON.parse(readFileSync('tools/art-batch.json', 'utf8'));
const args = process.argv.slice(2);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const force = args.includes('--force');
mkdirSync('assets/generated/raw', { recursive: true });
mkdirSync('assets/generated/crops', { recursive: true });
const STYLE = '2D cartoon illustration for a mature mystery game, flat colors with soft cel shading, clean dark outlines';
for (const it of cfg.items) {
  if (it.skip || (only && !only.includes(it.id))) continue;
  const kind = cfg.kinds[it.kind];
  const raw = `assets/generated/raw/${it.id}.jpg`;
  const crop = `assets/generated/crops/${it.id}.jpg`;
  if (!force && existsSync(raw)) { console.log(`skip(exists) ${it.id}`); continue; }
  const palette = it.warm ? '' : ' ';
  const prompt = `${it.prompt} ${kind.suffix}`;
  const r = spawnSync('node', ['tools/generate-image.mjs', '--style', STYLE, '--steps', '4', '--file', `${it.id}.jpg`, '--dir', 'assets/generated/raw', '--prompt', prompt], { encoding: 'utf8' });
  if (r.status !== 0) { console.log(`FAIL ${it.id} (${r.status}) ${r.stderr.trim().split('\n').pop()}`); appendFileSync('assets/generated/raw/_fail.log', `${it.id}\t${r.status}\t${r.stderr.trim().split('\n').pop()}\n`); continue; }
  spawnSync('python3', ['tools/crop-image.py', raw, crop, kind.crop, ...(it.kind === 'cctv' ? ['--cctv'] : [])], { encoding: 'utf8' });
  console.log(`ok ${it.id}`);
}
