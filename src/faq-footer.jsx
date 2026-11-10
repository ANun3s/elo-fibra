import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { createRoot } from 'react-dom/client';
import FoldText from './components/FoldText';
import './faq-footer.css';

function FaqAnswer({ details, paragraph, text }) {
  const [open, setOpen] = useState(details.open);
  const [closing, setClosing] = useState(false);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const animation = useRef(null);
  const wasOpen = useRef(false);

  const finishClosing = useCallback(() => {
    if (!closing) return;
    details.open = false;
    setOpen(false);
    setClosing(false);
  }, [details, closing]);

  useEffect(() => {
    const toggle = () => {
      setOpen(details.open);
      if (!details.open) setClosing(false);
    };
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    const summary = details.querySelector('summary');
    const click = event => {
      if (!details.open || media.matches) return;
      // Keep native details open while its text folds back; another click reverses direction.
      event.preventDefault();
      setClosing(value => !value);
    };
    summary.addEventListener('click', click);
    details.addEventListener('toggle', toggle);
    media.addEventListener('change', update);
    return () => {
      summary.removeEventListener('click', click);
      details.removeEventListener('toggle', toggle);
      media.removeEventListener('change', update);
    };
  }, [details]);

  useLayoutEffect(() => {
    animation.current?.kill();
    details.dataset.closing = String(closing);
    if (!open || reduced) {
      gsap.set(paragraph, { clearProps: 'height,opacity,transform,overflow' });
      wasOpen.current = open;
      if (reduced && closing) finishClosing();
      return;
    }
    const height = paragraph.scrollHeight;
    if (!wasOpen.current) gsap.set(paragraph, { height: 0, opacity: 0, y: -8 });
    wasOpen.current = true;
    gsap.set(paragraph, { overflow: 'hidden' });
    animation.current = gsap.to(paragraph, {
      height: closing ? 0 : height,
      opacity: closing ? 0 : 1,
      y: closing ? -8 : 0,
      duration: closing ? 0.4 : 0.3,
      ease: 'power2.out',
      onComplete: () => {
        if (!closing) gsap.set(paragraph, { clearProps: 'height,opacity,transform,overflow' });
      }
    });
  }, [open, closing, reduced, paragraph, details, finishClosing]);

  useEffect(() => () => {
    animation.current?.kill();
    delete details.dataset.closing;
    gsap.set(paragraph, { clearProps: 'height,opacity,transform,overflow' });
  }, [paragraph, details]);

  return open && !reduced ? <FoldText
    text={text}
    splitBy="char"
    hinge="top"
    trigger="mount"
    reversed={closing}
    onReverseComplete={finishClosing}
    duration={0.32}
    stagger={Math.min(0.045, 0.18 / Math.max(text.length, 1))}
    ease="power3.out"
    perspective={700}
    creaseShading={0.55}
    fontSize="inherit"
    fontWeight={400}
    color="currentColor"
    className="faq-fold-answer"
  /> : text;
}

document.querySelectorAll('.faq-list details').forEach(details => {
  const paragraph = details.querySelector('p');
  if (!paragraph) return;
  const text = paragraph.textContent;
  createRoot(paragraph).render(<FaqAnswer details={details} paragraph={paragraph} text={text} />);
});
