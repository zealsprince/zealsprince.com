<script lang="ts">
  import type { Snippet } from 'svelte'

  type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type ButtonType = 'button' | 'submit' | 'reset'

  interface Props {
    variant?: ButtonVariant
    size?: ButtonSize
    type?: ButtonType
    disabled?: boolean
    loading?: boolean
    fullWidth?: boolean
    href?: string | undefined
    target?: string | undefined
    rel?: string | undefined
    ariaLabel?: string | undefined
    className?: string
    children?: Snippet
    [key: string]: any
  }

  const {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    href = undefined,
    target = undefined,
    rel = undefined,
    ariaLabel = undefined,
    className = '',
    children,
    ...restProps
  }: Props = $props()

  const isLink = $derived(href !== undefined)

  const classes = $derived(
    [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      disabled && 'btn--disabled',
      loading && 'btn--loading',
      fullWidth && 'btn--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' '),
  )

  function handleClick(event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault()
    }
  }
</script>

{#if isLink}
  <!-- eslint-disable svelte/no-navigation-without-resolve -->
  <a
    {href}
    {target}
    {rel}
    class={classes}
    aria-label={ariaLabel}
    aria-disabled={disabled}
    onclick={handleClick}
    role="button"
    tabindex={disabled ? -1 : 0}
    {...restProps}
  >
    {#if loading}
      <span class="btn__spinner" aria-hidden="true"></span>
    {/if}
    <span class="btn__content" class:btn__content--hidden={loading}>
      {@render children?.()}
    </span>
  </a>
  <!-- eslint-enable svelte/no-navigation-without-resolve -->
{:else}
  <button
    {type}
    {disabled}
    class={classes}
    aria-label={ariaLabel}
    onclick={handleClick}
    {...restProps}
  >
    {#if loading}
      <span class="btn__spinner" aria-hidden="true"></span>
    {/if}
    <span class="btn__content" class:btn__content--hidden={loading}>
      {@render children?.()}
    </span>
  </button>
{/if}

<style lang="scss">
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    position: relative;
    font-family: var(--font-family);
    font-weight: var(--font-weight-normal);
    text-decoration: none;
    text-align: center;
    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    &--xs { padding: 0.25rem 0.5rem; font-size: var(--font-size-xs); min-height: 1.5rem; }
    &--sm { padding: 0.375rem 0.75rem; font-size: calc(var(--font-size-xs) * 1.2); min-height: 2rem; }
    &--md { padding: 0.5rem 1rem; font-size: var(--font-size-sm); min-height: 2.5rem; }
    &--lg { padding: 0.75rem 1.5rem; font-size: calc(var(--font-size-sm) * 1.125); min-height: 3rem; }
    &--xl { padding: 1rem 2rem; font-size: calc(var(--font-size-sm) * 1.25); min-height: 3.5rem; }

    &--primary {
      background-color: var(--color-primary);
      color: var(--color-background);
      border-color: var(--color-primary);
      &:hover:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-primary) 90%, white);
        border-color: color-mix(in srgb, var(--color-primary) 90%, white);
      }
      &:active:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-primary) 80%, black);
        border-color: color-mix(in srgb, var(--color-primary) 80%, black);
        transform: translateY(1px);
      }
    }
    &--secondary {
      background-color: var(--color-secondary);
      color: var(--color-background);
      border-color: var(--color-secondary);
      &:hover:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-secondary) 90%, white);
        border-color: color-mix(in srgb, var(--color-secondary) 90%, white);
      }
      &:active:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-secondary) 80%, black);
        border-color: color-mix(in srgb, var(--color-secondary) 80%, black);
        transform: translateY(1px);
      }
    }
    &--outline {
      background-color: transparent;
      color: var(--color-primary);
      border-color: var(--color-primary);
      &:hover:not(.btn--disabled):not(.btn--loading) {
        background-color: var(--color-primary);
        color: var(--color-background);
      }
      &:active:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-primary) 90%, black);
        border-color: color-mix(in srgb, var(--color-primary) 90%, black);
        transform: translateY(1px);
      }
    }
    &--ghost {
      background-color: transparent;
      color: var(--color-text);
      border-color: transparent;
      &:hover:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-secondary) 10%, transparent);
        color: var(--color-primary);
      }
      &:active:not(.btn--disabled):not(.btn--loading) {
        background-color: color-mix(in srgb, var(--color-secondary) 15%, transparent);
        transform: translateY(1px);
      }
    }
    &--link {
      background-color: transparent;
      color: var(--color-link);
      border-color: transparent;
      padding: 0;
      min-height: auto;
      border-radius: 0;
      &:hover:not(.btn--disabled):not(.btn--loading) {
        color: var(--color-text);
        text-decoration: underline;
      }
      &:active:not(.btn--disabled):not(.btn--loading) {
        color: color-mix(in srgb, var(--color-link) 80%, black);
      }
    }
    &--disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
    &--loading { cursor: wait; pointer-events: none; }
    &--full-width { width: 100%; }
  }

  .btn__content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 0.2s ease;
    &--hidden { opacity: 0; }
  }

  .btn__spinner {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .btn {
      &--lg { padding: 0.625rem 1.25rem; min-height: 2.75rem; }
      &--xl { padding: 0.75rem 1.5rem; min-height: 3rem; }
    }
  }
</style>
