/* 일시정지 메뉴. 폰 밖에 두는 유일한 게임 UI.
 * 여는 법: 데스크톱 사이드 노트 버튼 / 상태바 시계 1.5초 길게 누르기.
 * 설계: SCREEN_SPECIFICATIONS 3.14~3.17, BUSINESS_RULES BR-34·36 */
(function () {
  'use strict';
  const LM = window.LM;
  const h = LM.h;

  let pauseEl = null;

  function dev() { return document.querySelector('.device'); }

  function fmtGame(ms) {
    const d = new Date(ms);
    return LM.fmtDateTime(d);
  }
  function fmtReal(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function sheet(content, size) {
    return LM.ui.sheet(pauseEl, content, { size: size || 'large' });
  }

  function closeSheet(wrap) { if (wrap && wrap.close) wrap.close(); }

  function openSettings() {
    const ui = LM.ui;
    const sizes = [['xs', '작게'], ['md', '기본'], ['lg', '크게'], ['xl', '아주 크게']];
    const curSize = sizes.find((s) => s[0] === LM.state.textSize) || sizes[1];
    const body = h('div', null,
      ui.group({
        header: '글자 크기',
        rows: h('div', { style: { padding: '4px 0 10px' } },
          ui.segmented(sizes.map((s) => s[1]), curSize[1], (label) => {
            const found = sizes.find((s) => s[1] === label);
            if (found) LM.set({ textSize: found[0] });
          })),
      }),
      ui.group({
        header: '화면',
        rows: [
          ui.row({
            title: '테마', chevron: false,
            accessory: ui.segmented(['다크', '라이트'], LM.state.theme === 'light' ? '라이트' : '다크', (v) => {
              LM.set({ theme: v === '라이트' ? 'light' : 'dark' });
            }),
          }),
          ui.row({
            title: '움직임 줄이기', subtitle: '전환을 짧게 합니다',
            toggle: { on: !!LM.state.reduceMotion, onChange: (v) => LM.set({ reduceMotion: v }) },
            chevron: false,
          }),
        ],
      }),
      h('div', { class: 'grp-f', style: { padding: '0 16px' } }, '설정은 즉시 저장됩니다. 글자 크기는 LUMA 설정 › 디스플레이와 같은 값입니다.')
    );
    const wrap = sheet(ui.sheetPage({ title: '설정', cancel: '닫기', body }), 'large');
    return wrap;
  }

  function slotAction(row) {
    const actions = [];
    if (row.slot !== 'auto') {
      actions.push({
        label: row.exists ? '이 슬롯에 저장' : '이 슬롯에 저장',
        onClick: () => {
          const go = () => { LM.saveGame(row.slot); LM.ui.toast('저장했습니다'); };
          if (row.exists) {
            LM.ui.alert({
              host: pauseEl, title: '덮어쓸까요?', text: '슬롯 ' + row.slot + '의 저장을 지금 상태로 바꿉니다.',
              actions: [{ label: '취소', cancel: true }, { label: '덮어쓰기', destructive: true, onClick: go }],
            });
          } else go();
        },
      });
    } else {
      actions.push({ label: '지금 자동 저장', onClick: () => { LM.saveGame('auto'); LM.ui.toast('자동 저장했습니다'); } });
    }
    if (row.exists) {
      actions.push({
        label: '불러오기',
        onClick: () => {
          LM.ui.alert({
            host: pauseEl, title: '불러올까요?', text: '이 시점으로 돌아갑니다. 지금 상태는 자동 저장에 남습니다.',
            actions: [{ label: '취소', cancel: true }, {
              label: '불러오기', onClick: () => {
                if (LM.loadGame(row.slot)) {
                  closePause();
                  if (LM.refreshShell) LM.refreshShell();
                  LM.ui.toast('불러왔습니다');
                } else LM.ui.toast('불러오지 못했습니다');
              },
            }],
          });
        },
      });
    }
    LM.ui.actionSheet({ host: pauseEl, title: (row.slot === 'auto' ? '자동 저장' : '슬롯 ' + row.slot), actions });
  }

  function openSave() {
    const ui = LM.ui;
    const saves = LM.listSaves();
    const rows = saves.map((row) => {
      const name = row.slot === 'auto' ? '자동 저장' : '슬롯 ' + row.slot;
      let value = '비어 있음';
      let subtitle = '';
      if (row.exists) {
        value = fmtGame(row.gameMs);
        subtitle = (row.summary || '') + (row.savedAt ? ' · 저장 ' + fmtReal(row.savedAt) : '');
      }
      return ui.row({
        title: name, value: value, subtitle: subtitle || null,
        chevron: true, class: 'pause-slot', onClick: () => slotAction(row),
      });
    });
    const wrap = sheet(ui.sheetPage({
      title: '저장·불러오기', cancel: '닫기',
      body: h('div', null,
        ui.group({ header: '게임 저장', rows: rows }),
        h('div', { class: 'grp-f', style: { padding: '0 16px' } }, '자동 저장은 항상 켜져 있습니다. 슬롯은 3개입니다.')),
    }), 'large');
    return wrap;
  }

  function openHint() {
    if (LM.hints && typeof LM.hints.open === 'function') { LM.hints.open(); return; }
    const ui = LM.ui;
    sheet(ui.sheetPage({
      title: '막혔을 때', cancel: '닫기',
      body: h('div', { class: 'pause-hint' },
        h('div', { class: 'pause-hint-step' }, '안내'),
        h('p', null, '힌트는 준비 중입니다.'),
        h('p', { class: 'pause-hint-sub' }, '폰 안에서 직접 찾아야 합니다.')),
    }), 'medium');
  }

  function restart() {
    LM.ui.alert({
      host: pauseEl, title: '처음부터', text: '지금 진행을 버리고 새 게임을 시작합니다. 자동 저장은 새 게임으로 바뀝니다.',
      actions: [{ label: '취소', cancel: true }, {
        label: '새 게임', destructive: true, onClick: () => {
          LM.newGame();
          closePause();
          if (LM.refreshShell) LM.refreshShell();
          if (LM.prologue) LM.prologue.play();
        },
      }],
    });
  }

  function closePause() {
    if (!pauseEl) return;
    const el = pauseEl;
    pauseEl = null;
    el.remove();
    const d = dev();
    if (d) d.classList.remove('paused');
    LM.resume('menu');
    LM.emit('pause:close');
  }

  function open() {
    if (pauseEl) return;
    const d = dev();
    if (!d) return;
    LM.pause('menu');
    d.classList.add('paused');
    pauseEl = h('div', { class: 'pause', role: 'dialog', 'aria-modal': 'true', 'aria-label': '일시정지' },
      h('div', { class: 'pause-title' }, '일시정지'),
      h('div', { class: 'pause-items' },
        h('button', { class: 'pause-item', onclick: closePause }, '계속하기'),
        h('button', { class: 'pause-item', onclick: () => openSave() }, '저장·불러오기'),
        h('button', { class: 'pause-item', onclick: () => openSettings() }, '설정'),
        h('button', { class: 'pause-item', onclick: () => openHint() }, '막혔을 때'),
        h('button', { class: 'pause-item pause-restart', onclick: () => restart() }, '처음부터')));
    d.appendChild(pauseEl);
    LM.emit('pause:open');
  }

  function init() {
    const d = dev();
    if (!d) return;
    // 모바일: 상태바 시계 1.5초 길게 누르기
    const bar = d.querySelector('.statusbar');
    const time = d.querySelector('.sb-time');
    if (bar && time) {
      let timer = null;
      const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
      time.style.pointerEvents = 'auto';
      time.addEventListener('pointerdown', (e) => {
        cancel();
        timer = setTimeout(() => {
          timer = null;
          bar._dragged = true;
          open();
        }, 1500);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => time.addEventListener(ev, cancel));
    }
    // 데스크톱: 사이드 노트 버튼
    const side = document.querySelector('.side-note');
    if (side && !side.querySelector('[data-act="pause"]')) {
      const p = h('p', null, h('button', { 'data-act': 'pause', onclick: open }, '일시정지'));
      side.insertBefore(p, side.querySelector('p') || null);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (pauseEl) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.closest && e.target.closest('input, textarea')) return;
        const topSheet = pauseEl.querySelector('.sheet-wrap');
        if (topSheet && topSheet.close) { topSheet.close(); return; }
        closePause();
        return;
      }
      // 데스크톱: 앱·시트 없이 홈/잠금화면에 있을 때 Esc = 일시정지
      const d = dev();
      const busy = d && d.querySelector('.sheet-wrap, .as-wrap, .al-wrap, .passcode, .appwin');
      const cur = LM.current && LM.current();
      if (busy || cur || LM.state.locked) return;
      e.preventDefault();
      e.stopPropagation();
      open();
    }, true);
  }

  LM.pauseUI = { open: open, close: closePause, init: init, isOpen: () => !!pauseEl };
})();
