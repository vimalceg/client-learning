import { h } from 'vdom';
import { transformJSX } from '../compiler/transformJSX.js';
import { registerComponent } from './ComponentRegistry.js';


export function createComponent(componentDef) {
    // const transformed = transformJSX(componentDef.jsx, { transforms: ['jsx'], jsxPragma: 'h' });
    const transformed = Babel.transform(componentDef.jsx, {
    plugins: [["transform-react-jsx", { pragma: "h" }]]
  });
    console.log('transformed component:', transformed.code);
    const Component = new Function('h', `let f= function (props) { let a= ${transformed.code}; console.log("a",a); return a;}; console.log(f); return f;`)(h);
    registerComponent(componentDef.name, Component);
}
