/**
 * Fully persistent array data structure.
 */
class PersistentArray {
    /**
     * Creates an uninitialized persistent array of size n.
     * 
     * @param {Integer} n - The initial array size.
     */
    constructor(n) {
        this._length = n;
        this._currentNode = new Node(new Array(n));
    }

    /**
     * Create and return a persistent array from an array-like.
     * 
     * Mutation to the elements of the original array-like WILL affect the
     * persistent array.
     * 
     * @param {ArrayLike} arrayLike - Array-like object to be copied.
     * 
     * @return {PersistentArray} A persistent array with the same elements as
     * the given array-like object. 
     */
    static from(arrayLike) {
        const created = new PersistentArray;
        created._length = arrayLike.length;
        created._currentNode = new Node(Array.from(arrayLike));
        return created;
    }

    /**
     * Create and return a persistent array with the given elements.
     * 
     * @param  {...any} elements - Desired elements.
     */
    static of(...elements) {
        return this.from(elements);
    }

    /**
     * @return {Integer} The array length.
     */
    get length() {
        return this._length;
    }

    /**
     * Reroots the context tree and returns the cache for this array.
     * 
     * @returns {any[]} Cache for the array.
     */
    toArray() {
        this._currentNode = reroot(this._currentNode);
        return Object.assign([], this._currentNode.cache);
    }

    /**
     * Returns the element at the given index.
     * 
     * Mutation on the returned element WILL affect the persistent array. If
     * mutation is absolutely needed (hint: usually it's not), make sure you
     * clone the returned object beforehand and then update the array.
     * 
     * @param {Integer} index - Array index.
     * 
     * @throws {RangeError} Index must be positive and bounded by array size.
     * 
     * @return {any} The object stored at the given position.
     */
    at(index) {
        if (index < 0 || index >= this.length) {
            throw new RangeError(
                "Index must be positive and bounded by array size");
        } else {
            if (!this._currentNode.isRoot &&
                this._currentNode._index == index) {
                return this._currentNode.value;
            } else {
                this._currentNode = reroot(this._currentNode);
                return this._currentNode.cache[index];
            }
        }
    }

    /**
     * Returns a new version of the array updated with the given value at the
     * given index.
     * 
     * @param {Integer} index - Array index at which to update.
     * @param {any} value - The value to be put into the array.
     * 
     * @throws {RangeError} Index must be positive and bounded by array size.
     * 
     * @return {PersistentArray} A persistent array with the same elements as
     * the original, except that it has an updated value at the given index.
     */
    update(index, value) {
        if (index < 0 || index >= this.length) {
            throw new RangeError(
                "Index must be positive and bounded by array size");
        } else {
            const updated = new PersistentArray;
            updated._length = this.length;
            updated._currentNode = new Node(this._currentNode, index, value);
            return updated;
        }
    }

    /**
     * Returns a string representation of the array and its elements.
     * 
     * @return {String} The array as a string.
     */
    toString() {
        return this.toArray().toString();
    }
    
    /**
     * Returns a read-only iterator for the array.
     * 
     * This will perform a rerooting and create a copy of the cache, which will
     * then be used to create the iterator.
     * 
     * Changes to the objects referenced by the iterator WILL affect the
     * elements in the persistent array, and may cause unintended results.
     * 
     * @returns {Iterator<any>} the iterator for a copy of the cache array of
     * this version of the persistent array.
     */
    [Symbol.iterator]() {
        return this.toArray()[Symbol.iterator]();
    }
}

class Node {
    constructor(parent, index, value) {
        this._parent = parent;
        this._index = index;
        this._value = value;
    }

    get cache() {
        if (this.isRoot) {
            return this._parent;
        } else {
            return undefined;
        }
    }

    get parent() { return this._parent; }
    get index() { return this._index; }
    get value() { return this._value; }

    get isRoot() {
        return this.parent instanceof Array;
    }
}

function reroot(node) {
    if (node.isRoot)
        return node;
    else
        return rotate(node);
}

function swapRoot(parent, node) {
    const updateIndex = node.index;
    const cache = parent.parent;
    
    parent._index = updateIndex;
    parent._value = parent.cache[updateIndex];
    parent._parent = node;

    node._parent = cache;
    cache[updateIndex] = node.value;
}

function rotate(node) {
    const parent = node.parent;
    if (node.parent.isRoot) {
        swapRoot(parent, node);
        return node;
    } else {
        node.parent = rotate(parent);
        return rotate(node);
    }
}

module.exports = PersistentArray;
