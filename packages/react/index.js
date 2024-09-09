import { resolveDispatcher } from "./currentDispatcher";

function ReactElement(type, key, ref, props) {
    return {
        type,
		key,
		ref,
		props,
    }
}

function jsx(type, config, ...children) {
    let key = null;
    let ref = null;
    const props = {};

    for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}

    if (children.length > 0) {
        props.children = children.length === 1 ? children[0] : children;
    }

    return ReactElement(type, key, ref, props);
}

export const useState = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
}

export default {
    jsx
}