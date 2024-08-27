import { appendChild, createElement, createTextNode } from "./hostConfig";

const createRoot = (container) => {
  return {
    render(reactElement) {
      console.log(reactElement);
      appendChildLoop(container, reactElement);
    },
  };
};

const appendChildLoop = (parent, childrenReactElement) => {
  if (!childrenReactElement) return;

  const node = createChild(childrenReactElement);
  appendChild(parent, node);

  // 递归插入子节点
  if (childrenReactElement.props && childrenReactElement.props.children) {
    const children = childrenReactElement.props.children;

    if (Array.isArray(childrenReactElement.props.children)) {
      childrenReactElement.props.children.forEach((child) => {
        appendChildLoop(node, child);
      });
    } else if(typeof childrenReactElement.props.children === 'object') {
      appendChildLoop(node, children);
    } else {
      console.log('未考虑到的类型', children);
    }
  }
};

const createChild = (reactElement) => {
  let node;
  if (typeof reactElement === "string" || typeof reactElement === "number") {
    // 文本节点
    node = createTextNode(reactElement);
  } else if (typeof reactElement === "object" && reactElement !== null) {
    // 普通dom节点 比如 div span
    node = createElement(reactElement.type, reactElement.props);
  } else {
    console.warn("未实现的类型");
  }

  return node;
};

export default {
  createRoot,
};
