/* 아이콘: 손으로 그린 SVG 코드(래스터 생성 없음). 설계: design/02-design/ICONOGRAPHY_AND_IMAGERY.md
 * 앱 글리프 = 24 격자, 흰 모노라인 2px + 채운 강조 하나. 타일 = 단색 슈퍼타원(그라디언트·광택 없음). */
(function () {
  'use strict';
  const LM = window.LM;
  const S = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const F = 'fill="currentColor" stroke="none"';

  /* 앱 글리프(30). 강조(F)는 하나만 */
  const APP = {
    // 직사각 폰 옆면 + 음파 두 줄, 음파 끝 점
    phone: `<rect x="5" y="3.5" width="8" height="17" rx="2"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/><circle cx="18.5" cy="17.5" r="1.3" ${F}/>`,
    // 모서리 하나가 각진 말풍선, 안에 점 1
    msg: `<path d="M4 18.5V7a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 7v7.5a2.5 2.5 0 0 1-2.5 2.5H8z"/><circle cx="12" cy="10.8" r="1.4" ${F}/>`,
    // 두 말풍선 겹침(뒤는 선만), 앞 채움
    talk: `<path d="M9 4h9.5A2.5 2.5 0 0 1 21 6.5v5a2.5 2.5 0 0 1-2.5 2.5H18v2.5L15 14"/><path d="M5.5 8.5h8A2.5 2.5 0 0 1 16 11v4.5a2.5 2.5 0 0 1-2.5 2.5H9l-3.5 2.5V18A2.5 2.5 0 0 1 3 15.5V11a2.5 2.5 0 0 1 2.5-2.5z" ${F}/>`,
    // 끊긴 원(끝이 살짝 겹친 고리) + 고리 끝 점
    loop: `<path d="M17.8 7.2A7.5 7.5 0 1 0 19.5 12"/><path d="M15.5 4.9a7.5 7.5 0 0 1 4 4.6"/><circle cx="19.5" cy="12" r="1.6" ${F}/>`,
    // 반쯤 감긴 눈: 위 눈꺼풀 선 + 아래 호, 눈동자 반원 채움
    blink: `<path d="M3 12.5c2.5-2 5.5-3 9-3s6.5 1 9 3"/><path d="M4.5 13.5c2 3 4.5 4.5 7.5 4.5s5.5-1.5 7.5-4.5"/><path d="M8.6 12.6a3.4 3.4 0 0 0 6.8 0z" ${F}/>`,
    // 덮개가 열린 봉투, 덮개 끝 점
    mail: `<path d="M3.5 10.5v8a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-8"/><path d="m3.5 10.5 8.5 5.5 8.5-5.5"/><path d="M3.5 10.5 12 3.5l8.5 7"/><circle cx="12" cy="3.5" r="1.4" ${F}/>`,
    // 엇갈려 겹친 두 사각 프레임 + 앞 프레임 안 해
    photo: `<rect x="7.5" y="3.5" width="13" height="11" rx="2"/><rect x="3.5" y="8.5" width="13" height="11" rx="2"/><circle cx="8" cy="13" r="1.8" ${F}/>`,
    // 사각 몸체 + 원 렌즈 + 렌즈 중심 점
    cam: `<rect x="3" y="6.5" width="18" height="13" rx="3"/><path d="M8 6.5 9.5 4h5L16 6.5"/><circle cx="12" cy="13" r="3.8"/><circle cx="12" cy="13" r="1.3" ${F}/>`,
    // 3면 접힌 지도 + 핀(머리 채움)
    map: `<path d="m3.5 7 5.5-2 6 2 5.5-2v12.5l-5.5 2-6-2-5.5 2z"/><path d="M9 5v12.5M15 7v6"/><path d="M15 21s-3-3-3-5.2a3 3 0 0 1 6 0C18 18 15 21 15 21z" ${F}/>`,
    // 동심 호 두 개(레이더) + 중심 점
    find: `<path d="M6.3 17.7a8 8 0 1 1 11.4 0"/><path d="M9.2 14.8a4 4 0 1 1 5.6 0"/><circle cx="12" cy="12" r="1.8" ${F}/>`,
    // 위쪽 링 두 개 + 오늘 날짜 숫자(흰 타일·남색)
    cal: `<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4"/><text x="12" y="17.6" text-anchor="middle" font-size="9" font-weight="700" fill="currentColor" stroke="none" font-family="Pretendard Variable, sans-serif">17</text>`,
    // 모서리 접힌 종이 + 줄 3, 접힌 모서리 채움
    note: `<path d="M5 3.5h10l4.5 4.5v11a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19z"/><path d="M15 3.5V8h4.5z" ${F}/><path d="M8.5 11h7M8.5 14h7M8.5 17h4.5"/>`,
    // 파형 5줄, 가운데 채움
    voice: `<path d="M4.5 10v4M8.2 7v10M15.8 8v8M19.5 10.5v3"/><rect x="10.6" y="4" width="2.8" height="16" rx="1.4" ${F}/>`,
    // 지그재그 맥박선 + 끝 점
    health: `<path d="M2.5 12.5h4l2-5 3.5 10 2.5-7 1.5 2h3"/><circle cx="20" cy="12.5" r="1.6" ${F}/>`,
    // 겹친 카드 두 장, 앞 카드 띠
    wallet: `<rect x="6" y="4" width="14.5" height="10" rx="2"/><rect x="3.5" y="9" width="14.5" height="10.5" rx="2"/><rect x="3.5" y="11.5" width="14.5" height="2.5" ${F}/>`,
    // 계단형 막대 3개, 가장 높은 막대 채움
    bank: `<rect x="4" y="13" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="11" rx="1"/><rect x="16" y="4" width="4" height="16" rx="1" ${F}/>`,
    // 차 옆면 + 지붕 표시등 채움
    taxi: `<path d="M3 16.5v-3.5l2.5-1 2-3.5h7.5l3 3.5 3 1v3.5H3z"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><rect x="9.5" y="4.5" width="5" height="2.5" rx="1" ${F}/>`,
    // 탭이 있는 폴더, 탭 채움
    file: `<path d="M3.5 8.5h17v9.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M3.5 8.5V6A1.5 1.5 0 0 1 5 4.5h4.5L11.5 7h-8z" ${F}/>`,
    // 슬라이더 세 줄, 손잡이 하나 채움
    set: `<path d="M4 6.5h16M4 12h16M4 17.5h16"/><circle cx="8.5" cy="6.5" r="2.3" fill="var(--lm-app-tile)"/><circle cx="15.5" cy="12" r="2.3" ${F}/><circle cx="10" cy="17.5" r="2.3" fill="var(--lm-app-tile)"/>`,
    // 2×2 격자 + 연산 부호
    calc: `<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M12 3.5v17M3.5 12h17M6 7.8h3.5M7.75 6v3.5M14.5 7.8H18M14.5 15h3.5M14.5 17h3.5M6.2 14.2l3 3M9.2 14.2l-3 3"/>`,
    // 수평선 위 물결 + 위쪽 호, 물결 마루 점
    wave: `<path d="M5 13a7 7 0 0 1 14 0"/><path d="M3 16.5c1.5 0 1.5-1.5 3-1.5s1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5"/><circle cx="12" cy="14.6" r="1.4" ${F}/>`,
    // 가로로 긴 둥근 사각 + 아래 진행 막대(앞부분 채움)
    tube: `<rect x="3" y="4.5" width="18" height="12" rx="3.5"/><path d="M3.5 20h17"/><rect x="3" y="18.8" width="8" height="2.4" rx="1.2" ${F}/>`,
    // 겹친 말풍선 셋이 원형으로 모임, 가운데 빈 원
    moa: `<circle cx="12" cy="7" r="3.5"/><circle cx="7" cy="15" r="3.5"/><circle cx="17" cy="15" r="3.5"/><circle cx="12" cy="12.2" r="1.3" ${F}/>`,
    // 그릇 반원 + 위 김 두 줄, 테두리 점
    hankki: `<path d="M3.5 12h17a8.5 8.5 0 0 1-17 0z"/><path d="M9.5 8.5c0-1.2 1-1.6 1-2.8M14 8.5c0-1.2 1-1.6 1-2.8"/><circle cx="20.5" cy="12" r="1.5" ${F}/>`,
    // 지붕 선 + 가격표 꼬리표, 구멍 점
    market: `<path d="M3.5 10 12 4l8.5 6"/><path d="M8 11.5h8.5l2.5 4-2.5 4H8z"/><circle cx="16" cy="15.5" r="1.3" ${F}/>`,
    // 반쯤 열린 카드 + 머리·어깨 선, 머리 채움
    cont: `<path d="M6 3.5h12A1.5 1.5 0 0 1 19.5 5v14a1.5 1.5 0 0 1-1.5 1.5H6"/><path d="M6 3.5v17"/><circle cx="12.8" cy="10" r="2.6" ${F}/><path d="M8.5 17c.6-2 2.2-3 4.3-3s3.7 1 4.3 3"/>`,
    // 체크 원 3개 세로 줄, 맨 위만 채움(흰 타일·남색)
    rem: `<circle cx="6" cy="6.5" r="2.2" ${F}/><circle cx="6" cy="12" r="2.2"/><circle cx="6" cy="17.5" r="2.2"/><path d="M11 6.5h9M11 12h9M11 17.5h9"/>`,
    // 원 + 바늘 두 개(9:05), 중심 점
    clock: `<circle cx="12" cy="12" r="8.5"/><path d="M12 12H7.5M12 12l.8-4.6"/><circle cx="12" cy="12" r="1.5" ${F}/>`,
    // 해 반원(채움) + 구름 선 하나
    wthr: `<path d="M5 12.5a5 5 0 0 1 10 0z" ${F}/><path d="M8 19h10a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.4 1.2A2.4 2.4 0 0 0 8 19z"/>`,
    // 펼친 책 위 작은 깃발
    portal: `<path d="M12 9.5c-2-1.5-5-2-8.5-1.5v11c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V8c-3.5-.5-6.5 0-8.5 1.5zM12 9.5V21"/><path d="M12 9.5V2.5"/><path d="M12 2.5h5l-1.3 1.8L17 6h-5z" ${F}/>`,
  };

  /* UI 기호 */
  const UI = {
    'chevron-left': '<path d="m15 5-7 7 7 7"/>',
    'chevron-right': '<path d="m9 5 7 7-7 7"/>',
    'chevron-down': '<path d="m5 9 7 7 7-7"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    more: '<circle cx="5.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.1"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    unlock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 7.7-1.5"/>',
    wifi: '<path d="M3 9.5a13 13 0 0 1 18 0M6 13a8.5 8.5 0 0 1 12 0M9 16.4a4 4 0 0 1 6 0"/><circle cx="12" cy="19.3" r="1.2" fill="currentColor"/>',
    plane: '<path d="M10.5 3.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v6l7.5 4.5v2l-7.5-2.3v4.8l2.2 1.7v1.6L12 20.6l-3.7 1.2v-1.6l2.2-1.7v-4.8L3 16v-2l7.5-4.5z" fill="currentColor" stroke="none"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" fill="currentColor" stroke="none"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    'bell-off': '<path d="M6 16.5V11a6 6 0 0 1 9.4-4.9M18 11v5.5l1.5 1.5H8"/><path d="M4 4l16 16M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    flash: '<path d="M13 3 5.5 13.5H11l-1 7.5 7.5-10.5H12z" fill="currentColor" stroke="none"/>',
    screenshot: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"/>',
    signal: '<rect x="3" y="15" width="3" height="5" rx="1" fill="currentColor" stroke="none"/><rect x="8" y="12" width="3" height="8" rx="1" fill="currentColor" stroke="none" opacity=".35"/><rect x="13" y="8.5" width="3" height="11.5" rx="1" fill="currentColor" stroke="none" opacity=".35"/><rect x="18" y="5" width="3" height="15" rx="1" fill="currentColor" stroke="none" opacity=".35"/>',
    bluetooth: '<path d="m7 7 10 10-5 4V3l5 4L7 17"/>',
    rotate: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18.5 3v4h-4M5.5 21v-4h4"/>',
    torch: '<path d="M8 3h8v4l-2 3v11h-4V10L8 7z"/><path d="M12 13v2"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    mic: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
    camera: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.5" r="3.4"/>',
    photo: '<rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m4 17 5-5 4 4 2.5-2.5L20 18"/><circle cx="15.5" cy="9.5" r="1.4"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    'heart-fill': '<path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" fill="currentColor"/>',
    comment: '<path d="M12 4.5c4.4 0 8 3 8 6.8s-3.6 6.7-8 6.7c-1.2 0-2.3-.2-3.3-.6L4.5 19l1.2-3.5A6.4 6.4 0 0 1 4 11.3C4 7.5 7.6 4.5 12 4.5z"/>',
    repost: '<path d="M4 10V8.5A2.5 2.5 0 0 1 6.5 6H18l-3-3M20 14v1.5a2.5 2.5 0 0 1-2.5 2.5H6l3 3"/>',
    share: '<path d="M12 3.5v11M7.5 8 12 3.5 16.5 8"/><path d="M5.5 12v6.5a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V12"/>',
    bookmark: '<path d="M6.5 4h11v16.5L12 16l-5.5 4.5z"/>',
    home: '<path d="M4 11 12 4l8 7v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1z"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    users: '<circle cx="9" cy="8.5" r="3.3"/><path d="M3 19.5c.6-3 3-4.8 6-4.8s5.4 1.8 6 4.8"/><path d="M15.5 5.5a3.3 3.3 0 0 1 0 6.3M17.5 14.9c1.8.6 3.1 2.2 3.5 4.6"/>',
    chat: '<path d="M12 4.5c4.4 0 8 3 8 6.8s-3.6 6.7-8 6.7c-1.2 0-2.3-.2-3.3-.6L4.5 19l1.2-3.5A6.4 6.4 0 0 1 4 11.3C4 7.5 7.6 4.5 12 4.5z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
    star: '<path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8.5 6.5H20M8.5 12H20M8.5 17.5H20"/><circle cx="4.5" cy="6.5" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="17.5" r="1" fill="currentColor"/>',
    keypad: '<circle cx="6" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="18" cy="5" r="1.4" fill="currentColor"/><circle cx="6" cy="11" r="1.4" fill="currentColor"/><circle cx="12" cy="11" r="1.4" fill="currentColor"/><circle cx="18" cy="11" r="1.4" fill="currentColor"/><circle cx="6" cy="17" r="1.4" fill="currentColor"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/><circle cx="18" cy="17" r="1.4" fill="currentColor"/><circle cx="12" cy="22" r="1.4" fill="currentColor"/>',
    voicemail: '<circle cx="6.5" cy="12" r="3.5"/><circle cx="17.5" cy="12" r="3.5"/><path d="M6.5 15.5h11"/>',
    'phone-out': '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    video: '<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="m15.5 10.5 5.5-3v9l-5.5-3z"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    nav: '<path d="M20 4 4 10.5l7 2.5 2.5 7z"/>',
    trash: '<path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 13.5h9l1-13.5"/>',
    edit: '<path d="M14.5 5.5 18.5 9.5 9 19H5v-4z"/><path d="m12.5 7.5 4 4"/>',
    compose: '<path d="M11 4.5H6A1.5 1.5 0 0 0 4.5 6v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-5"/><path d="M17.5 3.5 20.5 6.5 12 15h-3v-3z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    doc: '<path d="M7 3.5h7l4.5 4.5v12.5H7z"/><path d="M14 3.5V8h4.5"/>',
    folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    cloud: '<path d="M7 19h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.5A3.3 3.3 0 0 0 7 19z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 8.5-8.5M16.5 6.5l2 2M14.5 8.5l1.5 1.5"/>',
    shield: '<path d="M12 3.5 5 6v5.5c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M3.5 3.5 20.5 20.5M10 6a9.4 9.4 0 0 1 2-.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.4 7.6A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.4-1.1"/>',
    battery: '<rect x="2.5" y="7" width="17" height="10" rx="2.5"/><path d="M21.5 10.5v3"/>',
    car: '<path d="M5 15.5v-3l1.6-4.2A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.3L19 12.5v3"/><rect x="3.5" y="12.5" width="17" height="5" rx="2"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m10 21 2.5-6-2.5-2.5 1-5 3.5 3 3 1M9 11l-2 3.5M12.5 15l3 6"/>',
    bus: '<rect x="5" y="3.5" width="14" height="14" rx="3"/><path d="M5 11h14M8 20.5v-3M16 20.5v-3"/>',
    play: '<path d="m8 5 11 7-11 7z" fill="currentColor"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
    record: '<circle cx="12" cy="12" r="7" fill="currentColor"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    sort: '<path d="M7 4v16M3.5 16.5 7 20l3.5-3.5M17 20V4M13.5 7.5 17 4l3.5 3.5"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.7 3.7 5.5 3.7 8.5s-1.2 5.8-3.7 8.5c-2.5-2.7-3.7-5.5-3.7-8.5S9.5 6.2 12 3.5z"/>',
    flag: '<path d="M5.5 21V4M5.5 4.5h11l-2 4 2 4h-11"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 10h18M6.5 15h4"/>',
    receipt: '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z"/><path d="M9 8.5h6M9 12h6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    reply: '<path d="M9.5 6 4 11.5 9.5 17M4.5 11.5H14a6 6 0 0 1 6 6v1"/>',
    forward: '<path d="M14.5 6 20 11.5 14.5 17M19.5 11.5H10a6 6 0 0 0-6 6v1"/>',
    archive: '<rect x="3.5" y="4.5" width="17" height="4" rx="1"/><path d="M5 8.5v10a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-10M10 12.5h4"/>',
    inbox: '<path d="M3.5 13.5 6 5h12l2.5 8.5v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5"/>',
    tag: '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="9" r="1.4" fill="currentColor"/>',
    timer: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5V9M9.5 3h5"/>',
    alarm: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9v4.5l2.5 1.5M4 5.5 6.5 3M20 5.5 17.5 3"/>',
    stopwatch: '<circle cx="12" cy="13.5" r="7.5"/><path d="M12 13.5 15 10.5M10 3h4M12 3v3"/>',
    world: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.7 3.7 5.5 3.7 8.5s-1.2 5.8-3.7 8.5c-2.5-2.7-3.7-5.5-3.7-8.5S9.5 6.2 12 3.5z"/>',
    sparkle: '<path d="M12 3.5 13.8 10.2 20.5 12l-6.7 1.8L12 20.5l-1.8-6.7L3.5 12l6.7-1.8z"/>',
    bolt: '<path d="M13 3 5.5 13.5H11l-1 7.5 7.5-10.5H12z"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4"/>',
    location: '<path d="M20 4 4 10.5l7 2.5 2.5 7z" fill="currentColor"/>',
    hash: '<path d="M9.5 3.5 7.5 20.5M16.5 3.5l-2 17M4.5 9h16M3.5 15h16"/>',
    at: '<circle cx="12" cy="12" r="3.8"/><path d="M15.8 12v1.5a2.7 2.7 0 0 0 5.2 0V12a9 9 0 1 0-3.5 7.1"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5v.1M15 9.5v.1"/>',
    sticker: '<path d="M20.5 12A8.5 8.5 0 1 1 12 3.5h5a3.5 3.5 0 0 1 3.5 3.5z"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0"/>',
    gift: '<rect x="4" y="9" width="16" height="11.5" rx="1.5"/><path d="M3 9h18M12 9v11.5M12 9c-1.5-3.5-5-3.5-5-1.5S12 9 12 9zm0 0c1.5-3.5 5-3.5 5-1.5S12 9 12 9z"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    accessibility: '<circle cx="12" cy="4.5" r="1.8"/><path d="M4.5 8.5 12 10l7.5-1.5M12 10v4.5l-3 6M12 14.5l3 6"/>',
    text: '<path d="M5 7V5h14v2M12 5v14M9 19h6"/>',
    hand: '<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v8a6.5 6.5 0 0 1-6.5 6.5A6 6 0 0 1 6 18l-2.5-4.5a1.4 1.4 0 0 1 2.4-1.4L8 15"/>',
    sos: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5M12 15.8v.1"/>',
    medical: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 7.5v9M7.5 12h9"/>',
    backspace: '<path d="M8.5 5.5H20a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8.5L3 12z"/><path d="m11.5 9.5 5 5M16.5 9.5l-5 5"/>',
    store: '<path d="M4.5 9.5V20h15V9.5M3.5 9.5 5 4h14l1.5 5.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5c0 1.4-1.1 2.5-2.5 2.5S10.5 10.9 10.5 9.5C10.5 10.9 9.4 12 8 12S5.5 10.9 5.5 9.5"/>',
    bag: '<path d="M5 8h14l-1 11.5H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    upload: '<path d="M12 15V4M7.5 8.5 12 4l4.5 4.5M5 19.5h14"/>',
    erase: '<path d="M8.5 20.5h11M4.8 15.2l9.9-9.9a2 2 0 0 1 2.8 0l2.2 2.2a2 2 0 0 1 0 2.8L12 18H7.6z"/>',
    devices: '<rect x="3" y="5" width="12" height="9" rx="1.5"/><path d="M6 17.5h6"/><rect x="16.5" y="8.5" width="5" height="11" rx="1.5"/>',
    history: '<path d="M4 12a8 8 0 1 0 2.4-5.7M4 4.5v4h4"/><path d="M12 8v4.5l3 1.8"/>',
    scale: '<path d="M12 4v16M5 20h14M5 8l-2.5 6a2.8 2.8 0 0 0 5 0zm14 0-2.5 6a2.8 2.8 0 0 0 5 0zM5 8h14"/>',
    steps: '<path d="M7 16c-1.5 0-2.5-1.5-2.5-4s1-6 3-6 2 3 2 5-1 5-2.5 5zM16.5 21c-1.5 0-2.5-1.5-2.5-4s1-6 3-6 2 3 2 5-1 5-2.5 5z"/>',
    rain: '<path d="M7 15h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.5A3.3 3.3 0 0 0 7 15zM8 18l-1 2.5M12 18l-1 2.5M16 18l-1 2.5"/>',
    sunny: '<circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    cloudy: '<path d="M7 19h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.5A3.3 3.3 0 0 0 7 19z" fill="currentColor" stroke="none" opacity=".85"/>',
    moonc: '<path d="M18 13.5A6.5 6.5 0 0 1 10.5 6a6.5 6.5 0 1 0 7.5 7.5z" fill="currentColor" stroke="none"/>',
  };

  LM.icon = (name, cls) => {
    const d = UI[name] || APP[name] || UI.info;
    return LM.svg(S(d), 'ic' + (cls ? ' ' + cls : ''));
  };
  LM.glyph = (id) => LM.svg(S(APP[id] || UI.info), 'glyph');
  LM.hasGlyph = (id) => !!APP[id];


  /* 앱 타일 마스크: 슈퍼타원 n=5. 직선 구간이 길고 모서리만 부드럽게 굽는다(스마트폰 앱 아이콘에 가까운 비율). */
  const SQUIRCLE = (() => {
    const n = 5, N = 120, c = 30, r = 30, pts = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2, ct = Math.cos(t), st = Math.sin(t);
      const x = c + r * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / n);
      const y = c + r * Math.sign(st) * Math.pow(Math.abs(st), 2 / n);
      pts.push(x.toFixed(2) + ' ' + y.toFixed(2));
    }
    return 'M' + pts.join('L') + 'Z';
  })();
  LM.SQUIRCLE = SQUIRCLE;

  /* 앱 타일: 단색 슈퍼타원. 타일색은 tokens.css의 [data-app] 변수 */
  LM.appIcon = (id, size) => {
    const tile = LM.h('span', { class: 'appicon', data: { app: id }, style: size ? { width: size + 'px', height: size + 'px' } : null, 'aria-hidden': true });
    const white = id === 'cal' || id === 'rem'; // 흰 타일 + 남색 글리프
    tile.innerHTML = '<svg class="appicon-shape" viewBox="0 0 60 60" aria-hidden="true"><path d="' + SQUIRCLE + '" fill="' + (white ? '#FFFFFF' : 'var(--lm-app-tile)') + '"/></svg>';
    if (white) tile.style.color = 'var(--lm-app-tile)';
    tile.appendChild(LM.glyph(id));
    return tile;
  };
})();
