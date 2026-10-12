import { randomInteger } from "@/lib/random";

const arrayLength = 8;
const smallestValue = 1;
const largestValue = 99;

export function createRandomArray(): number[] {
  return Array.from({ length: arrayLength }, () =>
    randomInteger(smallestValue, largestValue),
  );
}
