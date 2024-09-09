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

export const commitUpdate = (fiber) => {
	switch (fiber.tag) {
		case HostText:
			const text = fiber.memoizedProps?.content;
			commitTextUpdate(fiber.stateNode, text);
			break;
		default:
			console.warn('为实现的update类型', fiber);
			break;
	}
};

export const commitTextUpdate = (
	textInstance,
	content
) => {
	textInstance.textContent = content;
};