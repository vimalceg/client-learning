const mockPage = {
  id: 'home',
  sections: [
    {
      type: 'Hero',
      props: {
        title: 'Build fast VDOM experiences',
        description: 'Compose layout-driven pages using reusable components and real-time data.',
        ctaText: 'Launch playground'
      }
    },
    {
      type: 'Section',
      props: {
        title: 'Features',
        subtitle: 'Various primitives that can be driven by API payloads.'
      },
      children: [
        {
          type: 'FlexLayout',
          props: { direction: 'row', gap: '6', wrap: true, justify: 'center' },
          children: [
            {
              type: 'Card',
              props: {
                title: 'Composable',
                description: 'Nest layout and content directives in JSON.'
              }
            },
            {
              type: 'Card',
              props: {
                title: 'Realtime',
                description: 'Redux-backed counter streamlines each render.'
              }
            },
            {
              type: 'Card',
              props: {
                title: 'Design Friendly',
                description: 'Tailwind-ready classes make styling predictable.'
              }
            }
          ]
        }
      ]
    },
    {
      type: 'Section',
      props: {
        title: 'Grid Showcase'
      },
      children: [
        {
          type: 'GridLayout',
          props: {
            columns: 3,
            gap: '4',
            className: 'w-full'
          },
          children: [
            {
              type: 'Card',
              props: { title: 'One', description: 'Grid column one' }
            },
            {
              type: 'Card',
              props: { title: 'Two', description: 'Grid column two' }
            },
            {
              type: 'Card',
              props: { title: 'Three', description: 'Grid column three' }
            }
          ]
        }
      ]
    }
  ]
};

export function fetchPageLayout(pageId) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ ...mockPage, id: pageId }), 400);
  });
}
