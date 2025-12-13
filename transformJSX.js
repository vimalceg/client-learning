import { Parser } from "acorn";
import jsx from "./jsx.js";

const JSXParser = Parser.extend(jsx());

export function transformJSX(code) {
  const ast = JSXParser.parse(code, {
    ecmaVersion: 2020,
    sourceType: "module"
  });

  return generate(ast);
}

/* ---------------- CORE ---------------- */

function generate(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(generate).join("\n");

    case "ExpressionStatement":
      return generate(node.expression) + ";";

    case "JSXElement":
      return transformElement(node);

    case "JSXFragment":
      return transformFragment(node);

    case "Literal":
      return JSON.stringify(node.value);

    case "Identifier":
      return node.name;

    case "CallExpression":
      return `${generate(node.callee)}(${node.arguments.map(generate).join(", ")})`;

    default:
      return "";
  }
}

/* ---------------- JSX ---------------- */

function transformElement(node) {
  const tag = resolveTag(node.openingElement.name);
  const props = buildProps(node.openingElement.attributes);
  const children = buildChildren(node.children);

  return `h(${tag}, ${props}${children ? ", " + children : ""})`;
}

function transformFragment(node) {
  const children = buildChildren(node.children);
  return `h(null, null${children ? ", " + children : ""})`;
}

function resolveTag(name) {
  if (name.type === "JSXIdentifier") {
    return /^[A-Z]/.test(name.name)
      ? `"${name.name}"`
      : `"${name.name}"`;
  }
}

function buildProps(attrs) {
  if (!attrs.length) return "null";

  const props = attrs.map(attr => {
    const key = attr.name.name;

    if (!attr.value) return `${key}: true`;

    if (attr.value.type === "Literal") {
      return `${key}: ${JSON.stringify(attr.value.value)}`;
    }

    if (attr.value.type === "JSXExpressionContainer") {
      return `${key}: ${generate(attr.value.expression)}`;
    }
  });

  return `{ ${props.join(", ")} }`;
}

function buildChildren(children) {
  const result = children
    .map(c => {
      if (c.type === "JSXText") {
        const text = c.value.trim();
        return text ? JSON.stringify(text) : null;
      }

      if (c.type === "JSXExpressionContainer") {
        return generate(c.expression);
      }

      if (c.type === "JSXElement") {
        return transformElement(c);
      }

      if (c.type === "JSXFragment") {
        return transformFragment(c);
      }

      return null;
    })
    .filter(Boolean);

  return result.join(", ");
}
