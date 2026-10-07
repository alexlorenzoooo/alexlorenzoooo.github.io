/* Alex Lorenzo-Gomez portfolio scripts */

/* ===== Terminal typing (hero Nmap scan) ===== */
(function () {
  var lines = [
    '<span class="c">alex@lab</span>:~$ nmap -sV alex',
    '<span class="m">Starting Nmap scan...</span>',
    'Nmap scan report for alex (Alexandria, VA)',
    'Host is up. Open to new opportunities.',
    '',
    '<span class="h">PORT      STATE  SERVICE            VERSION</span>',
    '22/tcp    <span class="g">open</span>   troubleshooting    Geek Squad',
    '80/tcp    <span class="g">open</span>   desktop-support    Windows, macOS, Linux',
    '443/tcp   <span class="g">open</span>   security-analysis  Wireshark, Splunk',
    '3389/tcp  <span class="g">open</span>   forensics          FTK Imager, Autopsy',
    '8080/tcp  <span class="g">open</span>   customer-support   English, Spanish',
    '',
    '<span class="m">Service detection complete. 1 host up.</span>',
    '<span class="c">alex@lab</span>:~$ '
  ];
  var el = document.getElementById('scan');
  var cursor = '<span class="cursor"></span>';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { el.innerHTML = lines.join('\n') + cursor; return; }
  var i = 0;
  function next() {
    el.innerHTML = lines.slice(0, i + 1).join('\n') + cursor;
    i++;
    if (i < lines.length) setTimeout(next, i === 1 ? 700 : (lines[i - 1] === '' ? 120 : 240));
  }
  setTimeout(next, 400);
})();


/* ===== Logo animation replay ===== */
(function () {
  var brand = document.querySelector('.brand');
  var head = brand && brand.querySelector('.logo');
  function replay(svg) { svg.classList.remove('go'); void svg.getBoundingClientRect(); svg.classList.add('go'); }
  if (brand && head) brand.addEventListener('mouseenter', function () { replay(head); });
  var foot = document.querySelector('footer .logo');
  if (!foot) return;
  if (!('IntersectionObserver' in window)) { foot.classList.add('go'); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { foot.classList.add('go'); io.disconnect(); } });
  }, { threshold: 0.6 });
  io.observe(foot);
})();


/* ===== Hover cards: lift, bob, tilt, spotlight ===== */
(function () {
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var groups = [
    { sel: '.term', tilt: 7, lift: 8, bob: 3 },
    { sel: '.proj, .job', tilt: 3.5, lift: 7, bob: 2.5 },
    { sel: '.tl .card, .skill, .edu article, .platforms', tilt: 4, lift: 6, bob: 2.5 },
    { sel: '.resume-frame', tilt: 4, lift: 6, bob: 2 }
  ];
  var items = [];
  groups.forEach(function (g) {
    document.querySelectorAll(g.sel).forEach(function (el) {
      el.classList.add('alive');
      items.push({ el: el, g: g, h: 0, ht: 0, rx: 0, ry: 0, rxt: 0, ryt: 0, phase: Math.random() * 6.28 });
    });
  });
  if (!canHover) return;
  var running = false;
  function tick(now) {
    var active = false;
    items.forEach(function (it) {
      it.h += (it.ht - it.h) * 0.12;
      it.rx += (it.rxt - it.rx) * 0.14;
      it.ry += (it.ryt - it.ry) * 0.14;
      if (it.ht === 0 && it.h < 0.002 && Math.abs(it.rx) < 0.01 && Math.abs(it.ry) < 0.01) {
        if (it.el.style.transform) it.el.style.transform = '';
        return;
      }
      active = true;
      var bob = calm ? 0 : Math.sin(now / 420 + it.phase) * it.g.bob;
      var y = -it.h * (it.g.lift + bob);
      var sc = 1 + 0.015 * it.h;
      it.el.style.transform = 'perspective(1000px) translateY(' + y.toFixed(2) + 'px) rotateX(' + it.rx.toFixed(2) + 'deg) rotateY(' + it.ry.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
    });
    if (active) requestAnimationFrame(tick); else running = false;
  }
  function start() { if (!running) { running = true; requestAnimationFrame(tick); } }
  items.forEach(function (it) {
    var el = it.el;
    el.addEventListener('pointerenter', function () { it.ht = 1; el.classList.add('is-hover'); start(); });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      if (!calm) { it.ryt = (x - 0.5) * 2 * it.g.tilt; it.rxt = (0.5 - y) * 2 * it.g.tilt; }
      start();
    });
    el.addEventListener('pointerleave', function () { it.ht = 0; it.rxt = 0; it.ryt = 0; el.classList.remove('is-hover'); start(); });
  });
})();


