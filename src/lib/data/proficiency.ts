/**
 * A five step emphasis ramp shared by every proficiency readout.
 *
 * The vocabularies are not shared, deliberately. Language proficiency and
 * technical proficiency are different scales and reading "Exceptional French"
 * would be odd. What they do share is the ramp: five tiers, one bar width and
 * one colour each. Each domain maps its own level names onto a tier.
 */
export type Tier = 1 | 2 | 3 | 4 | 5

export interface Level {
  /** Shown next to the bar. */
  label: string
  tier: Tier
}

/** Bar fill per tier. */
export const TIER_WIDTH: Record<Tier, string> = {
  5: '100%',
  4: '85%',
  3: '70%',
  2: '55%',
  1: '40%',
}

/**
 * Tier colour. Resolves to the `--level-*` custom properties in app.scss, which
 * are mixed from the page palette rather than fixed hexes, so the ramp follows
 * the theme and every page style. The previous blue/green/amber/red set ignored
 * both, and read like a severity scale rather than a proficiency one.
 */
export function tierColor(tier: Tier): string {
  return `var(--level-${tier})`
}
