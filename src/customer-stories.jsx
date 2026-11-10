import { createRoot } from 'react-dom/client';
import InfiniteMenu from './components/InfiniteMenu';
import items from './customer-stories.json';
const target = document.getElementById('customer-universe');
if (target) createRoot(target).render(<InfiniteMenu items={items} scale={1.4}/>);
