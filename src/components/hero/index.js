import { createComponent } from 'component';

export default createComponent({
  name: 'Hero',
  props: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    ctaText: { type: 'string' },
    ctaVariant: { type: 'string', default: 'solid' },
    ctaAction: { type: 'function' },
    className: { type: 'string' }
  },
  template: (props, h) =>
    h(
      'section',
      {
        class: ['bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-3xl p-8 md:p-12', props.className || ''].filter(Boolean).join(' ')
      },
      h('div', { class: 'space-y-6' },
        h('h1', { class: 'text-4xl md:text-5xl font-bold leading-tight' }, props.title),
        h('p', { class: 'text-lg md:text-xl text-opacity-90' }, props.description),
        props.ctaText && h(
          'Button',
          {
            variant: props.ctaVariant,
            fullWidth: false,
            onClick: props.ctaAction
          },
          props.ctaText
        )
      )
    )
});
