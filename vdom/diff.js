import { createElement } from './createElement.js';
import { setProps } from './setProps.js';
import { applyRef } from './applyRef.js';
import { getComponent } from './ComponentRegistry.js';

// Helper to check if a vnode is a component
function isComponent(vnode) {
  if (!vnode || typeof vnode === 'string') return false;
  return typeof vnode.type !== 'string' || /^[A-Z]/.test(vnode.type);
}

// Helper to resolve component to its rendered vnode
function resolveComponentVNode(vnode) {
  if (!isComponent(vnode)) return vnode;
  
  let componentName = typeof vnode.type === 'string' ? vnode.type : vnode.type.name;
  let componentFunc = getComponent(componentName);
  if (!componentFunc) return null;
  
  let componentVDOM = componentFunc({ ...vnode.props, children: vnode.children });
  return componentVDOM ? resolveComponentVNode(componentVDOM) : null;
}

// 6️⃣ Key Detection
function hasKeys(a, b) {
  return [...a, ...b].some(c => c && typeof c === 'object' && c.key != null);
}
// 7️⃣ Keyed List Diff (Core Logic)
function diffKeyedChildren(oldChildren, newChildren, parentDom) {
  const oldMap = new Map();

  oldChildren.forEach((child, index) => {
    if (child?.key != null) {
      oldMap.set(child.key, {
        vnode: child,
        dom: parentDom.childNodes[index]
      });
    }
  });

  let currentDomIndex = 0;

  newChildren.forEach((newChild) => {
    const key = newChild?.key;
    const match = key != null ? oldMap.get(key) : null;

    if (match) {
      diff(match.vnode, newChild, parentDom, currentDomIndex);

      const dom = match.dom;
      const referenceNode = parentDom.childNodes[currentDomIndex];

      if (dom !== referenceNode) {
        parentDom.insertBefore(dom, referenceNode);
      }

      oldMap.delete(key);
    } else {
      const newDom = createElement(newChild);
      if (newDom instanceof Node) {
        parentDom.insertBefore(
          newDom,
          parentDom.childNodes[currentDomIndex] || null
        );
      }
    }

    currentDomIndex++;
  });

  // Remove old nodes not reused
  oldMap.forEach(({ dom }) => {
    if (dom instanceof Node) {
      parentDom.removeChild(dom);
    }
  });
}

// 5️⃣ Children Diff (Keyed + Unkeyed)
function diffChildren(oldChildren, newChildren, parentDom) {
  const keyed = hasKeys(oldChildren, newChildren);

  if (keyed) {
    diffKeyedChildren(oldChildren, newChildren, parentDom);
  } else {
    const max = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < max; i++) {
      diff(oldChildren[i], newChildren[i], parentDom, i);
    }
  }
}

// 4️⃣ Diff Entry Point
export function diff(oldVNode, newVNode, parentDom, index = 0) {
  const domNode = parentDom.childNodes[index];

  if (!oldVNode) {
    const newDom = createElement(newVNode);
    if (newDom instanceof Node) {
      parentDom.appendChild(newDom);
    }
    return;
  }

  if (!newVNode) {
    applyRef(oldVNode.ref, null);
    if (domNode && domNode instanceof Node) {
      parentDom.removeChild(domNode);
    }
    return;
  }

  // Resolve components to their actual vnodes for comparison
  const resolvedOldVNode = resolveComponentVNode(oldVNode) || oldVNode;
  const resolvedNewVNode = resolveComponentVNode(newVNode) || newVNode;

  // Text nodes
  if (typeof oldVNode === 'string' || typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      const newDom = createElement(newVNode);
      if (newDom instanceof Node && domNode instanceof Node) {
        parentDom.replaceChild(newDom, domNode);
      }
    }
    return;
  }

  // Different element type
  if (resolvedOldVNode.type !== resolvedNewVNode.type) {
    const newDom = createElement(newVNode);
    if (newDom instanceof Node && domNode instanceof Node) {
      parentDom.replaceChild(newDom, domNode);
    }
    return;
  }

  // Update props (use resolved vnodes)
  if (domNode && domNode instanceof Node) {
    setProps(domNode, resolvedOldVNode.props, resolvedNewVNode.props);
  }
  
  // Handle refs from original vnodes
  if (oldVNode.ref !== newVNode.ref) {
    applyRef(oldVNode.ref, null); // cleanup old
    applyRef(newVNode.ref, domNode);
  }

  // Diff children (use resolved vnodes)
  if (domNode && domNode instanceof Node) {
    diffChildren(
      resolvedOldVNode.children || [],
      resolvedNewVNode.children || [],
      domNode
    );
  }
}