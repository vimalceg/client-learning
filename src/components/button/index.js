import { createComponent } from 'component';

const variantStyles = {
  solid: 'bg-blue-500 text-white border-transparent hover:bg-blue-600',
  outline: 'border border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50',
  ghost: 'bg-transparent text-blue-600 hover:text-blue-800'
};

export default createComponent({
  name: 'Button',
  props: {
    variant: { type: 'string', default: 'solid' },
    size: { type: 'string', default: 'md' },
    className: { type: 'string' },
    children: { type: 'any' },
    onClick: { type: 'function' },
    type: { type: 'string', default: 'button' },
    fullWidth: { type: 'boolean', default: false }
  },
  template: (props, h) => {
    const padding = {
      xs: 'px-3 py-1 text-sm',
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }[props.size] || 'px-5 py-2 text-base';

    const classes = [
      'rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition',
      padding,
      variantStyles[props.variant] || variantStyles.solid,
      props.fullWidth ? 'w-full justify-center' : 'inline-flex',
      props.className || ''
    ]
      .filter(Boolean)
      .join(' ');

    return h(
      'button',
      {
        class: classes,
        type: props.type,
        onClick: props.onClick
      },
      props.children
    );
  }
});
