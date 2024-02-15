<script lang="ts">
	import ExchangeCard from '../components/ExchangeCard/ExchangeCard.svelte';
	import { onMount } from 'svelte';
	import type { ExchangesResponse } from './types';
	import { Exchanges } from './constants';

	let services: ExchangesResponse;

	const fetchServiceNames = async (): Promise<ExchangesResponse> => {
		const response = await fetch(`/api/exchanges`);
		if (!response.ok) {
			// @TODO: do stuff
			console.error('something went wrong');
		}
		return await response.json();
	};

	const checkServiceName = (serviceName: string): serviceName is Exchanges => {
		return Object.values(Exchanges).includes(serviceName as Exchanges);
	};
	onMount(async () => {
		services = await fetchServiceNames();
	});
</script>

<svelte:head>
	<title>Exchange rates</title>
	<meta name="description" content="Exchange rates for Zolotaya Korona and Contact" />
</svelte:head>

<section class="flex h-full flex-1 flex-col justify-center gap-4">
	<div class="flex h-full flex-wrap place-content-center gap-4">
		{#each Object.entries(services || {}) as [serviceName, values]}
			{#if checkServiceName(serviceName)}
				<ExchangeCard {serviceName} url={values.url} />
			{/if}
		{/each}
	</div>
</section>
