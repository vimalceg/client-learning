import { createComponent } from 'component';

export default createComponent({
  name: 'Section',
  props: {
    title: { type: 'string' },
    subtitle: { type: 'string' },
    className: { type: 'string' },
    style: { type: 'object' },
    children: { type: 'any' }
  },
  template: (props, h) =>
    h(
      'section',
      {
        class: ['px-4 py-8 md:px-8', props.className || ''].filter(Boolean).join(' '),
        style: props.style || {}
      },
      h(
        'div',
        { class: 'max-w-5xl mx-auto space-y-4' },
        props.title && h('h2', { class: 'text-3xl font-semibold' }, props.title),
        props.subtitle && h('p', { class: 'text-gray-600' }, props.subtitle),
        props.children
      )
    )
});
