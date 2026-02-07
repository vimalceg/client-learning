import { h, render } from 'vdom';
import { createComponent } from 'component';
import { store, COUNTER_IDS } from './store/index.js';
import { fetchAppInfo } from './services/appApi.js';

import './components/button/index.js';
import './components/text/index.js';
import './components/hero/index.js';
import './components/section/index.js';
import './components/card/index.js';
import './components/page/index.js';
import './components/appShell/index.js';
import './layout/flex/index.js';
import './layout/grid/index.js';

const root = document.getElementById('root');
const handlerCache = new Map();

function getActivePageId() {
  const state = store.getState();
  const hash = window.location.hash.replace(/^#/, '');
  const normalized = hash === '' ? '/' : hash;
  const match = state.app.pages.find(page => page.url === normalized);
  return match ? match.id : state.app.pages[0]?.id || null;
}

function getHandlers(id) {
  if (handlerCache.has(id)) {
    return handlerCache.get(id);
  }

  const handlers = {
    onInc: () => store.dispatch({ type: 'counter/inc', payload: { id } }),
    onDec: () => store.dispatch({ type: 'counter/dec', payload: { id } }),
    onReset: () => store.dispatch({ type: 'counter/reset', payload: { id } })
  };

  handlerCache.set(id, handlers);
  return handlers;
}

createComponent({
  name: 'Counter',
  props: {
    id: { type: 'string', required: true },
    label: { type: 'string' },
    count: { type: 'number', required: true },
    onInc: { type: 'function', required: true },
    onDec: { type: 'function', required: true },
    onReset: { type: 'function', required: true }
  },
  template: (props, h) =>
    h('div', { class: 'p-6 border rounded shadow-sm max-w-md mx-auto' },
      h('h2', { class: 'text-lg font-semibold mb-2' }, props.label || `Counter ${props.id}`),
      h('div', { class: 'flex items-center gap-3 mb-4' },
        h('button', {
          class: 'bg-gray-200 text-gray-900 px-3 py-2 rounded',
          onClick: props.onDec
        }, '-'),
        h('div', { class: 'text-xl font-mono w-16 text-center' }, String(props.count)),
        h('button', {
          class: 'bg-blue-500 text-white px-3 py-2 rounded',
          onClick: props.onInc
        }, '+')
      ),
      h('button', {
        class: 'text-sm text-blue-700 underline',
        onClick: props.onReset
      }, 'Reset')
    )
});

function renderApp() {
  const state = store.getState();
  const pageId = getActivePageId();
  const pageMeta = state.app.pages.find(p => p.id === pageId);
  const pageTitle = pageMeta?.label;
  const elTree = h(
    'AppShell',
    {
      pages: state.app.pages,
      collapsed: state.ui.navCollapsed,
      pageTitle,
      onToggleNav: () => store.dispatch({ type: 'ui/toggle-nav' })
    },
    h('div', { class: 'space-y-10' },
      h('section', { class: 'space-y-6' },
        h('Page', {
          pageId,
          pageTitle
        })
      ),
      h('section', { class: 'space-y-4' },
        COUNTER_IDS.map(id => {
          const count = state.counters[id] ?? 0;
          const handlers = getHandlers(id);
          return h('Counter', {
            key: id,
            id,
            label: id.replace(/^[a-zA-Z]/, char => char.toUpperCase()),
            count,
            onInc: handlers.onInc,
            onDec: handlers.onDec,
            onReset: handlers.onReset
          });
        })
      )
    )
  );
  render(elTree, root);
}

function loadAppInfo() {
  store.dispatch({ type: 'app/loading' });
  fetchAppInfo().then(info => {
    store.dispatch({ type: 'app/loaded', payload: info });
  });
}

store.subscribe(renderApp);
renderApp();
loadAppInfo();
window.addEventListener('hashchange', renderApp);
