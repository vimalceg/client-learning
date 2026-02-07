import { createComponent } from 'component';

export default createComponent({
  name: 'AppShell',
  props: {
    pages: { type: 'array', default: () => [] },
    collapsed: { type: 'boolean', default: false },
    pageTitle: { type: 'string' },
    onToggleNav: { type: 'function', required: true },
    children: { type: 'any' }
  },
  template: (props, h) => {
    const navWidth = props.collapsed ? 'w-20' : 'w-64';
    const navLabelClass = props.collapsed ? 'opacity-0 pointer-events-none' : '';
    const toggleLabel = props.collapsed ? '▶' : '◀';

    return h(
      'div',
      { class: 'min-h-screen flex bg-gray-50 text-gray-900' },
    h(
      'aside',
      {
        class: [
          'flex flex-col border-r border-gray-200 bg-white transition-all duration-200',
          navWidth
        ]
          .filter(Boolean)
          .join(' ')
      },
      h(
        'div',
        { class: 'flex items-center justify-between px-4 py-3 border-b border-gray-100' },
        h('span', { class: `text-lg font-bold ${navLabelClass}` }, 'Demo'),
        h(
          'button',
          {
            class: 'text-sm text-gray-500 focus:outline-none',
            type: 'button',
            onClick: props.onToggleNav
          },
          toggleLabel
        )
      ),
      h(
        'nav',
        { class: 'px-2 py-4 space-y-1 flex-1 overflow-y-auto' },
        ...props.pages.map(page => {
          const label = props.collapsed ? (page.label?.charAt(0) || '?') : page.label;
          const linkClasses = [
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
            'hover:text-blue-600 hover:bg-blue-50',
            props.collapsed ? 'justify-center' : 'justify-start'
          ];
          return h(
            'a',
            {
              class: linkClasses.filter(Boolean).join(' '),
              href: `#${page.url === '/' ? '/' : page.url}`,
              title: page.label
            },
            h('span', null, label)
          );
        })
      )
    ),
      h(
        'main',
        { class: 'flex-1 p-6 overflow-hidden' },
        props.pageTitle && h('header', { class: 'mb-6' }, h('h1', { class: 'text-3xl font-bold' }, props.pageTitle)),
        props.children
      )
    );
  }
});
