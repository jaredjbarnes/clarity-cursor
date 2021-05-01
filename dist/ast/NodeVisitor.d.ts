import Node from "./Node";
export default class NodeVisitor {
    context: Node;
    selectedNodes: Node[];
    constructor(context: Node, selectedNodes?: Node[]);
    flatten(): this;
    remove(): this;
    private recursiveRemove;
    wrap(callback: (node: Node) => Node): this;
    unwrap(): this;
    prepend(callback: (node: Node) => Node): this;
    append(callback: (node: Node) => Node): this;
    transform(callback: (node: Node) => Node): this;
    private recursiveTransform;
    walkUp(node: Node, callback: (node: Node, ancestors: Node[]) => void, ancestors?: Node[]): this;
    walkDown(node: Node, callback: (node: Node, ancestors: Node[]) => void, ancestors?: Node[]): this;
    selectAll(): NodeVisitor;
    selectNode(node: Node): NodeVisitor;
    deselectNode(node: Node): NodeVisitor;
    select(callback: (node: Node) => boolean): NodeVisitor;
    forEach(callback: (node: Node) => void): this;
    filter(callback: (node: Node) => boolean): NodeVisitor;
    map(callback: (node: Node) => Node): NodeVisitor;
    selectRoot(): NodeVisitor;
    first(): NodeVisitor;
    last(): NodeVisitor;
    get(index: number): NodeVisitor;
    clear(): this;
    static select(context: Node, callback?: (node: Node) => boolean): NodeVisitor;
}
