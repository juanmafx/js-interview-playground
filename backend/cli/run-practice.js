import { twoSum } from "../../shared/algorithms/two-sum.js";

export function runPractice(log = console.log) {
  const numbers = [2, 7, 11, 15];
  const target = 9;
  const indexes = twoSum(numbers, target);

  log("Node Interview Practice:");
  log("Input:", numbers, "Target:", target);
  log("Two Sum Indexes:", indexes);
  return indexes;
}
