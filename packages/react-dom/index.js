import { FiberNode } from "../react-reconciler/fiber"
import { renderRoot } from "../react-reconciler/workLoop"
import { HostRoot } from "../react-reconciler/workTag";

const createRoot = (container) => {

    return {
        render(reactElement) {
            const hostRootFiber = new FiberNode(HostRoot, { children: [reactElement] }, null);
            hostRootFiber.stateNode = container;

            renderRoot(hostRootFiber);
        }
    }
}

export default {
    createRoot
}