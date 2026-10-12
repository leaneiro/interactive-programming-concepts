export function randomInteger(minimum: number, maximum: number): number {
  return minimum + Math.floor(Math.random() * (maximum - minimum + 1));
}

export function pickRandom<Item>(items: readonly Item[]): Item {
  return items[randomInteger(0, items.length - 1)];
}

export function randomUniqueIntegers(
  count: number,
  minimum: number,
  maximum: number,
): number[] {
  const availableCount = maximum - minimum + 1;
  const uniqueIntegers = new Set<number>();

  while (uniqueIntegers.size < Math.min(count, availableCount)) {
    uniqueIntegers.add(randomInteger(minimum, maximum));
  }

  return [...uniqueIntegers];
}
