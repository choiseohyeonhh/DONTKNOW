# 이미지 생성 프롬프트

> 근거: `content/art-assets.md`(에셋 ID·우선순위), `content/locations.md`, `ui/visual-style.md`, bible 12.1~12.3.
> **방향 전환**: 실사 대신 **카툰(2D 일러스트)**. bible 12.3의 연출 원칙(1인칭 정지, 인물 얼굴 정면 금지, 따뜻한 색은 가족 사진에만)은 그대로 유지한다.
> 프롬프트는 영어로 쓴다(모델 응답이 안정적). 화면에 들어갈 한글·숫자는 **이미지에 넣지 않고 앱에서 얹는다**(AI 한글 렌더링 오류 방지).

## 0. 사용법

### 0.1 조립 규칙
최종 프롬프트 = `[STYLE]` + 에셋별 `Prompt` + `[NEG]`.

**[STYLE]** (모든 이미지 공통, 앞에 붙인다)
```
2D cartoon illustration for a mature mystery game, flat color fills with soft cel shading, clean medium-weight dark outlines, subtle paper-grain texture, muted desaturated palette, cinematic composition, quiet melancholic Korean urban realism, graphic-novel look (not childish, not chibi, not cute anime). First-person point of view unless stated.
```

**[NEG]** (모든 이미지 공통, 뒤에 붙인다. 네거티브 필드가 없으면 문장 끝에 그대로 붙인다)
```
No legible text, no letters, no numbers, no signage text, no logos, no watermark, no photorealism, no 3D render, no frontal face close-up (faces turned away, cropped, in shadow or simplified when visible at all), no pills or drug paraphernalia, no blood, no gore.
```

### 0.2 팔레트 (visual-style.md 3장과 동일)
| 이름 | 값 | 쓰임 |
|---|---|---|
| 형광 백색 | #E8EEF0 | 경찰서, 편의점, 약국, 교무실 |
| 나트륨등 주황 | #E39A3B | 밤 거리, 주차장 일부 |
| 새벽 청회색 | #4A5866 | 집 새벽, 엔딩 A |
| 따뜻한 색 | 가족 사진 내부만 | 2019 사진, 2022 사진 |

프롬프트의 색 지시는 위 값을 기준으로 한다. **가족 사진 두 장을 제외하면 따뜻한 색(노랑·분홍·살구)을 쓰지 않는다.**

### 0.3 규격·권장 모델
- 장면: **9:16**으로 생성 → 1170×2532(약 9:19.5)로 위·아래를 확장(`outpaint_image`) 또는 잘라낸다. 중요한 요소는 화면 중앙 70%에 둔다(상태바·하단 선택지 영역).
- 아이템·사진: 1:1 또는 3:4. CCTV·영상 키프레임: 16:9.
- 모델: 기본 `gpt_image_2_6`(레퍼런스 일관성·세부 지시), 싼 시안은 `nano_banana`. 카툰 일러스트 느낌이 약하면 `recraft_v4_1`(standard)로 바꿔 비교한다.
- **일관성**: 먼저 R-01(스타일 앵커)을 뽑아 확정하고, 이후 모든 장면에 레퍼런스로 붙인다. 같은 인물(도현·아버지·어머니)은 R-02, R-03을 레퍼런스로 쓴다.
- 비용 감각: 1장 약 0.25 크레딧(`gpt_image_2_6`, 9:16, 확인값). 아래 프롬프트는 약 55장이고 재시도를 3배로 잡으면 40크레딧 안팎이라 **무료 플랜 10크레딧으로는 P0만 가능**하다.

### 0.4 연출 규칙 요약 (프롬프트마다 반영됨)
- 인물은 **손, 어깨, 뒷모습, 아래 반쪽**으로만. 도현은 사진(ART.photo.*) 속에서만 얼굴이 보인다.
- 약·처방 관련 물건은 **라벨 없는 상자, 찢긴 영수증**까지. 알약, 투약 장면 금지(`overview/content-guidelines.md`).
- 간판·서류·화면의 글자는 **빈 패널 또는 의미 없는 선(낙서 줄)**으로 처리한다. 글자는 앱이 레이어로 얹는다.
- 3/18 날씨: 흐림, 오후부터 비. 약국·주차장은 젖은 바닥.

