# Persistent Array

![Build Status][build]
![Documentation][docs]

A persistent data structure is one that accepts updates while keeping
immutability, by preserving original data and only recording updates, usually
in the form of a directed graph.

This is an implementation of a persistent array data structure which optimizes
for fast updates and minimum space usage, keeping reads efficient when done
many at a time by using shallow binding.

[build]: https://github.com/GuiBrandt/PersistentArray/workflows/Build/badge.svg
[docs]: https://github.com/GuiBrandt/PersistentArray/workflows/Documentation/badge.svg

## Characteristics

- Read `i`: To perform a simple query for an element at a given index.
  Takes O(u) time, where u = number of updates. However, sequential reads to
  the same version or to child versions (i.e. O(1) updates apart) take constant
  time.

- Update `i`, `v`: To update the array by putting value `v` at index `i`
  without mutating it.
  Takes O(1) time and allocates O(1) space.

- **NOT thread-safe:** To allow for efficient reads, this implementation uses
  a context tree which is shared by all versions of the array and needs
  mutability in order to maintain coherence while maintining space usage to a
  minimum.

Ultimately, the primary advantage of this data structure against an ordinary
Array is that updates can preserve previous versions while still taking O(1)
time and space, when doing the same thing with an Array would take O(n) time
and space.

A semi-thread-safe implementation that does not require locks might be
possible, and will be worked on in the future. 
