import { createElement, createTextNode, appendChild } from "../react-dom/hostConfig";
import { FiberNode } from "./fiber";
import { NoFlags, Update } from "./fiberFlags";
import { FunctionComponent, HostComponent, HostRoot, HostText } from "./workTag";

function markUpdate(fiber) {
	fiber.flags |= Update;
}

export function completeWork(workInProgress) {
    // 创建fiber对应的dom节点
    const newProps = workInProgress.pendingProps;
    const current = workInProgress.alternate;

    switch (workInProgress.tag) {
        case HostRoot:
            bubbleProperties(workInProgress)
            break
        case HostText:
            if(current === null) {
                const textInstance = createTextNode(newProps.content);
                workInProgress.stateNode = textInstance;
            } else {
                const oldText = current.memoizedProps.content;
				const newText = newProps.content;
				if (oldText !== newText) {
					markUpdate(workInProgress);
				}
            }
            bubbleProperties(workInProgress)
            break
        case HostComponent:
            if(current === null) {
                const instance = createElement(workInProgress.type, newProps);
                appendAllChildren(instance, workInProgress);
                workInProgress.stateNode = instance;
            } else {
                // TODO
            }
            bubbleProperties(workInProgress)
            break
        case FunctionComponent:
            bubbleProperties(workInProgress)
            break
    }
}

function appendAllChildren(parent, workInProgress) {
    let node = workInProgress.child;
    // 创建完dom节点后，应该把所有子fiber上对应的dom插入到当前dom上
    while(node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) {
            appendChild(parent, node.stateNode);
        } else if(node.child !== null) {
            // 走到这里表示是函数组件，以后也可能是其他的没有dom的fiber，对应的dom在child上
            node.child.return = node;
            node = node.child;
            continue
        }

        // 如果node 等于 workInProgress的话说明遍历结束了，表示所有的子fiber对应的dom都添加进去了
        if(node === workInProgress) {
            return
        }

        // 走到这里说明当前节点没有兄弟节点，需要向上寻找
        while(node.sibling === null) {
            if(node.return === null || node.return === workInProgress) {
                return
            }
            node = node.return;
        }

        // 走到这里说明有兄弟节点，下次遍历插入兄弟节点上对应的dom
        node.sibling.return = node.return;
        node = node.sibling;
    }
}

/**
 * 冒泡flags 到父节点
 * @param {FiberNode} workInProgress 
 */
function bubbleProperties(workInProgress) {
    let subtreeFlags = NoFlags;
	let child = workInProgress.child;

    while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;

		child.return = workInProgress;
		child = child.sibling;
	}
    console.log('bubbleProperties', workInProgress, subtreeFlags);
	workInProgress.subtreeFlags |= subtreeFlags;
}