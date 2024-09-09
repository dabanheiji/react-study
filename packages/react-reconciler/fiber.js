import { NoFlags } from "./fiberFlags";
import { HostComponent, FunctionComponent } from "./workTag";

export class FiberNode {
    tag;
    type;
    pendingProps;
    memoizedProps;
    key;
    stateNode;
    
    child;
    return;
    sibling;
    index;
    memoizedState;

    alternate; // 双缓存fiber树

    flags;
    subtreeFlags;
    deletions;

    constructor(tag, props, key) {
        this.tag = tag;
        this.pendingProps = props;
        this.memoizedProps = null;
        this.key = key;
        this.type = null;
        this.stateNode = null;
        
        this.child = null;
        this.return = null;
        this.sibling = null;
        this.index = 0;
        this.memoizedState = null;

        this.alternate = null;

        this.flags = NoFlags;
        this.subtreeFlags = NoFlags;

        this.deletions = null;
    }
}

export class FiberRootNode {
    container;
    current;
    finishedWork;

    constructor(container, hostRootFiber) {
        this.container = container;
        this.current = hostRootFiber;
        this.finishedWork = null;
        hostRootFiber.stateNode = this;
    }
}

/**
 * 根据jsx对象创建fiber
 * @param {jsx} element 
 * @returns 
 */
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

/**
 * 根据current 创建 workInProgress fiber
 * @param {FiberNode} current 当前视图上的fiber
 * @param {any} pendingProps props
 * @returns {FiberNode} 新的fiber
 */
export const createWorkInProgress = (current, pendingProps) => {
    let workInProgress = current.alternate;
    if(workInProgress === null) {
        workInProgress = new FiberNode(current.tag, pendingProps, current.key);
        workInProgress.stateNode = current.stateNode;
        workInProgress.alternate = current;
        workInProgress.pendingProps = pendingProps;
        current.alternate = workInProgress;
    } else {
        workInProgress.pendingProps = pendingProps;
    }
    workInProgress.type = current.type;
    workInProgress.child = current.child;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.memoizedProps = current.memoizedProps;
    return workInProgress;
}