import { Component, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import WarpText from './components/WarpText';
import GradualBlur from './components/GradualBlur';
import './warp-section.css';

class EffectBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure?.(true); }
  render() { return this.state.failed ? null : this.props.children; }
}

function WarpMoment({ stage }) {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const active = !reduced && !paused && !failed;

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = event => setReduced(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    stage.classList.toggle('has-warp-canvas', active && ready);
    if (!active) setReady(false);
    return () => stage.classList.remove('has-warp-canvas');
  }, [active, ready, stage]);

  return <>
    {active && <EffectBoundary onFailure={setFailed}>
      <div aria-hidden="true">
        <WarpText
          text="Bend the moment"
          color="#f8f5ff"
          warpStrength={0.08}
          warpScale={1.7}
          speed={0.55}
          pointerInfluence={0.42}
          pointerStrength={0.38}
          refraction={0.018}
          ripple
          fontSize="clamp(3rem, 10vw, 9rem)"
          fontWeight={800}
          style={{ height: '320px' }}
          onReady={setReady}
          onError={setFailed}
        />
      </div>
    </EffectBoundary>}
    {!reduced && !failed && <button
      className="warp-pause"
      type="button"
      aria-pressed={paused}
      onClick={() => setPaused(value => !value)}
    >
      <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
      {paused ? 'Retomar efeito' : 'Pausar efeito'}
    </button>}
  </>;
}

const warpHost = document.getElementById('warp-react-root');
if (warpHost) {
  // Load the GPU effect only when its section approaches the viewport.
  const mount = () => createRoot(warpHost).render(<WarpMoment stage={warpHost.parentElement} />);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { observer.disconnect(); mount(); }
    }, { rootMargin: '240px' });
    observer.observe(warpHost);
  } else mount();
}

const blurHost = document.getElementById('hero-blur-root');
if (blurHost) createRoot(blurHost).render(<EffectBoundary>
  <GradualBlur
    target="parent"
    position="bottom"
    height="6rem"
    strength={2}
    divCount={5}
    curve="bezier"
    exponential={true}
    opacity={1}
    zIndex={1}
  />
</EffectBoundary>);
