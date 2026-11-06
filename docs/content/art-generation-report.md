# 이미지 생성 결과 (FLUX.1 schnell, 카툰)

> 도구: `tools/generate-image.mjs`(생성), `tools/crop-image.py`(중앙 크롭, CCTV 후처리), `tools/art-batch.mjs` + `tools/art-batch.json`(일괄 실행·프롬프트). 사용법은 `.claude/skills/generate-image/SKILL.md`.
> 규격: 생성은 **1024×1024 정사각형**(API 고정) → 핵심 요소를 중앙 띠에 두고 비율별로 중앙 크롭. 장면 9:16(576×1024), 사진 3:4(768×1024), CCTV 16:9(1024×576), 아이템 1:1.
> 파일: 원본 `assets/generated/raw/<id>.jpg`, 크롭 `assets/generated/crops/<id>.jpg`. ID는 `docs/content/art-assets.md` 기준(`scene_`, `photo_`, `item_`, `cctv_`, `wall_`, `ref_`, `ui_`).
> 최종 해상도(1170×2532 등)는 별도 업스케일 단계가 필요하다(현재 크롭본은 576×1024).

## 1. 결과 요약

| 구분 | 생성 | 합격 | 비고 |
|---|---|---|---|
| 장면 | 22 + 앵커 1 | 23 | 재생성 7건 |
| 사진·배경화면 | 11 | 11 | 재생성 6건 |
| 아이템 | 5 | 5 | 재생성 1건 |
| CCTV 키프레임 | 7 | 7 | 전면 재생성 2회, 일부 3회 |
| 레퍼런스·UI | 4 | 4 | 부모 시트 재생성 |
| **합계** | **약 50장** | **전부 합격** | 생성 실패(NSFW 오탐) 4종은 표현 변경 후 성공 |

## 2. 검수에서 바꾼 것

| 에셋 | 문제 | 조치 |
|---|---|---|
| school_gate | 간판에 "High School" 영문 | 간판·학교 단어 제거, 빈 패널 |
| police_front_morning, interrogation_glass | "POLICE", "FIST" 글자 | "government building / office"로 표현 변경 |
| entrance_yujin | 얼굴 정면 노출(원칙 위반), "목에서 잘라" 지시 무시 | **역광 실루엣**으로 변경 |
| living_dawn | 파랑 과포화 | charcoal/slate 톤 지시 |
| interrogation_glass_bplus | 자세 불일치 | "chin lifted, hands on table" |
| balance_notice ×3, debt_form, postit | 영문풍 가짜 글자 | "statement/form" 단어 대신 "grid of empty cells and wavy lines" |
| father_son_2022, ref_parents | 아버지 외형 불일치(머리색·안경) | 두 컷과 family_2019 모두 **둥근 안경 + 관자놀이 흰머리** |
| CCTV 7컷 | 컬러, 클로즈업, 간판 글자, 소년 자리에 여성 | **후처리**(흑백, 픽셀 블록 1/6, 노이즈, 주사선) + "멀리서 내려다보는 광각, 작은 인물" 구도 |

## 3. 남은 한계 (알고 쓸 것)

- **일관성**: FLUX schnell은 레퍼런스 이미지를 못 받는다. 같은 인물이 여러 컷에 나오는 사진 계열(도현·아버지)은 외형이 흔들린다. 지금은 설명 문장을 통일해 맞췄다.
- **글자 흔적**: father_son_2022 배경 간판에 한자풍 무늬, debt_form·balance_notice_1에 아주 작은 가짜 글자가 남아 있다. 화면 비율에서는 눈에 띄지 않으나, 사진 앱에서 확대되는 컷이면 앱에서 흐림 처리하거나 재생성한다.
- **entrance_in_c**: 문이 열린 구도(밖의 도시 불빛이 보임). "문틈 아래 주황빛" 연출과는 다르다. 필요하면 재생성.
- **CCTV 15초 구간**: 정지 키프레임 7장뿐이다. 영상(스크러버용 프레임 시퀀스)은 별도 작업이다. k2는 접근 직전(두 사람이 거리를 둠), k3은 어깨에 손이 닿기 직전 구도다.
- **영상형(인터폰 민재)**: 생성하지 않았다(영상 도구 없음).
- **UI 아이콘·지도·타이틀 로고타입**: 코드로 제작(생성 안 함). `ui_title_bg`, `ui_app_icon`만 생성.
- **9:16 크롭**: 정사각형의 가운데 56%만 쓰므로 좌우 가장자리는 버려진다. 프롬프트가 중앙 띠 배치를 지시하지만 모델이 안 지키면 구도가 어색해진다(대부분 통과).
