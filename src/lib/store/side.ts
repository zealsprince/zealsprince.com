import { writable } from 'svelte/store'

// 'A' = professional, 'B' = avant garde
export const side = writable<'A' | 'B'>('A')
