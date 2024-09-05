import { FiberNode, FiberRootNode } from "../react-reconciler/fiber"
import { renderRoot } from "../react-reconciler/workLoop"
import { HostRoot } from "../react-reconciler/workTag";

const createRoot = (container) => {

    return {
        render(reactElement) {
            const hostRootFiber = new FiberNode(HostRoot, { children: reactElement }, null);
            const root = new FiberRootNode(container, hostRootFiber);
            renderRoot(root);
        }
    }
}

export default {
    createRoot
}