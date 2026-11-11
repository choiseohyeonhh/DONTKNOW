---
name: generate-image
description: Cloudflare Workers AI(FLUX.1 schnell)로 이미지를 생성해 assets/generated/에 저장한다. "이미지 만들어줘", "에셋 뽑아줘", "프롬프트로 그려줘" 같은 요청에 사용.
---

# generate-image

`tools/generate-image.mjs`로 FLUX.1 schnell을 호출하고 결과를 `assets/generated/`에 저장한다.

## 절차
1. 요청에서 프롬프트를 정한다. 이미지 방향은 `design/02-design/ICONOGRAPHY_AND_IMAGERY.md`를 따른다.
2. FLUX schnell은 **네거티브 프롬프트가 없다**. "no text, no letters" 같은 금지를 긍정문으로 프롬프트 안에 넣는다. 카툰 스타일은 `--style cartoon`.
3. 실행:
   ```bash
   node tools/generate-image.mjs --style cartoon --name home-hall-night --prompt "<영어 프롬프트>"
   ```
   옵션: `--steps 1~8`(기본 4), `--dir`(기본 `assets/generated`), `--dry-run`(API 호출 없이 요청·인증 존재 여부만 확인).
4. 출력된 파일 경로를 사용자에게 알리고 이미지를 확인한다. 마음에 안 들면 프롬프트를 고쳐 다시 생성(파일명에 시각이 붙어 덮어쓰지 않음).

## 실측 메모
- `--steps 4`가 안정적이다. `--steps 8`은 502가 반복돼 쓰지 않는다(5xx는 스크립트가 최대 3회 재시도).
- 동시에 여러 개를 띄우지 말고 순서대로 돌린다(병렬 4건이 전부 502).
- 입력 필터가 무해한 장면도 NSFW로 오탐할 수 있다(종료 코드 5, `8007`). 단어를 바꿔 다시 시도한다(예: 복도 장면에서 "wall switch"류 제거).
- 어두운 장면은 "dark blue"가 과포화로 나온다. "charcoal, slate, dusty teal, almost monochrome"처럼 쓰면 가라앉는다.

## 규칙
- 프록시를 쓰는 환경(Claude Code 클라우드 세션)에서는 앞에 `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`를 붙인다. 토큰이 프록시로 주입되는 환경이면 `CLOUDFLARE_API_TOKEN=proxy-injected`처럼 자리표시값을 쓴다.
- 인증은 `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`. 프로세스 환경변수 → `documents/.env` → `.env` 순으로 읽는다. **값을 출력·로그·커밋하지 않는다.** 없으면 만들어내지 말고 사용자에게 요청한다.
- 프로젝트 원칙: 인물 얼굴 정면 금지, 이미지 속 글자 금지(앱이 얹는다), 약·투약 묘사 금지(`design/00-foundation/PRODUCT_PRINCIPLES.md` 콘텐츠 가이드라인).
- API는 `prompt`와 `steps`만 받는다. seed·크기·네거티브 지정 불가라서 재현은 안 되고 해상도도 API가 정한다. 게임용 1170×2532는 이후 크롭/확장 단계에서 맞춘다.
- 생성 비용: Workers AI 무료 할당량 안에서는 무료, 초과 시 과금. 한 번에 많이 돌리기 전에 사용자에게 알린다.
