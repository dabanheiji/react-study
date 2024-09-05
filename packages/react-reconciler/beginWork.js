import { FiberNode, createFiberFromElement, createWorkInProgress } from "./fiber";
import { ChildDeletion, Placement } from "./fiberFlags";
import { FunctionComponent, HostComponent, HostRoot, HostText } from "./workTag";

export function beginWork(workInProgress) {
    // console.log('beginWork', workInProgress)
    switch(workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(workInProgress);
        case HostComponent:
            return updateHostComponent(workInProgress);
        case HostText:
            return null;
        case FunctionComponent:
            return updateFunctionComponent(workInProgress);
        default:
            return null;
    }
}

function updateFunctionComponent(workInProgress) {
    const nextChildren = workInProgress.type();
    reconcilerChildren(workInProgress, nextChildren);
    return workInProgress.child;
}

function updateHostRoot(workInProgress) {
    // 创建子节点对应的fiber，并且和 workInProgress 建立连接
    const nextChildren = workInProgress.pendingProps.children;
    reconcilerChildren(workInProgress, nextChildren);
    return workInProgress.child;
}

function updateHostComponent(workInProgress) {
    const nextChildren = workInProgress.pendingProps.children;
    reconcilerChildren(workInProgress, nextChildren);
    return workInProgress.child;
}

/**
 * 
 * @param {FiberNode} workInProgress 
 * @param {JSX} children 
 */
function reconcilerChildren(workInProgress, children) {
    let current = workInProgress.alternate;
    if(current !== null) {
        updateChildFibers(workInProgress, current.child, children);
    } else {
        mountChildFibers(workInProgress, children);
    }
}

/**
 * mount阶段 根据children对应的jsx创建子fiber
 * @param {FiberNode} workInProgress 
 * @param {JSX} nextChildren 
 * @returns 
 */
function mountChildFibers(workInProgress, nextChildren) {
    // console.log('workInProgress', workInProgress);
    // workInProgress 是当前工作中对应的fiber

    // children 是数组的情况下需要创建所有children的fiber 并且和 workInProgress 建立连接 workInProgress.child 指向第一个children的fiber
    if(Array.isArray(nextChildren)) {
        let prevSibling = null;
        for(let i = 0; i < nextChildren.length; i++) {
            const element = nextChildren[i];
            
            let newFiber;
            if(typeof element === 'string' || typeof element === 'number') {
                newFiber = new FiberNode(HostText, { content: element }, null);
            } else {
                newFiber = createFiberFromElement(element);
            }

            if(i === 0) {
                workInProgress.child = newFiber;
            } else {
                prevSibling.sibling = newFiber;
            }
            newFiber.return = workInProgress;
            prevSibling = newFiber;
        }
        return
    }

    if(typeof nextChildren === 'object' && nextChildren !== null) {
        const fiber = createFiberFromElement(nextChildren);
        fiber.return = workInProgress;
        workInProgress.child = fiber;
        return fiber;
    }

    if(typeof nextChildren === 'string' || typeof nextChildren === 'number') {
        const fiber = new FiberNode(HostText, { content: nextChildren }, null);
        fiber.return = workInProgress;
        workInProgress.child = fiber;
        return fiber;
    }

    console.log('未实现的类型');
}

function updateChildFibers(workInProgress, currentFiber, nextChildren) {

    if(currentFiber !== null) {
        if(Array.isArray(nextChildren)) {
            // TODO 多节点场景
        }

        if(typeof nextChildren === 'object' && nextChildren !== null) {
            /**
             * 判断能不能复用fiber，满足下面两个条件可以复用
             * 1. type 不变
             * 2. key 不变
             */
            const key = nextChildren.key;
            if(currentFiber.key === key) {
                if(currentFiber.type === nextChildren.type) {
                    // 可以复用
                    const existing = useFiber(currentFiber, nextChildren.props);
                    existing.return = workInProgress;
                    return existing;
                }
                // key相同，但是type不同，不能复用，删除节点
                deleteChild(workInProgress, currentFiber);
            } else {
                // key不同，不能复用，删除节点
                deleteChild(workInProgress, currentFiber);
            }
            return
        }

        if(typeof nextChildren === 'string' || typeof nextChildren === 'number') {
            // 文本节点只需要判断更新后还是文本节点吗，只要是文本节点一定可以复用
            if(currentFiber.tag === HostText) {
                const existing = useFiber(currentFiber, { content: nextChildren });
                existing.return = workInProgress;
                return existing;
            }
            // 不是文本节点，删除
            deleteChild(workInProgress, currentFiber);
        }

    }

    // 说明是更新阶段新出现的节点，需要打上Placement标记
    const fiber = createFiberFromElement(nextChildren);
    fiber.return = workInProgress;
    fiber.flags |= Placement;
    workInProgress.child = fiber;
}

/**
 * 打上删除的标记
 * @param {FiberNode} returnFiber 父fiber
 * @param {FiberNode} childToDelete 需要删除的fiber
 */
function deleteChild(returnFiber, childToDelete) {
    if(!returnFiber.deletions) {
        returnFiber.deletions = [childToDelete];
        returnFiber.flags |= ChildDeletion;
    } else {
        returnFiber.deletions.push(childToDelete);
    }
}

/**
 *  复用fiber的方法
 * @param {FiberNode} fiber 复用的fiber
 * @param {any} pendingProps props
 * @returns {FiberNode}
 */
function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
}