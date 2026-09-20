import './plan-folders';
import { Component, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import WarpText from './components/WarpText';
import GradualBlur from './components/GradualBlur';
import LetterGlitch from './components/LetterGlitch';
import './warp-section.css';

class EffectBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure?.(true); }
  render() { return this.state.failed ? null : this.props.children; }
}

function WarpMoment({ stage }) {
  const [typography, setTypography] = useState(null);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [backgroundVisible, setBackgroundVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const active = !reduced && !failed;
  const backgroundHost = document.getElementById('letter-glitch-root');

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    const observer = new IntersectionObserver(([entry]) => setBackgroundVisible(entry.isIntersecting));
    observer.observe(stage.closest('.hero-intro'));
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [stage]);

  useEffect(() => {
    const heading = stage.querySelector('h1');
    const update = () => {
      const titleStyle = getComputedStyle(heading);
      const brandStyle = getComputedStyle(heading.querySelector('span'));
      const wrapped = heading.querySelector('span').getClientRects().length > 1;
      const next = {
        theme: document.documentElement.dataset.theme,
        text: wrapped ? 'Sua vida flui.\nSua internet\ntambém.' : 'Sua vida flui.\nSua internet também.',
        fontSize: titleStyle.fontSize,
        fontWeight: titleStyle.fontWeight,
        lineHeight: titleStyle.lineHeight,
        letterSpacing: titleStyle.letterSpacing,
        color: titleStyle.color,
        lineColors: wrapped ? [titleStyle.color, brandStyle.color, brandStyle.color] : [titleStyle.color, brandStyle.color]
      };
      setTypography(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    update();
    const resize = new ResizeObserver(update);
    resize.observe(stage);
    const theme = new MutationObserver(update);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { resize.disconnect(); theme.disconnect(); };
  }, [stage]);

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
    {!reduced && backgroundVisible && pageVisible && typography && backgroundHost && createPortal(
      <EffectBoundary>
        <LetterGlitch
          key={typography.theme}
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
          lightMode={typography.theme !== 'dark'}
          backgroundColor="transparent"
          glitchColors={typography.theme === 'dark' ? ['#2b4539', '#61dca3', '#afd5a8'] : ['#27563c', '#54765a', '#899781']}
        />
      </EffectBoundary>, backgroundHost
    )}
    {active && typography && <EffectBoundary onFailure={setFailed}>
      <div aria-hidden="true">
        <WarpText
          text={typography.text}
          color={typography.color}
          lineColors={typography.lineColors}
          warpStrength={0.08}
          warpScale={1.7}
          speed={0.55}
          pointerInfluence={0.42}
          pointerStrength={0.38}
          refraction={0.018}
          ripple
          fontSize={typography.fontSize}
          fontWeight={typography.fontWeight}
          lineHeight={typography.lineHeight}
          letterSpacing={typography.letterSpacing}
          style={{ height: '100%' }}
          onReady={setReady}
          onError={setFailed}
        />
      </div>
    </EffectBoundary>}
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
