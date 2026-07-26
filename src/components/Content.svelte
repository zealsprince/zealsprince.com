<script lang="ts">
  import type { ContentDirective } from '$types/Content'
  import technologies from '$/components/Embeds/Technologies.svelte'

  import languages from '$components/Embeds/Languages.svelte'
  import spinner from '$components/Spinner.svelte'
  import { mount, onMount } from 'svelte'

  interface Props {
    html: string
    components?: ContentDirective[]
  }

  const { html, components = [] }: Props = $props()

  let container: HTMLDivElement | undefined = $state()
  const loadedComponents: Record<string, any> = {}

  // Component registry - you can extend this
  const componentMap = {
    spinner: () => spinner,
    languages: () => languages,
    technologies: () => technologies,
    // Add more components as needed
  }

  async function loadComponent(name: string) {
    if (loadedComponents[name])
      return loadedComponents[name]

    try {
      const module = await componentMap[name as keyof typeof componentMap]?.()
      if (module) {
        loadedComponents[name] = module
        return module
      }
    }
    catch (e) {
      console.warn(`Failed to load component: ${name}`, e)
    }
    return null
  }

  async function renderComponents() {
    if (!container || !components.length)
      return

    for (const component of components) {
      const placeholder = container.querySelector(
        `[data-component-id="${component.id}"]`,
      )
      if (!placeholder)
        continue

      const ComponentClass = await loadComponent(component.name)
      if (!ComponentClass)
        continue

      try {
        // Create a wrapper div for the component
        const wrapper = document.createElement('div')
        wrapper.className = 'dynamic-component'

        // Create the Svelte component instance using Svelte 5 mount API
        mount(ComponentClass, {
          target: wrapper,
          props: component.props,
        })

        // Replace the placeholder with the component
        placeholder.replaceWith(wrapper)
      }
      catch (e) {
        console.error(`Failed to render component ${component.name}:`, e)
        placeholder.innerHTML = `<div class="component-error">Failed to load component: ${component.name}</div>`
      }
    }
  }

  onMount(() => {
    renderComponents()
  })

  // Re-render when components change
  $effect(() => {
    if (container && components)
      renderComponents()
  })
</script>

<div bind:this={container} class="dynamic-content">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html html}
</div>

<style>
  /* Now that the markdown server-renders, these ship in the HTML and get
     swapped out on mount. Reserve the space but stay invisible, so the page
     does not flash a row of empty dashed boxes before hydration. */
  .dynamic-content :global(.component-placeholder) {
    min-height: 2rem;
    margin: 1rem 0;
  }

  .dynamic-content :global(.component-error) {
    color: #ff6b6b;
    text-align: center;
    padding: 1rem;
    border: 1px solid #ff6b6b;
    border-radius: 0.5rem;
    background: rgba(255, 107, 107, 0.1);
  }

  .dynamic-content :global(.dynamic-component) {
    margin: 1rem 0;
  }
</style>
