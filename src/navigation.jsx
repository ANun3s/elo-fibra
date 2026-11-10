import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PillNav from './components/PillNav';
const items = [{label:'Início',href:'/'},{label:'Serviços',href:'/servicos/'},{label:'Clientes',href:'/clientes/'},{label:'Planos',href:'/planos/'}];
function Navigation(){
 const readLocation = () => location.pathname;
 const [activeHref, setActiveHref] = useState(readLocation);
 useEffect(() => { const update = () => setActiveHref(readLocation()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update); }, []);
 const [theme,setTheme]=useState(document.documentElement.dataset.theme || 'light');
 useEffect(()=>{const observer=new MutationObserver(()=>setTheme(document.documentElement.dataset.theme));observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect();},[]);
 return <PillNav logo={<img className="elo-wordmark" src="/assets/elo-logo-v2.png" width="92" height="46" alt="" />} items={items} activeHref={activeHref} ease="power2.out" baseColor="#000000" pillColor="#142c4d" pillTextColor="#ffffff" hoveredPillTextColor="#ffffff" initialLoadAnimation={false} actions={<><button id="theme-toggle" className="elo-theme-button" aria-label={theme==='dark'?'Ativar tema claro':'Ativar tema escuro'} aria-pressed={theme==='dark'}><svg viewBox="0 0 24 24" aria-hidden="true">{theme==='dark'?<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></>:<path d="M20.5 13.5A8.5 8.5 0 0 1 10.5 3.5 8.5 8.5 0 1 0 20.5 13.5Z"/>}</svg></button><a className="elo-plan-link button" href="/planos/">Conhecer planos <span aria-hidden="true">↗</span></a></>}/>;
}
const header=document.querySelector('.nav-wrap');
if(header) {
 createRoot(header).render(<Navigation/>);
 const observer = new ResizeObserver(() => {
  document.documentElement.style.setProperty('--elo-nav-offset', `${header.getBoundingClientRect().bottom + 24}px`);
 });
 observer.observe(header);
}
