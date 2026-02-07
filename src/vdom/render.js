import { createElement } from './createElement.js';
import { diff } from './diff.js';
// 8️⃣ Render Function
let currentVDOM = null;

export function render(vdom, container) {
  if (!currentVDOM) {
    const newDom = createElement(vdom);
    if (newDom instanceof Node) {
      container.appendChild(newDom);
    }
  } else {
    diff(currentVDOM, vdom, container);
  }
  currentVDOM = vdom;
}