/* ===== Timeline charging line ===== */
(function () {
  var wrap = document.querySelector('.tl-wrap');
  if (!wrap) return;
  var track = wrap.querySelector('.tl-track');
  var lis = Array.prototype.slice.call(wrap.querySelectorAll('.tl > li'));
  var nowLi = wrap.querySelector('.tl > li.now') || lis[lis.length - 1];
  var lastLi = lis[lis.length - 1];
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = 0, maxY = 0, lastY = 0, ys = [], running = false, done = false;
  function nodeY(li) { var n = li.querySelector('.node'); return li.offsetTop + n.offsetTop + n.offsetHeight / 2; }
  function measure() {
    ys = lis.map(nodeY); maxY = nodeY(nowLi); lastY = nodeY(lastLi);
    track.style.setProperty('--now', maxY + 'px');
    track.style.setProperty('--dist', Math.max(0, lastY - maxY - 12) + 'px');
  }
  function paint() {
    track.style.setProperty('--fill', cur.toFixed(1) + 'px');
    lis.forEach(function (li, i) { if (!li.classList.contains('future') && ys[i] <= cur + 2) li.classList.add('charged'); });
    if (cur >= maxY - 0.5) { done = true; track.classList.add('full'); }
  }
  function target() { return Math.min(maxY, Math.max(0, window.innerHeight * 0.62 - wrap.getBoundingClientRect().top)); }
  function tick() {
    var t = Math.max(cur, target());
    cur += (t - cur) * 0.07;
    if (t - cur < 0.5) cur = t;
    paint();
    if (!done && t - cur > 0.01) requestAnimationFrame(tick); else running = false;
  }
  function kick() { if (done || running) return; running = true; requestAnimationFrame(tick); }
  measure();
  if (calm) { cur = maxY; paint(); return; }
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', function () { measure(); if (done) { cur = maxY; paint(); } else kick(); });
  kick();
})();


/* ===== Platforms box growing border ===== */
(function () {
  var box = document.getElementById('platforms');
  if (!box) return;
  var rects = box.querySelectorAll('.trace rect');
  function size() {
    var w = box.offsetWidth, h = box.offsetHeight, r = 16;
    rects.forEach(function (rc) {
      rc.setAttribute('x', 0.8); rc.setAttribute('y', 0.8);
      rc.setAttribute('width', Math.max(0, w - 1.6)); rc.setAttribute('height', Math.max(0, h - 1.6));
      rc.setAttribute('rx', r); rc.setAttribute('ry', r);
    });
  }
  size();
  window.addEventListener('resize', size);
  if (!('IntersectionObserver' in window)) { box.classList.add('on'); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { box.classList.add('on'); io.disconnect(); } });
  }, { threshold: 0.8 });
  io.observe(box);
})();


