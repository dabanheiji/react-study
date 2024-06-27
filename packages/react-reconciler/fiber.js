import { HostComponent, FunctionComponent } from "./workTag";

export class FiberNode {
    tag;
    type;
    pendingProps;
    key;
    stateNode;
    
    child;
    return;
    sibling;
    index;

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

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function') {
		console.warn('未定义的type类型', element);
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}