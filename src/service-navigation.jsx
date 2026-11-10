import { createRoot } from 'react-dom/client';
import GooeyNav from './components/GooeyNav';
import './service-navigation.css';
document.querySelectorAll('#service-nav-root, #plans-nav-root').forEach(host => {
  const items = [...host.querySelectorAll('a')].map(link => ({label:link.textContent,href:link.getAttribute('href')}));
  createRoot(host).render(<GooeyNav ariaLabel={host.id === 'plans-nav-root' ? 'Planos nesta página' : 'Serviços nesta página'} items={items} particleCount={15} particleDistances={[90,10]} particleR={100}
    initialActiveIndex={Math.max(0,items.findIndex(item => item.href === location.hash))} animationTime={600} timeVariance={300} colors={[1,2,3,1,2,3,1,4]}/>);
});
