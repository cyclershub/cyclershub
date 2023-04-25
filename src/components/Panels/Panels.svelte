<script context="module">
  export const PANELS = {};
</script>

<script>
  import { setContext, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  const panels = [];
  const selectedPanel = writable(null);

  setContext(PANELS, {
    registerPanel: panel => {
      panels.push(panel);
      selectedPanel.update(current => current || panel);

      onDestroy(() => {
        const i = panels.indexOf(panel);
        panels.splice(i, 1);
        selectedPanel.update(current => current === panel ? (panels[i] || panels[panels.length - 1]) : current);
      });
    },

    setSelectedPanel: index => {
      selectedPanel.set(panels[index]);
    },

    selectedPanel
  });

	export let activePanel

	$: {
		if (activePanel <= panels.length - 1) {
			selectedPanel.set(panels[activePanel])
		}
	}
</script>

<div class="panels">
  <slot></slot>
</div>