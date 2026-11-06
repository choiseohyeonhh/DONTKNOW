(function () {
  const G = window.__game;
  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const WAIT = G.WAIT;
  const END = G.END;

  const trust = () => { G.S.v.s4_trust_count = (G.S.v.s4_trust_count || 0) + 1; };
  const doubt = () => { G.S.v.s4_doubt_count = (G.S.v.s4_doubt_count || 0) + 1; };

  const JUNHO_BADMOUTH = [
    SAY('yujin', [], '걔요? 처음엔 그냥 조용한 애였는데, 도현이가 뭐든 챙겨 주니까 점점 기대는 것 같았어요.'),
    SAY('yujin', [], '도현이가 요즘 걔한테 돈도 빌려주고, 뭐 하러 다니는지도 모르는 데 같이 가고 그러더라고요.'),
    SAY('yujin', [], '제가 몇 번이나 말렸어요. 근데 도현이가 걔를 동생처럼 생각해서… 결국 이렇게 된 거죠.'),
  ];

  const END_LINES = [
    SAY('yujin', [], '도현이한테 연락 오거나 뭐 생각나시면 여기로 연락 주세요. 저도 도현이 물건 중에 뭐 나오면 바로 연락드릴게요.'),
    DO(() => {
      G.grant('K-08');
      G.addContact({ id: 'yujin', name: '차유진', num: '010-XXXX-4417', kind: 'normal', th: 'yujin' });
      if ((G.S.v.s4_trust_count || 0) >= 2) G.setFlag('F-01');
    }),
    END(),
  ];

  G.defDialogue('S04.yujin', [
    SAY('yujin', [], '안녕하세요, 갑자기 찾아와서 죄송해요. 저 도현이 여자친구 차유진이라고 하는데요, 도현이가 며칠째 연락이 안 돼서, 너무 걱정돼서, 혹시 집에는 들어왔나 해서 와 봤어요.'),
    CHOICE([
      { label: { c: '이렇게 와 줘서 고마워요.' }, do: trust },
      { label: { c: '도현이한테 여자친구 있단 얘기는 못 들었는데요.' }, do: doubt, then: [
        SAY('yujin', [], '아, 도현이가 원래 그런 얘기 잘 안 하잖아요, 아버님한테는 특히 더요, 저도 그게 좀 서운했는데, 그래도 저희 꽤 오래 만났어요…'),
      ] },
      { label: { c: '…' } },
    ]),
    SAY('yujin', [], '3월 들어서는 원래 7시 12분 버스 타던 애가 갑자기 6시 40분 걸 타더라고요, 학교 일찍 가서 혼자 있고 싶다면서요, 점심도 자꾸 거르고요.'),
    SAY('yujin', [], '혹시 준호라는 애 아세요? 아랫집 사는 고등학생이요, 도현이가 걔를 동생처럼 챙겼는데, 걔가 그걸 이용해서 도현이를 좀 이상한 데로 끌어들였거든요.'),
    CHOICE([
      { label: { c: '준호가 어떤 앤데요?' }, do: trust, then: JUNHO_BADMOUTH },
      { label: { c: '학교 선생님 말로는 도현이가 누굴 지키려 했다던데. 그게 준호예요?' }, cond: () => G.has('K-06'), do: doubt, then: [
        WAIT(2000),
        SAY('yujin', [], '…네? 아, 그건, 도현이가 착해서 그런 거예요, 준호가 그걸 이용한 거고요.'),
      ] },
      { label: { c: '…' } },
    ]),
    SAY('yujin', [], '이런 말씀 드려도 될지 모르겠는데, 도현이가 요즘 집에 있으면 숨이 막힌다고 했어요, 아버님이랑 대화가 하나도 없다고, 이런 얘기는 저한테밖에 못 한다고요.'),
    CHOICE([
      { label: { c: '도현이가 그런 말 할 애가 아닌데요.' }, do: doubt, then: [
        SAY('yujin', [], '아버님 마음 알아요. 근데 저한텐 그랬어요.'),
      ] },
      { label: { c: '…그랬군요.' }, do: trust },
      { label: { c: '…' } },
    ]),
    ...END_LINES,
  ], { onEnd: () => window.s4YujinEnd() });

  G.defDialogue('S04.detective', [
    SAY('detective', [], '이상철 씨 되시죠? 성원서 실종팀 김태윤 경위입니다.'),
    SAY('detective', [], '잠깐 서로 좀 나와 주실 수 있겠습니까.'),
    CHOICE([
      { label: { c: '네, 지금 가겠습니다.' }, then: [
        DO(() => {
          G.setFlag('S04.callAccepted');
          G.later(1200, () => {
            G.endCall();
            G.endSession('S04');
            G.setFlag('S04.done');
            G.startRoute('police');
          }, 'S04.afterCall');
        }),
        END(),
      ] },
    ]),
  ], { onEnd: () => {} });

  function ringDetective() {
    const S = G.S;
    if (S.session !== 'S04' || G.flag('S04.callAccepted') || G.flag('S04.done')) return;
    G.setFlag('S04.awaitingDetective');
    S.ov = { type: 'incoming', name: '김 형사', from: 'detective' };
    G.refresh();
  }

  window.s4YujinEnd = function s4YujinEnd() {
    if (G.flag('S04.yujinDone')) return;
    G.setFlag('S04.yujinDone');
    G.addContact({ id: 'detective', name: '성원경찰서 김태윤', num: '010-XXXX-1182', kind: 'normal', th: 'detective' });
    G.schedule('EV.S04.02', 30000, ringDetective, { cond: () => G.S.session === 'S04' && !G.flag('S04.callAccepted') });
    G.later(65000, () => {
      if (G.S.session === 'S04' && !G.flag('S04.callAccepted') && !G.S.ov) ringDetective();
    }, 'S04.recall');
  };

  window.startS4 = function startS4(mode = 'arrive') {
    const S = G.S;
    if (S.session === 'S04' && S.dlg) return;
    if (G.flag('S04.done')) return;
    S.phase = 'free';
    S.place = 'home';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.phoneUp = false;
    S.travel = null;
    if (S.clock[0] < 10 || (S.clock[0] === 10 && S.clock[1] < 30)) S.clock = [10, 30];
    G.startSession('S04');
    G.setFlag('S04.active');
    G.runDialogue('S04.yujin', { channel: 'face', who: 'yujin', scene: 'scene_entrance_yujin' });
    G.nudge('S04', [
      [90000, () => {
        if (G.S.session !== 'S04' || G.flag('S04.callAccepted')) return;
        G.addTalkContact({ id: 'guard', name: '성원아파트 경비실' });
        G.addTalkMsg('guard', G.nowMsg('them', '[경비실] 손님분이 아직 기다리고 계십니다'));
      }],
      [450000, () => {
        if (G.S.session !== 'S04' || G.flag('S04.callAccepted') || G.S.dlg) return;
        ringDetective();
      }],
    ]);
  };

  G.defSession('S04', () => window.startS4('jump'));

  G.onArrive('home', () => {
    if (G.flag('S03.ended') && !G.flag('S04.done') && G.S.session !== 'S04') window.startS4('arrive');
  });

  G.onAccept(() => {
    const S = G.S;
    if (S.session === 'S04' && G.flag('S04.awaitingDetective')) {
      S.ov = null;
      G.setFlag('S04.awaitingDetective');
      G.runDialogue('S04.detective', { channel: 'call', who: 'detective', opening: '여보세요.' });
      return true;
    }
    return false;
  });
})();
