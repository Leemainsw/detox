import { animals, fruits, verbs } from "./words";

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateNickname() {
  return `${pickRandom(fruits)}${pickRandom(verbs)}${pickRandom(animals)}`;
}
