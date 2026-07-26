<script lang="ts">
  interface Props {
    color?: string
    size?: number
    title?: string
    [key: string]: any
  }

  const { color = 'currentColor', size = 24, title = 'LinkedIn', ...rest }: Props = $props()
</script>

<!--
  Local rather than from a package. simple-icons dropped LinkedIn over
  trademark, and lucide has carried no brand marks since v1, so the link was
  falling back to a generic chain icon and reading as "some website" next to a
  row of recognisable logos.

  Props match the simple-icons components it sits beside, so Links.svelte can
  treat it exactly like the rest of the icon map.
-->
<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  fill={color}
  viewBox="0 0 24 24"
  {...rest}
>
  <title>{title}</title>
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
</svg>
