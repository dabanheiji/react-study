import { FiberNode } from "../react-reconciler/fiber"
import { renderRoot } from "../react-reconciler/workLoop"

const createRoot = (container) => {

    return {
        render(reactElement) {
            const hostRootFiber = new FiberNode('root', { children: [reactElement] }, null);
            hostRootFiber.stateNode = container;

            renderRoot(hostRootFiber);
        }
    }
}

export default {
    createRoot
}