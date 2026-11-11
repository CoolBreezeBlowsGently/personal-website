/* Breeze — wind field, scroll reveals, current-section nav. No dependencies. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ------------------------------------------------------- */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- scroll reveals --------------------------------------------- */
  const revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach((el, i) => {
      el.style.setProperty('--i', String(Math.min(i % 4, 3)));
      io.observe(el);
    });
  }

  /* ---------- current section in nav ------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const observedSections = [
    document.getElementById('top'),
    ...navLinks.map((link) => document.querySelector(link.getAttribute('href'))),
  ].filter(Boolean);

  if (observedSections.length && 'IntersectionObserver' in window) {
    const markCurrent = (id) => {
      navLinks.forEach((link) => {
        const on = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-current', on);
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) markCurrent(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    observedSections.forEach((section) => navIo.observe(section));
  }

  /* ---------- hero wind field -------------------------------------------- */
  const canvas = document.querySelector('.hero__wind');
  const hero = document.getElementById('top');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let raf = 0;
  let running = false;
  let pointer = { x: -9999, y: -9999, active: false };

  const field = (x, y, t) => {
    // Smooth pseudo-flow built from offset sinusoids: cheap, seamless, no assets.
    const a =
      Math.sin(x * 0.0022 + t * 0.00032) * 1.15 +
      Math.cos(y * 0.0029 - t * 0.00021) * 0.95 +
      Math.sin((x + y) * 0.0014 + t * 0.00017) * 0.55;
    return a;
  };

  const seed = () => {
    const density = Math.min(240, Math.max(48, Math.round((width * height) / 11000)));
    particles = Array.from({ length: density }, () => spawn());
  };

  function spawn() {
    const x = Math.random() * width;
    const y = Math.random() * height;
    return {
      x,
      y,
      px: x,
      py: y,
      life: Math.random(),
      decay: 0.0018 + Math.random() * 0.0032,
      speed: 0.55 + Math.random() * 0.95,
      hue: Math.random(),
    };
  }

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  };

  const step = (t) => {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      const angle = field(p.x, p.y, t);
      let vx = Math.cos(angle) * p.speed;
      let vy = Math.sin(angle) * p.speed;

      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 190 && dist > 0.5) {
          const force = (1 - dist / 190) * 2.6;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
        }
      }

      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy;
      p.life -= p.decay;

      const edge =
        p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20 || p.life <= 0;

      if (edge) {
        const fresh = spawn();
        p.x = fresh.x;
        p.y = fresh.y;
        p.px = fresh.x;
        p.py = fresh.y;
        p.life = 1;
        p.speed = fresh.speed;
        continue;
      }

      const alpha = 0.2 * Math.min(1, p.life * 1.8);
      ctx.strokeStyle = `rgba(230, 242, 236, ${alpha.toFixed(3)})`;
      ctx.lineWidth = p.hue > 0.93 ? 1.4 : 0.9;
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    raf = requestAnimationFrame(step);
  };

  const start = () => {
    if (running || reduceMotion) return;
    running = true;
    raf = requestAnimationFrame(step);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const drawStill = () => {
    // Reduced motion: one composed frame, same field, no movement.
    ctx.clearRect(0, 0, width, height);
    const lines = 26;
    for (let i = 0; i < lines; i += 1) {
      const yBase = (height / lines) * i + 6;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 14) {
        const y = yBase + Math.sin(x * 0.0032 + i * 0.7) * 16 + Math.cos(x * 0.0011 + i) * 9;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(230, 242, 236, ${(0.05 + (i % 3) * 0.02).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  resize();
  if (reduceMotion) drawStill();

  const onPointerMove = (event) => {
    const rect = hero.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  };
  const onPointerLeave = () => { pointer.active = false; };

  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // Only animate while the hero is on screen and the tab is visible.
  let inView = true;
  const tick = () => { if (inView && !document.hidden) start(); else stop(); };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      tick();
    }, { threshold: 0 }).observe(hero);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', tick);

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resize();
      if (reduceMotion) drawStill();
    }, 180);
  });
})();
