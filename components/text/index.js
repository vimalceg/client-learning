import { createComponent } from "../../vdom/component.js";

export default createComponent({
  jsx: `<div>aaa {props.children}</div>`,
  name: 'Text',
  props: {}
});