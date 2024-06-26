export class FiberNode {
    type;
    pendingProps;
    key;
    stateNode;
    
    child;
    return;
    sibling;
    index;

    constructor(type, props, key) {
        this.type = type;
        this.pendingProps = props;
        this.key = key;
        this.stateNode = null;
        
        this.child = null;
        this.return = null;
        this.sibling = null;
        this.index = 0;
    }
}