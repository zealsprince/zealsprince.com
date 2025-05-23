export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function noise(x: number, y: number, z: number = 0): number {
  return Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453 % 1;
}

export function map(value: number, min1: number, max1: number, min2: number, max2: number): number {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
