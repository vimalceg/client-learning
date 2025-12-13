export function applyRef(ref, value) {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(value);
  } else if (typeof ref === 'object') {
    ref.current = value;
  }
}