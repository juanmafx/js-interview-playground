import { assertFiniteNumbers } from "./assert-finite-numbers.js";

export function twoSum(numbers, target) {
  assertFiniteNumbers(numbers);
  if (!Number.isFinite(target)) {
    throw new TypeError("target must be a finite number");
  }

  const seenIndexes = new Map();

  for (let index = 0; index < numbers.length; index += 1) {
    const complement = target - numbers[index];
    if (seenIndexes.has(complement)) {
      return [seenIndexes.get(complement), index];
    }
    seenIndexes.set(numbers[index], index);
  }

  return [];
}
