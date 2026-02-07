class ComponentRegistry {
    constructor() {
        this.components = {};
    }
    registerComponent(name, componentFunc) {
        this.components[name] = componentFunc;
    }
    getComponent(name) {
        return this.components[name];
    }
}
const componentRegistry = new ComponentRegistry();

export function registerComponent(name, componentFunc) {
    componentRegistry.registerComponent(name, componentFunc);
}
export function getComponent(name) {
    return componentRegistry.getComponent(name);
}