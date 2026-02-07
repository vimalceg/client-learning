import { createComponent } from 'component';

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
};

export default createComponent({
  name: 'Text',
  props: {
    tag: { type: 'string', default: 'p' },
    size: { type: 'string', default: 'md' },
    weight: { type: 'string', default: 'normal' },
    align: { type: 'string' },
    color: { type: 'string' },
    className: { type: 'string' },
    style: { type: 'object' },
    children: { type: 'any' }
  },
  template: (props, h) =>
    h(
      props.tag,
      {
        class: [
          sizeClasses[props.size] || sizeClasses.md,
          props.weight === 'bold' ? 'font-bold' : props.weight === 'semibold' ? 'font-semibold' : '',
          props.align ? `text-${props.align}` : '',
          props.color || '',
          props.className || ''
        ]
          .filter(Boolean)
          .join(' '),
        style: props.style || {}
      },
      props.children
    )
});
