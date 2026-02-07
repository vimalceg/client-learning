import { setProps } from './setProps.js';
import { applyRef } from './applyRef.js';
import { getComponent } from './ComponentRegistry.js';

// Helper function to create component elements
function createComponentElement(vnode) {
  let componentName = typeof vnode.type === 'string' ? vnode.type : vnode.type.name;
  let componentFunc = getComponent(componentName);
  
  if (!componentFunc) {
    console.error('Component not found:', componentName);
    return document.createTextNode('');
  }
  
  let componentVDOM = componentFunc({ ...vnode.props, children: vnode.children });
  
  // Ensure componentVDOM is a valid vnode before recursing
  if (!componentVDOM) {
    console.error('Component returned null/undefined:', componentName);
    return document.createTextNode('');
  }
  
  return createElement(componentVDOM);
}

// 2️⃣ Create Real DOM from VDOM
export function createElement(vnode) {
  if (vnode == null || typeof vnode === 'boolean') {
    return document.createTextNode('');
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }
  if (vnode && (typeof vnode.type !== 'string' || /[A-Z]/.test(vnode.type))) {
    return createComponentElement(vnode);
  }
  const el = document.createElement(vnode.type);

  setProps(el, {}, vnode.props);

  vnode.children.forEach(child => {
    el.appendChild(createElement(child));
  });

  // 🔑 APPLY REF
  applyRef(vnode.ref, el);
  
  return el;
}