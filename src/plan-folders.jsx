import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import Folder from './components/Folder';
import DetailDialog from './plan-card-dialog';
import './plan-folders.css';

const plans = {
  essencial: { name: 'elo essencial', color: '#142c4d', download: '400 Mbps', upload: '200 Mbps', price: 'R$ 89,90 / mês', equipment: 'Roteador Wi-Fi 6', use: 'Para estudar, navegar e curtir seus conteúdos.', advantages: ['Aulas e chamadas de vídeo no dia a dia.', 'Filmes, séries e navegação em casa.', 'Envio de fotos e documentos para a nuvem.'] },
  completo: { name: 'elo completo', color: '#142c4d', download: '700 Mbps', upload: '350 Mbps', price: 'R$ 109,90 / mês', equipment: 'Roteador Wi-Fi 6', use: 'Mais espaço para a casa toda se conectar.', advantages: ['Mais capacidade para atividades simultâneas.', 'Trabalho, estudo e entretenimento na mesma casa.', 'Mais velocidade para baixar e enviar arquivos.'] },
  maxima: { name: 'elo máxima', color: '#142c4d', download: '1.000 Mbps', upload: '500 Mbps', price: 'R$ 149,90 / mês', equipment: 'Wi-Fi 6 + ponto mesh', use: 'Para uma rotina intensa e uma casa mais conectada.', advantages: ['A maior velocidade entre os três planos.', 'Mais capacidade para downloads e uploads grandes.', 'Um ponto mesh para ampliar a distribuição do Wi-Fi.'] }
};

const topics = [
  { title: 'Velocidade', teaser: 'Download e upload' },
  { title: 'Wi-Fi', teaser: 'Conexão sem fios' },
  { title: 'Equipamentos', teaser: 'O que vem com o plano' },
  { title: 'Sua rotina', teaser: 'Para diferentes momentos' },
  { title: 'Vantagens', teaser: 'Veja os destaques' }
];

function PlanFolders({ hosts }) {
  const [openPlan, setOpenPlan] = useState(null);
  const [selection, setSelection] = useState(null);
  const [theme, setTheme] = useState(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const open = event => {
      const { key, trigger } = event.detail;
      if (!plans[key]) return;
      event.preventDefault();
      setSelection({ plan: plans[key], key, index: 0, trigger });
    };
    document.addEventListener('elo:open-plan', open);
    return () => document.removeEventListener('elo:open-plan', open);
  }, []);

  return <>
    {hosts.map(host => {
      const key = host.dataset.folderPlan;
      const plan = plans[key];
      if (!plan) return null;
      const open = openPlan === key;
      const items = topics.map((topic, index) => ({
        title: topic.title,
        description: topic.teaser,
        content: <span className="folder-file-content">
          <span className="folder-file-index">{String(index + 1).padStart(2, '0')}</span>
          <strong>{topic.title}</strong>
          <small>{topic.teaser}</small>
        </span>
      }));
      return createPortal(<>
        <div className="plan-folder-stage">
          <Folder
            size={0.78}
            color={plan.color}
            paperColor={theme === 'dark' ? '#eef3fb' : '#ffffff'}
            className="elo-folder"
            label={plan.name}
            open={open}
            onOpenChange={value => setOpenPlan(value ? key : null)}
            onItemClick={(_, index) => setSelection({ plan, key, index, trigger: host.querySelector('.folder-stage') })}
            items={items}
          />
        </div>
        <p className="folder-hint" aria-live="polite">{open ? 'Escolha uma miniatura para ampliar.' : 'Abra a pasta para explorar os detalhes.'}</p>
      </>, host, key);
    })}
    {selection && <DetailDialog selection={selection} onClose={() => setSelection(null)} />}
  </>;
}

const hosts = [...document.querySelectorAll('[data-folder-plan]')];
if (hosts.length) createRoot(document.createElement('div')).render(<PlanFolders hosts={hosts} />);
