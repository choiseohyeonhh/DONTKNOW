#!/usr/bin/env node
// Cloudflare Workers AI (FLUX.1 schnell) 이미지 생성 CLI. 의존성 없음(Node 18+).
// 사용: node tools/generate-image.mjs --prompt "..." [--name hall | --file fixed.jpg] [--steps 4] [--dir assets/generated] [--style cartoon] [--dry-run]
// FLUX.1 schnell은 prompt, steps(1~8)만 받는다(seed·size·negative_prompt 불가).
// 프록시 환경(클라우드 세션)에서는 NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=<CA번들> 필요.
// 인증: CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN (프로세스 환경변수 우선, 없으면 documents/.env, .env 순). 값은 출력하지 않는다.
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const MODEL = '@cf/black-forest-labs/flux-1-schnell';
const KEYS = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'];
// 카툰 방향(docs/content/art-prompts.md [STYLE])의 짧은 버전. FLUX schnell은 네거티브 프롬프트가 없으므로 금지 항목은 긍정문으로 쓴다.
const STYLES = {
  cartoon:
    '2D cartoon illustration for a mature mystery game, flat colors with soft cel shading, clean dark outlines, muted desaturated palette, cinematic composition, graphic-novel look, no text, no letters',
};

function loadEnvFile(path, wanted) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || !wanted.includes(m[1])) continue; // 필요한 키만 읽는다(다른 값은 메모리에도 안 올림)
    out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return out;
}

function getCredentials(root) {
  const found = {};
  for (const k of KEYS) if (process.env[k]) found[k] = process.env[k];
  for (const f of ['documents/.env', '.env']) {
    const vals = loadEnvFile(join(root, f), KEYS);
    for (const k of KEYS) if (!found[k] && vals[k]) found[k] = vals[k];
  }
  return found;
}

function parseArgs(argv) {
  const a = { steps: 4, dir: 'assets/generated' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--dry-run') a.dryRun = true;
    else if (k.startsWith('--')) a[k.slice(2)] = argv[++i];
  }
  return a;
}

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image';

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.prompt) {
    console.error('--prompt 가 필요합니다.');
    process.exit(2);
  }
  const root = resolve(process.cwd());
  const steps = Math.min(8, Math.max(1, Number(args.steps) || 4));
  const prompt = args.style ? `${STYLES[args.style] ?? args.style}. ${args.prompt}` : args.prompt;
  const body = { prompt, steps };

  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
  const file = args.file ? args.file : `${slug(args.name || args.prompt)}-${stamp}.jpg`; // --file: 고정 파일명(덮어씀)
  const outDir = resolve(root, args.dir);

  const creds = getCredentials(root);
  const missing = KEYS.filter((k) => !creds[k]);
  if (args.dryRun) {
    console.log(JSON.stringify({ model: MODEL, body, output: join(args.dir, file), credentials: Object.fromEntries(KEYS.map((k) => [k, creds[k] ? 'present' : 'missing'])) }, null, 2));
    return;
  }
  if (missing.length) {
    console.error(`환경변수 누락: ${missing.join(', ')} (documents/.env 또는 프로세스 환경변수에 설정하세요)`);
    process.exit(3);
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(creds.CLOUDFLARE_ACCOUNT_ID)}/ai/run/${MODEL}`;
  let res;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${creds.CLOUDFLARE_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error(`네트워크 오류: ${e.cause?.code || e.message} (api.cloudflare.com 접근 허용 여부 확인)`);
      process.exit(4);
    }
    if (res.status < 500) break; // 5xx만 재시도(일시 오류)
    await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
  }
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok || !json?.success) {
    const msg = json?.errors?.map((e) => `${e.code}: ${e.message}`).join('; ') || `HTTP ${res.status}`;
    console.error(`생성 실패: ${msg}`);
    process.exit(5);
  }
  const b64 = json.result?.image;
  if (!b64) {
    console.error('응답에 image 필드가 없습니다.');
    process.exit(6);
  }
  mkdirSync(outDir, { recursive: true });
  const path = join(outDir, file);
  writeFileSync(path, Buffer.from(b64, 'base64'));
  console.log(path);
}

main();
