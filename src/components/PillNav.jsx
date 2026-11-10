import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PillNav.css';

const PillNav = ({
  logo,
  actions,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#120F17',
  hoveredPillTextColor = '#120F17',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);


  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement || !circle.isConnected) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (!h || !w) return;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => { window.removeEventListener('resize', onResize); tlRefs.current.forEach(t => t?.kill()); activeTweenRefs.current.forEach(t => t?.kill()); };
  }, [items, ease]);

  const handleEnter = i => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  return <nav className={`elo-pill-nav ${className}`} aria-label="Navegação principal" style={{ '--base': baseColor, '--pill-bg': pillColor, '--pill-text': resolvedPillTextColor, '--hover-text': hoveredPillTextColor }}>
    <a className="elo-nav-logo" href="/" aria-label="elo — página inicial">{logo}</a>
    <div id="elo-nav-panel" className="elo-nav-panel">
      <ul className="elo-pill-list">{items.map((item,i) => <li key={item.href}><a href={item.href} className={`pill ${activeHref === item.href ? 'is-active' : ''}`} aria-current={activeHref === item.href ? 'page' : undefined} onMouseEnter={() => !matchMedia('(prefers-reduced-motion: reduce)').matches && handleEnter(i)} onMouseLeave={() => handleLeave(i)} onFocus={() => handleEnter(i)} onBlur={() => handleLeave(i)}>
        <span className="hover-circle" ref={el => circleRefs.current[i] = el} aria-hidden="true"/><span className="label-stack"><span className="pill-label">{item.label}</span><span className="pill-label-hover" aria-hidden="true">{item.label}</span></span>
      </a></li>)}</ul>
      <div className="elo-nav-actions">{actions}</div>
    </div>
  </nav>;
};
export default PillNav;
