// rng.js — repeatable random numbers

export function createRng(seed) {
  let number = seed >>> 0;

  return function rng() {
    number = (number + 0x6d2b79f5) | 0;

    let value = Math.imul(number ^ (number >>> 15), 1 | number);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate the number of arrivals
export function poisson(rng, lambda) {
  if (lambda <= 0) return 0;

  if (lambda > 20) {
    const average = lambda;
    const variation = Math.sqrt(lambda);
    const random = (rng() + rng() + rng() - 1.5) * 2;

    return Math.max(0, Math.round(average + variation * random));
  }

  const limit = Math.exp(-lambda);
  let count = 0;
  let probability = 1;

  do {
    count++;
    probability *= rng();
  } while (probability > limit);

  return count - 1;
}