---

## 1. 레퍼런스 (R-xx) — 먼저 뽑는다

| ID | 용도 | 비율 | 우선 |
|---|---|---|---|
| R-01 | **스타일 앵커**. 확정되면 이후 전 장면에 레퍼런스로 첨부 | 9:16 | P0 |
| R-02 | 도현 외형 기준(사진용, 중3·고3 2종) | 3:4 | P1 |
| R-03 | 아버지·어머니 외형 기준(사진용) | 3:4 | P1 |

**R-01 스타일 앵커 = `ART.scene.home_hall_night`와 동일.** 아래 2.1의 프롬프트로 뽑아 마음에 드는 한 장을 앵커로 고정한다.

**R-02 도현 외형 (두 장)**
```
Character reference sheet, plain light-grey background, a slim 15-year-old Korean boy (version A) and the same boy at 18 (version B), short neat black hair, calm quiet expression, narrow shoulders, plain grey hoodie (A) / plain navy school-style jacket (B), standing straight, three-quarter view, full body, consistent proportions, simple eyes, no smile.
```

**R-03 아버지·어머니 외형**
```
Character reference sheet, plain light-grey background, a Korean father in his early 50s (short hair going grey at the temples, broad tired shoulders, plain dark work jacket) and a Korean mother in her late 40s (shoulder-length black hair, soft gentle smile, light cardigan), three-quarter view, full body, simple faces, consistent proportions.
```

---

## 2. 장면 (ART.scene.*)

### 2.1 집·도현의 방

**ART.scene.home_hall_night** — S1·S2 · 9:16 · P0 · *(= R-01)*
```
First-person view standing in a dark apartment hallway at 2:47 a.m. Straight ahead, a closed bedroom door with no light under it (a dark gap, completely black). Faint blue-grey light enters from the far end of the hall where a living-room window is. Foreground details: a shoe cabinet corner, one pair of slippers, a wall light switch, a small family-photo frame on the wall shown only as a pale rectangle. Palette: dawn blue-grey #4A5866, deep shadows, almost no color. Very still, slightly oppressive, nobody visible.
```
- 모션 없음(정지가 연출).

**ART.scene.entrance_in** — S4·S8·S10 · 9:16 · P1  *(조명 3종을 같은 구도로 생성)*
```
Base: First-person view inside a Korean apartment entrance: shoe rack with a few worn men's shoes and a pair of clean sneakers, the front door with a security chain and a wall-mounted video intercom beside it, a small shelf with a key tray, frosted glass in the inner door. Plain cluttered-but-ordinary home. 
Variant A (S4, 10:30): overcast daylight through the hallway window, flat neutral light.
Variant B (S8, 16:10): darker overcast afternoon, the intercom screen glowing pale, tense stillness.
Variant C (S10, 19:10): night, sodium orange #E39A3B light leaking in through the gap under the door, the rest in blue-grey shadow, a plain brown envelope lying on the floor just inside the door.
```
- 같은 구도 유지를 위해 A를 먼저 뽑고 B·C는 A를 레퍼런스로 `조명만 변경` 지시.

**ART.scene.living_table** — S10~S12 · 9:16 · P1
```
First-person view of a living-room table at night. On the table: a plain brown paper envelope torn open, a small square sticky note with scribbled lines instead of words, a phone charger cable plugged in leading to an old dark smartphone, a large-button flip-cover phone-case for a father's phone, a half-drunk glass of water. A single cool white desk lamp, a window behind showing night city lights as orange dots. No warm colors except the faint orange of the window dots. Quiet, lived-in, lonely.
```

**ART.scene.living_dawn** — S14 A · 9:16 · P1
```
First-person view of a living room at 5:40 a.m. Blue-grey dawn light #4A5866 through a large window, the sky just beginning to pale. At the far end of the hall, a bedroom door stands open and the room inside is dark. On the sofa a folded blanket, on the table a phone lying face-up. The apartment feels held-breath still. No people.
```
- 모션: 창밖 빛이 청회색에서 연한 흰빛으로 서서히 변한다(CSS 오버레이).

