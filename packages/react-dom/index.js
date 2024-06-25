import { createElement, createTextNode } from "./hostConfig";

const createRoot = (container) => {
    return {
        render(reactElement) {
            console.log(reactElement)
            appendChildLoop(container, [reactElement])
        }
    }
}

const appendChildLoop = (parent, childrenReactElement) => {
    if(!Array.isArray(childrenReactElement)) return;
    for(const reactElement of childrenReactElement) {
        let node;
        if(typeof reactElement === 'string' || typeof reactElement === 'number') {
            node = createTextNode(reactElement);
            parent.appendChild(node);
            continue
        }

        if(typeof reactElement === 'object' && reactElement !== null) {
            node = createElement(reactElement.type, reactElement.props);
            parent.appendChild(node);
            if(reactElement.props.children?.length) {
                appendChildLoop(node, reactElement.props.children)
            }
            continue
        }

        console.warn('未实现的类型')
    }
}

export default {
    createRoot
}