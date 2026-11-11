/* NPC 반응표 — 설계의 대사는 글자 그대로. 설계에 없는 문장은 인물의 앎 매트릭스를 지켜 짧게 썼다(보고서에 목록).
 * 단일 출처: PROGRESSION_AND_ENDINGS 4·5절, TRACES_AND_REACTIONS 4절, CHARACTERS 4절, ACTION_PROOF 3절 */
window.LM = window.LM || {};
window.LM.C = window.LM.C || {};

LM.C.dialogue = {
  /* 직접 입력에서 알아듣는 낱말. 우선순위: 장소 → 사람 → 돈 → 정체 → 기타 */
  dictionary: {
    place: ['해담', '해담고시텔', '성원구청로 31', '성원구청로31', '207', '청운', '청운고시원', '304', '리버뷰', '1203', '성원구청역', '성원스파'],
    person: ['강민석', '민석', '강실장', '강 실장', '실장K', '실장 K', '윤민지', '민지'],
    money: ['한결', '빚', '4820', '48,200,000', '이상철'],
    identity: ['아빠', '아빠다', '도현이 아빠', '도현이아빠', '아저씨', '아버님', '아버지'],
    other: ['녹음', '자수', '경찰', '번호판', '38러 5512', '5512'],
  },

  /* 흔적 → 반응 기본 지연(게임 분). 개별 행이 delay를 가지면 그 값을 쓴다. */
  delay: { DH: [3, 8], JH: [2, 5], SA: [10, 20], HR: [30, 30], MJ: [5, 15], KS: [10, 40], IMP: [10, 40], CW: [1, 1] },

  rows: [
    /* ---------------- 도현 (DH) ---------------- */
    { id: 'dh-who', npc: 'DH', states: [1, 2], match: { type: 'suggestion', value: '누구세요' }, reply: ['그쪽이 누군데요'] },
    { id: 'dh-dad', npc: 'DH', states: [0, 1, 2], match: { type: 'word', cls: 'identity' }, reply: ['아빠면 지금 내 방 사진 찍어 보내. 책상 서랍 열고.'], state: '2' },
    { id: 'dh-drawer', npc: 'DH', states: [1, 2], match: { type: 'eid', ids: ['E-217b'] }, reply: ['…지우는 거 멈출게. 근데 나 찾지 마. 내일 다 끝나'], state: '3', sets: ['E-217b'], hook: 'DH3' },
    { id: 'dh-desk', npc: 'DH', states: [1, 2], match: { type: 'eid', ids: ['E-217a'] }, reply: ['서랍.'] },
    { id: 'dh-photo', npc: 'DH', states: [1, 2], match: { type: 'attachment' }, reply: ['장난해요?'], alert: 1 },
    { id: 'dh-rec', npc: 'DH', states: [3, 4], match: { type: 'eid', ids: ['E-37'] }, reply: ['그거… 아빠가 들었어?'] },
    { id: 'dh-seoa', npc: 'DH', states: [3, 4], match: { type: 'eid', ids: ['E-93'] }, reply: ['서아한테 미안하다고 해 줘'] },
    { id: 'dh-confess', npc: 'DH', states: [3, 4], match: { type: 'word', cls: 'money' }, reply: ['…언제부터 알았어'], state: '4', flags: { CONFESS: true } },
    { id: 'dh-name', npc: 'DH', states: [3, 4], match: { type: 'word', valueAny: ['강민석', '민석', '강실장', '강 실장', '실장K'] }, reply: ['…그게 그 사람 이름이야?'] },
    { id: 'dh-place2', npc: 'DH', states: [0, 1, 2], match: { type: 'word', valueAny: ['해담', '해담고시텔', '207', '성원구청로 31', '성원구청로31'] }, reply: ['…'], longTyping: true },
    { id: 'dh-place3', npc: 'DH', states: [3], match: { type: 'word', valueAny: ['해담', '해담고시텔', '207', '성원구청로 31', '성원구청로31'] }, reply: ['오지 마. 아빠 위험해'], longTyping: true },
    { id: 'dh-place4', npc: 'DH', states: [4], match: { type: 'word', valueAny: ['해담', '해담고시텔', '207', '성원구청로 31', '성원구청로31'] }, reply: ['…와도 문 안 열 거야.'] },
    { id: 'dh-cheongun', npc: 'DH', states: [3, 4], match: { type: 'word', valueAny: ['청운', '청운고시원', '304'] }, reply: ['거기 아니야.'] },
    { id: 'dh-where', npc: 'DH', states: [1, 2], match: { type: 'suggestion', value: '어디야' }, reply: ['그건 왜요'] },
    { id: 'dh-where3', npc: 'DH', states: [3, 4], match: { type: 'suggestion', value: '어디야' }, reply: ['왜.'] },
    { id: 'dh-stop', npc: 'DH', states: [1, 2, 3, 4], match: { type: 'suggestion', value: '지우지 마' }, reply: ['…알았어'] },
    { id: 'dh-sorry', npc: 'DH', states: [1, 2, 3, 4], match: { type: 'suggestion', value: '미안하다' }, reply: ['뭐가 미안한데요'] },
    { id: 'dh-any-early', npc: 'DH', states: [0, 1, 2], match: { type: 'any' }, reply: ['그거 왜 봐요'] },
    { id: 'dh-any', npc: 'DH', states: [3, 4], match: { type: 'any' }, reply: ['아빠 그게 뭐야'] },

    /* ---------------- 지훈 (JH) ---------------- */
    { id: 'jh-reveal', npc: 'JH', states: [0], match: { type: 'word', cls: 'identity' }, reply: ['아저씨…? 도현이 폰을 왜…'], state: '1', reveal: true },
    { id: 'jh-hidden', npc: 'JH', states: [0], match: { type: 'any' }, reply: ['야 너 어디야!! 아버님한테 말 안 했어'], alert: 1 },
    { id: 'jh-job', npc: 'JH', states: [0, 1, 2], match: { type: 'word', valueAny: ['알바', '아르바이트'] }, reply: ['몰라요'] },
    { id: 'jh-e23', npc: 'JH', states: [0, 1, 2], match: { type: 'eid', ids: ['E-23'] }, reply: ['…도현이 살아 있어요. 어딘지는 진짜 몰라요. 걔 2월에 방 구한다고 했었어요'], state: '1' },
    { id: 'jh-v06', npc: 'JH', states: [0, 1, 2], match: { type: 'eid', ids: ['E-40', 'E-55', 'E-36b'] }, reply: ['…저요. 그 알바 제가 소개했어요.', '@jh_lee_99요? 이런 애 몰라요. 저한테도 DM 왔어요'], state: '2', sets: ['E-92'] },
    { id: 'jh-any', npc: 'JH', states: [0, 1, 2], match: { type: 'any' }, reply: ['뭔데요'] },

    /* ---------------- 서아 (SA) ---------------- */
    { id: 'sa-reveal', npc: 'SA', states: [0, 1, 2], match: { type: 'word', cls: 'identity' }, reply: ['아버님… 도현이랑 그날 같이 있었어요'], state: '1', reveal: true },
    { id: 'sa-hidden', npc: 'SA', states: [0], match: { type: 'any' }, reply: ['나 경찰한테 너랑 있었다고 했어. 괜찮은 거지?'], state: '1' },
    { id: 'sa-v05', npc: 'SA', states: [0, 1, 2], match: { type: 'eid', ids: ['E-42', 'E-12', 'E-12b', 'E-22'] }, reply: ['그날 저 홍대 있었어요. 도현이가 부탁했어요. 리버뷰에 누구 만나러 간다고, 무섭다고 했어요'], state: '2', sets: ['E-93'] },
    { id: 'sa-any', npc: 'SA', states: [0, 1, 2], match: { type: 'any' }, reply: ['이게 뭐예요?'] },

    /* ---------------- 하린 (HR) ---------------- */
    { id: 'hr-sorry', npc: 'HR', states: [0], match: { type: 'combo', identity: true, words: ['미안', '죄송', '사과'], any: ['계좌', '352', '7731', '이*현'], orEid: ['E-47', 'E-45', 'E-82'] }, reply: ['사과는 받는 게 아니라 돌려받는 거예요. 경찰에서 뵙죠.'], flags: { HARIN: 'apologized' }, once: true },
    { id: 'hr-fake', npc: 'HR', states: [0], match: { type: 'combo', hidden: true, words: ['미안', '죄송', '사과'] }, reply: ['이제 와서요? 신고했어요.'], flags: { HARIN: 'angered' }, once: true },
    { id: 'hr-any', npc: 'HR', states: [0], match: { type: 'any' }, reply: ['…'] },

    /* ---------------- 윤민지 (MJ) ---------------- */
    { id: 'mj-reveal', npc: 'MJ', states: [0, 1], match: { type: 'word', cls: 'identity' }, reply: ['…도현이 아버님이요?'], state: '1', reveal: true },
    { id: 'mj-hidden', npc: 'MJ', states: [0], match: { type: 'any' }, reply: ['도현? 너 괜찮아?'], state: '1' },
    { id: 'mj-photo', npc: 'MJ', states: [0, 1], match: { type: 'eid', ids: ['E-32', 'E-104'] }, special: 'MJ2', state: '2' },
    { id: 'mj-any', npc: 'MJ', states: [0, 1, 2], match: { type: 'any' }, reply: ['…누구세요?'] },

    /* ---------------- 실장K (KS) ---------------- */
    { id: 'ks-leak', npc: 'KS', states: [0, 1, 2], match: { type: 'word', valueAny: ['해담', '해담고시텔', '207', '성원구청로 31', '성원구청로31', '성원구청역', '성원스파'] }, reply: ['어디라고?'], flags: { LEAK: true }, state: '3' },
    { id: 'ks-leak-e', npc: 'KS', states: [0, 1, 2], match: { type: 'eid', ids: ['E-150', 'E-198', 'E-219', 'E-220', 'E-73'] }, reply: ['고맙다.'], flags: { LEAK: true }, state: '3' },
    { id: 'ks-cheongun', npc: 'KS', states: [0, 1, 2], match: { type: 'word', valueAny: ['청운', '청운고시원', '304'] }, reply: ['청운? 거기 가 봤자.'], state: '2' },
    { id: 'ks-dad', npc: 'KS', states: [0, 1, 2], match: { type: 'word', cls: 'identity' }, reply: ['니 아빠 한빛물류 맞지?'], state: '2' },
    { id: 'ks-any', npc: 'KS', states: [0, 1, 2], match: { type: 'any' }, reply: ['누구냐'], state: '1' },

    /* ---------------- @jh_lee_99 (사칭) ---------------- */
    { id: 'imp-leak', npc: 'IMP', states: [0, 1, 2], match: { type: 'word', valueAny: ['해담', '해담고시텔', '207', '성원구청로 31', '성원구청로31', '성원구청역', '성원스파'] }, reply: ['어디래?'], flags: { LEAK: true }, state: '3' },
    { id: 'imp-leak-e', npc: 'IMP', states: [0, 1, 2], match: { type: 'eid', ids: ['E-150', 'E-198', 'E-219', 'E-220', 'E-73'] }, reply: ['어디래?'], flags: { LEAK: true }, state: '3' },
    { id: 'imp-who', npc: 'IMP', states: [0, 1, 2], match: { type: 'word', cls: 'identity' }, reply: ['누구세요?'], state: '2' },
    { id: 'imp-any', npc: 'IMP', states: [0, 1, 2], match: { type: 'any' }, reply: ['걱정돼서 그래. 어디 있는지 말해 봐.'], state: '1' },

    /* ---------------- 청운고시원 (CW) — 메일 ---------------- */
    { id: 'cw-any', npc: 'CW', states: [0], match: { type: 'any' }, reply: ['입실 취소하신 분입니다. 개인정보라 더는 말씀드릴 수 없습니다.'] },
  ],

  /* MJ-2의 세 왕복(최대 3). 엔진이 MJturns 순서로 고른다. */
  mjStatements: [
    { line: '…손목에 초록색 시계. 실장이 그거 차고 있었어요.', sets: ['E-108'] },
    { line: '실장이 녹음 찾고 있어요. 그거 있으면 큰일 나요.', sets: ['E-109'] },
    { line: '교육 때 누가 "민석이 형"이라고 했어요. @jh_lee_99가 저한테 "형이 걱정돼서"라고 DM 했고요.', sets: ['E-111', 'E-110'] },
  ],
};
