// michi — a quiet horizontal runner along the way. Three moods cycling: day (hiru), twilight (yū)
// and night (yoru). Swans glide in by day and ravens fly at you by night. Zen keeps
// the moods as they are; challenge shortens them, starts 30% faster and raises the
// base difficulty every loop.
const ZenRunner = (() => {
  'use strict';

  // Every balance number lives in balance.json, which create() takes as opts.balance.
  const SUN_LOW = hexRgb('#e2502f');
  const SUN_HIGH = hexRgb('#eeb032');
  const GROUND = 80;      // ground line, in height units from the top (100 units = canvas height)
  const SERIF = '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", Georgia, serif';

  const THEMES = [
    { key: 'day', kanji: '昼', romaji: 'hiru', bird: 'swan',
      sky0: '#f7f4ed', sky1: '#e8e2d4', far: '#e0d9ca', mid: '#cdc4b1', near: '#b5ab96', ground: '#ddd6c6',
      ink: '#1f1e1c', text: '#1f1e1c', moon: '#c4bdaf', mote: '#d65a3c', particle: '#8f897c', style: 'dust',
      scale: [0, 2, 4, 7, 9], root: 392 },
    { key: 'twilight', kanji: '夕', romaji: 'yū', bird: null,
      sky0: '#c63a2d', sky1: '#94221a', far: '#ad2e23', mid: '#8e2119', near: '#6d1610', ground: '#5a110c',
      ink: '#1c0706', text: '#f4e7d4', moon: '#f4e7d4', mote: '#fbeedd', particle: '#f3d8c2', style: 'petal',
      scale: [0, 3, 5, 7, 10], root: 330 },
    { key: 'night', kanji: '夜', romaji: 'yoru', bird: 'raven',
      sky0: '#0b0c10', sky1: '#1a1c23', far: '#23262f', mid: '#181a21', near: '#101116', ground: '#07080a',
      ink: '#ece7dc', text: '#ece7dc', moon: '#ece7dc', mote: '#a6dccf', particle: '#ece7dc', style: 'star',
      scale: [0, 3, 5, 8, 10], root: 294 },
  ];
  const COLORS = ['sky0', 'sky1', 'far', 'mid', 'near', 'ground', 'ink', 'text', 'moon', 'mote', 'particle'];
  for (const t of THEMES) for (const k of COLORS) t[k] = hexRgb(t[k]);

  function hexRgb(h) { return [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); }
  function mix(a, b, k) { return a.map((v, i) => v + (b[i] - v) * k); }
  function rgba(c, a = 1) { return `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function smooth(k) { return k * k * (3 - 2 * k); }
  function hash01(n) {
    n = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b); n ^= n >>> 13;
    n = Math.imul(n, 0xc2b2ae35); n ^= n >>> 16;
    return (n >>> 0) / 4294967296;
  }
  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function create(canvas, opts = {}) {
    const B = opts.balance, C = B.energyPerMove, POOL = C.pool, J = B.jumpStrength, D = B.obstacleDistance, O = B.obstacles;
    const R = B.hits.runnerRadius, GRAVITY = J.gravity, HOLD = J.holdGravity, HOLD_WINDOW = J.holdWindow;
    const ctx = canvas.getContext('2d');
    const rand = mulberry32(opts.seed ?? (Math.random() * 1e9) | 0);
    const table = Float32Array.from({ length: 512 }, rand);
    const emit = opts.onEvent || (() => {});
    const runnerFrac = opts.runnerX ?? 0.24;
    let W = 1, H = 1, u = 1, dpr = 1, grain = null;

    const s = {
      mode: opts.mode || 'title',
      autopilot: opts.autopilot ?? (opts.mode || 'title') === 'title',
      hud: opts.hud !== false, title: opts.title ?? (opts.mode || 'title') === 'title',
      game: opts.game || 'challenge', ts: B.moods.secondsPerMood[opts.game || 'challenge'], pick: 0,  // pick 0 = challenge, 1 = zen
      settings: false, difficulty: B.speedIncrease.default,
      t: opts.startT || 0, clock: 0, dist: 0, next: 40,
      y: 0, vy: 0, grounded: true, jumpsUsed: 0, hoversUsed: 0, held: false, holdT: 0, autoRelease: 0,
      pulseTier: 0, pulseSince: 99,
      squash: 0, broken: 0, invuln: 0, hovering: false, conj: 0, conjOn: false, birdT: 2, energy: POOL.start, maxEnergy: POOL.start,
      stones: [], birds: [], abysses: [], motes: [], fx: [], particles: [], trail: [],
      motes_: 0, streak: 0, best: 0, cleared: 0, themeIndex: -1, muted: false,
    };

    function noise(x) {
      const i = Math.floor(x), f = x - i;
      const a = table[i & 511], b = table[(i + 1) & 511];
      return a + (b - a) * smooth(f);
    }
    function fbm(x) { return noise(x) * 0.6 + noise(x * 2.1 + 17) * 0.28 + noise(x * 4.3 + 41) * 0.12; }
    // Challenge raises the base every loop, a rising see-saw: each day is easier
    // than the night before it, but harder than the day before that.
    function tuned(T, challenge, level) {
      const k = T.key, sp = B.baseSpeed, pc = O.pairChance, sh = O.stoneHeight;
      const base = { ...T, speed: sp[k], gap: D[k], pair: pc[k], minH: sh[k][0], maxH: sh[k][1], birdGap: T.bird && D.birds[T.bird] };
      if (!challenge) return { ...base, speed: base.speed * sp.zenMultiplier };
      const ease = g => Math.max(D.minSeconds, g / (1 + D.shrinkPerLoop * level));
      return { ...base, speed: Math.min(sp.cap, base.speed * sp.challengeMultiplier * (1 + B.speedIncrease.perLoop[s.difficulty] * level)),
        gap: base.gap.map(ease), birdGap: base.birdGap && base.birdGap.map(ease),
        pair: Math.min(pc.cap, base.pair + pc.perLoop * level),
        maxH: Math.min(sh.cap, base.maxH + sh.perLoop * level) };
    }

    function themeAt(t, ts, challenge) {
      const n = Math.floor(t / ts), local = t - n * ts, blend = B.moods.blendSeconds;
      const lv = i => (challenge ? Math.floor(i / 3) : 0);
      const a = tuned(THEMES[n % 3], challenge, lv(n)), b = tuned(THEMES[(n + 1) % 3], challenge, lv(n + 1));
      const k = smooth(clamp((local - (ts - blend)) / blend, 0, 1));
      const pal = { speed: lerp(a.speed, b.speed, k) };
      for (const c of COLORS) pal[c] = mix(a[c], b[c], k);
      return { theme: a, index: n, local, loop: lv(n), pal };
    }

    const themeNow = () => themeAt(s.t, s.ts, s.game === 'challenge');
    // The open abyss whose middle is under x, if any: there is no ground there to stand on.
    const pitUnder = x => s.abysses.find(a => !a.fade && x > a.x + R * 0.6 && x < a.x + a.w - R * 0.6);
    const rx = () => s.dist + (W * runnerFrac) / u;

    function resize(w, h, ratio = 1) {
      if (!(w > 0 && h > 0)) return;  // a frame loaded hidden has no size yet; its first resize brings one
      W = w; H = h; dpr = ratio; u = H / 100;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      grain = makeGrain();
      if (!s.stones.length) s.next = Math.max(s.next, rx() + 25);
      const want = Math.round(clamp(W / u, 60, 220) * 0.35);
      while (s.particles.length < want) s.particles.push(spawnParticle(themeNow().theme, true));
      s.particles.length = want;
    }

    function makeGrain() {
      const g = document.createElement('canvas');
      g.width = g.height = 256;
      const gc = g.getContext('2d');
      const img = gc.createImageData(256, 256);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = rand() < 0.5 ? 0 : 255;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = rand() * 22;
      }
      gc.putImageData(img, 0, 0);
      return ctx.createPattern(g, 'repeat');
    }

    function spawnParticle(T, initial) {
      const p = { style: T.style, col: T.particle, life: 0, max: 6 + rand() * 10,
        x: rand() * W, y: rand() * H * 0.8, rot: rand() * 6.28, spin: (rand() - 0.5) * 2 };
      if (p.style === 'dust') {
        p.size = (0.12 + rand() * 0.3) * u; p.vx = -(1 + rand() * 3) * u; p.vy = (rand() - 0.5) * 0.8 * u;
      } else if (p.style === 'petal') {
        p.size = (0.35 + rand() * 0.45) * u; p.vx = -(5 + rand() * 8) * u; p.vy = (2 + rand() * 4) * u;
        if (!initial) { p.x = W * (0.3 + rand() * 0.9); p.y = -rand() * H * 0.2; }
      } else {
        p.size = (0.08 + rand() * 0.2) * u; p.y = rand() * H * 0.62; p.vx = -0.3 * u; p.vy = 0; p.max = 8 + rand() * 14;
      }
      if (initial) p.life = rand() * p.max;
      return p;
    }

    // From the third twilight on, abysses open in some of twilight's gaps between stones.
    function spawn(T, speed, abysses) {
      const ob = B.orbRate, ab = O.abyss;
      const between = ([lo, hi]) => lerp(lo, hi, rand());
      const x = s.next, w = between(O.stoneWidth);
      s.stones.push({ x, w, h: lerp(T.minH, T.maxH, rand()) });
      let end = x + w;
      if (rand() < T.pair) {
        const x2 = end + between(D.pairSpacing);
        s.stones.push({ x: x2, w, h: lerp(T.minH, T.maxH * O.pairHeightShare, rand()) });
        end = x2 + w;
      }
      const gap = speed * lerp(T.gap[0], T.gap[1], rand());
      if (abysses && rand() < ab.chance) {
        const aw = between(ab.width);
        if (gap >= aw + 2 * D.abyssClearance) s.abysses.push({ x: end + (gap - aw) / 2, w: aw });
      }
      // more orbs while the sun and moon meet; a fractional multiplier is a last pass taken by chance
      for (let n = s.conjOn ? ob.eclipseMultiplier : 1; n > 0; n--) {
        if ((n < 1 && rand() >= n) || rand() >= ob.chancePerGap) continue;
        const mx = end + gap * (0.15 + rand() * 0.7);
        s.motes.push({ x: mx, h: between(ob.height), phase: rand() * 6.28, taken: 0 });
        if (rand() < ob.secondOrbChance) s.motes.push({ x: mx + 3 + rand() * 5, h: between(ob.height), phase: rand() * 6.28, taken: 0 });
      }
      s.next = end + gap;
    }

    function ring(x, y, col, size) { s.fx.push({ kind: 'ring', x, y, col, size, life: 1 }); }

    // Spends challenge energy for a move; zen moves are free.
    function spend(cost) {
      if (s.game !== 'challenge' || s.autopilot) return true;
      if (s.energy < cost) return false;
      s.energy -= cost;
      return true;
    }

    // The last jump, kept so a touch that turns out to be a swipe can take it back.
    let undo = null;
    function press() {
      s.held = true; undo = null;
      if (s.broken > 0 || (s.mode !== 'play' && !s.autopilot)) return;
      undo = { grounded: s.grounded, vy: s.vy, jumpsUsed: s.jumpsUsed, hovering: s.hovering, clock: s.clock };
      if (s.grounded) {
        if (!spend(C.jumps[0])) return;
        s.jumpsUsed = 1; s.vy = J.jump; s.grounded = false; s.holdT = 0; emit('jump', 0);
      } else if (s.jumpsUsed < C.jumps.length && spend(C.jumps[s.jumpsUsed])) {  // each jump before landing costs more
        s.jumpsUsed++; s.vy = J.airJump; s.holdT = 0; s.hovering = false;
        ring(rx(), s.y + R, themeNow().pal.ink, 3); emit('jump', 1);
      }
    }
    // Undoes the last jump as if it never happened: its energy and its jump come back, and the
    // runner returns to the ground, or to the fall it was on.
    function takeBack() {
      if (!undo || s.jumpsUsed === undo.jumpsUsed) return;
      if (s.game === 'challenge' && !s.autopilot) s.energy = Math.min(s.maxEnergy, s.energy + C.jumps[undo.jumpsUsed]);
      s.jumpsUsed = undo.jumpsUsed; s.hovering = undo.hovering; s.held = false;
      if (undo.grounded) { s.y = 0; s.vy = 0; s.grounded = true; }
      else s.vy = undo.vy - GRAVITY * (s.clock - undo.clock);
      undo = null;
    }
    function release() {
      if (s.held && !s.grounded && s.vy > 0 && s.holdT < HOLD_WINDOW) s.vy *= J.jumpCut;
      s.held = false;
    }

    function dash() {
      if (s.mode !== 'play' || s.broken > 0 || s.grounded || !spend(C.dash)) return;
      s.vy = -J.dashSpeed; s.held = false; s.hovering = false;
      ring(rx(), s.y + R, themeNow().pal.ink, 2.5); emit('dash');
    }

    // Back: hold still in the air for as long as it is held; each hover before landing costs more.
    function hover() {
      if (s.mode !== 'play' || s.broken > 0 || s.grounded || s.hovering) return;
      if (s.hoversUsed >= C.hovers.length || !spend(C.hovers[s.hoversUsed])) return;
      s.hoversUsed++; s.hovering = true; s.vy = 0; s.held = false;
      ring(rx(), s.y + R, themeNow().pal.mote, 2); emit('hover');
    }
    function endHover() { s.hovering = false; }

    // Forward: a short pulse that clears the stones and birds near you. Abysses stay.
    // A pulse within the repeat window of the last one costs double the last price.
    function pulse() {
      if (s.mode !== 'play' || s.broken > 0) return;
      const tier = s.pulseSince < C.pulseRepeatWindowSeconds ? s.pulseTier + 1 : 0;
      if (!spend(C.pulse * 2 ** tier)) return;
      s.pulseTier = tier; s.pulseSince = 0;
      s.fx.push({ kind: 'pulse', y: s.y + R, life: 1 });
      pulseSweep(R);
      emit('pulse');
    }

    // The pulse's wave clears every stone and bird it reaches, from just behind you out to its
    // edge, which spreads to B.pulse.reach while it is drawn; what it clears is gone at once.
    function pulseSweep(edge) {
      const cx = rx();
      for (const st of s.stones) if (!st.fade && st.x + st.w > cx - 3 && st.x < cx + edge) st.fade = st.pulsed = 1;
      for (const b of s.birds) if (!b.fade && b.x > cx - 4 && b.x - b.r < cx + edge) b.fade = b.pulsed = 1;
    }

    // Swans glide the same way you run, so they close in slowly; ravens fly at you.
    // Low ravens are jumped; high ones and swans are passed under, or cleared with a held jump.
    // In zen the swans and four ravens in five fly out of reach and never collide.
    function spawnBird(T, speed) {
      const x = s.dist + W / u + 8, phase = rand() * 6.28, zen = s.game === 'zen';
      const between = ([lo, hi]) => lerp(lo, hi, rand()), Z = O.zenBirds;
      if (T.bird === 'swan') {
        const sw = O.swan, harmless = zen && Z.swansHarmless;
        s.birds.push({ kind: 'swan', x, h: harmless ? between(Z.aloftHeight) : between(sw.height), r: sw.radius, vx: speed * sw.speedShare, phase, harmless });
      } else {
        const rv = O.raven, harmless = zen && rand() < Z.harmlessRavenChance;
        const h = harmless ? between(Z.aloftHeight) : rand() < rv.lowChance ? rv.lowHeight : between(rv.highHeight);
        s.birds.push({ kind: 'raven', x, h, r: rv.radius, vx: speed * rv.speedShare, phase, harmless });
      }
    }

    function start(game = 'challenge', t = 0) {
      Object.assign(s, { mode: 'play', autopilot: false, title: false, game, ts: B.moods.secondsPerMood[game], t, motes_: 0, streak: 0, best: 0, cleared: 0, themeIndex: -1, held: false, hovering: false, birdT: 2, energy: POOL.start, maxEnergy: POOL.start, lives: B.hits.lives,
        jumpsUsed: 0, hoversUsed: 0, pulseTier: 0, pulseSince: 99 });
      s.birds.forEach(b => (b.fade = b.fade || 1));
      const cx = rx();
      for (const st of s.stones) if (st.x < cx + 40) st.fade = st.fade || 1;
    }
    // Restart: back to the start screen, with the world still drifting behind it.
    function toTitle() {
      Object.assign(s, { mode: 'title', autopilot: true, title: true, settings: false, t: 0, motes_: 0, streak: 0, best: 0, cleared: 0,
        themeIndex: -1, held: false, hovering: false, energy: POOL.start, maxEnergy: POOL.start, jumpsUsed: 0, hoversUsed: 0,
        pulseTier: 0, pulseSince: 99, y: 0, vy: 0, grounded: true, broken: 0, invuln: 0 });
      for (const o of [...s.stones, ...s.birds, ...s.abysses]) o.fade = o.fade || 1;
    }

    // The settings panel, in height units around the middle of the screen.
    const LEVELS = ['easy', 'medium', 'hard'];
    const ROW = { sound: 44, difficulty: 52, restart: 60, close: 68 };
    const levelX = i => W / 2 + (1 + i * 7.5) * u;
    const settingsLabelHit = (x, y) => x > W - 14 * u && y < 8 * u;
    function tapSettings(x, y) {
      const yu = y / u, near = row => Math.abs(yu - row) < 3;
      if (Math.abs(x - W / 2) > 20 * u || yu < 30 || yu > 72 || near(ROW.close)) { s.settings = false; return; }
      if (near(ROW.sound)) { s.muted = !s.muted; emit('settings'); }
      else if (near(ROW.difficulty)) {
        let pick = 0;
        LEVELS.forEach((_, i) => { if (Math.abs(x - levelX(i)) < Math.abs(x - levelX(pick))) pick = i; });
        s.difficulty = LEVELS[pick]; emit('settings');
      } else if (near(ROW.restart)) toTitle();
    }

    function pause() { if (s.mode === 'play') s.mode = 'paused'; }
    function resume() { if (s.mode === 'paused') s.mode = 'play'; }

    function hit(speed) {
      const cx = rx();
      s.broken = B.hits.brokenSeconds; s.invuln = B.hits.invulnerableSeconds; s.streak = 0; s.cleared = 0;
      s.maxEnergy = Math.max(POOL.start, s.maxEnergy - POOL.hitLowersMax);
      s.energy = Math.min(s.energy, s.maxEnergy);
      for (let i = 0; i < 16; i++) {
        const a = rand() * 6.283, v = 8 + rand() * 22;
        s.fx.push({ kind: 'shard', x: cx, y: s.y + R, vx: Math.cos(a) * v + speed * 0.6, vy: Math.sin(a) * v + 12,
          size: 0.35 + rand() * 0.6, life: 1 });
      }
      s.y = 0; s.vy = 0; s.grounded = true; s.held = false; s.hovering = false; s.jumpsUsed = 0; s.hoversUsed = 0;
      for (const st of s.stones) if (st.x + st.w > cx - 4 && st.x < cx + 40) st.fade = st.fade || 1;
      for (const a of s.abysses) if (a.x + a.w > cx - 4 && a.x < cx + 40) a.fade = a.fade || 1;
      for (const b of s.birds) if (b.x > cx - 4 && b.x < cx + 50) b.fade = b.fade || 1;
      emit('hit');
      // Challenge has lives; losing the last ends the run, and the world drifts on behind it.
      if (s.game === 'challenge' && --s.lives <= 0) { s.mode = 'over'; s.autopilot = true; }
    }

    function update(dt) {
      s.clock += dt;
      if (s.mode === 'paused' || s.settings) return;
      if (s.mode === 'play') s.t += dt;
      const th = themeNow(), T = th.theme, speed = th.pal.speed;
      if (s.mode === 'play' && th.index !== s.themeIndex) {
        if (s.themeIndex >= 0) emit('theme', T);
        s.themeIndex = th.index;
      }
      s.dist += speed * dt;
      s.squash *= Math.exp(-dt * 10);
      s.invuln = Math.max(0, s.invuln - dt);
      if (s.mode === 'play' && !s.hovering) s.energy = Math.min(s.maxEnergy, s.energy + POOL.refillShareOfMax * s.maxEnergy * dt);
      s.pulseSince += dt;

      const { sun, moon } = heavens();
      const meeting = s.mode === 'play' && sun && moon && Math.hypot(sun.x - moon.x, sun.y - moon.y) < sun.r + moon.r;
      if (meeting && !s.conjOn) emit('conjunction');
      s.conjOn = !!meeting;
      s.conj = clamp(s.conj + (meeting ? 1 : -1) * dt / 1.5, 0, 1);

      if (s.broken > 0) {
        s.broken -= dt;
        if (s.broken <= 0) ring(rx(), R, th.pal.ink, 6);
      } else if (s.hovering) {
        if (s.game === 'challenge' && !s.autopilot && (s.energy -= C.hoverPerSecond * dt) <= 0) { s.energy = 0; s.hovering = false; }
      } else if (!s.grounded) {
        const g = s.held && s.vy > 0 && s.holdT < HOLD_WINDOW ? GRAVITY * HOLD : GRAVITY;
        const above = s.y >= 0;
        s.holdT += dt;
        s.vy -= g * dt;
        s.y += s.vy * dt;
        // land only coming down onto ground; over an abyss, or already inside one, keep falling
        if (above && s.y <= 0 && (s.autopilot || !pitUnder(rx()))) { s.y = 0; s.vy = 0; s.grounded = true; s.jumpsUsed = 0; s.hoversUsed = 0; s.squash = 1; }
      } else if (!s.autopilot && pitUnder(rx())) {
        s.grounded = false;  // walked off the edge
      }

      const ahead = s.dist + W / u + 20;
      const abysses = T.key === 'twilight' && th.index >= 3 * (O.abyss.fromTwilight - 1) + 1;
      while (s.next < ahead) spawn(T, speed, abysses);
      const birdsOut = (T.bird === 'swan' && th.index >= 3 * (O.swan.fromDay - 1)) ||
        (T.bird === 'raven' && th.index >= 3 * (O.raven.fromNight - 1) + 2);
      if (birdsOut && (s.birdT -= dt) <= 0) {
        spawnBird(T, speed);
        s.birdT = lerp(T.birdGap[0], T.birdGap[1], rand());
      }
      for (const b of s.birds) { b.x += b.vx * dt; if (b.fade) b.fade -= dt * (b.pulsed ? 4 : 1.5); }
      s.birds = s.birds.filter(b => b.x > s.dist - 10 && !(b.fade <= 0));

      const cx = rx(), cy = s.y + R;
      if (s.autopilot && s.broken <= 0) {
        const i = s.stones.findIndex(o => o.x + o.w > cx - R && !o.fade);
        const st = s.stones[i];
        if (st && s.grounded) {
          const d = st.x - cx;
          const pairNext = s.stones[i + 1] && s.stones[i + 1].x - st.x < 14;
          if (d > 0 && d < speed * 0.2 + st.w * 0.3) {
            press();
            s.autoRelease = st.h > 9 || pairNext ? 0.32 : 0.05;
          }
        }
        if (s.held) { s.autoRelease -= dt; if (s.autoRelease <= 0) release(); }
      }

      if (!s.autopilot && s.broken <= 0 && s.invuln <= 0) {
        for (const st of s.stones) {
          if (st.fade || st.x > cx + R || st.x + st.w < cx - R) continue;
          const px = clamp(cx, st.x, st.x + st.w), py = clamp(cy, 0, st.h);
          if ((cx - px) ** 2 + (cy - py) ** 2 < (R * B.hits.stoneForgiveness) ** 2) { hit(speed); break; }
        }
        // down in an abyss: running into its far wall, or falling to the bottom, is a hit
        if (s.broken <= 0 && s.y < 0) {
          const a = s.abysses.find(o => !o.fade && cx + R > o.x && cx - R < o.x + o.w);
          if (!a || cx + R * B.hits.stoneForgiveness > a.x + a.w || s.y < -O.abyss.fallDepth) hit(speed);
        }
        for (const b of s.birds) {
          if (s.broken > 0) break;
          if (!b.fade && !b.harmless && (b.x - cx) ** 2 + (b.h - cy) ** 2 < ((R + b.r) * B.hits.birdForgiveness) ** 2) hit(speed);
        }
      }

      for (const st of s.stones) {
        if (st.fade) st.fade -= dt * (st.pulsed ? 4 : 1.5);
        else if (!st.passed && st.x + st.w < cx - R) { st.passed = true; s.cleared++; }
      }
      for (const m of s.motes) {
        if (m.taken) { m.taken += dt; continue; }
        const dx = m.x - cx, dy = m.h + Math.sin(s.clock * 2 + m.phase) * 0.8 - cy;
        if (s.broken <= 0 && !s.autopilot && dx * dx + dy * dy < 16) {
          m.taken = 1e-4; s.motes_++; s.maxEnergy += B.orbRate.raisesMax; s.energy = Math.min(s.maxEnergy, s.energy + B.orbRate.restores); s.streak++; s.best = Math.max(s.best, s.streak);
          emit('mote', s.streak);
          const bonus = B.orbRate.streakBonus;
          if (s.streak % bonus.every === 0) {
            s.energy = Math.min(s.maxEnergy, s.energy + bonus.energy);
            ring(cx, cy, th.pal.mote, 7); ring(cx, cy, th.pal.mote, 4);
            emit('streak', s.streak);
          }
        }
      }
      s.stones = s.stones.filter(o => o.x + o.w > s.dist - 5 && !(o.fade <= 0));
      for (const a of s.abysses) if (a.fade) a.fade -= dt * 1.5;
      s.abysses = s.abysses.filter(a => a.x + a.w > s.dist - 5 && !(a.fade <= 0));
      s.motes = s.motes.filter(m => m.x > s.dist - 5 && m.taken < 0.8);

      for (const f of s.fx) {
        f.life -= dt * (f.kind === 'ring' ? 1.4 : f.kind === 'pulse' ? 2.5 : 0.7);
        if (f.kind === 'pulse' && f.life > 0) pulseSweep(R + (1 - f.life) * B.pulse.reach);
        if (f.kind === 'shard') {
          f.vy -= 60 * dt; f.x += f.vx * dt; f.y += f.vy * dt;
          if (f.y < 0) { f.y = 0; f.vy *= -0.3; f.vx *= 0.6; }
        }
      }
      s.fx = s.fx.filter(f => f.life > 0);

      for (let i = 0; i < s.particles.length; i++) {
        const p = s.particles[i];
        p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.spin * dt;
        if (p.life > p.max || p.x < -20 || p.y > H) s.particles[i] = spawnParticle(T, false);
      }

      if (s.broken <= 0) s.trail.push({ x: cx, y: cy });
      while (s.trail.length && s.trail[0].x < s.dist - 1) s.trail.shift();
      if (s.broken > 0) s.trail.length = 0;
    }

    function ridge(p, base, amp, freq, col, off) {
      const o = s.dist * p, step = Math.max(4, W / 240);
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let x = 0; x <= W + step; x += step) ctx.lineTo(x, (base - amp * fbm((x / u + o) * freq + off)) * u);
      ctx.lineTo(W, H); ctx.closePath();
      ctx.fillStyle = rgba(col); ctx.fill();
    }

    function drawParticles(stars) {
      for (const p of s.particles) {
        if ((p.style === 'star') !== stars) continue;
        const env = Math.sin(Math.PI * clamp(p.life / p.max, 0, 1));
        let a = p.style === 'dust' ? env * 0.45 : p.style === 'petal' ? Math.min(1, env * 2) * 0.8 : env * (0.5 + 0.5 * Math.sin(s.clock * 3 + p.rot * 5));
        ctx.fillStyle = rgba(p.col, a);
        ctx.beginPath();
        if (p.style === 'petal') ctx.ellipse(p.x, p.y, p.size, p.size * 0.45, p.rot, 0, 6.283);
        else ctx.arc(p.x, p.y, p.size, 0, 6.283);
        ctx.fill();
      }
    }

    function text(str, x, y, size, col, a, opts2 = {}) {
      ctx.font = `${opts2.weight || 400} ${size}px ${SERIF}`;
      ctx.textAlign = opts2.align || 'center'; ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) ctx.letterSpacing = opts2.spacing ? `${opts2.spacing}px` : '0px';
      ctx.fillStyle = rgba(col, a);
      ctx.fillText(str, x, y);
    }

    function draw() {
      const th = themeNow(), P = th.pal, gy = GROUND * u;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;

      const sky = ctx.createLinearGradient(0, 0, 0, gy);
      sky.addColorStop(0, rgba(P.sky0)); sky.addColorStop(1, rgba(P.sky1));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
      drawParticles(true);

      if (s.conj > 0) { ctx.fillStyle = rgba(SUN_HIGH, 0.12 * s.conj); ctx.fillRect(0, 0, W, gy); }
      if (opts.sun) orb(W * opts.sun.x, opts.sun.y * u, opts.sun.r * u, SUN_LOW, 0.22);
      else {
        const { sun, moon } = heavens();
        if (moon) orb(moon.x, moon.y, moon.r, P.moon, 0.16);
        if (sun) orb(sun.x, sun.y, sun.r, sun.col, 0.22);
        if (sun && moon && s.conj > 0) corona(sun, moon);
      }

      ridge(0.06, 60, 20, 0.022, P.far, 0);
      const mist = ctx.createLinearGradient(0, 50 * u, 0, 74 * u);
      mist.addColorStop(0, rgba(P.sky1, 0)); mist.addColorStop(1, rgba(P.sky1, 0.55));
      ctx.fillStyle = mist; ctx.fillRect(0, 50 * u, W, 24 * u);
      ridge(0.15, 68, 14, 0.035, P.mid, 100);
      ridge(0.35, 75, 8, 0.06, P.near, 200);

      ctx.fillStyle = rgba(P.ground); ctx.fillRect(0, gy, W, H - gy);
      ctx.strokeStyle = rgba(P.ink, 0.8); ctx.lineWidth = Math.max(1, 0.16 * u);
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();

      const sp = 3.3;
      ctx.beginPath();
      for (let k = Math.floor(s.dist / sp), e = Math.ceil((s.dist + W / u) / sp); k <= e; k++) {
        const hv = hash01(k);
        if (hv < 0.55) continue;
        const x = (k * sp - s.dist + hash01(k * 7 + 3) * 2) * u, h = (0.4 + (hv - 0.55) * 5) * u;
        ctx.moveTo(x, gy); ctx.lineTo(x + h * 0.25, gy - h);
      }
      ctx.strokeStyle = rgba(P.ink, 0.3); ctx.lineWidth = Math.max(1, 0.12 * u); ctx.stroke();

      for (const a of s.abysses) {
        const x = (a.x - s.dist) * u, w = a.w * u;
        if (x > W || x + w < 0) continue;
        ctx.globalAlpha = a.fade ? clamp(a.fade, 0, 1) : 1;
        const pit = ctx.createLinearGradient(0, gy, 0, H);
        pit.addColorStop(0, 'rgba(0,0,0,0.55)'); pit.addColorStop(1, 'rgba(0,0,0,0.9)');
        ctx.fillStyle = rgba(P.ground); ctx.fillRect(x, gy - 2, w, H - gy + 2);
        ctx.fillStyle = pit; ctx.fillRect(x, gy - 1, w, H - gy + 1);
        ctx.strokeStyle = rgba(P.ink, 0.6); ctx.lineWidth = Math.max(1, 0.16 * u);
        ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + 3 * u); ctx.moveTo(x + w, gy); ctx.lineTo(x + w, gy + 3 * u); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const moteCol = mix(P.mote, SUN_HIGH, s.conj * 0.8), glowR = 2.4 * (1 + 0.5 * s.conj);
      for (const m of s.motes) {
        const x = (m.x - s.dist) * u, y = (GROUND - m.h - Math.sin(s.clock * 2 + m.phase) * 0.8) * u;
        if (x < -5 * u || x > W + 5 * u) continue;
        if (m.taken) {
          const k = m.taken / 0.8;
          ctx.strokeStyle = rgba(moteCol, 1 - k); ctx.lineWidth = Math.max(1, 0.15 * u);
          ctx.beginPath(); ctx.arc(x, y, (0.6 + k * 4) * u, 0, 6.283); ctx.stroke();
          continue;
        }
        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR * u);
        g.addColorStop(0, rgba(moteCol, 0.35 + 0.2 * s.conj)); g.addColorStop(1, rgba(moteCol, 0));
        ctx.fillStyle = g; ctx.fillRect(x - glowR * u, y - glowR * u, 2 * glowR * u, 2 * glowR * u);
        ctx.fillStyle = rgba(moteCol); ctx.beginPath(); ctx.arc(x, y, 0.55 * u, 0, 6.283); ctx.fill();
      }

      ctx.fillStyle = rgba(P.ink);
      for (const st of s.stones) {
        const x = (st.x - s.dist) * u, w = st.w * u, h = st.h * u, r = w / 2;
        if (x > W || x + w < 0) continue;
        ctx.globalAlpha = st.fade ? clamp(st.fade, 0, 1) : 1;
        ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy - h + r);
        ctx.arc(x + r, gy - h + r, r, Math.PI, 0); ctx.lineTo(x + w, gy); ctx.closePath(); ctx.fill();
      }
      for (const b of s.birds) {
        const x = (b.x - s.dist) * u;
        if (x < -6 * u || x > W + 6 * u) continue;
        ctx.globalAlpha = b.fade ? clamp(b.fade, 0, 1) : 1;
        drawBird(b, x, (GROUND - b.h - Math.sin(s.clock * 1.5 + b.phase) * 0.6) * u, P.ink);
      }
      ctx.globalAlpha = 1;

      const runX = W * runnerFrac;
      if (s.trail.length > 1) {
        const tg = ctx.createLinearGradient(0, 0, runX, 0);
        tg.addColorStop(0, rgba(P.ink, 0)); tg.addColorStop(1, rgba(P.ink, 0.45));
        ctx.strokeStyle = tg; ctx.lineWidth = Math.max(1, 0.3 * u); ctx.lineCap = 'round';
        ctx.beginPath();
        s.trail.forEach((p, i) => { const x = (p.x - s.dist) * u, y = (GROUND - p.y) * u; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.stroke();
      }
      if (s.broken <= 0) {
        const sqy = 1 - 0.2 * s.squash, sqx = 1 + 0.14 * s.squash;
        ctx.fillStyle = rgba(P.ink, s.invuln > 0 ? 0.5 : 1);
        ctx.beginPath(); ctx.ellipse(runX, (GROUND - s.y - R * sqy) * u, R * sqx * u, R * sqy * u, 0, 0, 6.283); ctx.fill();
        if (s.y < 0) { ctx.strokeStyle = rgba(P.mote, 0.8); ctx.lineWidth = Math.max(1, 0.2 * u); ctx.stroke(); }
      }

      for (const f of s.fx) {
        const x = (f.x - s.dist) * u, y = (GROUND - f.y) * u;
        if (f.kind === 'ring') {
          ctx.strokeStyle = rgba(f.col, f.life * 0.6); ctx.lineWidth = Math.max(1, 0.14 * u);
          ctx.beginPath(); ctx.arc(x, y, (1 - f.life) * f.size * u + R * u * 0.6, 0, 6.283); ctx.stroke();
        } else if (f.kind === 'pulse') {
          const px = W * runnerFrac, py = (GROUND - f.y) * u, pr = (R + (1 - f.life) * B.pulse.reach) * u;
          ctx.strokeStyle = rgba(P.mote, f.life * 0.8); ctx.lineWidth = Math.max(1.5, 0.4 * u * f.life);
          ctx.beginPath(); ctx.arc(px, py, pr, -1.1, 1.1); ctx.stroke();
          ctx.strokeStyle = rgba(P.mote, f.life * 0.25); ctx.lineWidth = Math.max(1, 0.15 * u);
          ctx.beginPath(); ctx.arc(px, py, pr, 0, 6.283); ctx.stroke();
        } else {
          ctx.fillStyle = rgba(P.ink, f.life);
          ctx.beginPath(); ctx.arc(x, y, f.size * u, 0, 6.283); ctx.fill();
        }
      }

      drawParticles(false);

      ctx.fillStyle = grain; ctx.fillRect(0, 0, W, H);
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.16)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

      if (s.hud && s.mode !== 'title') drawHud(th, P);
      if (s.title && !s.settings) drawTitle(P);
      if (s.mode === 'title' && s.hud) settingsLabel(P);
      if (s.mode === 'paused') {
        ctx.fillStyle = rgba(P.sky1, 0.55); ctx.fillRect(0, 0, W, H);
        text('paused', W / 2, 44 * u, 4 * u, P.text, 0.85, { spacing: 0.6 * u });
        text('tap to continue', W / 2, 51 * u, 1.8 * u, P.text, 0.55, { spacing: 0.3 * u });
        if (!s.settings) settingsLabel(P);
      }
      if (s.mode === 'over' && !s.settings) {
        ctx.fillStyle = rgba(P.sky1, 0.55); ctx.fillRect(0, 0, W, H);
        text('終', W / 2, 36 * u, 12 * u, P.text, 0.85);
        text(`${s.motes_} orbs · loop ${th.loop + 1}`, W / 2, 48 * u, 2 * u, P.text, 0.7, { spacing: 0.3 * u });
        text('tap to return', W / 2, 54 * u, 1.6 * u, P.text, 0.5, { spacing: 0.3 * u });
        settingsLabel(P);
      }
      if (s.settings) drawSettings(P);
    }

    function settingsLabel(P) {
      text('settings', W - 4 * u, 4.2 * u, 1.8 * u, P.text, 0.5, { align: 'right', spacing: 0.2 * u });
    }

    function drawSettings(P) {
      ctx.fillStyle = rgba(P.sky1, 0.92); ctx.fillRect(0, 0, W, H);
      const left = W / 2 - 16 * u, right = W / 2 + 16 * u, row = (label, y) => text(label, left, y * u, 1.8 * u, P.text, 0.7, { align: 'left', spacing: 0.3 * u });
      text('settings', W / 2, 36 * u, 2.6 * u, P.text, 0.85, { spacing: 0.6 * u });
      row('sound', ROW.sound);
      text(s.muted ? 'off' : 'on', right, ROW.sound * u, 1.8 * u, P.text, 0.9, { align: 'right', spacing: 0.3 * u });
      row('difficulty', ROW.difficulty);
      LEVELS.forEach((level, i) => {
        const on = s.difficulty === level;
        text(level, levelX(i), ROW.difficulty * u, 1.6 * u, P.text, on ? 0.9 : 0.35, { spacing: 0.2 * u });
        if (on) { ctx.fillStyle = rgba(P.mote); ctx.beginPath(); ctx.arc(levelX(i), (ROW.difficulty + 2.4) * u, 0.35 * u, 0, 6.283); ctx.fill(); }
      });
      text('how fast challenge speeds up each loop', left, (ROW.difficulty + 3.6) * u, 1.1 * u, P.text, 0.35, { align: 'left', spacing: 0.15 * u });
      row('restart', ROW.restart);
      text('back to the start', right, ROW.restart * u, 1.3 * u, P.text, 0.4, { align: 'right', spacing: 0.15 * u });
      text('close', W / 2, ROW.close * u, 1.6 * u, P.text, 0.5, { spacing: 0.4 * u });
    }

    function drawBird(b, x, y, col) {
      ctx.fillStyle = ctx.strokeStyle = rgba(col);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (b.kind === 'raven') {
        const f = Math.sin(s.clock * 12 + b.phase), span = 2.4 * u;
        ctx.lineWidth = Math.max(1.5, 0.5 * u);
        ctx.beginPath();
        ctx.moveTo(x - span, y - f * 1.3 * u);
        ctx.quadraticCurveTo(x - span * 0.4, y - (0.6 + f * 0.6) * u, x, y);
        ctx.quadraticCurveTo(x + span * 0.4, y - (0.6 + f * 0.6) * u, x + span, y - f * 1.3 * u);
        ctx.stroke();
        ctx.beginPath(); ctx.ellipse(x, y + 0.2 * u, 0.9 * u, 0.45 * u, 0, 0, 6.283); ctx.fill();
        ctx.beginPath(); ctx.arc(x - 0.9 * u, y, 0.35 * u, 0, 6.283); ctx.fill();
      } else {
        // drawn facing left, then mirrored: swans fly the way the runner runs
        const f = Math.sin(s.clock * 3 + b.phase);
        ctx.save(); ctx.translate(2 * x, 0); ctx.scale(-1, 1);
        ctx.beginPath(); ctx.ellipse(x, y, 1.9 * u, 0.75 * u, 0, 0, 6.283); ctx.fill();
        ctx.lineWidth = Math.max(1.5, 0.35 * u);
        ctx.beginPath(); ctx.moveTo(x - 1.4 * u, y - 0.2 * u);
        ctx.quadraticCurveTo(x - 2.6 * u, y - 0.6 * u, x - 2.7 * u, y - 2.2 * u); ctx.stroke();
        ctx.beginPath(); ctx.arc(x - 2.75 * u, y - 2.35 * u, 0.4 * u, 0, 6.283); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x - 0.8 * u, y - 0.3 * u);
        ctx.quadraticCurveTo(x + 0.4 * u, y - (2.6 + f) * u, x + 2.4 * u, y - (1.4 + f * 1.6) * u);
        ctx.quadraticCurveTo(x + 0.8 * u, y - 0.9 * u, x + 0.9 * u, y - 0.2 * u); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    // Where the sun and moon are in the sky now, in pixels; either is null while below the horizon.
    function heavens() {
      const loopSeconds = s.ts * 3, ct = s.mode === 'title' ? loopSeconds * 0.15 : s.t;
      const sunK = (ct % loopSeconds) / loopSeconds / B.sky.sunUpShare;
      const moonT = ct - 2 * s.ts, moonP = s.ts * B.sky.moonPeriodInMoods;
      const moonK = moonT >= 0 ? (moonT % moonP) / (moonP / 2) : 1;
      const h = Math.sin(sunK * Math.PI);
      return {
        sun: sunK < 1 ? { x: W * lerp(0.06, 0.94, sunK), y: (92 - 70 * h) * u, r: 9 * u, col: mix(SUN_LOW, SUN_HIGH, h * h) } : null,
        moon: moonK < 1 ? { x: W * lerp(0.1, 0.9, moonK), y: (92 - 76 * Math.sin(moonK * Math.PI)) * u, r: 5.5 * u } : null,
      };
    }

    // While the sun and moon meet: slowly turning rays and a ring around the pair.
    function corona(sun, moon) {
      const cx = (sun.x + moon.x) / 2, cy = (sun.y + moon.y) / 2, r = sun.r, a = s.conj;
      ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(SUN_HIGH, 0.35 * a); ctx.lineWidth = Math.max(1, 0.18 * u);
      ctx.beginPath();
      for (let i = 0; i < 28; i++) {
        const ang = (i / 28) * 6.283 + s.clock * 0.15, len = r * (2.2 + 0.6 * Math.sin(s.clock * 2 + i * 1.7));
        ctx.moveTo(cx + Math.cos(ang) * r * 1.35, cy + Math.sin(ang) * r * 1.35);
        ctx.lineTo(cx + Math.cos(ang) * len, cy + Math.sin(ang) * len);
      }
      ctx.stroke();
      ctx.strokeStyle = rgba(SUN_HIGH, 0.25 * a);
      ctx.beginPath(); ctx.arc(cx, cy, r * (1.6 + 0.08 * Math.sin(s.clock * 1.3)), 0, 6.283); ctx.stroke();
    }

    function orb(x, y, r, col, glowA) {
      const glow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 3.2);
      glow.addColorStop(0, rgba(col, glowA)); glow.addColorStop(1, rgba(col, 0));
      ctx.fillStyle = glow; ctx.fillRect(x - r * 3.2, y - r * 3.2, r * 6.4, r * 6.4);
      ctx.fillStyle = rgba(col, 0.92);
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }

    function drawHud(th, P) {
      const m = 4 * u;
      ctx.fillStyle = rgba(P.mote); ctx.beginPath(); ctx.arc(m + 0.6 * u, m + 0.2 * u, 0.6 * u, 0, 6.283); ctx.fill();
      text(String(s.motes_), m + 2.2 * u, m + 0.2 * u, 2.4 * u, P.text, 0.75, { align: 'left' });
      if (s.streak > 2) text(`${s.streak} unbroken`, m, m + 3.2 * u, 1.5 * u, P.text, 0.4, { align: 'left', spacing: 0.15 * u });
      settingsLabel(P);

      const challenge = s.game === 'challenge';
      const y = H - 3.5 * u, x0 = 9 * u, x1 = W - (challenge ? 34 : 4) * u, k = th.local / s.ts;
      ctx.lineWidth = Math.max(1, 0.12 * u);
      ctx.strokeStyle = rgba(P.ink, 0.15); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.strokeStyle = rgba(P.ink, 0.5); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, k), y); ctx.stroke();
      text(th.theme.kanji, 5.5 * u, y, 2.2 * u, P.text, 0.55);
      text(s.game, 4 * u, y - 5.5 * u, 5.6 * u, P.text, 0.35, { align: 'left', spacing: 0.6 * u });
      if (challenge) {
        // Bottom right: the pulse's repeat window under 波, full when a pulse is back at its base price.
        const d0 = W - 28 * u, d1 = W - 4 * u, cool = Math.min(1, s.pulseSince / C.pulseRepeatWindowSeconds);
        ctx.lineWidth = Math.max(1, 0.12 * u);
        ctx.strokeStyle = rgba(P.ink, 0.12); ctx.beginPath(); ctx.moveTo(d0, y); ctx.lineTo(d1, y); ctx.stroke();
        ctx.strokeStyle = cool >= 1 ? rgba(P.mote, 0.85) : rgba(P.ink, 0.4);
        ctx.beginPath(); ctx.moveTo(d0, y); ctx.lineTo(lerp(d0, d1, cool), y); ctx.stroke();
        text('波', d0 - 1 * u, y, 1.6 * u, P.text, 0.55, { align: 'right' });

        // Above it: the lives left, one dash each, under 生.
        const ly = y - 4 * u, n = B.hits.lives, seg = (d1 - d0) / n;
        ctx.lineWidth = Math.max(1, 0.3 * u);
        for (let i = 0; i < n; i++) {
          ctx.strokeStyle = i < s.lives ? rgba(P.ink, 0.6) : rgba(P.ink, 0.12);
          ctx.beginPath(); ctx.moveTo(d0 + i * seg + 0.4 * u, ly); ctx.lineTo(d0 + (i + 1) * seg - 0.4 * u, ly); ctx.stroke();
        }
        ctx.lineWidth = Math.max(1, 0.12 * u);
        text('生', d0 - 1 * u, ly, 1.6 * u, P.text, 0.55, { align: 'right' });

        // Centred above the timeline: the energy left as a number and a bar against the max, lit while a jump is affordable.
        const e0 = W / 2 - 12 * u, e1 = W / 2 + 12 * u, ey = y - 4 * u, ready = s.energy >= C.jumps[0];
        ctx.strokeStyle = rgba(P.ink, 0.12); ctx.beginPath(); ctx.moveTo(e0, ey); ctx.lineTo(e1, ey); ctx.stroke();
        ctx.lineWidth = Math.max(1, (ready ? 0.3 : 0.12) * u);
        ctx.strokeStyle = ready ? rgba(P.mote, 0.85) : rgba(P.ink, 0.4);
        ctx.beginPath(); ctx.moveTo(e0, ey); ctx.lineTo(lerp(e0, e1, s.energy / s.maxEnergy), ey); ctx.stroke();
        text(String(Math.floor(s.energy)), e0 - 1.2 * u, ey, 3 * u, P.text, 0.6, { align: 'right' });
        text(String(s.maxEnergy), e1 + 1.2 * u, ey, 3 * u, P.text, 0.35, { align: 'left' });
      }
      ctx.lineWidth = Math.max(1, 0.12 * u);
      if (challenge) text(`loop ${th.loop + 1}`, x1, y - 2 * u, 1.4 * u, P.text, 0.4, { align: 'right', spacing: 0.15 * u });

      if (th.local < 7) {
        const a = Math.min(1, th.local / 1.2) * Math.min(1, (7 - th.local) / 2);
        text(th.theme.kanji, W / 2, 26 * u, 12 * u, P.text, a * 0.8);
        text(`${th.theme.romaji} · ${th.theme.key}`, W / 2, 35 * u, 1.8 * u, P.text, a * 0.6, { spacing: 0.5 * u });
      }
    }

    function drawTitle(P) {
      text('道', W / 2, 30 * u, 15 * u, P.text, 0.88);
      text('michi', W / 2, 42 * u, 3.4 * u, P.text, 0.85, { spacing: 1.2 * u });
      text('a quiet runner', W / 2, 47 * u, 1.7 * u, P.text, 0.5, { spacing: 0.4 * u });
      if (s.mode === 'title') {
        const choice = (label, sub, x, on) => {
          text(label, x, 58 * u, 2.6 * u, P.text, on ? 0.9 : 0.4, { spacing: 0.6 * u });
          text(sub, x, 62 * u, 1.4 * u, P.text, on ? 0.55 : 0.25, { spacing: 0.3 * u });
          if (on) { ctx.fillStyle = rgba(P.mote); ctx.beginPath(); ctx.arc(x, 65.5 * u, 0.4 * u, 0, 6.283); ctx.fill(); }
        };
        choice('challenge', 'ever rising', W / 2 - 12 * u, s.pick === 0);
        choice('zen', 'calm, endless', W / 2 + 12 * u, s.pick === 1);
        const a = 0.3 + 0.25 * Math.sin(s.clock * 2.2);
        text('tap one · or ← → and space', W / 2, 96 * u, 1.5 * u, P.text, a, { spacing: 0.4 * u });

        // The moves, with their energy cost while challenge is picked.
        const moves = [['↑', 'jump', C.jumps.join(' · ')], ['↓', 'dash', C.dash], ['←', 'hover', C.hovers.join(' · ')], ['→', 'pulse', `${C.pulse} ×2`]];
        const step = Math.min(13 * u, W / 4.6);
        moves.forEach(([key, label, cost], i) => {
          const x = W / 2 + (i - 1.5) * step;
          text(key, x, 84 * u, 2.2 * u, P.text, 0.6);
          text(label, x, 87.3 * u, 1.3 * u, P.text, 0.45, { spacing: 0.2 * u });
          if (s.pick === 0) text(String(cost), x, 89.6 * u, 1.1 * u, P.mote, 0.7);
        });
        text('touch · tap to jump, swipe for the rest', W / 2, 92.5 * u, 1.1 * u, P.text, 0.3, { spacing: 0.2 * u });
      }
    }

    return {
      state: s, resize, update, draw, press, release, takeBack, dash, hover, endHover, pulse, start, pause, resume, toTitle,
      tapSettings, settingsLabelHit, toggleSettings() { s.settings = !s.settings; },
      togglePause() { s.mode === 'paused' ? resume() : pause(); },
      theme: () => themeNow().theme,
      unit: () => u,
    };
  }

  return { create, THEMES };
})();
