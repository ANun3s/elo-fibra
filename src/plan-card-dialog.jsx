import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CardSwap, { Card } from './components/CardSwap';
import './plan-card-dialog.css';

const titles = ['Velocidade', 'Wi-Fi', 'Equipamentos', 'Sua rotina', 'Vantagens'];
const headings = ['Mais fluidez, sempre.', 'Sua casa conectada.', 'Equipamentos para sua casa.', 'Para sua rotina.', 'O que faz este plano valer.'];

export default function DetailDialog({ selection, onClose }) {
  const { plan, index, trigger, key } = selection;
  const dialogRef = useRef(null);
  const swapRef = useRef(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const order = Array.from({ length: titles.length }, (_, offset) => (index + offset) % titles.length);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    const dialog = dialogRef.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      media.removeEventListener('change', update);
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);
  const close = () => dialogRef.current.close();
  return createPortal(<dialog ref={dialogRef} className="plan-swap-dialog" aria-labelledby="swap-dialog-title"
    onClose={onClose} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }}>
    <header className="swap-titlebar">
      <button className="swap-window-close" onClick={close} aria-label="Fechar detalhes do plano" autoFocus><span aria-hidden="true">×</span></button>
      <h2 id="swap-dialog-title">{plan.name}</h2>
      <span className="swap-titlebar-mark" aria-hidden="true">elo.</span>
    </header>
    <div className="swap-stage">
      <CardSwap ref={swapRef} width="100%" height="100%" cardDistance={14} verticalDistance={16}
        skewAmount={0} delay={5000} pauseOnHover={false} autoPlay={false} easing="smooth"
        reducedMotion={reduced} onActiveChange={setActive}>
        {order.map(topic => <Card key={topic} customClass="plan-detail-card">
          <div className="swap-card-content" tabIndex={active === order.indexOf(topic) ? 0 : -1} role="region" aria-label={titles[topic]}>
            <div className="eyebrow">{String(topic + 1).padStart(2, '0')} / {titles[topic]}</div>
            <h3>{headings[topic]}</h3>
            {topic === 0 ? <>
              <p>Velocidade para acompanhar o seu ritmo.</p>
              <dl><div><dt>Download</dt><dd>{plan.download}</dd></div><div><dt>Upload</dt><dd>{plan.upload}</dd></div></dl>
              <p>Download é a velocidade para receber conteúdos. Upload é a velocidade para enviar arquivos, fazer chamadas e salvar na nuvem.</p>
              <p className="swap-fine-print">O desempenho depende dos dispositivos, dos servidores e da conexão. Para avaliar a velocidade, prefira uma conexão por cabo compatível.</p>
            </> : topic === 1 ? <>
              <p>Conexão sem fios para a rotina da casa.</p>
              <dl><div><dt>Equipamento</dt><dd>{plan.equipment}</dd></div></dl>
              <p>O Wi-Fi 6 ajuda a organizar a conexão de dispositivos compatíveis. Posicione o roteador em um local central, aberto e elevado.</p>
              <p>{key === 'maxima' ? 'O ponto mesh incluído ajuda a distribuir o sinal em mais ambientes.' : 'Para ambientes mais distantes, conheça as opções de rede mesh na página de serviços.'}</p>
              <p className="swap-fine-print">Paredes, distância e interferências influenciam a cobertura.</p>
            </> : topic === 2 ? <>
              <p>Os equipamentos previstos para este plano.</p>
              <dl><div><dt>Incluído</dt><dd>{plan.equipment}</dd></div></dl>
              <p>O roteador Wi-Fi 6 conecta aparelhos compatíveis à rede sem fios. No elo máxima, um ponto mesh adicional ajuda a distribuir o sinal em mais ambientes.</p>
              <p className="swap-fine-print">A cobertura varia conforme o espaço, as paredes e a posição dos equipamentos.</p>
            </> : topic === 3 ? <>
              <p>{plan.use}</p>
              <p>O plano é uma proposta demonstrativa para diferentes rotinas de conexão em casa.</p>
              <p className="swap-fine-print">A quantidade de aparelhos e o uso simultâneo influenciam a experiência.</p>
            </> : <>
              <p>Alguns destaques deste plano.</p>
              <ul>{plan.advantages.map(text => <li key={text}>{text}</li>)}</ul>
            </>}
          </div>
        </Card>)}
      </CardSwap>
    </div>
    <footer className="swap-controls">
      <div className="swap-progress" aria-live="polite" aria-atomic="true">{active + 1} de {titles.length} <span>· {titles[order[active]]}</span></div>
      <button className="button swap-next" onClick={() => swapRef.current?.next()}>{active === titles.length - 1 ? 'Ver novamente' : 'Próximo'} <span aria-hidden="true">→</span></button>
      <div className="swap-price"><strong>{plan.price}</strong><span>Plano demonstrativo. Sem contratação ou cobrança.</span></div>
    </footer>
  </dialog>, document.body);
}
