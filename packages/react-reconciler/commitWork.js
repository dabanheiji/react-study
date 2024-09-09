import { appendChild, commitTextUpdate } from "../react-dom/hostConfig";
import { FiberNode } from "./fiber";
import { MutationMask, NoFlags, Placement, Update } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTag";

export function commitMutationEffects(finishedWork) {
    let nextEffect = finishedWork;

    while(nextEffect !== null) {
        const child = nextEffect.child;

        // 查看child上是否有子节点上存在需要处理的flags
        if(
            (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
        ) {
            nextEffect = child;
        } else {
            up: while(nextEffect !== null) {
                commitMutationEffectsOnFiber(nextEffect)

                const sibling = nextEffect.sibling;

                if(sibling !== null) {
                    nextEffect = sibling;
                    break up;
                }

                nextEffect = nextEffect.return;
            }
        }
    }
}

/**
 * 处理副作用
 * @param {FiberNode} workInProgress 
 */
function commitMutationEffectsOnFiber(workInProgress) {
    const flags = workInProgress.flags;
    if((flags & Placement) !== NoFlags) {
        commitPlacement(workInProgress);
        workInProgress.flags &= ~Placement;
    }

    if ((flags & Update) !== NoFlags) {
		commitUpdate(workInProgress);
		workInProgress.flags &= ~Update;
	}
}

function commitPlacement(workInProgress) {
    const hostParent = getHostParent(workInProgress);
    if(hostParent !== null) {
        appendPlacementNodeIntoContainer(workInProgress, hostParent)
    }
}

function commitUpdate(fiber) {
    switch (fiber.tag) {
		case HostText:
			const text = fiber.memoizedProps?.content;
			commitTextUpdate(fiber.stateNode, text);
			break;
		default:
			if (__DEV__) {
				console.warn('为实现的update类型', fiber);
			}
			break;
	}
}

function getHostParent(fiber) {
    let parent = fiber.return;

    while(parent !== null) {
        const parentTag = parent.tag;

        // HostComponent HostRoot
        if(parentTag === HostComponent) {
            return parent.stateNode;
        }

        if(parentTag === HostRoot) {
            return parent.stateNode.container;
        }

        parent = parent.return;
    }
    return null;
}

function appendPlacementNodeIntoContainer(workInProgress, container) {
    if(workInProgress.tag === HostComponent || workInProgress.tag === HostText) {
        appendChild(container, workInProgress.stateNode);
        return
    }

    const child = workInProgress.child;
    if(child !== null) {
        appendPlacementNodeIntoContainer(child, container);
        let sibling = child.sibling;

        while(sibling !== null) {
            appendPlacementNodeIntoContainer(sibling, container);
            sibling = sibling.sibling;
        }
    }
}