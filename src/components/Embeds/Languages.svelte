<script lang="ts">
  import type { Language } from '$/lib/data/languages'
  import { LANGUAGE_LEVELS, LANGUAGES } from '$/lib/data/languages'
  import { TIER_WIDTH, tierColor } from '$/lib/data/proficiency'

  interface Props {
    languages?: Language[]
  }

  const { languages = LANGUAGES }: Props = $props()
</script>

<div class="languages-container">
  <div class="languages-grid">
    {#each languages as language (language.name)}
      {@const level = LANGUAGE_LEVELS[language.level]}
      <div class="language-item">
        <div class="language-header">
          {#if language.flag}
            <span class="language-flag">{language.flag}</span>
          {/if}
          <span class="language-name">{language.name}</span>
          <span class="language-level" style="color: {tierColor(level.tier)}">
            {level.label}
          </span>
        </div>
        <div class="language-bar">
          <div
            class="language-progress"
            style="width: {TIER_WIDTH[level.tier]}; background-color: {tierColor(level.tier)}"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .languages-container {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid var(--color-secondary);
    border-radius: var(--border-radius);
    background: color-mix(
      in srgb,
      var(--color-background) 95%,
      var(--color-secondary)
    );
  }

  .languages-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .language-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .language-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: var(--font-size-sm);
  }

  .language-flag {
    font-size: 1.2em;
    line-height: 1;
  }

  .language-name {
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    flex: 1;
  }

  .language-level {
    font-size: 0.875rem;
    font-weight: var(--font-weight-normal);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .language-bar {
    height: 4px;
    background-color: color-mix(
      in srgb,
      var(--color-secondary) 30%,
      transparent
    );
    border-radius: 2px;
    overflow: hidden;
  }

  .language-progress {
    height: 100%;
    border-radius: 2px;
    transition: width 0.6s ease-out;
  }

  /* Responsive design */
  @media (min-width: 600px) {
    .languages-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  @media (min-width: 900px) {
    .languages-container {
      margin: 2.5rem 0;
      padding: 2rem;
    }

    .languages-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
