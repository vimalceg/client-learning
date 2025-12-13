import { createComponent } from "../../vdom/component.js";

export default createComponent({
  jsx: `<div>
  Hello, {props.name}
  <Text>test1 sfsdf</Text>
  <button>{props.children}</button>
  </div>`,
  name: 'Button',
  props: {}
});