<script lang="ts">
	type ExchangeRate = Record<string, number>;
	type RatesResponse = Record<string, ExchangeRate>;
	import ExchangeCard from '../components/ExchangeCard/ExchangeCard.svelte';
	import { onMount } from 'svelte';
	import { ratesStore } from './store';

	let rates: RatesResponse = {};
	ratesStore.subscribe((items) => (rates = items));

	console.log(process.env.NODE_ENV);

	const load = async (): Promise<RatesResponse> => {
		const response = await fetch(`api/exchanges/rates`);
		if (!response.ok) {
			// @TODO: do stuff
			console.error('something went wrong');
		}
		return await response.json();
	};

	onMount(async () => {
		ratesStore.set(await load());
	});
</script>

<svelte:head>
	<title>Exchange rates</title>
	<meta name="description" content="Exchange rates" />
</svelte:head>

<section class="flex h-full flex-1 flex-col justify-center">
	<div class="flex h-full flex-wrap place-content-center gap-4">
		{#each Object.entries(rates) as [name, exchangeRates]}
			<ExchangeCard cardName={name} rates={exchangeRates} />
		{/each}
	</div>
</section>
