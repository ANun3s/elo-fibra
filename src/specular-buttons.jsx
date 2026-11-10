import './service-navigation';
import './scroll-text';
import './page-blur';
import './navigation';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import SpecularButton from './components/SpecularButton';
import './specular-buttons.css';

const selector = 'button, a.button, .section-nav a, .faq-list summary, .bubble-menu-items .pill-link';
const ids = new WeakMap();
let nextId = 0;

function SpecularButtons() {
  const [targets, setTargets] = useState([]);
  useEffect(() => {
    const discover = () => {
      const next = [...document.querySelectorAll(selector)].filter(target => !target.closest('.elo-folder, .gooey-nav-container, .swap-window-close'));
      next.forEach(target => {
        target.classList.add('has-specular');
        if (!ids.has(target)) ids.set(target, nextId++);
      });
      setTargets(previous => previous.length === next.length && previous.every((target, index) => target === next[index]) ? previous : next);
    };
    discover();
    // Include dynamic controls, while leaving folder animations free of shader overlays.
    let frame = 0;
    const mutations = new MutationObserver(records => {
      const changed = records.some(record => [...record.addedNodes, ...record.removedNodes].some(node =>
        node.nodeType === 1 && (node.matches(selector) || node.querySelector(selector))
      ));
      if (changed && !frame) frame = requestAnimationFrame(() => { frame = 0; discover(); });
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => { mutations.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  const [visible, setVisible] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(!motion.matches && pointer.matches && !document.hidden);
    update();
    motion.addEventListener('change', update);
    pointer.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    const visibleTargets = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      });
      setVisible([...visibleTargets]);
    });
    targets.forEach(target => observer.observe(target));
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', update);
      pointer.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [targets]);

  return enabled ? visible.filter(target => target.isConnected).map(target => <SpecularButton
    key={ids.get(target)}
    target={target}
    size="lg"
    radius={parseFloat(getComputedStyle(target).borderTopLeftRadius) || 18}
    tint="#ffffff"
    tintOpacity={0}
    blur={0}
    textColor="#f5f5f5"
    lineColor="#ffffff"
    baseColor="#525252"
    intensity={1}
    shineSize={10}
    shineFade={40}
    thickness={1}
    speed={0.35}
    followMouse
    proximity={250}
    autoAnimate={false}
  />) : null;
}

if ('IntersectionObserver' in window) {
  // Portals add only decorative spans. Native controls and existing event handlers stay intact.
  createRoot(document.createElement('div')).render(<SpecularButtons />);
}