**ART.scene.morning_empty** — S14 C · 9:16 · P1
```
First-person view of a kitchen dining table the next morning. Flat grey daylight. Two chairs, one pushed in, one pulled out slightly. A single untouched bowl and spoon, a phone lying face-down. Cold, empty, a little too tidy. No people, no warm tones.
```

**ART.scene.dohyun_room_newphone** — S14 D · 9:16 · P1
```
First-person view of a teenage boy's bedroom in the dark. A neatly made bed, a school backpack hung on the chair, a desk. The only light is a pale blue glow from a brand-new smartphone lying on the desk, its screen showing a blank notification bubble shape with no words. Everything else in deep blue-black shadow. Unsettling calm.
```

### 2.2 학교 (S3)

**ART.cine.hall_morning** — CN-01 · 9:16 · P1 · *(home_hall_night와 같은 구도)*
```
Same composition as the night hallway: first-person view in an apartment hallway, a closed bedroom door straight ahead with the gap under it still dark. It is 8:40 a.m.: flat, cloudy morning light from the living-room window at the far end, pale grey-blue, no sun patches. Slippers in the same place, shoe-cabinet corner, light switch, pale photo frame. Nothing moved since the night. Quiet, tired, nobody visible.
```

**ART.scene.school_gate** — 9:16 · P1
```
First-person view standing before a Korean high-school main gate on an overcast morning around 8:40. Iron sliding gate partly open, a concrete gatepost with a blank nameplate (no text), tall zelkova trees casting soft shadows on the ground, an empty schoolyard beyond, a distant single faceless silhouette near the building entrance. Palette: fluorescent-white overcast #E8EEF0 with muted greens. Slightly nostalgic, slightly cold.
```
- 모션: 나무 그림자 흔들림.

**ART.scene.staffroom** — 9:16 · P1
```
First-person view seated at a school staff-room desk. Across the desk, a woman teacher in her 40s shown only from the shoulders down (beige cardigan sleeve, hands) holding a printed attendance sheet filled with rows of meaningless scribble lines instead of text. On the desk: a mug, a stack of folders, a desk plant. Cool fluorescent white #E8EEF0 light from above, other teachers' desks blurred in the background.
```
- 모션: 형광등 미세 깜빡임.

**ART.scene.counsel_room** — 9:16 · P1
```
First-person view in a small school counselling room by the window. A counsellor shown only as a hand holding a plain ceramic mug and a sleeve of a grey sweater, seated across a small round table with a tissue box and a stack of leaflets with blank covers. Sheer curtain gently moving, soft diffuse overcast light, pale blue-grey. Quiet, careful atmosphere.
```
- 모션: 커튼.

### 2.3 인물 대면 컷

**ART.scene.entrance_yujin** — S4 · 9:16 · P1
```
First-person view looking through a half-open apartment front door at a young woman standing in the corridor, cropped below the chin so her face is not visible: cream knit sweater, dark slim trousers, neat posture, hands politely clasped holding a small paper bag. Corridor behind her with a fluorescent light and neighbours' doors. Slightly too polished, quietly unsettling. Palette neutral-cool.
```

**ART.scene.police_office** — S5 · 9:16 · P1
```
First-person view seated at a detective's desk in a police station missing-persons team office. Across the desk, only the hands and forearms of a tired man in his mid-40s (white shirt, sleeves rolled up) holding a thin file folder; paper cups, a monitor facing away, a water dispenser in the blurred background. Fluorescent white #E8EEF0, one tube flickering (rendered slightly dimmer than the others). Bureaucratic fatigue.
```
- 모션: 형광등 1개 깜빡임.

**ART.scene.parking_b3** — S13 · 9:16 · P1
```
Underground public parking garage, level B3, at 11 p.m. Concrete pillars painted with blank number panels (no numbers), a long wet concrete floor reflecting light, one fluorescent tube overhead flickering (dim and bright states), a dark sedan parked, and a man in his mid-30s seen only from behind standing beside it: neat charcoal long coat, hands in pockets, calm upright posture. Ventilation duct in the ceiling, water drips. Palette: fluorescent white mixed with sodium orange #E39A3B accents, deep shadows.
```
- 모션: 형광등 고정 패턴(밝음→어두움→밝음, 불규칙 금지).