/* ===== Machine background: glass blocks, dust, and light trails that flow with scrolling ===== */
(function () {
  var cv = document.getElementById('bg'); if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.innerWidth < 760;
  var W = 0, H = 0, F = 0, ZMIN = 9, ZMAX = 130;
  var cubes = [], dust = [], trails = [];
  var camY = 0, drift = 0, scrollCam = 0, mx = 0, my = 0, cx = 0, cyo = 0, roll = 0, last = 0, acc = 0, t = 0, lastScroll = window.scrollY, spin = 1;
  var SCROLL_K = 0.022;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function resize() { W = cv.width = Math.round(window.innerWidth); H = cv.height = Math.round(window.innerHeight); F = Math.min(W, H) * 0.9; }
  function halfH(d) { return (H / 2) / F * d + 4; }
  function halfW(d) { return (W / 2) / F * d + 4; }
  function makeCube(yCenter) {
    var d = ZMIN + Math.pow(Math.random(), 0.8) * (ZMAX - ZMIN);
    var s = rnd(0.6, 2.4), tall = Math.random() < .35 ? rnd(1.6, 3.2) : rnd(.8, 1.3);
    return { x: rnd(-1, 1) * halfW(d), y: yCenter + rnd(-1, 1) * halfH(d), z: -d, sx: s, sy: s * tall, sz: s,
      ax: rnd(0, 6.28), ay: rnd(0, 6.28), az: rnd(0, 6.28), vx: rnd(-.12, .12), vy: rnd(-.16, .16), vz: rnd(-.08, .08), tone: rnd(.8, 1.15) };
  }
  function seed() {
    cubes = []; dust = []; trails = [];
    var N = small ? 60 : 125;
    for (var i = 0; i < N; i++) cubes.push(makeCube(camY));
    for (var j = 0; j < (small ? 150 : 340); j++) { var d = rnd(2, ZMAX); dust.push({ x: rnd(-1, 1) * halfW(d), y: camY + rnd(-1, 1) * halfH(d), z: -d, p: rnd(0, 6.28), sp: rnd(.2, .7) }); }
    var TC = ['111,240,181', '255,120,150', '176,140,255', '143,180,255'];
    for (var k = 0; k < 4; k++) trails.push(makeTrail(TC[k], true));
  }
  function makeTrail(c, anywhere) {
    var d = rnd(25, 80), dir = Math.random() < .5 ? 1 : -1;
    return { c: c, z: -d, x: rnd(-.8, .8) * halfW(d), y: anywhere ? camY + rnd(-1, 1) * halfH(d) : camY - dir * halfH(d), dir: dir, sp: rnd(7, 13), sway: rnd(2, 5), ph: rnd(0, 6.28), hist: [] };
  }
  var V = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  var FACES = [[0,1,2,3,0,0,-1],[5,4,7,6,0,0,1],[4,0,3,7,-1,0,0],[1,5,6,2,1,0,0],[3,2,6,7,0,1,0],[4,5,1,0,0,-1,0]];
  var L = [-.45, .72, .52]; var ll = Math.hypot(L[0], L[1], L[2]); L = [L[0]/ll, L[1]/ll, L[2]/ll];
  function rot(v, c) {
    var x = v[0], y = v[1], z = v[2], s, co, t1;
    s = Math.sin(c.ax); co = Math.cos(c.ax); t1 = y * co - z * s; z = y * s + z * co; y = t1;
    s = Math.sin(c.ay); co = Math.cos(c.ay); t1 = x * co + z * s; z = -x * s + z * co; x = t1;
    s = Math.sin(c.az); co = Math.cos(c.az); t1 = x * co - y * s; y = x * s + y * co; x = t1;
    return [x, y, z];
  }
  function view(x, y, z) {
    x -= cx; y -= camY + cyo;
    var s = Math.sin(roll), c = Math.cos(roll);
    return [x * c - y * s, x * s + y * c, z];
  }
  function proj(v) { var d = -v[2]; return [W / 2 + F * v[0] / d, H / 2 - F * v[1] / d]; }
  function wrapY(o, d) { var hh = halfH(d); if (o.y - camY > hh) o.y -= 2 * hh; else if (o.y - camY < -hh) o.y += 2 * hh; }
  function draw(dt) {
    t += dt;
    if (!calm) {
      var sy = window.scrollY, vel = (sy - lastScroll) / Math.max(dt, .016); lastScroll = sy;
      spin += ((1 + Math.min(6, Math.abs(vel) / 260)) - spin) * .1;
      drift -= dt * .35;
      scrollCam += (-sy * SCROLL_K - scrollCam) * .09;
      camY = drift + scrollCam;
      cx += (mx * 2.2 - cx) * .04; cyo += (-my * 1.6 - cyo) * .04;
      roll = Math.sin(t * .07) * .06;
    }
    ctx.clearRect(0, 0, W, H);
    var list = cubes.slice().sort(function (a, b) { return a.z - b.z; });
    for (var n = 0; n < list.length; n++) {
      var cb = list[n], depth = -cb.z;
      wrapY(cb, depth);
      if (!calm) { cb.ax += cb.vx * dt * spin; cb.ay += cb.vy * dt * spin; cb.az += cb.vz * dt * spin; }
      var fog = Math.max(0, Math.min(1, 1 - depth / ZMAX)); fog = fog * fog;
      if (fog < .02) continue;
      var near = Math.min(1, Math.max(0, (depth - ZMIN + 2) / 10));
      var pts = [], vv = [];
      for (var q = 0; q < 8; q++) {
        var r = rot([V[q][0] * cb.sx / 2, V[q][1] * cb.sy / 2, V[q][2] * cb.sz / 2], cb);
        var w = view(cb.x + r[0], cb.y + r[1], cb.z + r[2]);
        vv.push(w); pts.push(proj(w));
      }
      for (var f = 0; f < 6; f++) {
        var fc = FACES[f]; var nrm = rot([fc[4], fc[5], fc[6]], cb);
        var a = vv[fc[0]];
        if (nrm[0] * a[0] + nrm[1] * a[1] + nrm[2] * a[2] >= 0) continue;
        var lit = Math.max(0, nrm[0] * L[0] + nrm[1] * L[1] + nrm[2] * L[2]);
        var R = Math.round((95 + 150 * lit) * cb.tone), Gc = Math.round((125 + 120 * lit) * cb.tone);
        var al = (.08 + .30 * lit) * fog * near;
        ctx.beginPath();
        ctx.moveTo(pts[fc[0]][0], pts[fc[0]][1]); ctx.lineTo(pts[fc[1]][0], pts[fc[1]][1]); ctx.lineTo(pts[fc[2]][0], pts[fc[2]][1]); ctx.lineTo(pts[fc[3]][0], pts[fc[3]][1]); ctx.closePath();
        ctx.fillStyle = 'rgba(' + Math.min(255, R) + ',' + Math.min(255, Gc) + ',255,' + al.toFixed(3) + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(215,232,255,' + (al * .75).toFixed(3) + ')'; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    for (var di = 0; di < dust.length; di++) {
      var p = dust[di], dd = -p.z;
      if (!calm) p.y += p.sp * dt * .35;
      wrapY(p, dd);
      var pp = proj(view(p.x, p.y, p.z));
      if (pp[0] < -5 || pp[0] > W + 5 || pp[1] < -5 || pp[1] > H + 5) continue;
      var tw = .55 + .45 * Math.sin(t * 2.2 + p.p), fg = Math.max(0, 1 - dd / ZMAX), sz = Math.max(.6, 2.6 / dd * 9);
      ctx.fillStyle = 'rgba(200,222,255,' + (fg * tw * .85).toFixed(3) + ')';
      ctx.fillRect(pp[0] - sz / 2, pp[1] - sz / 2, sz, sz);
    }
    ctx.globalCompositeOperation = 'lighter';
    for (var m = 0; m < trails.length; m++) {
      var tr = trails[m], td = -tr.z;
      if (!calm) { tr.y += tr.dir * tr.sp * dt; tr.ph += dt * 1.3; }
      var hx = tr.x + Math.sin(tr.ph) * tr.sway;
      tr.hist.push([hx, tr.y]); if (tr.hist.length > 28) tr.hist.shift();
      if (Math.abs(tr.y - camY) > halfH(td) + 6) { trails[m] = makeTrail(tr.c, false); continue; }
      var fgT = Math.max(0, Math.min(1, 1 - td / 100));
      var prev = null;
      for (var h = 0; h < tr.hist.length; h++) {
        var hp = proj(view(tr.hist[h][0], tr.hist[h][1], tr.z));
        if (prev) { ctx.strokeStyle = 'rgba(' + tr.c + ',' + (h / tr.hist.length * .8 * fgT).toFixed(3) + ')'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(hp[0], hp[1]); ctx.stroke(); }
        prev = hp;
      }
      if (prev) { var g = ctx.createRadialGradient(prev[0], prev[1], 0, prev[0], prev[1], 9); g.addColorStop(0, 'rgba(' + tr.c + ',' + (.9 * fgT).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + tr.c + ',0)'); ctx.fillStyle = g; ctx.fillRect(prev[0] - 9, prev[1] - 9, 18, 18); }
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  function loop(now) {
    if (document.hidden) { last = now; requestAnimationFrame(loop); return; }
    var dt = Math.min(.1, (now - (last || now)) / 1000); last = now; acc += dt;
    if (acc >= 1 / 30) { draw(acc); acc = 0; }
    requestAnimationFrame(loop);
  }
  resize(); seed();
  window.addEventListener('resize', function () { resize(); if (calm) draw(0); });
  window.addEventListener('pointermove', function (e) { mx = e.clientX / window.innerWidth - .5; my = e.clientY / window.innerHeight - .5; }, { passive: true });
  if (calm) draw(0); else { scrollCam = -window.scrollY * SCROLL_K; camY = scrollCam; seed(); requestAnimationFrame(loop); }
})();

/* ===== Plaza floor: circuit grid with data packets wandering like a crowd ===== */
(function () {
  var cv = document.getElementById('floor'); if (!cv || !cv.getContext) return;
  var ctx = cv.getContext('2d');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var S = 44, W = 0, H = 0, cols = 0, rows = 0, packets = [], last = 0, acc = 0, visible = true;
  var COLORS = ['175,203,255', '175,203,255', '143,180,255', '108,240,181', '255,255,255', '255,120,150'];
  function resize() {
    var r = cv.getBoundingClientRect();
    W = cv.width = Math.max(1, Math.round(cv.offsetWidth)); H = cv.height = Math.max(1, Math.round(cv.offsetHeight));
    cols = Math.floor(W / S); rows = Math.floor(H / S);
    packets = [];
    var n = Math.round(cols * rows * .09);
    for (var i = 0; i < n; i++) packets.push(spawn());
  }
  var DIRS = [[1,0],[-1,0],[0,1],[0,-1]];
  function spawn() {
    var d = DIRS[Math.floor(Math.random() * 4)];
    var c = COLORS[Math.floor(Math.random() * COLORS.length)];
    if (c === '255,120,150' && Math.random() < .6) c = COLORS[0];
    return { gx: Math.floor(Math.random() * cols), gy: Math.floor(Math.random() * rows), dx: d[0], dy: d[1], f: Math.random(), sp: .6 + Math.random() * 1.1, c: c, hist: [], pause: 0 };
  }
  function step(p) {
    p.gx += p.dx; p.gy += p.dy;
    if (p.gx < 0 || p.gy < 0 || p.gx > cols || p.gy > rows) { var np = spawn(); for (var k in np) p[k] = np[k]; return; }
    var r = Math.random();
    if (r < .2) { var t = p.dx; p.dx = -p.dy; p.dy = t; } else if (r < .4) { var t2 = p.dx; p.dx = p.dy; p.dy = -t2; }
    if (Math.random() < .08) p.pause = .4 + Math.random() * 1.2;
  }
  function draw(dt, now) {
    ctx.clearRect(0, 0, W, H);
    // glow pool
    var g = ctx.createRadialGradient(W / 2, H * .7, 0, W / 2, H * .7, W * .5);
    g.addColorStop(0, 'rgba(64,120,255,.22)'); g.addColorStop(1, 'rgba(64,120,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // grid
    ctx.lineWidth = 1;
    for (var x = 0; x <= cols; x++) { ctx.strokeStyle = 'rgba(120,165,255,' + (x % 4 === 0 ? .28 : .13) + ')'; ctx.beginPath(); ctx.moveTo(x * S + .5, 0); ctx.lineTo(x * S + .5, rows * S); ctx.stroke(); }
    for (var y = 0; y <= rows; y++) { ctx.strokeStyle = 'rgba(120,165,255,' + (y % 4 === 0 ? .28 : .13) + ')'; ctx.beginPath(); ctx.moveTo(0, y * S + .5); ctx.lineTo(cols * S, y * S + .5); ctx.stroke(); }
    // node pulses
    var tt = now / 1000;
    for (var nx = 0; nx <= cols; nx += 4) for (var ny = 0; ny <= rows; ny += 4) {
      var a = .25 + .25 * Math.sin(tt * 1.5 + nx * .7 + ny * 1.3);
      ctx.fillStyle = 'rgba(175,203,255,' + a.toFixed(3) + ')'; ctx.fillRect(nx * S - 2, ny * S - 2, 4, 4);
    }
    // packets
    for (var i = 0; i < packets.length; i++) {
      var p = packets[i];
      if (!calm) {
        if (p.pause > 0) p.pause -= dt; else { p.f += dt * p.sp; while (p.f >= 1) { p.f -= 1; step(p); } }
      }
      var px = (p.gx + p.dx * p.f) * S, py = (p.gy + p.dy * p.f) * S;
      p.hist.push([px, py]); if (p.hist.length > 9) p.hist.shift();
      for (var h = 1; h < p.hist.length; h++) {
        ctx.strokeStyle = 'rgba(' + p.c + ',' + (h / p.hist.length * .55).toFixed(3) + ')'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(p.hist[h - 1][0], p.hist[h - 1][1]); ctx.lineTo(p.hist[h][0], p.hist[h][1]); ctx.stroke();
      }
      var gl = ctx.createRadialGradient(px, py, 0, px, py, 12); gl.addColorStop(0, 'rgba(' + p.c + ',.9)'); gl.addColorStop(1, 'rgba(' + p.c + ',0)');
      ctx.fillStyle = gl; ctx.fillRect(px - 12, py - 12, 24, 24);
      ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.fillRect(px - 2.5, py - 2.5, 5, 5);
    }
  }
  function loop(now) {
    var dt = Math.min(.1, (now - (last || now)) / 1000); last = now; acc += dt;
    if (visible && !document.hidden && acc >= 1 / 30) { draw(acc, now); acc = 0; }
    requestAnimationFrame(loop);
  }
  resize();
  window.addEventListener('resize', function () { resize(); if (calm) draw(0, 0); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
  if (calm) draw(0, 0); else requestAnimationFrame(loop);
})();


/* ===== Resume viewer and download ===== */
(function () {
  var dlg = document.getElementById('resume-viewer');
  document.querySelectorAll('[data-open-resume]').forEach(function (b) {
    b.addEventListener('click', function () { if (dlg && dlg.showModal) dlg.showModal(); });
  });
  document.querySelectorAll('[data-close-resume]').forEach(function (b) { b.addEventListener('click', function () { dlg.close(); }); });
  if (dlg) dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  var links = document.querySelectorAll('[data-download-resume]');
  var dataEl = document.getElementById('resume-pdf-data');
  if (!window.claude || !window.claude.use || !dataEl) return; /* self-hosted: the normal file link works */
  links.forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });
  window.claude.use('downloads').then(function (dl) {
    if (!dl) { links.forEach(function (a) { a.hidden = true; }); return; }
    var bytes = null;
    function pdfBlob() {
      if (!bytes) { var bin = atob(dataEl.textContent.trim()); bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); }
      return new Blob([bytes], { type: 'application/pdf' });
    }
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        dl.save({ filename: 'Alex-Lorenzo-Gomez-Resume.pdf', data: pdfBlob() }).catch(function (err) {
          if (err && (err.code === 'unavailable' || err.code === 'not_granted' || err.code === 'capability_disabled' || err.code === 'capability_removed')) links.forEach(function (x) { x.hidden = true; });
        });
      });
    });
  }).catch(function () { links.forEach(function (a) { a.hidden = true; }); });
})();


