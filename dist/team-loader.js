// Keep the 3D engine out of the critical path and preserve HTML badges as fallback.
const team = document.querySelector('#equipe');
if (team) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let loaded = false;
  const load = () => {
    if (loaded || motion.matches) return;
    loaded = true;
    import('/assets/team-lanyards.js?v=release-20261110').catch(() => { loaded = false; });
  };
  const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) load(); }, { rootMargin: '450px' });
  observer.observe(team);
  motion.addEventListener('change', load);
}