**ART.scene.interrogation_glass** — S14 B · 9:16 · P1  *(2종)*
```
View from a police-station corridor through a large one-way window into a dim interview room. Inside, a seated young man shown only as a dark silhouette, head bowed, shoulders slumped, facing away; a table and two chairs. Cold fluorescent light on our side, darker inside, reflections on the glass. No face visible.
```
- **Variant B+**: 같은 구도에서 `the silhouette's head is slightly raised, chin lifted a few degrees` 만 변경(얼굴은 여전히 안 보임). 이미지 편집으로 처리.

### 2.4 편의점 (S6)

**ART.scene.mart_counter** — 9:16 · P1
```
First-person view across a convenience-store counter. On the counter a small CRT-style monitor showing only a blurry grayscale security-camera frame of a street at night (shapes, no readable details). Behind the counter a blank cigarette rack, shelves of unlabeled colored boxes, the forearm of an older man in an apron resting on the counter. Cool fluorescent white #E8EEF0, a glowing refrigerated showcase at the side reflecting faintly in the glass.
```
- 모션: 냉장고 문 반사.

**ART.scene.mart_front** — 9:16 · P2
```
Front of a convenience store at midday on an overcast day, viewed from across the narrow street. Glass double door, a blank backlit sign panel (no text), a street bollard and a curb where a car could stop, wet-looking grey sky. Empty sidewalk. This is the place where something happened later; it should look utterly ordinary. Palette flat grey #E8EEF0 with a muted red awning.
```
- 모션: 행인 그림자.

### 2.5 인터폰 · 약국 (S8, S9)

**ART.scene.intercom** — S8 · 9:16 · P1
```
Close first-person view of a wall-mounted video door-phone panel in an apartment hallway: a plain beige plastic housing with a small black-and-white screen (leave the screen flat dark grey, to be replaced), two round buttons, a speaker grille, a coat hook beside it. Slight tension, afternoon overcast light.
```

**ART.scene.pharmacy_in** — 9:16 · P1
```
First-person view at a neighbourhood pharmacy counter. Across the counter, only the hands and white-coat sleeves of a woman in her mid-50s resting on a paper bag; glass cabinets behind her filled with plain unlabeled white and light-green boxes; a small sign-board stand with blank paper. Fluorescent white #E8EEF0, late afternoon, shadows long and cool. Quiet, slightly guilty atmosphere.
```
- 모션: 형광등.

**ART.scene.pharmacy_bench** — 9:16 · P1
```
View from inside a pharmacy through a rain-streaked window at dusk: a lone wooden bench on the wet sidewalk outside, glistening pavement, a street lamp just turning on with sodium orange #E39A3B glow, blue-grey sky. The bench is empty. Raindrops on the glass in the foreground, soft focus city lights behind. Melancholy.
```
- 모션: 빗방울.

**ART.scene.pharmacy_shutter** — S9 종료 · 9:16 · P1
```
View from the wet sidewalk at evening: a pharmacy's metal roll-up shutter half pulled down, light from the shop interior spilling in a thin band under it onto the rainy pavement. Reflections of the blank shop sign (no text) in the puddle. Blue-grey dusk, sodium orange accents. Nobody visible.
```
- 모션: 셔터 이동(별도 레이어: 셔터 하단 PNG).

### 2.6 엔딩

**ART.scene.police_front_morning** — S14 A · 9:16 · P1
```
First-person view standing in front of a police-station glass automatic door at 8:50 on a cold clear morning. At the bottom of the frame, a hand holding two phones side by side: a large plain phone with a big-button case on the left and a smaller dark slim phone on the right, both screens off. In the door glass, the faint reflection of the street and sky, no one inside. Cool pale morning light, blue-grey with hints of white. Hopeful but uncertain.
```
- 모션: 자동문 반사.

---

## 3. 사진 (ART.photo.*) — 폰 안의 사진

> 폰 사진처럼 보이게 **약한 가장자리 비네트와 살짝 기울기**를 프롬프트에 넣되, 스타일은 카툰 유지.

