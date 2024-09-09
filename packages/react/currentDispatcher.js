export const currentDispatcher = {
    current: null,
}

export const resolveDispatcher = () => {
    const dispatcher = currentDispatcher.current;
    if(!dispatcher) {
        throw new Error('hooks只能在函数组件中调用');
    }
    return dispatcher;
}