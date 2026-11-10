import { useRef, useEffect, useState, useId } from 'react';
import './GooeyNav.css';

const GooeyNav = ({
  items,
  ariaLabel = "Serviços nesta página",
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
}) => {
  const filterId = useId().replace(/:/g, '');
  const timers = useRef(new Set());
  const stopScroll = useRef(() => {});
  const schedule = (callback, delay) => {
    const id = setTimeout(() => { timers.current.delete(id); callback(); }, delay);
    timers.current.add(id);
  };
  const clearParticles = () => {
    stopScroll.current();
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    filterRef.current?.querySelectorAll('.particle').forEach(p => p.remove());
  };
  useEffect(() => () => clearParticles(), []);
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = element => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');

      schedule(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, white)`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);

        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        element.classList.add('active');
        schedule(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = element => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index) => {
    const liEl = e.currentTarget.closest('li');
    // Keep modified clicks/new tabs native; delay only in-page navigation.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = items[index].href;
    const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    if (!target) return;
    e.preventDefault();
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    setActiveIndex(index);
    updateEffectPosition(liEl);

    clearParticles();

    if (textRef.current) {
      textRef.current.classList.remove('active');

      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }

    if (filterRef.current && !reduced) {
      makeParticles(filterRef.current);
    }
    const navigate = () => {
      const startY = window.scrollY;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const endY = Math.max(0, Math.min(document.documentElement.scrollHeight - window.innerHeight,
        startY + target.getBoundingClientRect().top - padding - margin));
      const distance = endY - startY;
      const finish = () => {
        if (location.hash !== href) history.pushState(null, '', href);
      };
      if (reduced) {
        window.scrollTo({ top: endY, behavior: 'instant' });
        finish();
        return;
      }
      const duration = Math.min(1600, Math.max(800, Math.abs(distance) * 0.3 + 650));
      let frame;
      const started = performance.now();
      const cancel = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('wheel', cancel);
        window.removeEventListener('touchstart', cancel);
        window.removeEventListener('keydown', onKey);
        stopScroll.current = () => {};
      };
      const onKey = event => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', 'Escape', ' '].includes(event.key)) cancel();
      };
      stopScroll.current = cancel;
      window.addEventListener('wheel', cancel, { passive: true });
      window.addEventListener('touchstart', cancel, { passive: true });
      window.addEventListener('keydown', onKey);
      const step = now => {
        const progress = Math.min(1, (now - started) / duration);
        // Quintic smoothstep: zero velocity and acceleration at both ends.
        const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
        window.scrollTo({ top: startY + distance * eased, behavior: 'instant' });
        if (progress < 1) frame = requestAnimationFrame(step);
        else { cancel(); finish(); }
      };
      frame = requestAnimationFrame(step);
    };
    if (reduced) navigate();
    else schedule(navigate, 180);
  };

  useEffect(() => {
    const sync = () => { clearParticles(); const index = items.findIndex(item => item.href === location.hash); if (index >= 0) setActiveIndex(index); };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [items]);

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex];
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
    }

    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex];
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav aria-label={ariaLabel}>
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={index} className={activeIndex === index ? 'active' : ''}>
              <a href={item.href} onClick={e => handleClick(e, index)} aria-current={activeIndex === index ? 'location' : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <svg width="0" height="0" aria-hidden="true" className="gooey-filter-defs"><defs><filter id={filterId} x="-100%" y="-250%" width="300%" height="600%" colorInterpolationFilters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"/><feComposite in="SourceGraphic" operator="atop"/></filter></defs></svg>
      <span className="effect filter" ref={filterRef} aria-hidden="true" style={{ filter: `url(#${filterId})` }} />
      <span className="effect text" ref={textRef} aria-hidden="true" />
    </div>
  );
};

export default GooeyNav;
