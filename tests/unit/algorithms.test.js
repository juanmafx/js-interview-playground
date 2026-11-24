import assert from "node:assert/strict";
import { test } from "node:test";
import { evenSquares, twoSum, withRole } from "../../shared/index.js";

test("twoSum returns the indexes of the first matching pair", () => {
  assert.deepEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
});

test("twoSum handles duplicates without reusing one element", () => {
  assert.deepEqual(twoSum([3, 3], 6), [0, 1]);
  assert.deepEqual(twoSum([3, 4], 6), []);
});

test("twoSum handles negative numbers and zero", () => {
  assert.deepEqual(twoSum([-3, 4, 3, 90], 0), [0, 2]);
  assert.deepEqual(twoSum([0, 1, 0], 0), [0, 2]);
});

test("twoSum returns an empty array when no pair exists", () => {
  assert.deepEqual(twoSum([], 1), []);
  assert.deepEqual(twoSum([1], 2), []);
});

test("twoSum does not mutate its input", () => {
  const numbers = Object.freeze([2, 7]);
  assert.deepEqual(twoSum(numbers, 9), [0, 1]);
});

test("twoSum rejects invalid input", () => {
  assert.throws(() => twoSum("12", 3), TypeError);
  assert.throws(() => twoSum([1, "2"], 3), TypeError);
  assert.throws(() => twoSum([1, Number.NaN], 3), TypeError);
  assert.throws(() => twoSum([1, 2], Number.POSITIVE_INFINITY), TypeError);
});

test("evenSquares squares only even values in order", () => {
  assert.deepEqual(evenSquares([1, 2, 3, 4, 5, 6]), [4, 16, 36]);
  assert.deepEqual(evenSquares([-2, 0, 1]), [4, 0]);
  assert.deepEqual(evenSquares([]), []);
});

test("evenSquares rejects invalid input", () => {
  assert.throws(() => evenSquares(null), TypeError);
  assert.throws(() => evenSquares([2, "4"]), TypeError);
});

test("withRole returns a copy and leaves the original intact", () => {
  const person = Object.freeze({ name: "Sam", role: "Frontend Engineer" });
  const updated = withRole(person, "JavaScript Candidate");
  assert.notEqual(updated, person);
  assert.deepEqual(updated, { name: "Sam", role: "JavaScript Candidate" });
  assert.equal(person.role, "Frontend Engineer");
});
