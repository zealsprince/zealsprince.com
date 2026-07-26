<script lang="ts">
  import type { PageData } from '$types/Content'
  import Main from '$/components/Main.svelte'
  import { browser } from '$app/environment'
  import { page } from '$app/state'

  const { data }: { data: PageData } = $props()

  const editor = browser
    ? page.url.searchParams.get('editor') === 'true'
    : false
</script>

<Main {data} {editor} />
