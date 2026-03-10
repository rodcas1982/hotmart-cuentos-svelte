<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { updated } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();
	
	onMount(() => {
		updated.subscribe((isUpdated) => {
			if (isUpdated) {
				window.location.reload();
			}
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
