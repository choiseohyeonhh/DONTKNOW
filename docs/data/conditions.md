# 조건식·효과 문법

> 선택지 노출, 이벤트 발화, 세션 진입, 엔딩 판정이 전부 이 문법 하나로 쓰인다.

## 1. 조건식 (문자열)

### 1.1 원자
| 형식 | 의미 | 예 |
|---|---|---|
| `K-nn`, `KX-nn[a]` | 앎 보유 | `K-15` |
| `F-nn[b]`, `FX-nn` | 플래그 세팅 | `F-02b` |
| `done(Sxx)` | 세션 완료 | `done(S06)` |
| `active(Sxx)` | 세션 진행 중 | `active(S09)` |
| `at(PL.x)` | 현재 장소 | `at(PL.home)` |
| `seen(id)` | 열람 기록 | `seen(MM.o.remaining)` |
| `branch(A-1)` | 분기 코드 | `branch(B-2)` |
| `time>=HH:MM`, `time<HH:MM` | 게임 시계(당일) | `time>=16:10` |
| `v.name OP n` | 변수 비교(`== != >= <= > <`) | `v.s4_trust_count>=2` |
| `device(old)` | 현재 기기 | |
| `meta.endings>=n` | 회차 | `meta.endings>=1` |
| `true`, `false` | | |

### 1.2 결합
- `!a`, `a && b`, `a || b`, 괄호. 우선순위: `!` > `&&` > `||`.
- 공백 무시.

### 1.3 예
```
K-15 && !F-03                          # 마약 선택지(김 형사)
K-19 && K-20                           # S13 ①
F-04 || !K-17                          # S13 ④  [ISSUE-08]
KX-21 && !F-01                         # S12 "너도… 거기서 나오고 싶었던 거 아니냐"
done(S07) && at(PL.home)               # S8 진입
v.s9_pressure>=2                       # S9 조기 종료
```

### 1.4 문법 (EBNF)
```
expr    = or ;
or      = and { "||" and } ;
and     = unary { "&&" unary } ;
unary   = "!" unary | atom | "(" expr ")" ;
atom    = ID | func "(" ARG ")" | cmp ;
cmp     = ( "time" | VAR ) OP VALUE ;
ID      = /K-\d\d|KX-\d\d[a-z]?|F-\d\d[b]?|FX-\d\d|true|false/ ;
func    = "done" | "active" | "at" | "seen" | "branch" | "device" ;
VAR     = /v\.[a-z0-9_]+|meta\.[a-z]+/ ;
OP      = "==" | "!=" | ">=" | "<=" | ">" | "<" ;
```

## 2. 평가 규칙

- 정의되지 않은 ID는 **빌드 타임 에러**(검증 스크립트). 런타임에는 false + 콘솔 경고.
- 평가는 순수 함수. 부수 효과 없음.

## 3. 효과 (배열)

| 효과 | 형식 | 예 |
|---|---|---|
| 앎 획득 | `{"know": "K-12"}` | |
| 플래그 | `{"flag": "F-02"}` | |
| 변수 | `{"set": "v.s9_path", "value": "photo"}`, `{"inc": "v.s4_trust_count"}` | |
| 분기 코드 | `{"branch": "A-3"}` | |
| 세션 상태 | `{"session": "S06", "status": "done"}` | |
| 시간 | `{"clock": "+15"}`, `{"clock": "=19:10"}` | |
| 장소 | `{"moveTo": "PL.home", "mode": "instant\|travel"}` | |
| 네비 등록 | `{"navAdd": "PL.mart", "prompt": true}` | |
| 연락처 | `{"contactAdd": "CT.yujin"}`, `{"numberAdd": "0091"}` | |
| 메시지 주입 | `{"message": "TH.f.jihoon/005"}` (데이터에 정의된 메시지를 수신 처리) | |
| 이벤트 예약 | `{"schedule": "RE.01"}` / `{"cancel": "NG.S06.180"}` | |
| 독백 | `{"monologue": "MO.04"}` | |
| 대화 시작 | `{"dialogue": "DLG.S04.yujin"}` | |
| 화면 | `{"open": "app:messages/TH.f.jihoon"}`, `{"close": "app"}` | AV-01 |
| 오디오 | `{"sfx": "AU.sfx.shutter"}`, `{"ambience": "AU.amb.pharmacy"}` | |
| 기기 | `{"device": "old"}` | |
| 엔딩 | `{"resolveEnding": true}` | S13 종료 |
| 열람 표시 | `{"seen": "IT.receipt"}` | |

- 효과는 배열 순서대로 적용. 같은 액션 안의 효과들은 원자적(중간 세이브 없음).
- `know`·`flag` 효과는 이미 있으면 무시(멱등).
