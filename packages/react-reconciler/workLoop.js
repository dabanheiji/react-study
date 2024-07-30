import { appendChild, createElement, createTextNode } from "../react-dom/hostConfig";
import { beginWork } from "./beginWork";
import { completeWork } from "./completeWork";
import { FiberNode, createFiberFromElement } from "./fiber";
import { HostComponent, HostRoot, HostText } from "./workTag";

let workInProgress = null;

export const renderRoot = (rootFiber) => {
    // jsx -> fiber
    console.log(rootFiber);
    workInProgress = rootFiber;

    while(workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }

    commitRoot(rootFiber);
}

// 渲染并创建fiber节点，组成fiber的链表结构
function performUnitOfWork(fiber){
    const next = beginWork(fiber);

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

function commitRoot(rootFiber) {
    console.log('commitRoot', rootFiber);
    let node = rootFiber.child;
    while(node !== null) {
        appendChild(rootFiber.stateNode, node.stateNode);
        node = node.sibling;
    }
}
