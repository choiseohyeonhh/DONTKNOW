(function () {
  const G = window.__game;
  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const GOTO = G.GOTO;
  const LABEL = G.LABEL;
  const END = G.END;

  G.defPlace({ id: 'police', name: '성원경찰서', scene: 'scene_police_office', travelMin: { home: 25, school: 30 } });

  const KX11_TEXT = '아버님, 아까 말씀드린 통화 기록입니다. 3/14 18:41 발신, 2분 11초, 010-5XXX-0091';

  function tryRe01() {
    const S = G.S;
    if (G.flag('RE.01')) return;
    if (!G.has('K-10')) return;
    if (S.dlg && (S.dlg.channel === 'face' || S.dlg.channel === 'intercom')) {
      G.schedule('RE.01.retry', 3000, tryRe01, { cond: () => !G.flag('RE.01') });
      return;
    }
    G.setFlag('RE.01');
    G.addMsg('yujin', G.nowMsg('them', '아버님, 혹시 경찰서 다녀오셨어요?'));
  }

  function sendKx11() {
    if (G.flag('S05.kx11Sent')) return;
    G.setFlag('S05.kx11Sent');
    G.addContact({ id: 'detective', name: '김태윤 경위', num: '031-XXX-0100', kind: 'normal', th: 'detective' });
    G.addMsg('detective', G.nowMsg('them', KX11_TEXT));
  }

  function finishS5() {
    if (G.flag('S05.done')) return;
    G.setFlag('S05.done');
    G.endSession('S05');
    G.registerDest('police');
    G.registerDest('mart');
    G.later(2000, sendKx11, 'S05.end');
    G.later(6000, () => {
      if (G.S.session) return;
      G.startRoute('mart');
    }, 'S05.route');
  }

  const HUB_CHOICES = [
    {
      label: { c: "혹시 '형'이라는 사람 아십니까? 애가 그 사람이랑 통화하는 걸 친구가 들었답니다." },
      cond: () => G.has('K-04') && !G.flag('S05.askedHyung'),
      then: [
        SAY('detective', [], '…그 번호 주인일 수도 있겠네요. 적어 두겠습니다.'),
        DO(() => G.setFlag('S05.askedHyung')),
        GOTO('hub'),
      ],
    },
    {
      label: { c: "애가 친구한테 '내일 끝난다'는 말을 했답니다." },
      cond: () => G.has('K-02') && !G.flag('S05.askedTomorrow'),
      then: [
        SAY('detective', [], '…뭐가요?'),
        SAY('detective', [], '그건 모르겠습니다.'),
        SAY('detective', [], '알아보겠습니다.'),
        DO(() => G.setFlag('S05.askedTomorrow')),
        GOTO('hub'),
      ],
    },
    {
      label: { c: '그 여자애, 우리 애 여자친구 아닙니다.' },
      cond: () => G.has('K-08') && !G.flag('S05.askedYujin'),
      then: [
        SAY('detective', [], '아버님이 아드님 연애사까지 다 아시는 건 아니잖습니까.'),
        DO(() => G.setFlag('S05.askedYujin')),
        GOTO('hub'),
      ],
    },
  ];

  G.defDialogue('S05.detective', [
    SAY('detective', [], 'CCTV 정지 화면입니다. 19시 5분 도착, 19시 6분 남성과 대화, 19시 7분 탑승입니다.'),
    SAY('detective', [], '보시면 아시겠지만, 아드님이 직접 탔어요.'),
    SAY('detective', [], '장소는 하루마트 성원역점 앞입니다.', { kn: 'K-11' }),
    SAY('detective', [], '18시 41분에 아드님이 먼저 전화를 걸었어요. 010-5XXX-0091, 2분 11초. 명의는 확인이 안 되고요. 대포폰입니다. 요즘은 애들끼리도 이런 거 많이 써요.', { kn: 'K-09' }),
    SAY('detective', [], '마지막으로 잡힌 기지국이 20시 3분, 성원IC 근처예요. 그 뒤로는 계속 꺼져 있고요.'),
    SAY('detective', [], '아버님, 아드님이 만 18세라 실종아동이 아니에요. 성인 가출인으로 접수가 됐어요. 자기 발로 탄 거고요. 찾는 건 계속 찾습니다만.'),
    SAY('detective', [], '학교에도 확인해 봤는데요, 3월 11일까진 수업 나왔고 12일부터 안 나왔답니다. 입학하고 2주 만이죠. 신입생들 적응 못 하고 잠수 타는 경우 꽤 있어요.'),
    SAY('detective', [], '그리고 아침에 여자친구라는 분이 왔다 갔어요. 아드님이 집 나가고 싶다는 얘기를 했었다고 하더라고요.', { kn: 'K-10' }),
    DO(() => {
      G.schedule('RE.01', 30000, tryRe01, { cond: () => !G.flag('RE.01') });
    }),
    LABEL('hub'),
    CHOICE([
      ...HUB_CHOICES,
      { label: { c: '…알겠습니다. 수고하십시오.' }, then: [END()] },
    ]),
  ], { onEnd: finishS5 });

  const HUB_AGAIN = [
    SAY('detective', [], '아버님. 새로 나온 건 없습니다.'),
    CHOICE([
      { label: { c: '편의점 사장 말이, 애가 협박당하는 것 같았답니다.' }, cond: () => G.has('K-12') && !G.flag('FX-03'), then: [
        SAY('detective', [], '…협박이요. 그 얘기는 처음 듣습니다. 사장님 연락처 좀 주시겠습니까.'),
        DO(() => { G.setFlag('FX-03'); G.setFlag('RE.08'); }),
        END(),
      ] },
      { label: { c: '형사님, 약 얘기가 나왔습니다.' }, cond: () => G.has('K-15') && !G.flag('F-03'), then: [
        SAY('detective', [], '…아버님, 그 얘기면 저희 팀이 아니라 마약수사계로 넘어갑니다. 그러면 아드님은 실종자가 아니라 피의자가 될 수도 있어요. 아시죠?'),
        CHOICE([
          { label: { c: '말하겠습니다.' }, then: [
            SAY('detective', [], '아버님, 그 얘기 하시는 순간 제 손을 떠납니다.'),
            CHOICE([
              { label: { c: '그래도 말하겠습니다.' }, then: [
                SAY('detective', [], '…알겠습니다. 기록하겠습니다.'),
                DO(() => G.setFlag('F-03')),
                END(),
              ] },
              { label: { c: '…아닙니다.' }, then: [END()] },
            ]),
          ] },
          { label: { c: '…아닙니다. 됐습니다.' }, then: [END()] },
        ]),
      ] },
      { label: { c: '도현이가 약을 팔았답니다.' }, cond: () => G.has('K-15') && !G.flag('F-03'), then: [
        SAY('detective', [], '…아버님, 그 얘기면 저희 팀이 아니라 마약수사계로 넘어갑니다. 그러면 아드님은 실종자가 아니라 피의자가 될 수도 있어요. 아시죠?'),
        CHOICE([
          { label: { c: '말하겠습니다.' }, then: [
            SAY('detective', [], '아버님, 그 얘기 하시는 순간 제 손을 떠납니다.'),
            CHOICE([
              { label: { c: '그래도 말하겠습니다.' }, then: [
                SAY('detective', [], '…알겠습니다. 기록하겠습니다.'),
                DO(() => { G.setFlag('F-03'); G.setFlag('F-04'); }),
                END(),
              ] },
              { label: { c: '…아닙니다.' }, then: [END()] },
            ]),
          ] },
          { label: { c: '…아닙니다. 됐습니다.' }, then: [END()] },
        ]),
      ] },
      { label: { c: '…알겠습니다.' }, then: [END()] },
    ]),
  ];

  G.defDialogue('HUB.detective', HUB_AGAIN, { onEnd: () => {} });

  window.startS5 = function startS5(mode = 'arrive') {
    const S = G.S;
    if (S.session === 'S05' && S.dlg) return;
    if (G.flag('S05.done')) return;
    S.phase = 'free';
    S.place = 'police';
    S.unlocked = true;
    S.stack = [];
    S.ov = null;
    S.call = null;
    S.phoneUp = false;
    S.travel = null;
    if (S.clock[0] < 11 || (S.clock[0] === 11 && S.clock[1] < 30)) S.clock = [11, 30];
    G.startSession('S05');
    G.setFlag('S05.active');
    G.runDialogue('S05.detective', { channel: 'face', who: 'detective', scene: 'scene_police_office' });
    G.nudge('S05', [
      [90000, () => {
        if (G.S.session !== 'S05' || G.flag('S05.done')) return;
        if (!G.S.dlg) G.addMsg('detective', G.nowMsg('them', '아버님, 더 궁금한 거 있으십니까?'));
      }],
      [450000, () => {
        if (G.S.session !== 'S05' || G.flag('S05.done') || G.S.dlg) return;
        G.startRoute('mart');
      }],
    ]);
  };

  G.defSession('S05', () => window.startS5('jump'));

  G.onArrive('police', () => {
    if (G.flag('S05.done')) {
      if (!G.S.dlg) G.runDialogue('HUB.detective', { channel: 'face', who: 'detective', scene: 'scene_police_office' });
      return;
    }
    window.startS5('arrive');
  });

  G.onDialContact('detective', () => {
    const S = G.S;
    if (!G.flag('S05.done')) return false;
    if (S.dlg) return true;
    G.runDialogue('HUB.detective', { channel: 'call', who: 'detective', opening: '여보세요. 김태윤입니다.' });
    return true;
  });

  G.onThreadOpen('detective', () => {
    if (G.flag('S05.kx11Sent') && !G.has('KX-11')) G.grant('KX-11');
  });
})();
