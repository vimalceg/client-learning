// 3️⃣ Props Handling
export function setProps(el, oldProps, newProps) {
  // Remove old event listeners
  for (const k in oldProps) {
    if (k.startsWith('on')) {
      const eventName = k.toLowerCase().substring(2);
      el.removeEventListener(eventName, oldProps[k]);
    } else if (k !== 'key') {
      el.removeAttribute(k);
    }
  }

  // Add / Update
  for (const k in newProps) {
    if (k === 'key') continue;
    if (k.startsWith('on')) {
      const eventName = k.toLowerCase().substring(2);
      el.addEventListener(eventName, newProps[k]);
    } else {
      el.setAttribute(k, newProps[k]);
    }
  }
}