(function () {
  const G = window.__game || window.DK;
  G.setStartGame(() => G.jump('S01'));
  G.boot();
})();
