import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import DecryptedText from './components/DecryptedText';
import './scroll-text.css';

// One passive listener for all islands; sampling decays without an idle animation loop.
let previousY = window.scrollY;
let previousTime = performance.now();
let velocity = 0;
const measureScroll = () => {
  const now = performance.now();
  velocity = Math.min(4, Math.abs(window.scrollY - previousY) / Math.max(16, Math.min(64, now - previousTime)));
  previousY = window.scrollY;
  previousTime = now;
};
const readVelocity = () => velocity * Math.max(0, 1 - (performance.now() - previousTime) / 200);
window.addEventListener('scroll', measureScroll, { passive: true });

function ScrollText({ text }) {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return <DecryptedText text={text} animateOn="scroll" scrollVelocity={readVelocity} disabled={reduced}
    revealDirection="center" characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" parentClassName="elo-decrypted" encryptedClassName="decrypt-encrypted"/>;
}

// Intentionally limited to supporting copy. Never mount over another React island.
const selectors = '.benefits article > p, .section-intro > p, .connection-copy > p, .service-copy > p, .tip-line > p, .service-steps p, .listening-list p, .listening-section > div > p';
const excluded = '#planos, #comparar, .hero, .page-intro, .faq, .stories-section, dialog, header, footer, [id$="-root"], #customer-universe';
const mounts = [];
document.querySelectorAll(selectors).forEach(element => {
  if (element.closest(excluded) || element.querySelector('a, button, input, canvas')) return;
  const copy = element.cloneNode(true);
  copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
  const text = copy.textContent.trim();
  if (!text) return;
  element.dataset.scrollText = 'true';
  const root = createRoot(element);
  root.render(<ScrollText text={text}/>);
  mounts.push(root);
});
window.addEventListener('pagehide', event => {
  if (event.persisted) return;
  window.removeEventListener('scroll', measureScroll);
  mounts.forEach(root => root.unmount());
}, { once: true });
