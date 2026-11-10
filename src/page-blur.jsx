import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import GradualBlur from './components/GradualBlur';
import './page-blur.css';

function PageBlur() {
  const wrapper = useRef(null);
  useEffect(() => {
    let frame = 0;
    let idleTimer;
    let moving = false;
    const update = () => {
      frame = 0;
      const remaining = document.documentElement.scrollHeight - innerHeight - scrollY;
      // Reveal the final footer links completely when the reader reaches the end.
      wrapper.current.style.opacity = moving ? String(Math.max(0, Math.min(.65, remaining / 96))) : '0';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => { moving = true; clearTimeout(idleTimer); schedule(); idleTimer = setTimeout(() => { moving = false; schedule(); }, 140); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idleTimer);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  return <div ref={wrapper} className="elo-page-blur" aria-hidden="true">
    <GradualBlur target="parent" position="bottom" height="100%" strength={.65}
      divCount={5} curve="bezier" exponential={true} opacity={1} zIndex={1}/>
  </div>;
}

const host = document.createElement('div');
host.id = 'page-blur-root';
document.body.append(host);
createRoot(host).render(<PageBlur/>);
