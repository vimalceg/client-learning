import { createComponent } from 'component';
import { store } from '../../store/index.js';
import { fetchPageLayout } from '../../services/pageApi.js';

function renderNode(node, h) {
  if (node == null || typeof node === 'boolean') return null;
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  const { type, props = {}, children } = node;
  const resolvedChildren = Array.isArray(children)
    ? children.map(child => renderNode(child, h)).filter(Boolean)
    : [];

  return h(type, props, ...resolvedChildren);
}

const pendingFetches = new Set();

function ensurePageLoaded(pageId) {
  if (!pageId || pendingFetches.has(pageId)) return;
  const cache = store.getState().pageCache[pageId];
  if (cache && (cache.loading || cache.spec)) return;

  pendingFetches.add(pageId);
  store.dispatch({ type: 'page/loading', payload: { id: pageId } });
  fetchPageLayout(pageId)
    .then(spec => {
      store.dispatch({ type: 'page/loaded', payload: { id: pageId, spec } });
    })
    .finally(() => {
      pendingFetches.delete(pageId);
    });
}

export default createComponent({
  name: 'Page',
  props: {
    pageId: { type: 'string' },
    pageTitle: { type: 'string' }
  },
  template: (props, h) => {
    if (!props.pageId) {
      return h('div', { class: 'text-center text-sm text-gray-500' }, 'No page selected.');
    }

    ensurePageLoaded(props.pageId);
    const cache = store.getState().pageCache[props.pageId];

    if (!cache || cache.loading) {
      return h('div', { class: 'text-center text-sm text-gray-500' }, 'Loading page...');
    }

    const spec = cache.spec;
    if (!spec || !Array.isArray(spec.sections)) {
      return h('div', { class: 'text-center text-sm text-gray-400' }, 'No layout available.');
    }

    return h(
      'div',
      { class: 'space-y-10' },
      ...spec.sections.map(section => renderNode(section, h))
    );
  }
});