/* ===== Email chooser pop-up ===== */
(function () {
  var dlg = document.getElementById('email-chooser');
  if (!dlg || !dlg.showModal) return;
  var addr = document.getElementById('mail-addr');
  var btn = dlg.querySelector('[data-copy-mail]');
  var label = btn.querySelector('.copy-label');
  var status = document.getElementById('copy-status');
  var timer = null;
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    if (a.hasAttribute('data-mail-opt')) return;
    a.addEventListener('click', function (e) { e.preventDefault(); resetCopy(); dlg.showModal(); });
  });
  dlg.querySelector('[data-close-mail]').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.querySelectorAll('[data-mail-opt]').forEach(function (a) { a.addEventListener('click', function () { setTimeout(function () { dlg.close(); }, 150); }); });
  function resetCopy() { btn.classList.remove('copied'); label.textContent = 'Copy'; status.textContent = ''; }
  function done(ok) {
    clearTimeout(timer);
    if (ok) { btn.classList.add('copied'); label.textContent = 'Copied!'; status.textContent = 'Email address copied'; }
    else { addr.focus(); addr.select(); label.textContent = 'Press Ctrl/Cmd + C'; status.textContent = 'Address selected. Press Control or Command plus C to copy.'; }
    timer = setTimeout(resetCopy, 2600);
  }
  function legacyCopy() {
    try { addr.focus(); addr.select(); addr.setSelectionRange(0, addr.value.length); var ok = document.execCommand('copy'); addr.setSelectionRange(0, 0); addr.blur(); return ok; } catch (e) { return false; }
  }
  btn.addEventListener('click', function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(addr.value).then(function () { done(true); }, function () { done(legacyCopy()); });
    } else { done(legacyCopy()); }
  });
  addr.addEventListener('focus', function () { addr.select(); });
})();
