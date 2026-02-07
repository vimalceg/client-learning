import { createComponent } from 'component';

export default createComponent({
  name: 'Card',
  props: {
    title: { type: 'string', required: true },
    description: { type: 'string' },
    footer: { type: 'any' },
    className: { type: 'string' },
    children: { type: 'any' }
  },
  template: (props, h) =>
    h(
      'article',
      {
        class: ['p-6 rounded-2xl border border-gray-100 shadow-sm bg-white', props.className || ''].filter(Boolean).join(' ')
      },
      h('div', { class: 'space-y-3' },
        h('h3', { class: 'text-xl font-semibold' }, props.title),
        props.description && h('p', { class: 'text-gray-600' }, props.description),
        props.children
      ),
      props.footer && h('div', { class: 'mt-4 text-sm text-gray-500' }, props.footer)
    )
});
