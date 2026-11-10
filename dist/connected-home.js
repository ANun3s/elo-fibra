// Native disclosures remain usable without JavaScript; enhance with synchronized rooms.
const home = document.querySelector('.connected-home');
if (home) {
  const rooms = [...home.querySelectorAll('[data-room]')];
  const pins = [...home.querySelectorAll('[data-home-pin]')];
  const shapes = [...home.querySelectorAll('[data-house-room]')];
  const sync = (key) => {
    pins.forEach(pin => {
      const active = pin.dataset.homePin === key;
      pin.classList.toggle('is-active', active);
      pin.setAttribute('aria-expanded', String(active));
    });
    shapes.forEach(shape => shape.classList.toggle('is-active', shape.dataset.houseRoom === key));
  };
  const select = (key) => {
    rooms.forEach(room => { room.open = room.dataset.room === key; });
    sync(key);
  };
  pins.forEach(pin => pin.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(pin.dataset.homePin);
    // Announce the revealed text and make the next keyboard action predictable.
    const summary = rooms.find(room => room.dataset.room === pin.dataset.homePin).querySelector('summary');
    summary.focus({ preventScroll: true });
    if (matchMedia('(max-width:800px)').matches) {
      summary.parentElement.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    }
  }));
  rooms.forEach(room => room.addEventListener('toggle', () => {
    if (room.open) select(room.dataset.room);
    else if (!rooms.some(item => item.open)) sync(null);
  }));
  sync(rooms.find(room => room.open)?.dataset.room);
  // Keep old external section bookmarks useful after replacing the table.
  if (location.hash === '#comparar') home.scrollIntoView({ block: 'start' });
}
