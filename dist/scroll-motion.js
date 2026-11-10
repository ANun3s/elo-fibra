/* Shared scroll choreography. Decorative layers only; native scrolling stays intact. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const targets = [...document.querySelectorAll('[data-scroll-media], [data-mesh-scene], .signature-footer-wordmark')];
  const visible = new Set();
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const pointers = new Map();
  let frame = 0;
  let pageHeight = 1;
  const clamp = (n, low = 0, high = 1) => Math.min(high, Math.max(low, n));

  function measurePage() {
    pageHeight = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    schedule();
  }

  function renderMotion() {
    frame = 0;
    if (document.hidden || reduced.matches) return;
    // Read every box before writing transforms, avoiding repeated layout work.
    const boxes = [...visible].map(element => [element, element.getBoundingClientRect()]);
    progress.style.transform = `scaleX(${clamp(scrollY / pageHeight)})`;
    let settling = false;
    for (const [element, rect] of boxes) {
      const p = clamp((innerHeight - rect.top) / (innerHeight + rect.height));
      if (element.hasAttribute('data-mesh-scene')) {
        const pointer = pointers.get(element);
        const targetX = finePointer.matches ? pointer.x : 0;
        const targetY = finePointer.matches ? pointer.y : 0;
        pointer.currentX += (targetX - pointer.currentX) * 0.12;
        pointer.currentY += (targetY - pointer.currentY) * 0.12;
        settling ||= Math.abs(targetX - pointer.currentX) + Math.abs(targetY - pointer.currentY) > 0.002;
        element.style.setProperty('--mesh-yaw', `${(p - 0.5) * 28 + pointer.currentX * 7}deg`);
        element.style.setProperty('--mesh-pitch', `${-7 + (p - 0.5) * 10 - pointer.currentY * 4}deg`);
        element.style.setProperty('--mesh-lift', `${(0.5 - p) * 22}px`);
        element.style.setProperty('--signal-progress', `${0.3 + p * 0.7}`);
      } else if (element.hasAttribute('data-scroll-media')) {
        const amplitude = finePointer.matches ? 36 : 18;
        element.style.setProperty('--media-shift', `${(p - 0.5) * amplitude}px`);
        element.style.setProperty('--media-scale', `${1.08 + (1 - p) * 0.025}`);
      } else {
        element.style.setProperty('--wordmark-shift', `${(1 - p) * 26}px`);
      }
    }
    if (settling) schedule();
  }

  function schedule() {
    if (!frame && !reduced.matches && !document.hidden) frame = requestAnimationFrame(renderMotion);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    schedule();
  }, { rootMargin: '60px' });

  for (const element of targets) {
    observer.observe(element);
    if (!element.hasAttribute('data-mesh-scene')) continue;
    const pointer = { x: 0, y: 0, currentX: 0, currentY: 0 };
    pointers.set(element, pointer);
    element.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      const rect = element.getBoundingClientRect();
      pointer.x = clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1;
      pointer.y = clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1;
      schedule();
    }, { passive: true });
    element.addEventListener('pointerleave', () => {
      pointer.x = pointer.y = 0;
      schedule();
    });
  }

  function motionPreferenceChanged() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    document.documentElement.classList.toggle('scroll-motion-enabled', !reduced.matches);
    progress.hidden = reduced.matches;
    for (const element of targets) {
      for (const name of ['--mesh-yaw', '--mesh-pitch', '--mesh-lift', '--signal-progress', '--media-shift', '--media-scale', '--wordmark-shift']) element.style.removeProperty(name);
    }
    for (const pointer of pointers.values()) pointer.x = pointer.y = pointer.currentX = pointer.currentY = 0;
    measurePage();
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measurePage, { passive: true });
  addEventListener('pageshow', measurePage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else measurePage();
  });
  new ResizeObserver(measurePage).observe(document.body);
  reduced.addEventListener('change', motionPreferenceChanged);
  finePointer.addEventListener('change', schedule);
  motionPreferenceChanged();
})();
