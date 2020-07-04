const PersistentArray = require("../persistentArray");

describe("A new persistent array of size n", () => {
    const n = 5;
    let array = new PersistentArray(n);

    it("has size n", () => {
        expect(array.length).toBe(n);
    });

    it("is uninitialized", () => {
        for (let element of array) {
            expect(element).toBeUndefined();
        }
    });
});

describe("Reading from the array", () => {
    let array = PersistentArray.of(1, 2, 3, 4);
    let oldCache = array.cache;

    it("returns the element at the given index", () => {
        expect(array.at(0)).toBe(1);
        expect(array.at(1)).toBe(2);
        expect(array.at(2)).toBe(3);
        expect(array.at(3)).toBe(4);
    });
    
    it("does not mutate the array", () => {
        array.at(0);
        array.at(1);
        array.at(2);
        array.at(3);
        expect(array.cache).toEqual(oldCache);
    });
});

describe("Updating the array once", () => {
    let original = PersistentArray.of(1, 2, 3, 4);
    let updated = original.update(1, 5);

    it("updates the value at the given index", () => {
        expect(updated.at(1)).toBe(5);
    });

    it("does not affect other values", () => {
        expect(updated.at(0)).toBe(1);
        expect(updated.at(2)).toBe(3);
        expect(updated.at(3)).toBe(4);
    });

    it("does not affect the original", () => {
        expect(original.at(0)).toBe(1);
        expect(original.at(1)).toBe(2);
        expect(original.at(2)).toBe(3);
        expect(original.at(3)).toBe(4);
    });
});

describe("Updating the array sequentially", () => {
    let original = PersistentArray.of(1, 2, 3, 4);
    let updatedTwice = original.update(1, 5).update(2, 6);

    it("updates the value at the given index", () => {
        expect(updatedTwice.at(2)).toBe(6);
    });

    it("keeps updates from the previous version", () => {
        expect(updatedTwice.at(1)).toBe(5);
    });

    it("does not affect other values", () => {
        expect(updatedTwice.at(0)).toBe(1);
        expect(updatedTwice.at(3)).toBe(4);
    });

    it("does not affect the original", () => {
        expect(original.at(0)).toBe(1);
        expect(original.at(1)).toBe(2);
        expect(original.at(2)).toBe(3);
        expect(original.at(3)).toBe(4);
    });
});

describe("Updating the array in different ways", () => {
    let original = PersistentArray.of(1, 2, 3, 4);
    let updatedA = original.update(1, 5).update(2, 6);
    let updatedB = original.update(1, 7).update(3, 8);

    it("updates the value at the given indexes", () => {
        expect(updatedA.at(1)).toBe(5);
        expect(updatedA.at(2)).toBe(6);

        expect(updatedB.at(1)).toBe(7);
        expect(updatedB.at(3)).toBe(8);
    });

    it("does not affect other values", () => {
        expect(updatedA.at(0)).toBe(1);
        expect(updatedA.at(3)).toBe(4);

        expect(updatedB.at(0)).toBe(1);
        expect(updatedB.at(2)).toBe(3);
    });

    it("does not affect the original", () => {
        expect(original.at(0)).toBe(1);
        expect(original.at(1)).toBe(2);
        expect(original.at(2)).toBe(3);
        expect(original.at(3)).toBe(4);
    });
});

describe("Reading from an invalid index", () => {
    let array = PersistentArray.of(1, 2, 3, 4);
    const rangeError = new RangeError("Index must be positive and bounded by array size");

    it("throws when index < 0", () => {
        expect(() => array.at(-1)).toThrow(rangeError);
    });

    it("throws when index = length", () => {
        expect(() => array.at(array.length)).toThrow(rangeError);
    });

    it("throws when index > length", () => {
        expect(() => array.at(array.length + 1)).toThrow(rangeError);
    });
});

describe("Updating at an invalid index", () => {
    let array = PersistentArray.of(1, 2, 3, 4);
    const rangeError = new RangeError("Index must be positive and bounded by array size");

    it("throws when index < 0", () => {
        expect(() => array.update(-1, 0)).toThrow(rangeError);
    });

    it("throws when index = length", () => {
        expect(() => array.update(array.length, 0)).toThrow(rangeError);
    });

    it("throws when index > length", () => {
        expect(() => array.update(array.length + 1, 0)).toThrow(rangeError);
    });
});
