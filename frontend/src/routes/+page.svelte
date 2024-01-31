<script lang="ts">
	import type { PageData } from './$types';
	import ExchangeCard from '../components/ExchangeCard/ExchangeCard.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Exchange rates</title>
	<meta name="description" content="Exchange rates" />
</svelte:head>

<section class="flex h-full flex-1 flex-col justify-center">
	<div class="flex h-full flex-wrap place-content-center gap-4">
		{#each Object.entries(data) as [name, rates]}
			<ExchangeCard cardName={name} {rates} />
		{/each}
	</div>
</section>
