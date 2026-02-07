import { createComponent } from 'component';

export default createComponent({
  name: 'FlexLayout',
  props: {
    direction: { type: 'string', default: 'row' },
    wrap: { type: 'boolean', default: false },
    justify: { type: 'string' },
    align: { type: 'string' },
    gap: { type: 'string' },
    className: { type: 'string' },
    style: { type: 'object' },
    children: { type: 'any' }
  },
  template: (props, h) => {
    const classList = [
      'flex',
      props.direction === 'column' ? 'flex-col' : 'flex-row',
      props.wrap ? 'flex-wrap' : 'flex-nowrap',
      props.justify ? `justify-${props.justify}` : '',
      props.align ? `items-${props.align}` : '',
      props.gap ? `gap-${props.gap}` : '',
      props.className || ''
    ]
      .filter(Boolean)
      .join(' ');

    return h(
      'div',
      {
        class: classList,
        style: props.style || {}
      },
      props.children
    );
  }
});
