export function assertFiniteNumbers(numbers) {
  if (!Array.isArray(numbers) || !Array.from(numbers).every(Number.isFinite)) {
    throw new TypeError("numbers must be an array of finite numbers");
  }
}
