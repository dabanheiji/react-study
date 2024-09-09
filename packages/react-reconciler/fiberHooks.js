import { currentDispatcher } from '../react/currentDispatcher';
import { FiberNode } from './fiber';
import { scheduleUpdateOnFiber } from './workLoop';

let currentlyRenderingFiber = null;
let workInProgressHook = null;
let currentHook = null;

/**
 * 
 * @param {FiberNode} workInProgress 
 * @returns 
 */
export const renderWithHooks = (workInProgress) => {
    currentlyRenderingFiber = workInProgress;
    const current = workInProgress.alternate;

    if(current === null) {
        // mount
        currentDispatcher.current = mountDispatcher;
    } else {
        // update
        currentDispatcher.current = updateDispatcher;
    }

    const Component = workInProgress.type;
    // console.log('workInProgress', workInProgress);
    const props = workInProgress.pendingProps;
    const children = Component(props);

    currentlyRenderingFiber = null;
    workInProgressHook = null;
    return children;
}

const mountDispatcher = {
    useState: mountState
};
const updateDispatcher = {
    useState: updateState
};

export function mountState(initialState) {
    const hook = mountWorkdInProgressHook();
    let memoizedState;

    if(typeof initialState === 'function') {
        memoizedState = initialState();
    } else {
        memoizedState = initialState;
    }

    hook.memoizedState = memoizedState;

    const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, hook)

    return [hook.memoizedState, dispatch];
}

export function updateState() {
    const hook = updateWorkdInProgressHook();

    let memoizedState = workInProgressHook.memoizedState;

    if(typeof hook.action === 'function') {
        memoizedState = hook.action(memoizedState);
    } else {
        memoizedState = hook.action;
    }
    hook.action = null;
    hook.memoizedState = memoizedState;

    const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, hook);
    // console.log('state', hook);
    return [hook.memoizedState, dispatch];
}

function dispatchSetState(fiber, hook, action) {
    hook.action = action;
    scheduleUpdateOnFiber(fiber);
}

function mountWorkdInProgressHook() {
    const hook = {
        memoizedState: null,
    }

    workInProgressHook = hook;
    currentlyRenderingFiber.memoizedState = hook;

    return hook;
}

function updateWorkdInProgressHook() {
    const current = currentlyRenderingFiber.alternate;
    currentHook = current?.memoizedState;

    const newHook = {
        memoizedState: currentHook.memoizedState,
        action: currentHook.action,
    }

    workInProgressHook = newHook;
    currentlyRenderingFiber.memoizedState = newHook;

    return workInProgressHook;
}