**ART.photo.family_2019** — 배경화면 · 3:4 · **P0**  *(따뜻한 색 허용)*
```
Cartoon illustration styled like an old family phone photo: a Korean family of three standing side by side in a spring park, a father in his early 50s, a mother in her late 40s with shoulder-length hair, and an 11-year-old boy between them, all small full-body figures with simple friendly faces, cherry blossoms, golden warm afternoon light, warm peach, cream and soft yellow palette (the only warm image in the game), slight vignette, slightly tilted, snapshot framing.
```
- 배경화면(잠금화면)용으로 세로 9:16 크롭본도 만든다: 인물을 화면 하단 1/3에 두고 위쪽은 하늘.

**ART.photo.father_son_2022** — S9 · 3:4 · P1  *(도현 얼굴 허용)*
```
Cartoon illustration styled like a phone photo: a Korean father in his early 50s and his 15-year-old son (slim, short black hair, expressionless, plain grey hoodie) standing at an awkward distance on a restaurant street, not touching, both looking slightly away from the camera, the boy's face clearly visible and quiet. Muted autumn evening colors with a slight warm tint, shallow vignette, snapshot framing.
```

**ART.photo.debt_form** — S11 · 3:4 · P1
```
Cartoon illustration of a smartphone snapshot of a sheet of paper on a table taken at an angle, blurry, out of focus: a printed form with a table of boxes filled with scribble lines instead of words, a pen lying across it, a corner of a kitchen table. Cool grey light, slightly tilted, low contrast.
```

**ART.photo.graduation_gate** — P2 · 3:4
```
Cartoon illustration of a school gate on graduation day: a long blank congratulatory banner (no text) hung over the gate, balloons tied to the fence, no people, pale winter sky. Muted greys and blues.
```

**ART.photo.receipt_saebom** — S8 이후(자동 촬영) · 3:4 · P1
```
Cartoon illustration of a smartphone snapshot of a crumpled paper receipt held flat on a doorstep floor: a narrow thermal receipt with a header block of blank scribbles, several item rows scribbled out and ripped away at the bottom (torn edge), a piece of a paper pharmacy bag with a blank green cross-shaped badge and no text. Floor tiles at the corner of the frame. Flat grey light.
```
- 약 이름·처방 정보를 넣지 않는다. 가게 이름 "새봄약국"은 앱에서 얹는다.

**ART.photo.dunning_mail** — 옛 폰 · 3:4 · P1
```
Cartoon illustration of a phone photo of a debt-collection letter lying on a kitchen floor beside a shoe: an official-looking white envelope window, a folded letter with a heavy red-edged band at the top (blank), rows of scribble lines, a red stamp shape with no text. Dim, cool light, shot from above at an angle, low quality.
```

**ART.photo.balance_notice** ×3 — 옛 폰 · 3:4 · P1  *(3종 변형)*
```
Cartoon illustration of a phone photo of a plain monthly statement letter laid on a desk: window envelope beside it, a table of rows and columns with scribble lines instead of text, one total box circled in pencil, a calculator at the corner. Variation 1: neat and flat; Variation 2: slightly tilted with a pen on it; Variation 3: folded in half with a thumb at the edge. Cool grey-blue light.
```

**ART.photo.sleeping_father** — 엔딩 A 배경화면 원본 · 9:16 · P1
```
Cartoon illustration, first-person high angle behind a sofa: a middle-aged Korean father seen only from behind, asleep sitting slightly slumped on the sofa in a plain jacket, a thin blanket half slipped off one shoulder, a TV in front of him casting a cool blue flicker across his shoulders and the room, otherwise the living room is dark. Intimate, tender, a child's secret photo of his father. Mostly blue-grey #4A5866 with a pale TV glow, no warm tones.
```
- **배경화면 크롭**: 인물을 화면 하단 40%, 위쪽은 어두운 거실(시계 위젯 영역).

**ART.photo.sleeping_father_moire** — FX-07 · 9:16 · P1
- 생성 아님. 위 이미지를 코드에서 가공(모아레 패턴 오버레이, 약 3~5도 기울기, 화면 가장자리 노이즈)한다. 대체 프롬프트(이미지 편집):
```
Edit: make this look like a photo taken with a phone camera pointed at another phone screen: visible pixel-grid moire pattern, slight 4-degree tilt, soft vignette, a faint glare spot in one corner. Keep the scene and style.
```

