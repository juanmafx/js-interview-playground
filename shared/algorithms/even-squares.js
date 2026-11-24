export function evenSquares(numbers) {
  if (!Array.isArray(numbers) || !numbers.every(Number.isFinite)) {
    throw new TypeError("numbers must be an array of finite numbers");
  }
  return numbers.filter((value) => value % 2 === 0).map((value) => value * value);
}
