# docs/ — 보관 파일 (설계 기준 아님)

이전 설계(v5.4 bible·세션·시스템·UI 문서)는 폐기했고, 이 폴더에서 삭제했다. 설계의 유일한 기준은 [`design/`](../design/README.md)이다.

남은 세 파일은 **코드·도구의 입력**이라 지우지 않았다. 설계 내용으로 참조하지 않는다.

| 파일 | 남긴 이유 |
|---|---|
| `content/father-phone-data.md` | `prototype/tutorial/make_data.py`가 읽어 `mvp/js/data.js`·`prototype/tutorial/data.js`를 생성한다(v5 코드 실행 기반) |
| `content/art-prompts.md` | `.claude/skills/generate-image`와 `tools/` 이미지 도구가 프롬프트 출처로 지정한다 |
| `overview/content-guidelines.md` | `.claude/skills/generate-image`가 금지 원칙의 출처로 지정한다. 현재 콘텐츠 원칙은 `design/00-foundation/PRODUCT_PRINCIPLES.md` |
