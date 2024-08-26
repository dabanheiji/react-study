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

  if (Array.isArray(childrenReactElement)) {
    for (const reactElement of childrenReactElement) {
      // 创建插入节点
      const node = createChild(reactElement);
      appendChild(parent, node);

      // 递归插入子节点
      if (reactElement.props && reactElement.props.children) {
        appendChildLoop(node, reactElement.props.children);
      }
    }
  } else if (typeof childrenReactElement === "object") {
    // 创建插入节点
    const node = createChild(childrenReactElement);
    appendChild(parent, node);

    // 递归插入子节点
    if (childrenReactElement.props && childrenReactElement.props.children) {
      appendChildLoop(node, childrenReactElement.props.children);
    }
  } else {
    console.log("未考虑的场景", childrenReactElement);
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
