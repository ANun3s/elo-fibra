// Progressively enhance the installation narrative; mobile keeps every image visible.
const processSteps = [...document.querySelectorAll('[data-process-step]')];
const processImages = [...document.querySelectorAll('[data-process-image]')];
if (processSteps.length) {
  const desktop = matchMedia('(min-width: 801px)');
  let queued = false;
  let current = -1;
  const update = () => {
    queued = false;
    if (!desktop.matches) return;
    const guideLine = innerHeight * 0.5;
    let next = 0;
    processSteps.forEach((step, i) => {
      if (step.getBoundingClientRect().top <= guideLine) next = i;
    });
    if (next === current) return;
    current = next;
    processSteps.forEach((step, i) => step.classList.toggle('is-active', i === next));
    processImages.forEach((image, i) => {
      image.classList.toggle('is-active', i === next);
      image.setAttribute('aria-hidden', String(i !== next));
    });
  };
  const schedule = () => {
    if (queued || !desktop.matches) return;
    queued = true;
    requestAnimationFrame(update);
  };
  // Only track scrolling while the section is close to the viewport.
  const observer = new IntersectionObserver(([entry]) => {
    window.removeEventListener('scroll', schedule);
    if (entry.isIntersecting) window.addEventListener('scroll', schedule, { passive: true });
    schedule();
  }, { rootMargin: '100px' });
  observer.observe(document.querySelector('.care-process'));
  window.addEventListener('resize', schedule, { passive: true });
  desktop.addEventListener('change', schedule);
  update();
}
