import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import AccordionGallery from './components/AccordionGallery';
import './service-gallery.css';

const items = [
  { image: '/assets/services/fibra.jpg', label: 'Internet por fibra', alt: 'Infraestrutura de servidores e conexões de rede', link: '/servicos/#fibra' },
  { image: '/assets/living-room.jpg', label: 'Wi-Fi pela casa', alt: 'Sala iluminada com roteador discreto sobre a mesa', link: '/servicos/#wifi' },
  { image: '/assets/services/conexao.jpg', label: 'Sua rotina conectada', alt: 'Computador portátil em uma mesa de trabalho', link: '/planos/' },
  { image: '/assets/services/atendimento.jpg', label: 'Cuidado e suporte', alt: 'Pessoas trabalhando juntas em um escritório', link: '/servicos/#cuidado' }
];

function ServicesGallery() {
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 640px)').matches);
  useEffect(() => {
    const media = matchMedia('(max-width: 640px)');
    const update = () => setMobile(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <AccordionGallery items={items} defaultIndex={2} expandRatio={0.52}
    trigger="hover" grayscale={false} height={mobile ? 400 : 520}
    orientation={mobile ? 'vertical' : 'horizontal'} tilt={mobile ? 0 : 3}
    parallax={0.25} radius={24} gap={12} duration={0.6}
    accentColor="#ffffff" overlayColor="#081321" className="elo-services-gallery" />;
}

const host = document.getElementById('service-gallery-root');
if (host) createRoot(host).render(<ServicesGallery />);
