import { createComponent } from 'component';

export default createComponent({
  name: 'GridLayout',
  props: {
    columns: { type: 'number' },
    gap: { type: 'string' },
    justify: { type: 'string' },
    align: { type: 'string' },
    templateColumns: { type: 'string' },
    templateRows: { type: 'string' },
    className: { type: 'string' },
    style: { type: 'object' },
    children: { type: 'any' }
  },
  template: (props, h) => {
    const baseClasses = ['grid'];
    if (props.columns) {
      baseClasses.push(`grid-cols-${props.columns}`);
    }
    if (props.gap) {
      baseClasses.push(`gap-${props.gap}`);
    }
    if (props.justify) {
      baseClasses.push(`justify-items-${props.justify}`);
    }
    if (props.align) {
      baseClasses.push(`items-${props.align}`);
    }
    if (props.className) {
      baseClasses.push(props.className);
    }

    const style = {
      ...(props.templateColumns ? { gridTemplateColumns: props.templateColumns } : {}),
      ...(props.templateRows ? { gridTemplateRows: props.templateRows } : {}),
      ...(props.style || {})
    };

    return h(
      'div',
      {
        class: baseClasses.filter(Boolean).join(' '),
        style
      },
      props.children
    );
  }
});
