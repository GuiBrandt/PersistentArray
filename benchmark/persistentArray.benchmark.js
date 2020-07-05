const PersistentArray = require('../persistentArray');
const Benchmark = require('benchmark');

let testPersistentArray = new PersistentArray(1000);
let testArray = new Array(1000);

function randomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * max);
}

new Benchmark.Suite()
.add("PersistentArray#update", () => {
    testPersistentArray.update(2, 5);
})
.add("Object.assign([]) + Array#[]=", () => {
    let copy = Object.assign([], testArray);
    copy[randomInt(1000)] = 5;
})
.add("Array.from + Array#[]=", () => {
    let copy = Array.from(testArray);
    copy[randomInt(1000)] = 5;
})
.add("Spread copy + Array#[]=", () => {
    let copy = [...testArray];
    copy[randomInt(1000)] = 5;
})
.on('start', () => {
    console.log("---- IMMUTABLE UPDATE ----")
})
.on('cycle', event => {
    console.log(String(event.target));
})
.on('complete', () => console.log())
.run();

new Benchmark.Suite()
.add("PersistentArray#at", () => {
    testPersistentArray.at(randomInt(1000));
})
.add("Array#[]", () => {
    testArray[randomInt(1000)];
})
.on('start', () => {
    console.log("---- READ ----")
})
.on('cycle', event => {
    console.log(String(event.target));
})
.run();
