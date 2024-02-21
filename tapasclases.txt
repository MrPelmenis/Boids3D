let env = {
    repulsionForce: 15,
    attractionForce: 0.03
}

class Vector {
    public constructor() {
        this.x = 0;
        this.y = 0;
    }

    public x: number;
    public y: number;

    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public set length(value: number) {
        let l = this.length;
        if (l != 0) {
            l = value / l;
            this.x = this.x * l;
            this.y = this.y * l;
        }
    }
}

class GraphNode<T>{

    constructor(parentGraph: Graph<T>, x: number, y: number, data?: T) {
        this.data = data;
        this._x = x;
        this._y = y;
        this._parent = parentGraph;
        parentGraph.addNode(this);

        this._id = String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random()) + String(Math.random());
        this._edges = [];
    }

    public isEqualTo(other: GraphNode<T>) {
        return this._id == other._id;
    }

    public connectTo(other: GraphNode<T>) {
        let n = new GraphEdge<T>(this, other);
        if (!(this._edges.find((e) => e.isEqualTo(n)))) {
            this._edges.push(n);
            other._edges.push(n);
        }
    }

    public getRepulsionForceVector(): Vector {
        let res = new Vector();
        this._parent.nodes.forEach((n) => {
            if (!n.isEqualTo(this)) {
                let v = new Vector();
                v.x = -(n.x - this.x);
                v.y = -(n.y - this.y);
                v.length = 1 / v.length;
                v.length = v.length * env.repulsionForce;
                res.x = res.x + v.x;
                res.y = res.y + v.y;
            }
        });

        return res;
    }

    public getAttractionForceVector(): Vector {
        let res = new Vector();
        this._edges.forEach((e) => {
            let otherNode = (e.nodes[0].isEqualTo(this) ? e.nodes[1] : e.nodes[0]);
            let v = new Vector();
            v.x = otherNode.x - this.x;
            v.y = otherNode.y - this.y;
            v.length = v.length * env.attractionForce;
            res.x = res.x + v.x;
            res.y = res.y + v.y;
        });

        return res;
    }

    private _parent: Graph<T>;

    private _edges: Array<GraphEdge<T>>;
    public get edges(): Array<GraphEdge<T>> {
        return [...this._edges];
    }

    private _id: string;

    private _data: T;
    public set data(value: T) {
        this._data = value;
    }
    public get data(): T {
        return this._data;
    }


    private _x: number;
    public set x(value: number) {
        this._x = value;
    }
    public get x(): number {
        return this._x;
    }


    private _y: number;
    public set y(value: number) {
        this._y = value;
    }
    public get y(): number {
        return this._y;
    }
}

class GraphEdge<T>{
    constructor(a: GraphNode<T>, b: GraphNode<T>) {
        this._nodes = [a, b];
    }

    public isEqualTo(other: GraphEdge<T>) {
        return (this._nodes[0].isEqualTo(other._nodes[0]) && this._nodes[1].isEqualTo(other._nodes[1]))
            ||
            (this._nodes[0].isEqualTo(other._nodes[1]) && this._nodes[1].isEqualTo(other._nodes[0]));
    }

    private _nodes: Array<GraphNode<T>>;
    public get nodes(): Array<GraphNode<T>> {
        return [...this._nodes];
    }
}



class Graph<T> {

    constructor() {
        this.nodes = [];
    }

    public addNode(n: GraphNode<T>): void {
        if (!(this.nodes.find((nx) => nx.isEqualTo(n))))
            this.nodes.push(n);
    }

    public nodes: Array<GraphNode<T>>;
}