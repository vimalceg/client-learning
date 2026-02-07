import { h } from 'vdom';
import { registerComponent } from './ComponentRegistry.js';

export function createComponent(componentDef) {
  if (!componentDef || typeof componentDef !== 'object') {
    throw new Error('createComponent expects a component definition object.');
  }
  if (typeof componentDef.template !== 'function') {
    throw new Error(`Component "${componentDef.name || 'Unnamed'}" must provide a template(props, h) function.`);
  }

  const propsSchema = componentDef.props || {};

  function normalizeProps(inputProps = {}) {
    const normalized = { ...inputProps };

    for (const key of Object.keys(propsSchema)) {
      const rule = normalizeRule(propsSchema[key]);
      let value = normalized[key];

      if (value === undefined) {
        if (rule.default !== undefined) {
          value = typeof rule.default === 'function' ? rule.default() : rule.default;
          normalized[key] = value;
        } else if (rule.required) {
          console.warn(`Missing required prop "${key}" in ${componentDef.name || 'component'}.`);
        }
      }

      if (value !== undefined && rule.type && !isType(value, rule.type)) {
        console.warn(
          `Invalid prop "${key}" in ${componentDef.name || 'component'}: expected ${typeLabel(rule.type)}, got ${typeof value}.`
        );
      }

      if (value !== undefined && typeof rule.validate === 'function' && !rule.validate(value)) {
        console.warn(`Prop "${key}" failed custom validation in ${componentDef.name || 'component'}.`);
      }
    }

    return normalized;
  }

  function Component(inputProps) {
    const props = normalizeProps(inputProps);
    return componentDef.template(props, h);
  }

  registerComponent(componentDef.name, Component);
  return Component;
}

function normalizeRule(rule) {
  if (rule == null) return {};
  if (typeof rule === 'string' || typeof rule === 'function' || Array.isArray(rule)) {
    return { type: rule };
  }
  return rule;
}

function isType(value, type) {
  if (Array.isArray(type)) {
    return type.some(t => isType(value, t));
  }
  if (typeof type === 'string') {
    if (type === 'array') return Array.isArray(value);
    if (type === 'null') return value === null;
    return typeof value === type;
  }
  if (type === String) return typeof value === 'string';
  if (type === Number) return typeof value === 'number';
  if (type === Boolean) return typeof value === 'boolean';
  if (type === Function) return typeof value === 'function';
  if (type === Object) return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === Array) return Array.isArray(value);
  return value instanceof type;
}

function typeLabel(type) {
  if (Array.isArray(type)) {
    return type.map(typeLabel).join(' | ');
  }
  if (typeof type === 'string') return type;
  if (type && type.name) return type.name;
  return 'unknown';
}
