import { Component, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './components/Lanyard';

class BadgeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function TeamBadge({ name, front, back }) {
  const host = useRef(null);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const onInteract = useCallback(() => setInteracted(true), []);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!media.matches && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(host.current);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);
  const active = visible && enabled;
  useEffect(() => { if (!active) setReady(false); }, [active]);
  const staticCard = <div className="team-static-card"><img src={front} alt={`Crachá ilustrado de ${name}`} width="600" height="906" /></div>;
  return <div ref={host} className="team-badge-stage">
    <BadgeBoundary fallback={staticCard}>
      {(!active || !ready) && staticCard}
      {active && <div className="team-badge-canvas" aria-hidden="true">
        <Suspense fallback={null}>
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} fov={14} frontImage={front} backImage={back}
            lanyardImage="/assets/team/band.svg" imageFit="cover" lanyardWidth={1} onReady={onReady} onInteract={onInteract}/>
        </Suspense>
      </div>}
    </BadgeBoundary>
    <span className="team-badge-hint">{active && ready ? (interacted ? 'Pode soltar. A conexão continua.' : 'Arraste o crachá. Conheça quem conecta.') : 'Gente que faz a conexão acontecer.'}</span>
  </div>;
}

const roots = [...document.querySelectorAll('[data-team-badge]')].map(host => {
  const root = createRoot(host);
  root.render(<TeamBadge name={host.dataset.name} front={host.dataset.front} back={host.dataset.back}/>);
  return root;
});
window.addEventListener('pagehide', event => { if (!event.persisted) roots.forEach(root => root.unmount()); }, { once: true });
