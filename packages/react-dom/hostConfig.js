export const createElement = (type, props) => {
    const element = document.createElement(type);
    // TODO 处理props
    return element;
}

export const appendChild = (parent, child) => {
    parent.appendChild(child);
}

export const createTextNode = (content) => {
    return document.createTextNode(content);
}