/* 설정 — 참고 앱. 설계: design/03-features/SETTINGS_SPECIFICATION.md 8~9절, SCREEN_SPECIFICATIONS_SNS_SETTINGS.md SCR-SET-* */
(function () {
  'use strict';
  const LM = window.LM, h = LM.h, ui = LM.ui;

  const D = {
    devices: [
      { name: '도현의 폰', model: '이 기기', last: '지금' },
      { name: '도현의 슬레이트', model: '슬레이트 9(2021) · 셀룰러 없음(Wi-Fi 전용)', last: () => (LM.online() ? '방금 전' : '3월 15일') },
    ],
    sync: [
      ['사진', true], ['메모', true], ['미리 알림', true], ['메일', true, '메일 계정은 메일 앱에서 관리'], ['톡 백업', true],
      ['음성 메모', false], ['키보드 사전', true], ['지도·웨이브·날씨', true], ['스크린 타임(기기 간 공유)', true],
    ],
    wifi: [
      { ssid: 'seongwon_home', first: '2021', last: '3/14 18:50' },
      { ssid: 'HANSEO_FREE', first: '3/2', last: '3/13' },
      { ssid: 'RV1203', first: '1/9 13:05', last: '3/14 20:11~20:52' },
      { ssid: 'CHEONGUN_3F', first: '3/1 14:02', last: '3/1 14:40' },
      { ssid: 'HAEDAM_2F', first: '3/15 10:34 · 다른 기기에서 추가됨', last: '—', onlineOnly: true },
    ],
    clipboard: ((LM.C.keyboard && LM.C.keyboard.clipboard) || []).map((x) => [x.v, x.t]),
    replace: (LM.C.keyboard && LM.C.keyboard.replace) || [],
    places: [['리버뷰타워', '17회 · 1/9~3/14, 화·금'], ['한서대학교', '9회'], ['청운고시원 일대', '1회 · 3/1']],
    privacy: [['음성 메모', '마이크 3/14 20:09~20:51'], ['카메라', '카메라 3/14 20:02'], ['바로택시', '위치 3/14 21:04~21:22'], ['웨이브', '접속 도메인: side.money.kr, cheongun-gosiwon.kr, police.go'], ['블링크', '네트워크 3/14 18:40, 21:30']],
    nearby: [['받음', '민석의 폰', '1/20 14:12', '교육자료.pdf'], ['보냄', '서아의 폰', '2025.12.24', '사진 4장'], ['받음', '지훈', '2025.11.02', '동영상 1']],
    battery: [['음성 메모', '백그라운드 42분'], ['바로택시', '17분'], ['지도', '3분']],
    logins: [['loop.kr', 'dohyun.lee', ''], ['loop.kr', 'dontknow__ · dk.nowhere@mailbox.kr', '이 암호는 다른 기기에서 3/15 01:10에 변경되었습니다'], ['goodjob-work.kr', 'dk.nowhere@mailbox.kr', ''], ['hankki', 'dohyun.lee0921@cirrus.kr', ''], ['cheongun-gosiwon.kr', 'dohyun.lee0921@cirrus.kr', '']],
    notifApps: ['blink', 'loop', 'talk', 'msg', 'mail', 'bank', 'tube', 'market', 'portal'],
  };
  const previewName = { always: '항상', unlocked: '잠금 해제 시', off: '안 함' };

  LM.register({ id: 'set', render(app) { app.start((nav) => root(nav)); } });

  const kv = (k, v) => h('div', { class: 'kv' }, h('span', { class: 'kv-k' }, k), h('span', { class: 'kv-v' }, v));
  const tile = (id) => LM.appIcon(id, 30);
  const sub = (nav, title, body, back) => ui.page({ title, back: back || '설정', nav, large: false, grouped: true, class: 'grouped-bg', body });

  function root(nav) {
    const s = LM.state;
    return ui.page({
      title: '설정', grouped: true, class: 'grouped-bg', search: '검색',
      body: [
        ui.group({ rows: [ui.row({ avatar: '이도현', avatarSize: 58, title: '이도현', subtitle: '시러스 ID, 동기화, 가족', class: 'set-me', onClick: () => nav.push(() => cirrus(nav)) })] }),
        ui.group({ rows: [
          ui.row({ title: '비행기 모드', icon: 'plane', iconBg: '#F09A37', toggle: { on: s.airplane, onChange: (v) => LM.set({ airplane: v }) } }),
          ui.row({ title: 'Wi-Fi', icon: 'wifi', iconBg: '#3A82F7', value: s.wifi && !s.airplane ? 'seongwon_home' : '끔', onClick: () => nav.push(() => wifi(nav)) }),
          ui.row({ title: '셀룰러', icon: 'signal', iconBg: '#3DC373', value: '분실 정지', onClick: () => nav.push(() => cellular(nav)) }),
          ui.row({ title: '개인용 핫스팟', icon: 'link', iconBg: '#3DC373', value: '끔', onClick: () => nav.push(() => hotspot(nav)) }),
        ] }),
        ui.group({ rows: [
          ui.row({ title: '알림', icon: 'bell', iconBg: '#E5484D', onClick: () => nav.push(() => notifs(nav)) }),
          ui.row({ title: '집중 모드', icon: 'moon', iconBg: '#6A5ACD', value: s.dnd ? '방해 금지' : '', onClick: () => nav.push(() => focus(nav)) }),
          ui.row({ title: '스크린 타임', icon: 'timer', iconBg: '#6A5ACD', onClick: () => nav.push(() => screenTime(nav)) }),
        ] }),
        ui.group({ rows: [
          ui.row({ title: '일반', icon: 'gear', iconBg: '#8E8E93', onClick: () => nav.push(() => general(nav)) }),
          ui.row({ title: '손쉬운 사용', icon: 'accessibility', iconBg: '#3A82F7', onClick: () => nav.push(() => a11y(nav)) }),
          ui.row({ title: '디스플레이·배경화면·소리', icon: 'sun', iconBg: '#3A82F7', onClick: () => nav.push(() => display(nav)) }),
          ui.row({ title: '키보드', icon: 'text', iconBg: '#8E8E93', onClick: () => nav.push(() => keyboard(nav)) }),
          ui.row({ title: '배터리', icon: 'battery', iconBg: '#3DC373', onClick: () => nav.push(() => battery(nav)) }),
          ui.row({ title: '개인정보 보호', icon: 'hand', iconBg: '#3A82F7', onClick: () => nav.push(() => privacy(nav)) }),
        ] }),
        ui.group({ rows: [ui.row({ title: '암호', icon: 'key', iconBg: '#8E8E93', onClick: () => nav.push(() => passwords(nav)) })] }),
      ],
    });
  }

  function cirrus(nav) {
    LM.C.see('E-76');
    return sub(nav, '시러스 ID', [
      h('div', { class: 'set-hero' }, ui.avatar('이도현', 84), h('div', { class: 'set-hero-n' }, '이도현'), h('div', { class: 'set-hero-s' }, 'dohyun.lee0921@cirrus.kr')),
      ui.group({ rows: [
        ui.row({ title: '암호 및 보안', onClick: () => nav.push(() => security(nav)) }),
        ui.row({ title: '동기화', onClick: () => nav.push(() => sync(nav)) }),
        ui.row({ title: '가족', value: '2명', onClick: () => nav.push(() => family(nav)) }),
      ] }),
      ui.group({ header: '기기', rows: D.devices.map((d) => ui.row({ title: d.name, subtitle: d.model, icon: 'devices', onClick: () => nav.push(() => device(nav, d)) })) }),
    ]);
  }

  function device(nav, d) {
    const last = typeof d.last === 'function' ? d.last() : d.last;
    return sub(nav, d.name, [
      ui.group({ rows: [kv('모델', d.model), kv('마지막 활동', last)] }),
      d.model === '이 기기' ? null : ui.group({ rows: [ui.row({ title: '이 기기에서 제거', destructive: true, onClick: () => ui.actionSheet({ title: d.name + '을(를) 계정에서 제거할까요?', text: '이 기기는 시러스 ID에서 로그아웃됩니다.', actions: [{ label: '제거', destructive: true, onClick: () => { LM.ev.removeDevice(); ui.toast('기기를 제거했다'); } }] }) })] }),
    ], '시러스 ID');
  }

  const DECO_SYNC = { talk: true, keyboard: true, maps: true, screen: true };
  const syncOn = (key) => {
    const g = LM.G && LM.G.sync ? LM.G.sync : {};
    if (['photos', 'notes', 'reminders', 'voice'].indexOf(key) >= 0) return g[key] !== false && (key === 'voice' ? g.voice === true : true);
    return DECO_SYNC[key] !== false;
  };
  function setSync(key, v) {
    if (['photos', 'notes', 'reminders', 'voice'].indexOf(key) >= 0) {
      const before = syncOn(key);
      LM.gset('sync.' + key, v);
      if (key === 'voice' && v && !before && LM.trace) LM.trace('TR-13');
    } else DECO_SYNC[key] = v;
  }
  function sync(nav) {
    LM.C.see('E-204');
    const rows = [
      ['photos', '사진'], ['notes', '메모'], ['reminders', '미리 알림'], ['mail', '메일'],
      ['talk', '톡 백업'], ['voice', '음성 메모'], ['keyboard', '키보드 사전'],
      ['maps', '지도·웨이브·날씨'], ['screen', '스크린 타임(기기 간 공유)'],
    ].map(([key, label]) => {
      if (key === 'mail') return ui.row({ title: label, value: '켬', onClick: () => ui.toast('메일 계정은 메일 앱에서 관리') });
      return ui.row({ title: label, toggle: { on: syncOn(key), onChange: (v) => setSync(key, v) } });
    });
    return sub(nav, '동기화', [
      ui.group({ header: '시러스를 사용하는 앱', footer: '끄면 이 폰과 다른 기기 사이의 변경이 더 이상 오가지 않는다.', rows }),
    ], '시러스 ID');
  }


  function security(nav) {
    return sub(nav, '암호 및 보안', [
      ui.group({ rows: [ui.row({ title: '암호 변경', action: true, onClick: () => ui.alert({ title: '암호를 변경할까요?', text: '다른 기기는 모두 로그아웃됩니다.', actions: [{ label: '취소', cancel: true }, { label: '변경', destructive: true, onClick: () => { LM.ev.changeCirrusPassword(); ui.toast('암호를 변경했다'); } }] }) })] }),
      ui.group({ header: '2단계 인증', rows: [kv('신뢰하는 번호', '010-XXXX-0921 · 정지됨'), kv('신뢰 기기', '도현의 폰, 도현의 슬레이트')] }),
    ], '시러스 ID');
  }

  function family(nav) {
    LM.C.see('E-200');
    return sub(nav, '가족', [
      ui.group({ rows: [ui.row({ title: '이상철', subtitle: '아빠 · 관리자', avatar: '이상철' }), ui.row({ title: '이도현', subtitle: '나', avatar: '이도현' })] }),
      ui.group({ header: '위치 공유', rows: [kv('아빠와 위치 공유', '중지 · 2026년 1월 9일'), ui.row({ title: '위치 공유 요청 보내기', action: true, onClick: () => { if (!LM.online()) { ui.toast('오프라인 상태라 보낼 수 없다'); return; } if (LM.G && LM.G.npc && Number(LM.G.npc.DH) === 4) { LM.G.world = LM.G.world || {}; LM.G.world.locShared = true; LM.emit('locShared', {}); } if (LM.trace) LM.trace('TR-16'); ui.toast('도현의 슬레이트로 요청을 보냈다'); } })] }),
    ], '시러스 ID');
  }

  function wifi(nav) {
    const list = h('div');
    const draw = () => {
      const on = LM.state.wifi && !LM.state.airplane;
      list.replaceChildren(
        ui.group({ rows: [ui.row({ title: 'Wi-Fi', toggle: { on, onChange: (v) => { LM.set({ wifi: v }); draw(); } } }), on ? ui.row({ title: 'seongwon_home', lead: LM.icon('check', 'row-check'), accessory: LM.icon('wifi') }) : null] }),
        ui.group({ header: '알려진 네트워크', footer: on ? null : '일부 네트워크는 온라인이 되어야 동기화된다.', rows: D.wifi.filter((w) => !w.onlineOnly || LM.online()).map((w) => ui.row({ title: w.ssid, accessory: h('button', { class: 'nb-btn', 'aria-label': w.ssid + ' 정보', onclick: (e) => { e.stopPropagation(); if (w.ssid === 'HAEDAM_2F') LM.C.see('E-74'); ui.info(w.ssid, [['처음 연결', w.first], ['마지막 연결', w.last]]); } }, LM.icon('info')) })) }));
    };
    draw();
    const off = LM.on('state', () => list.isConnected && draw());
    return sub(nav, 'Wi-Fi', list);
  }

  function cellular(nav) {
    return sub(nav, '셀룰러', [
      ui.group({ rows: [kv('SIM', '온통신'), kv('상태', '분실 정지(3/15 09:10)'), kv('셀룰러 데이터', '사용 불가')] }),
      ui.group({ header: '앱별 셀룰러 데이터(지난 기간)', rows: [['loop', '루프'], ['talk', '톡'], ['blink', '블링크'], ['taxi', '바로택시'], ['voice', '음성 메모']].map(([id, n]) => ui.row({ title: n, lead: tile(id), value: id === 'voice' ? '0바이트' : '' })) }),
    ]);
  }

  function hotspot(nav) {
    LM.C.see('E-199');
    return sub(nav, '개인용 핫스팟', [
      ui.group({ rows: [ui.row({ title: '다른 사람의 연결 허용', toggle: { on: false } })] }),
      ui.group({ header: '연결했던 기기', rows: [ui.row({ title: '도현의 슬레이트', subtitle: '3/2~3/14 평일 아침·저녁 · 마지막 3/14 19:35', icon: 'devices' })] }),
    ]);
  }

  function notifs(nav) {
    return sub(nav, '알림', [
      ui.group({ header: '알림 스타일', rows: D.notifApps.map((id) => ui.row({ title: LM.APPS[id], lead: tile(id), subtitle: '미리보기: ' + previewName[pv(id)], onClick: () => nav.push(() => notifApp(nav, id)) })) }),
    ]);
  }
  function pv(id) { return id === 'blink' ? LM.state.preview.blink : id === 'loop' ? LM.state.preview.loopdm : 'unlocked'; }
  function notifApp(nav, id) {
    if (id === 'blink' || id === 'loop') LM.C.see('E-202');
    const body = h('div');
    const draw = () => body.replaceChildren(
      ui.group({ rows: [ui.row({ title: '알림 허용', toggle: { on: true } }), ui.row({ title: '배너', toggle: { on: true } })] }),
      ui.group({ header: '미리보기 표시', rows: ['always', 'unlocked', 'off'].map((k) => ui.row({ title: previewName[k], check: pv(id) === k, onClick: () => { if (id === 'blink' || id === 'loop') { const p = Object.assign({}, LM.state.preview); p[id === 'blink' ? 'blink' : 'loopdm'] = k; LM.set({ preview: p }); } draw(); } })) }));
    draw();
    return sub(nav, LM.APPS[id], body, '알림');
  }

  const focusShared = () => (LM.G && LM.G.device ? LM.G.device.focusShare !== false : true);
  function focus(nav) {
    LM.C.see('E-203');
    const body = h('div');
    const draw = () => body.replaceChildren(
      ui.group({ rows: [ui.row({ title: '방해 금지', icon: 'moon', iconBg: '#6A5ACD', toggle: { on: LM.state.dnd, onChange: (v) => { LM.set({ dnd: v }); if (!v && focusShared() && LM.trace) LM.trace('TR-12'); } } })], footer: '다른 기기에서 켬 · 도현의 슬레이트 · 3/15 00:21' }),
      ui.group({ rows: [ui.row({ title: '기기 간 공유', toggle: { on: focusShared(), onChange: (v) => { LM.gset('device.focusShare', v); draw(); } } })], footer: '한 기기에서 집중 모드를 켜거나 끄면 다른 기기에도 적용된다.' }));
    draw();
    return sub(nav, '집중 모드', body);
  }

  function screenTime(nav) {
    LM.C.see('E-193');
    if (LM.online()) LM.C.see('E-194');
    const bars = [['00', 0], ['03', 82], ['06', 0], ['09', 24], ['12', 30], ['15', 18], ['18', 64], ['21', 22]];
    const max = 82;
    const chart = h('div', { class: 'set-chart', role: 'img', 'aria-label': '시간대별 사용 시간 막대' }, bars.map(([t, v]) => h('div', { class: 'set-bar' }, h('i', { style: { height: Math.max(2, (v / max) * 100) + '%' } }), h('span', null, t))));
    let mode = '이 폰';
    const body = h('div');
    const draw = () => body.replaceChildren(
      ui.segmented(['이 폰', '도현의 슬레이트'], mode, (m) => { mode = m; draw(); }),
      mode === '이 폰'
        ? [ui.group({ header: '3월 9일', rows: [h('div', { class: 'set-chart-wrap' }, chart)] }),
          ui.group({ header: '3/9 03:00~05:00', rows: [['loop', '38분'], ['wave', '22분'], ['moa', '15분'], ['note', '4분'], ['calc', '3분']].map(([id, v]) => ui.row({ title: LM.APPS[id], lead: tile(id), value: v })) }),
          ui.group({ header: '3/14', rows: [ui.row({ title: '18:00~19:00', value: '웨이브·미리 알림·블링크' }), ui.row({ title: '20:09~20:51', value: '화면 꺼짐' }), ui.row({ title: '20:52', value: '지도 1분' }), ui.row({ title: '21:05~21:22', value: '루프 4분' })] }),
          ui.group({ header: '웹사이트', rows: [['side.money.kr', '3/11'], ['cheongun-gosiwon.kr', '2/24'], ['police.go', '3/13']].map(([a, b]) => ui.row({ title: a, value: b })) })]
        : (LM.online()
          ? ui.group({ header: '기기 간 공유', rows: [ui.row({ title: '3/15 01:00', value: '루프 6분' }), ui.row({ title: '3/15 08:40~09:40', value: '웨이브·지도·메일·바로택시' }), ui.row({ title: '3/15 13:00', value: '한끼 3분' }), ui.row({ title: '3/16 22:30~23:20', value: '한서 포털·웨이브·메일' }), ui.row({ title: '3/17 02:00~03:00', value: '웨이브 40분' })]
            .concat(LM.G && LM.G.world && LM.G.world.slateWave ? [ui.row({ title: '3/18 00:40', value: '웨이브' })] : [])
            .concat(LM.ev && LM.ev.moved && LM.ev.moved() ? [ui.row({ title: '3/18', value: '성원스파 · 지도' })] : []) })
          : ui.empty({ icon: 'devices', title: '다른 기기 데이터 없음', text: '온라인이 되면 기기 간 공유 데이터를 불러온다.' })));
    draw();
    return sub(nav, '스크린 타임', body);
  }

  function general(nav) {
    return sub(nav, '일반', [
      ui.group({ rows: [
        ui.row({ title: '정보', onClick: () => nav.push(() => sub(nav, '정보', ui.group({ rows: [kv('이름', '도현의 폰'), kv('시러스 계정', 'dohyun.lee0921@cirrus.kr')] }), '일반')) }),
        ui.row({ title: '근처 공유', onClick: () => nav.push(() => nearby(nav)) }),
        ui.row({ title: '저장 공간', onClick: () => nav.push(() => storage(nav)) }),
      ] }),
    ]);
  }
  function nearby(nav) {
    LM.C.see('E-197');
    return sub(nav, '근처 공유', [
      ui.group({ header: '받기', rows: ['끔', '연락처만', '모든 사람(10분)'].map((v) => ui.row({ title: v, check: v === '연락처만' })) }),
      ui.group({ header: '최근 주고받음', rows: D.nearby.map(([dir, dev, t, what]) => ui.row({ title: dev, subtitle: dir + ' · ' + what, meta: LM.fmt.list(t), icon: dir === '받음' ? 'download' : 'upload' })) }),
    ], '일반');
  }
  function storage(nav) {
    LM.C.see('E-196');
    const used = [['사진', 4.2, '#F09A37'], ['음성 메모', 0.5, '#E5484D'], ['앱', 9.8, '#3A82F7'], ['시스템', 7.1, '#8E8E93']];
    const total = 64;
    return sub(nav, '저장 공간', [
      ui.group({ rows: [h('div', { class: 'set-storage' }, h('div', { class: 'set-storage-t' }, '64GB 중 21.6GB 사용'), h('div', { class: 'set-storage-bar' }, used.map(([, v, c]) => h('i', { style: { width: (v / total) * 100 + '%', background: c } }))))] }),
      ui.group({ rows: [ui.row({ title: '음성 메모', lead: tile('voice'), value: '512MB', subtitle: '새로운 녹음 37 · 41MB · 시러스에 없음' }), ui.row({ title: '사진', lead: tile('photo'), value: '4.2GB', subtitle: '시러스에 있음' })] }),
    ], '일반');
  }

  function a11y(nav) {
    return sub(nav, '손쉬운 사용', [
      ui.group({ header: '듣기', rows: [ui.row({ title: '음성 메모 전사', toggle: { on: !!LM.state.transcribe, onChange: (v) => LM.set({ transcribe: v }) } }), ui.row({ title: '자막 항상 켜기', toggle: { on: false } }), ui.row({ title: '자막(튜브)', toggle: { on: true } })], footer: '음성 메모 전사를 켜면 녹음 전체를 받아쓰고 그 안을 검색할 수 있다.' }),
      ui.group({ header: '동작', rows: [ui.row({ title: '동작 줄이기', toggle: { on: LM.state.reduceMotion, onChange: (v) => LM.set({ reduceMotion: v }) } })] }),
    ]);
  }

  function display(nav) {
    const body = h('div');
    const sizes = [['xs', '작게'], ['md', '기본'], ['lg', '크게'], ['xl', '아주 크게']];
    const draw = () => body.replaceChildren(
      ui.group({ header: '화면 모드', rows: h('div', { class: 'set-modes' }, [['dark', '다크'], ['light', '라이트']].map(([k, n]) => h('button', { class: 'set-mode' + (LM.state.theme === k ? ' on' : ''), 'aria-pressed': LM.state.theme === k, onclick: () => { LM.set({ theme: k }); draw(); } }, h('span', { class: 'set-mode-pv ' + k }, h('i'), h('i'), h('i')), h('span', null, n), h('span', { class: 'set-radio' }, LM.state.theme === k ? LM.icon('check') : null)))) }),
      ui.group({ header: '글자 크기', rows: sizes.map(([k, n]) => ui.row({ title: n, check: LM.state.textSize === k, onClick: () => { LM.set({ textSize: k }); draw(); } })) }),
      ui.group({ header: '배경화면', rows: [ui.row({ title: '2019년 가족사진', subtitle: '잠금화면과 홈에 같은 사진', lead: h('span', { class: 'set-wall' }) })] }));
    draw();
    return sub(nav, '디스플레이·배경화면·소리', body);
  }

  function keyboard(nav) {
    LM.C.see('E-180', 'E-198');
    LM.setEid('E-198');
    return sub(nav, '키보드', [
      ui.group({ header: '클립보드 기록', rows: D.clipboard.map(([v, t]) => ui.row({ title: v, meta: t ? LM.fmt.list(t) : '', onLong: () => ui.contextMenu([{ label: '복사', onClick: () => ui.toast('복사됨') }], v), onClick: () => ui.toast('복사됨') })) }),
      ui.group({ header: '텍스트 대치', footer: LM.online() ? null : '다른 기기에서 만든 대치는 온라인이 되면 동기화된다.', rows: D.replace.filter((r) => !r.onlineOnly || LM.online()).map((r) => ui.row({ title: r.k, subtitle: r.v, meta: r.from })) }),
    ]);
  }

  function battery(nav) {
    LM.C.see('E-195');
    return sub(nav, '배터리', [
      ui.group({ rows: [kv('배터리 잔량', '31% · 충전 중'), kv('마지막 방전', '3/15 03:58 · 0%, 전원 꺼짐')] }),
      ui.group({ header: '최근 10일 앱별 사용', rows: D.battery.map(([n, v]) => ui.row({ title: n, value: v })) }),
    ]);
  }

  function privacy(nav) {
    return sub(nav, '개인정보 보호', [
      ui.group({ rows: [
        ui.row({ title: '위치 서비스', value: '켬', onClick: () => { LM.C.see('E-75'); nav.push(() => sub(nav, '중요 위치', ui.group({ header: '중요 위치', rows: D.places.map(([a, b]) => ui.row({ title: a, subtitle: b, icon: 'pin' })) }), '개인정보 보호')); } }),
        ui.row({ title: '앱 개인정보 보고서', onClick: () => { LM.C.see('E-192'); nav.push(() => sub(nav, '앱 개인정보 보고서', ui.group({ header: '최근 7일 · 3/9~3/15 03:58', rows: D.privacy.map(([a, b]) => ui.row({ title: a, subtitle: b })) }), '개인정보 보호')); } }),
      ] }),
    ]);
  }

  function passwords(nav) {
    LM.C.see('E-201');
    return sub(nav, '암호', [
      ui.notice('열 때 기기 암호가 필요하다.'),
      ui.group({ header: '저장된 로그인', rows: D.logins.map(([site, acc, note]) => ui.row({ title: site, subtitle: acc + (note ? ' · ' + note : ''), icon: 'key', onClick: () => ui.info(site, [['계정', acc], ['암호', '••••••••'], ['비고', note || '—']]) })) }),
    ]);
  }

  LM.searchSources.push({ app: 'set', items: () => [
    ...D.wifi.filter((w) => !w.onlineOnly || LM.online()).map((w) => ({ title: 'Wi-Fi · ' + w.ssid, sub: '마지막 연결 ' + w.last, text: w.ssid })),
    ...D.clipboard.map(([v]) => ({ title: '클립보드', sub: v, text: v })),
    ...['알림', '집중 모드', '스크린 타임', '키보드', '배터리', '개인정보 보호', '손쉬운 사용', '동기화', '근처 공유'].map((n) => ({ title: n, sub: '설정', text: n })),
  ] });
})();
