(function () {
  const G = window.__game || window.DK;
  if (!G) return;

  const SAY = G.SAY;
  const CHOICE = G.CHOICE;
  const DO = G.DO;
  const MONO = G.MONO;
  const GOTO = G.GOTO;
  const LABEL = G.LABEL;
  const END = G.END;

  const DEAD = '전원이 꺼져 있거나 신호가 없는 곳에 있을 수 있습니다.';

  function ensureJunhoThread() {
    if (G.S.v.s7_threadReady) return;
    G.S.v.s7_threadReady = true;
    const n = Number(G.S.v.s7_dialCount) || 0;
    G.addMsg('junho', { from: 'sys', text: `부재중 전화 ${n}건` }, { banner: false });
  }

  function deadCall(text, ms) {
    const S = G.S;
    G.clearGroup('S07.call');
    S.call = { kind: 'dead', name: '103호', state: 'ring', since: Date.now(), lines: [], deadText: text };
    S.ov = { type: 'call' };
    G.refresh();
    G.later(ms, () => {
      if (S.call && S.call.kind === 'dead') {
        S.call.state = 'dead';
        G.refresh();
      }
    }, 'S07.call');
  }

  function startS7() {
    const S = G.S;
    if (G.flag('S07.active') || G.flag('S07.ended')) return;
    G.setFlag('S07.active');
    S.phase = 'free';
    S.unlocked = true;
    if (S.clock[0] < 14) S.clock = [14, 0];
    G.startSession('S07');
    G.nudge('S07', [
      [90000, () => {
        if (G.S.session !== 'S07' || G.flag('S07.ended') || G.flag('S07.choiceShown')) return;
        G.addMsg('jihoon', G.nowMsg('them', '준호 걔 전화 잘 안 받아요 문자로 해보세요'));
      }],
      [180000, () => {
        if (G.S.session !== 'S07' || G.flag('S07.ended') || G.flag('S07.choiceShown')) return;
        G.showMono('준호.');
      }],
      [450000, () => {
        if (G.S.session !== 'S07' || G.flag('S07.ended')) return;
        if (G.flag('S07.choiceShown')) return;
        openSmsChoice();
      }],
    ]);
  }

  function openSmsChoice() {
    const S = G.S;
    if (G.flag('S07.ended') || G.flag('F-02') || G.flag('F-02b')) return;
    if (S.dlg && S.dlg.id === 'S07.junho.sms') return;
    if (S.dlg && S.dlg.channel !== 'sms') return;
    if (S.ov) return;
    ensureJunhoThread();
    const top = S.stack[S.stack.length - 1];
    if (!(top && top.app === 'msg' && top.id === 'junho')) G.openThread('junho');
    G.setFlag('S07.choiceShown');
    G.runDialogue('S07.junho.sms', { channel: 'sms', who: 'junho' });
  }

  function ringJunho(retry) {
    const S = G.S;
    if (S.session !== 'S07' || G.flag('S07.ended') || G.flag('S07.callDone')) return;
    if (S.dlg && (S.dlg.channel === 'face' || S.dlg.channel === 'intercom')) {
      G.schedule('EV.S07.01.defer', 5000, () => ringJunho(retry), {
        cond: () => !G.flag('S07.ended') && !G.flag('S07.callDone'),
      });
      return;
    }
    if (S.ov) return;
    S.v.s7_incoming = true;
    S.ov = { type: 'incoming', name: '103호', from: 'junho' };
    G.refresh();
    if (!retry) {
      G.schedule('EV.S07.01.retry', 16000, () => {
        if (G.flag('S07.ended') || G.flag('S07.callDone')) return;
        if (!G.S.ov && !G.S.dlg) ringJunho(true);
      }, { cond: () => !G.flag('S07.ended') && !G.flag('S07.callDone') });
    }
  }

  function scheduleCallback() {
    G.schedule('EV.S07.01', 45000, () => ringJunho(false), {
      gameMin: 3,
      cond: () => G.S.session === 'S07' && !G.flag('S07.ended') && !G.flag('S07.callDone'),
    });
  }

  function startJunhoSmsB() {
    const S = G.S;
    if (G.flag('S07.ended')) return;
    if (S.dlg || S.ov) {
      G.schedule('EV.S07.02.defer', 5000, startJunhoSmsB, {
        cond: () => G.S.session === 'S07' && !G.flag('S07.ended'),
      });
      return;
    }
    ensureJunhoThread();
    const top = S.stack[S.stack.length - 1];
    if (!(top && top.app === 'msg' && top.id === 'junho')) G.openThread('junho');
    G.runDialogue('S07.junho.sms.b', { channel: 'sms', who: 'junho' });
  }

  function schedulePromise() {
    G.schedule('EV.S07.02', 20000, startJunhoSmsB, {
      gameMin: 1,
      cond: () => G.S.session === 'S07' && !G.flag('S07.ended'),
    });
  }

  function finishCall() {
    const S = G.S;
    if (G.flag('S07.callDone')) return;
    G.setFlag('S07.callDone');
    G.setFlag('S07.callAccepted');
    S.ov = null;
    S.call = null;
    finishS7('A');
  }

  function finishS7(path) {
    const S = G.S;
    if (G.flag('S07.ended')) return;
    G.setFlag('S07.ended');
    G.setFlag('S07.done');
    G.setFlag('S07.path.' + path);
    G.cancelNudge('S07');
    G.clearGroup('S07.call');
    G.clearGroup('S07.dial');
    S.call = null;
    S.ov = null;
    G.endSession('S07');
    G.refresh();
    if (typeof window.armS8Home === 'function') window.armS8Home();
  }

  G.defDialogue('S07.junho.sms', [
    CHOICE([
      {
        label: { m: '준호야 아저씨 경찰에 신고했다. 계속 연락 안 받으면 너도 조사받게 된다' },
        then: [
          DO(() => {
            G.setFlag('F-02');
            G.setFlag('S07.optionA');
            scheduleCallback();
          }),
          END(),
        ],
      },
      {
        label: { m: '준호야. 아저씨 너 탓하려는 거 아니다. 도현이만 찾게 좀 도와줘. 약속할게' },
        then: [
          DO(() => {
            G.setFlag('F-02b');
            G.setFlag('S07.optionB');
            schedulePromise();
          }),
          END(),
        ],
      },
    ]),
  ]);

  G.defDialogue('S07.junho.call', [
    SAY('junho', [], '…여보세요.'),
    SAY('junho', [], '저… 저 진짜 아무것도 몰라요.'),
    CHOICE([
      {
        label: { c: '괜찮아. 말해 봐. 안 혼낸다.' },
        then: [GOTO('noYujin')],
      },
      {
        label: { c: '유진이라는 애가 네 얘기를 하던데.' },
        cond: () => G.has('K-08'),
        then: [
          SAY('junho', [], '유진 누나 말 믿지 마세요. 그 누나 무서운 사람이에요.', { kn: 'K-14' }),
          SAY('junho', [], '저 중3 때부터… 아, 아니에요.', { kx: 'KX-07' }),
          MONO('중3?'),
          GOTO('dawn'),
        ],
      },
      { label: { c: '…' }, then: [GOTO('noYujin')] },
    ]),
    LABEL('noYujin'),
    SAY('junho', [], '저는 시키는 대로만 한 거예요. …15일 새벽에 누가…', { kn: 'K-13' }),
    SAY('junho', [], '유진 누나… 조심하세요.', { kn: 'K-14' }),
    END(),
    LABEL('dawn'),
    SAY('junho', [], '15일 새벽에 누가 저희 집 문을 막 두드렸어요.', { kn: 'K-13' }),
    SAY('junho', [], '입 다물고 있으라고요. 엄마 깼으면 진짜…'),
    END(),
  ], { onEnd: finishCall });

  G.defDialogue('S07.junho.sms.b', [
    SAY('junho', ['아저씨 저 진짜몰라요'], ''),
    SAY('junho', ['제발'], ''),
    SAY('junho', ['엄마한테는 말하지마세요'], ''),
    CHOICE([
      { label: { m: '안 한다. 약속했잖아' } },
      { label: { m: '…' } },
    ]),
    SAY('junho', ['새벽에 누가 왓어요'], ''),
    SAY('junho', ['문앞에'], ''),
    SAY('junho', ['입다물라고'], '', { kn: 'K-13' }),
    SAY('junho', ['유진누나 조심하세요'], '', { kn: 'K-14' }),
    SAY('junho', ['지금은 말 못해요 나중에요'], ''),
    END(),
  ], { onEnd: () => finishS7('B') });

  G.onDialContact('junho', () => {
    const S = G.S;
    if (G.flag('S07.ended')) return false;
    if (!G.flag('S06.done') || !G.has('KX-03')) return false;
    if (!G.flag('S07.active')) startS7();
    const n = (Number(S.v.s7_dialCount) || 0) + 1;
    S.v.s7_dialCount = n;
    if (n === 1) {
      deadCall('신호가 끊겼습니다.', 6000);
    } else {
      deadCall(DEAD, 1200);
      G.later(1800, () => {
        G.endCall();
        if (!G.flag('S07.choiceShown') && !G.flag('S07.ended')) openSmsChoice();
      }, 'S07.dial');
    }
    return true;
  });

  G.onAccept(() => {
    const S = G.S;
    if (S.session === 'S07' && S.v.s7_incoming) {
      S.v.s7_incoming = false;
      S.ov = null;
      G.cancelScheduled('EV.S07.01.retry');
      G.setFlag('S07.callAccepted');
      G.runDialogue('S07.junho.call', { channel: 'call', who: 'junho' });
      return true;
    }
    return false;
  });

  window.startS7 = startS7;
  G.defSession('S07', () => {
    G.S.place = 'home';
    G.S.clock = [14, 0];
    startS7();
  });
})();
