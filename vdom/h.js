// 1️⃣ Virtual DOM Node Helper
export function h(type, rawProps = {}, ...children) {
  let ref = null;
  let key = null;
  const props = {};

  for (const k in rawProps) {
    if (k === 'ref') ref = rawProps[k];
    else if (k === 'key') key = rawProps[k];
    else props[k] = rawProps[k];
  }
  
 

  const normalizedChildren = children
    .flat()
    .filter(c => c !== null && c !== undefined && typeof c !== 'boolean')
    .map(c => (typeof c === 'object' ? c : String(c)));

  return {
    type,
    key,
    ref,
    props,
    children: normalizedChildren
  };
}
