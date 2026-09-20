import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import Folder from './components/Folder';
import './plan-folders.css';

const plans = {
  essencial: { name: 'elo essencial', color: '#628568', download: '400 Mbps', upload: '200 Mbps', price: 'R$ 89,90 / mês', equipment: 'Roteador Wi-Fi 6', use: 'Para estudar, navegar e curtir seus conteúdos.', advantages: ['Aulas e chamadas de vídeo no dia a dia.', 'Filmes, séries e navegação em casa.', 'Envio de fotos e documentos para a nuvem.'] },
  completo: { name: 'elo completo', color: '#27563c', download: '700 Mbps', upload: '350 Mbps', price: 'R$ 109,90 / mês', equipment: 'Roteador Wi-Fi 6', use: 'Mais espaço para a casa toda se conectar.', advantages: ['Mais capacidade para atividades simultâneas.', 'Trabalho, estudo e entretenimento na mesma casa.', 'Mais velocidade para baixar e enviar arquivos.'] },
  maxima: { name: 'elo máxima', color: '#41694d', download: '1.000 Mbps', upload: '500 Mbps', price: 'R$ 149,90 / mês', equipment: 'Wi-Fi 6 + ponto mesh', use: 'Para uma rotina intensa e uma casa mais conectada.', advantages: ['A maior velocidade entre os três planos.', 'Mais capacidade para downloads e uploads grandes.', 'Um ponto mesh para ampliar a distribuição do Wi-Fi.'] }
};
const labels = ['Velocidade', 'Wi-Fi', 'Dia a dia'];
const paths = ['m13 3-8 11h6l-1 7 9-12h-7z', 'M3 9a14 14 0 0 1 18 0M6 13a9 9 0 0 1 12 0m-9 4a4 4 0 0 1 6 0m-3 3h.01', 'm3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7'];

function DetailDialog({ selection, onClose }) {
  const ref = useRef(null);
  const { plan, index, trigger } = selection;
  useEffect(() => {
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);
  const close = () => ref.current.close();
  const description = index === 0 ? 'Velocidade para acompanhar o seu ritmo.' : index === 1 ? 'Conexão sem fio, com espaço para a sua rotina.' : plan.use;
  return createPortal(<dialog ref={ref} className="folder-detail-dialog" aria-labelledby="folder-detail-title" aria-describedby="folder-detail-description"
    onClose={onClose} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    }}>
    <button type="button" className="icon-button dialog-close" aria-label="Fechar vantagens do plano" onClick={close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
    <div className="eyebrow">{plan.name} · {labels[index]}</div>
    <h2 id="folder-detail-title">{labels[index] === 'Dia a dia' ? 'Feito para sua rotina.' : labels[index] === 'Wi-Fi' ? 'Sua casa conectada.' : 'Mais fluidez, sempre.'}</h2>
    <p id="folder-detail-description">{description}</p>
    {index === 0 ? <><dl><div><dt>Download</dt><dd>{plan.download}</dd></div><div><dt>Upload</dt><dd>{plan.upload}</dd></div></dl><p className="folder-detail-copy">Download é a velocidade para receber conteúdos. Upload é a velocidade para enviar arquivos, fazer chamadas e salvar na nuvem.</p><p className="folder-detail-copy">A velocidade percebida depende do dispositivo, do servidor e da conexão. Para avaliar a velocidade do plano, prefira uma conexão por cabo compatível.</p></> : index === 1 ? <><dl><div><dt>Equipamento incluído</dt><dd>{plan.equipment}</dd></div></dl><p className="folder-detail-copy">O Wi-Fi 6 ajuda a organizar a conexão de dispositivos compatíveis. Posicione o roteador em um local central, aberto e elevado.</p><p className="folder-detail-copy">{selection.key === 'maxima' ? 'O ponto mesh incluído ajuda a levar o sinal a outros ambientes. A posição dos equipamentos faz diferença.' : 'Para ambientes mais distantes, confira as opções de rede mesh na página de serviços.'} Paredes, distância e interferências influenciam a cobertura.</p></> : <ul className="folder-advantages">{plan.advantages.map(item => <li key={item}>{item}</li>)}</ul>}
    <div className="folder-detail-price"><span>{plan.name}</span><strong>{plan.price}</strong></div>
    <p className="dialog-note">Plano demonstrativo. Não há contratação, cobrança ou consulta de cobertura neste site.</p>
    <button type="button" className="button dialog-done" onClick={close}>Voltar aos planos <span aria-hidden="true">↗</span></button>
  </dialog>, document.body);
}

function PlanFolders({ hosts }) {
  const [openPlan, setOpenPlan] = useState(null);
  const [selection, setSelection] = useState(null);
  return <>
    {hosts.map(host => {
      const key = host.dataset.folderPlan;
      const plan = plans[key];
      const open = openPlan === key;
      return createPortal(<>
        <div className="plan-folder-stage"><Folder size={1} color={plan.color} className="elo-folder" label={plan.name}
          open={open} onOpenChange={value => setOpenPlan(value ? key : null)}
          itemLabels={labels} onItemClick={(index, trigger) => setSelection({ plan, key, index, trigger })}
          items={labels.map((label, i) => <span className="folder-file-content" key={label}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[i]} /></svg><span>{label}</span></span>)} />
        </div>
        <p className="folder-hint" aria-live="polite">{open ? 'Toque em um arquivo para explorar.' : 'Abra a pasta e descubra seu plano.'}</p>
      </>, host, key);
    })}
    {selection && <DetailDialog selection={selection} onClose={() => setSelection(null)} />}
  </>;
}

const hosts = [...document.querySelectorAll('[data-folder-plan]')];
if (hosts.length) createRoot(document.createElement('div')).render(<PlanFolders hosts={hosts} />);
