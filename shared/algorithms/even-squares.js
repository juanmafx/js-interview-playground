import { assertFiniteNumbers } from "./assert-finite-numbers.js";

export function evenSquares(numbers) {
  assertFiniteNumbers(numbers);
  return numbers.filter((value) => value % 2 === 0).map((value) => value * value);
}
