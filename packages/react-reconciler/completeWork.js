import { createElement, createTextNode, appendChild } from "../react-dom/hostConfig";
import { HostComponent, HostRoot, HostText } from "./workTag";

export function completeWork(workInProgress) {
    // console.log('completeWork', workInProgress.tag, workInProgress.type);
    // 创建fiber对应的dom节点
    const newProps = workInProgress.pendingProps;

    switch (workInProgress.tag) {
        case HostRoot:
            break
        case HostText:
            const textInstance = createTextNode(newProps.content);
            appendAllChildren(textInstance, workInProgress);
            workInProgress.stateNode = textInstance;
            break
        case HostComponent:
            const instance = createElement(workInProgress.type, newProps);
            appendAllChildren(instance, workInProgress);
            workInProgress.stateNode = instance;
            break
    }
}

function appendAllChildren(parent, workInProgress) {
    let node = workInProgress.child;
    while(node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) {
            appendChild(parent, node.stateNode);
        }
        node = node.sibling;
    }
}