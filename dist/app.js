const root = document.documentElement;
const themeButton = document.getElementById('theme-toggle');
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111713' : '#f6f7f4';
}
let initialTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
try { initialTheme = localStorage.getItem('elo-theme') || initialTheme; } catch {}
setTheme(initialTheme);
themeButton.addEventListener('click', () => { const theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; setTheme(theme); try { localStorage.setItem('elo-theme', theme); } catch {} });
const menu = document.getElementById('menu-toggle');
const links = document.getElementById('nav-links');
function closeMenu() { links.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Abrir navegação'); }
menu.addEventListener('click', () => { const open = links.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação'); });
links.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && links.classList.contains('open')) { closeMenu(); menu.focus(); } });
const plans = {
  essencial: {name:'elo essencial',description:'Para o dia a dia fluir.',price:'R$ 89,90 / mês',download:'400 Mbps',upload:'200 Mbps',equipment:'Roteador Wi-Fi 6'},
  completo: {name:'elo completo',description:'Para a casa toda, ao mesmo tempo.',price:'R$ 109,90 / mês',download:'700 Mbps',upload:'350 Mbps',equipment:'Roteador Wi-Fi 6'},
  maxima: {name:'elo máxima',description:'Para ir além, em cada conexão.',price:'R$ 149,90 / mês',download:'1.000 Mbps',upload:'500 Mbps',equipment:'Wi-Fi 6 + ponto mesh'}
};
const dialog = document.getElementById('plan-dialog');
let lastPlanTrigger;
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
  const plan = plans[button.dataset.plan];
  lastPlanTrigger = button;
  document.getElementById('dialog-title').textContent = plan.name;
  document.getElementById('dialog-description').textContent = plan.description;
  document.getElementById('dialog-price').textContent = plan.price;
  const features = document.getElementById('dialog-features');
  features.replaceChildren();
  for (const [label,value] of [['Download',plan.download],['Upload',plan.upload],['Equipamento',plan.equipment]]) {
    const row = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd');
    dt.textContent = label; dd.textContent = value; row.append(dt,dd); features.append(row);
  }
  dialog.showModal(); document.body.style.overflow = 'hidden';
}));
dialog?.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog?.addEventListener('click', event => { if(event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog?.addEventListener('close', () => { document.body.style.overflow = ''; lastPlanTrigger?.focus(); });
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => { for(const entry of entries) { if(entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);} } }, {threshold:.12});
  document.querySelectorAll('.section-intro,.connection-panel').forEach(el => { el.classList.add('reveal-ready'); observer.observe(el); });
}

const reviewFilters = document.querySelectorAll('[data-filter]');
reviewFilters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
    const visible = selected === 'todos' || card.dataset.category === selected;
    card.hidden = !visible;
    if (visible) count++;
  });
  reviewFilters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  document.getElementById('review-count').textContent = `${count} relatos ilustrativos`;
}));