**ART.photo.admission_capture / deposit_capture** — 생성 안 함(앱 UI 렌더로 대체. `art-assets.md` 2장).

---

## 4. 아이템 확대 (ART.item.*) — 1:1

**ART.item.receipt** — 1:1 · P1
```
Close-up of a crumpled torn fragment of a paper pharmacy bag with a green cross-shaped badge (blank) and a narrow white receipt stuck to it, lying on a grey doorstep floor. The receipt's header is scribbles, the item lines are ripped away at the bottom edge. Soft flat light, shallow shadows. No readable words.
```

**ART.item.envelope** — 1:1 · P1
```
Close-up of a plain brown A4 paper envelope lying on a hallway floor, flap sealed with a strip of clear tape, no sender, no address, a single smudged fingerprint on one corner. Orange sodium light from a gap under the door falls across one edge.
```

**ART.item.postit** — 1:1 · P1
```
Close-up of a small pale yellow-grey sticky note stuck on a brown envelope, handwritten text rendered as neat, slightly slanted scribble lines (no readable words) with the last short line trailing off, a faint pen smudge. Quiet, intimate.
```
- 한국어 문구 "버리라고 했는데 못 버렸어요"는 **앱에서 필기체 폰트로 얹는다**(유진 필체, 정돈된 흘림).

**ART.item.yujin_note** — 1:1 · P1
```
Close-up of a small white memo slip with a phone number written as neat scribble marks (no readable digits), in the same slightly slanted tidy handwriting, lying on a shoe-cabinet top beside a key tray.
```

**ART.item.old_phone_off** — 1:1 · P1
```
Close-up of an old smartphone lying on a table, screen black and off, a faint crack-free dark glass reflecting a ceiling light, a charging cable lying beside it not yet plugged in, plain black case with no stickers, slightly worn corners. Cool dim light.
```

**ART.item.cctv_still_1~3** — 16:9 · P1  *(공통 스타일)*
```
Low-resolution grayscale cartoon security-camera still, high wide-angle view from above a convenience-store entrance at night, slightly fisheye, heavy pixel blocks and horizontal noise lines, a timestamp band at the top left left blank, wet pavement shapes, faces indistinct blobs.
```
- **still_1 (19:05)**: `a slim teenage figure in a dark jacket walking alone toward the shop front from the left, hands in pockets, small and far.`
- **still_2 (19:06)**: `the same slim figure now standing near the curb; a taller man in a long dark coat stands close in front of him, back to the camera, a car stopped at the curb with lights on.`
- **still_3 (19:07)**: `the same slim figure bending to enter the back door of the car, the long-coat man holding the door, the car door open, brake lights red.`
- 타임스탬프(19:05/06/07)는 앱 오버레이.

---

## 5. 영상형 (ART.video.*)

### 5.1 CCTV 전체 (ART.video.cctv_full)
> 19:05:30~19:07:30(2분), 흑백 저화질, 무음. **15초 구간(19:06:05~19:06:20)이 핵심**: 어깨 잡음 → 귓속말 → 움찔 → 고개 숙임. 키프레임을 이미지로 먼저 만든 뒤 `generate_video`(이미지→영상, 5~10초 클립)로 이어 붙이거나, 스크러버용 **프레임 시퀀스**로 쓴다.

공통(모든 키프레임, 16:9):
```
Low-resolution grayscale cartoon security-camera still, wide high-angle view of a convenience-store entrance and curb at night, slight fisheye, pixel blocks, horizontal noise lines, blank timestamp band, wet pavement, faces indistinct blobs.
```
| 키프레임 | 시각 | 추가 지시 |
|---|---|---|
| K1 | 19:05:30 | `the slim teenage figure arrives alone, standing at the entrance, looking at a phone` |
| K2 | 19:06:00 | `a taller man in a long dark coat enters the frame from the right and stops very close to the teenager` |
| K3 | 19:06:05 | `the man's hand is on the teenager's shoulder, leaning in` |
| K4 | 19:06:12 | `the man's head close beside the teenager's ear (whisper), the teenager's shoulders drawn up` |
| K5 | 19:06:16 | `the teenager flinches, upper body jerking slightly away, blur on the shoulders` |
| K6 | 19:06:20 | `the teenager's head bowed, the man's hand still on his shoulder, a car stops at the curb` |
| K7 | 19:07:00 | `the teenager walks to the car and gets in, the man holding the door` |

