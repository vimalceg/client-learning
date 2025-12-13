// 1️⃣ Virtual DOM Node Helper
import { getComponent } from './ComponentRegistry.js';

export function h(type, rawProps = {}, ...children) {
  let ref = null;
  let key = null;
  const props = {};

  for (const k in rawProps) {
    if (k === 'ref') ref = rawProps[k];
    else if (k === 'key') key = rawProps[k];
    else props[k] = rawProps[k];
  }
  
 

  return {
    type,
    key,
    ref,
    props,
    children: children.flat().map(c =>
      typeof c === 'object' ? c : String(c)
    )
  };
}