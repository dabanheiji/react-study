import { FiberNode, createFiberFromElement } from "./fiber";
import { HostComponent, HostRoot, HostText } from "./workTag";

export function beginWork(workInProgress) {
    // console.log('beginWork', workInProgress)
    switch(workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(workInProgress);
        case HostComponent:
            return updateHostComponent(workInProgress);
        case HostText:
            return null;
        default:
            return null;
    }
}

function updateHostRoot(workInProgress) {
    // 创建子节点对应的fiber，并且和 workInProgress 建立连接
    const nextChildren = workInProgress.pendingProps.children;
    mountChildFibers(workInProgress, nextChildren);
    return workInProgress.child;
}

function updateHostComponent(workInProgress) {
    const nextChildren = workInProgress.pendingProps.children;
    mountChildFibers(workInProgress, nextChildren);
    return workInProgress.child;
}

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
        return 
    }

    if(typeof nextChildren === 'string' || typeof nextChildren === 'number') {
        const fiber = new FiberNode(HostText, { content: nextChildren }, null);
        fiber.return = workInProgress;
        workInProgress.child = fiber;
        return 
    }

    console.log('未实现的类型');
}