영상 변환 프롬프트(예: K3→K6, 5초):
```
Subtle security-camera footage motion: only the man's hand tightening, the teenager's shoulders rising and head lowering, low frame rate, noise flicker. Static camera, no zoom, no cuts.
```
- 15초 구간은 클립 3개(≈5초×3)로 만들어 이어 붙이거나 키프레임 사이를 2fps 프레임 시퀀스로 구성.

### 5.2 인터폰 민재 (ART.video.intercom_minjae)
**키프레임 (4:3 → 9:16 크롭)**
```
Low-resolution black-and-white video door-phone camera view with strong fisheye distortion looking out from a front door, a sweating man in his twenties standing far too close to the lens, face mostly cut off by the frame top and blurred by low resolution (only a wet chin and wild hair visible), his hand raised near the lens, hallway light behind him. Heavy noise, pixelation.
```
영상 변환 (10~15초 루프):
```
Shaky handheld-like video door-phone footage: the man leaning in and out of the lens, rocking back and forth, breathing, noise flicker, low frame rate. Face stays blurred and cropped. No cuts.
```
- 얼굴은 반드시 화질로 뭉갠다. 음성은 별도 녹음.

---

## 6. UI 그래픽 (ART.ui.*)

> 아이콘·지도·타이틀은 **코드(SVG/CSS)가 우선**이다. 아래는 코드로 어려운 질감·시안용.

**ART.ui.title** — P1 · 로고타입은 이미지가 아니라 폰트로 렌더(글자 오류 방지). 배경 질감만 생성:
```
Dark minimalist background for a game title screen: a hallway silhouette in deep blue-black with a single thin vertical line of pale light, cartoon style, large empty space at the center for a logotype, subtle paper grain.
```

**ART.ui.app_icon** — P1 · 1:1
```
Flat cartoon app icon: a dark blue-grey rounded square with a simple pale phone silhouette with a small red notification dot at its upper right, no text, minimal, strong silhouette readable at small size.
```

**ART.ui.map_dark** — P1 · 코드(가공 도로망 SVG)로 제작. 질감 시안 필요 시:
```
Abstract dark navigation map background, fictional road network of thin pale lines on a deep blue-black ground, one sodium orange #E39A3B route line, no place names, no text.
```

**ART.ui.icons_father / icons_old** — 코드 아이콘 세트로 제작(특정 실제 OS 모방 금지). 이미지 생성 불필요.

---

## 7. 작업 순서·검수

### 7.1 순서
1. **P0**: R-01(= home_hall_night) → family_2019(+배경화면 크롭) → R-02, R-03 (M2 수직 슬라이스에 필요한 것만).
2. **P1 장면 세트**: 같은 레퍼런스로 1막(S3~S4) → 2막(S5~S9) → 3막(S10~S14) 순.
3. **P1 사진·아이템·CCTV**, 마지막으로 영상형.
4. P2는 여유가 있을 때.

### 7.2 검수 체크
- [ ] 프롬프트마다 글자·숫자가 이미지에 없다(앱 레이어로 얹을 자리만 비어 있다).
- [ ] 얼굴이 정면으로 보이는 인물이 없다. 예외는 사진 두 장(family_2019, father_son_2022)과 레퍼런스 시트 R-02·R-03(내부 참조용, 게임에 쓰지 않음)뿐.
- [ ] 따뜻한 색은 family_2019, father_son_2022에만.
- [ ] 약 관련 이미지에 알약·약 이름·투약이 없다.
- [ ] 같은 장소의 변형(entrance_in A/B/C, interrogation_glass B/B+)이 구도 동일.
- [ ] 장면 간 선 굵기·채색 밀도·팔레트가 R-01과 어울린다(어긋나면 R-01을 레퍼런스로 다시).
- [ ] 1170×2532로 크롭/확장해도 핵심 요소가 중앙 70% 안에 있다.
