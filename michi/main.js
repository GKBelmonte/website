(async () => {
  'use strict';
  const balance = await (await fetch('balance.json')).json();
  const canvas = document.getElementById('c');
  const query = new URLSearchParams(location.search);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* sandboxed frame */ } },
  };

  const audio = createAudio();
  const game = ZenRunner.create(canvas, { balance, onEvent: (kind, value) => (kind === 'settings' ? save() : audio.play(kind, value, game.theme())) });
  game.state.muted = store.get('kaze.muted') === '1';
  const savedLevel = store.get('michi.difficulty');
  if (savedLevel in balance.speedIncrease.perLoop) game.state.difficulty = savedLevel;
  if (query.has('t')) game.start(query.get('mode') === 'zen' ? 'zen' : 'challenge', +query.get('t') || 0);

  const fit = () => game.resize(innerWidth, innerHeight, Math.min(devicePixelRatio || 1, 2));
  addEventListener('resize', fit);
  fit();

  function save() {
    store.set('kaze.muted', game.state.muted ? '1' : '0');
    store.set('michi.difficulty', game.state.difficulty);
  }
  function toggleMute() { game.state.muted = !game.state.muted; save(); }

  function down(e) {
    audio.unlock();
    const s = game.state;
    if (s.settings) return e && game.tapSettings(e.clientX, e.clientY);
    if (e && game.settingsLabelHit(e.clientX, e.clientY)) return game.toggleSettings();
    if (s.mode === 'title') return game.start(e ? (e.clientX < innerWidth / 2 ? 'challenge' : 'zen') : ['challenge', 'zen'][s.pick]);
    if (s.mode === 'paused') return game.resume();
    game.press();
  }

  // On touch screens a swipe down dashes, left hovers until the finger lifts, and right
  // pulses. The press that starts a swipe still jumps first.
  let swipe = null;
  canvas.addEventListener('pointerdown', e => { e.preventDefault(); swipe = game.state.settings ? null : { x: e.clientX, y: e.clientY }; down(e); });
  canvas.addEventListener('pointermove', e => {
    if (!swipe) return;
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y, far = 5 * game.unit();
    if (Math.max(Math.abs(dx), Math.abs(dy)) < far) return;
    swipe = null;
    if (Math.abs(dy) > Math.abs(dx)) { if (dy > 0) game.dash(); }
    else if (dx > 0) game.pulse();
    else game.hover();
  });
  addEventListener('pointerup', () => { swipe = null; game.endHover(); });
  addEventListener('pointerup', () => game.release());
  addEventListener('pointercancel', () => game.release());
  const JUMP_KEYS = ['Space', 'ArrowUp', 'KeyW', 'Enter'];
  addEventListener('keydown', e => {
    if (e.code === 'Escape') return game.toggleSettings();
    if (e.code === 'KeyM') return toggleMute();
    if (game.state.settings) return;
    if (JUMP_KEYS.includes(e.code)) { e.preventDefault(); if (!e.repeat) down(); }
    else if (game.state.mode === 'title' && ['ArrowLeft', 'ArrowRight', 'KeyZ', 'KeyC'].includes(e.code)) game.state.pick = +(e.code === 'ArrowRight' || e.code === 'KeyZ');
    else if ((e.code === 'ArrowDown' || e.code === 'KeyS') && !e.repeat) { e.preventDefault(); game.dash(); }
    else if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && !e.repeat) { e.preventDefault(); game.hover(); }
    else if ((e.code === 'ArrowRight' || e.code === 'KeyD') && !e.repeat) { e.preventDefault(); game.pulse(); }
    else if (e.code === 'KeyP') game.togglePause();
  });
  addEventListener('keyup', e => {
    if (JUMP_KEYS.includes(e.code)) game.release();
    else if (e.code === 'ArrowLeft' || e.code === 'KeyA') game.endHover();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) game.pause(); });
  addEventListener('blur', () => game.pause());

  let last = performance.now();
  requestAnimationFrame(function frame(now) {
    game.update(Math.min(0.05, (now - last) / 1000));
    last = now;
    game.draw();
    requestAnimationFrame(frame);
  });

  // Soft plucked tones, each mood with its own pentatonic scale. Sounds alternate left
  // and right, swinging wider with each one (bilateral stimulation). Each sound plays
  // dry at first and gains one echo for every two stones or motes taken since the last
  // hit, up to six. The echoes ping-pong between the ears, fully left and right from
  // five echoes on. A hit brings the pan back to the centre and the echoes to none.
  function createAudio() {
    let ac = null, out = null, wet = null, side = 1, width = 0.15, echoes = 0;
    function voice(freq, dur, vol, pan, type, t, dest) {
      const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      p.pan.value = pan;
      o.connect(g); g.connect(p); p.connect(dest);
      o.start(t); o.stop(t + dur + 0.05);
    }
    function tone(freq, dur, vol, pan, type = 'sine', delay = 0) {
      const t = ac.currentTime + delay, spread = Math.min(1, echoes / 5);
      voice(freq, dur, vol, pan, type, t, out);
      for (let i = 1; i <= echoes; i++) voice(freq, dur, vol * 0.72 ** i, side * (i % 2 ? -1 : 1) * spread, type, t + i * 0.32, wet);
    }
    const note = (theme, step, octave = 0) =>
      theme.root * 2 ** (octave + Math.floor(step / 5) + theme.scale[((step % 5) + 5) % 5] / 12);
    return {
      unlock() {
        if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ac = new AC();
        out = ac.createGain(); out.gain.value = 0.2; out.connect(ac.destination);
        wet = ac.createBiquadFilter(); wet.type = 'lowpass'; wet.frequency.value = 1600; wet.connect(out);
      },
      play(kind, value, theme) {
        if (!ac || game.state.muted || game.state.mode !== 'play') return;
        echoes = Math.min(6, Math.floor((game.state.cleared + game.state.streak) / 2));
        side = -side;
        const pan = side * width;
        width = kind === 'hit' ? 0.15 : Math.min(1, width + 0.1);
        if (kind === 'jump') tone(note(theme, Math.floor(Math.random() * 5), value ? 0 : -1), 0.5, 0.35, pan);
        else if (kind === 'mote') { const f = note(theme, Math.min(value - 1, 9), 0); tone(f, 1.2, 0.3, pan); tone(f * 2.76, 0.4, 0.06, pan); }
        else if (kind === 'streak') [5, 7, 10].forEach((step, i) => tone(note(theme, step, 0), 0.9, 0.22, pan, 'sine', i * 0.09));
        else if (kind === 'hover') tone(note(theme, 2, 1), 0.7, 0.18, pan);
        else if (kind === 'pulse') { tone(note(theme, 4, -1), 0.5, 0.35, pan, 'triangle'); tone(note(theme, 4, 1), 0.3, 0.12, pan); }
        else if (kind === 'conjunction') { tone(theme.root, 4, 0.18, 0); tone(theme.root * 1.5, 4, 0.12, 0); tone(theme.root * 2, 4, 0.08, 0); }
        else if (kind === 'dash') tone(note(theme, 0, -2), 0.35, 0.3, pan, 'triangle');
        else if (kind === 'hit') tone(theme.root / 4, 1.6, 0.5, pan, 'triangle');
        else if (kind === 'theme') { tone(theme.root / 4, 4, 0.5, pan); tone(theme.root * 0.375, 3, 0.25, pan); }
      },
    };
  }
})();
