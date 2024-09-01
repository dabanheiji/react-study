import { HostComponent, FunctionComponent } from "./workTag";

export class FiberNode {
  tag; // 组件的tag类型
  type; // 组件的类型，比如div，span
  pendingProps; // 组件的props
  key; // 组件的key
  stateNode; // 组件对应的真实dom节点

  child; // 子节点
  return; // 父节点
  sibling; // 兄弟节点
  index; // 兄弟节点的索引

  constructor(tag, props, key) {
    this.tag = tag;
    this.pendingProps = props;
    this.key = key;
    this.type = null;
    this.stateNode = null;

    this.child = null;
    this.return = null;
    this.sibling = null;
    this.index = 0;
  }
}

export const createFiberFromElement = (element) => {
  const { type, key, props } = element;
  let fiberTag = FunctionComponent;

  if (typeof type === "string") {
    fiberTag = HostComponent;
  } else if (typeof type !== "function") {
    console.warn("未定义的type类型", element);
  }

  const fiber = new FiberNode(fiberTag, props, key);
  fiber.type = type;
  return fiber;
};
