import { appendChild, createElement, createTextNode } from "../react-dom/hostConfig";
import { beginWork } from "./beginWork";
import { commitMutationEffects } from "./commitWork";
import { completeWork } from "./completeWork";
import { FiberNode, createFiberFromElement, createWorkInProgress } from "./fiber";
import { HostComponent, HostRoot, HostText } from "./workTag";

let workInProgress = null;

export const scheduleUpdateOnFiber = (fiber) => {
    const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = node.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}
	return null;
}

export const renderRoot = (root) => {
    // jsx -> fiber
    console.log(root);
    workInProgress = createWorkInProgress(root.current, root.current.pendingProps);

    while(workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }

    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;

    commitRoot(root);
}

// 渲染并创建fiber节点，组成fiber的链表结构
function performUnitOfWork(fiber){
    const next = beginWork(fiber);
    fiber.memoizedProps = fiber.pendingProps;

    if(next === null) {
        let node = fiber;
        do {
            completeWork(node);
            const sibling = node.sibling;
            if(sibling !== null) {
                workInProgress = sibling;
                return
            }
            node = node.return;
            workInProgress = node;
        } while(node !== null)
    } else {
        workInProgress = next;
    }
}

function commitRoot(root) {
    console.log('commitRoot', root);
    const finishedWork = root.finishedWork;
    if(finishedWork === null) {
        return;
    }
    root.finishedWork = null;
    
    commitMutationEffects(finishedWork);

    root.current = finishedWork;
}
