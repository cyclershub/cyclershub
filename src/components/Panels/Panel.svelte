<script>
  import { getContext } from 'svelte';
  import { PANELS } from './Panels.svelte';

  const panel = {};
  const { registerPanel, selectedPanel } = getContext(PANELS);

  registerPanel(panel);
</script>

{#if $selectedPanel === panel}
  <slot></slot>
{/if}
