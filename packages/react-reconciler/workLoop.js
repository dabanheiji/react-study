import { appendChild, createElement, createTextNode } from "../react-dom/hostConfig";
import { FiberNode } from "./fiber";

let workInProgress = null;

export const renderRoot = (rootFiber) => {
    // jsx -> fiber
    console.log(rootFiber);
    workInProgress = rootFiber;

    while(workInProgress !== null) {
        workInProgress =  performUnitOfWork(workInProgress);
    }
}

// 渲染并创建fiber节点，组成fiber的链表结构
function performUnitOfWork(fiber){
    if(!fiber.stateNode){
        // 如果当前节点没有对应的dom元素就创建对应的dom，并储存
        if(fiber.type === 'TEXT_ELEMENT') {
            fiber.stateNode = createTextNode(fiber.pendingProps.content);
        } else {
            fiber.stateNode = createElement(fiber.type);
        }
    }
    
    if(fiber.return){
        // 如果存在父节点就将当前fiber对应的dom插入到父节点
        appendChild(fiber.return.stateNode, fiber.stateNode);
    }
    
    const elements = fiber.pendingProps.children;
    let index = 0
    let prevSibling = null
    
    // 遍历子节点并创建对应的fiber
    while(elements && index < elements.length){
        const element = elements[index]
        
        // 创建子节点对应的fiber，通过类型判断是否是文本节点
        const type = typeof element === 'object' ? element.type : 'TEXT_ELEMENT';
        const props = type === 'TEXT_ELEMENT' ? { content: element } : element.props;
        const newFiber = new FiberNode(type, props, null);
        newFiber.return = fiber;
        newFiber.index = index;
        
        if(index === 0){
            // 将当前fiber与第一个子节点关联
            fiber.child = newFiber
        }else{
            // 不是第一个子节点将其与上一个兄弟fiber节点关联
            prevSibling.sibling = newFiber
        }
        
        // 每次循环结束都将当前fiber节点储存
        prevSibling = newFiber
        
        index++
    }
    
    if(fiber.child){
        // 如果当前fiber节点存在子节点就返回子节点作为下一个渲染的节点
        return fiber.child
    }
    
    while(fiber){
        if(fiber.sibling){
            // 如果没有子节点，但是存在兄弟节点返回兄弟节点作为下一个渲染的节点
            return fiber.sibling
        }
        // 如果既没子节点也没兄弟节点，将寻找父节点的兄弟节点
        fiber = fiber.return
    }
    return null;
}
