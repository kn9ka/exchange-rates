<script lang="ts">
	import { onMount } from 'svelte';
	import { ExchangeNames, Exchanges } from '../../routes/constants';

	export let serviceName: Exchanges;
	export let url: string = '';

	const translatedServiceName = ExchangeNames[serviceName];

	let rates = {};
	let isLoading = false;

	const fetchServiceRates = async () => {
		const response = await fetch(`/api/exchanges/${serviceName}/rates`);

		if (!response.ok) {
			// @TODO: do stuff
			console.error('something went wrong');
		}
		return await response.json();
	};

	onMount(async () => {
		try {
			isLoading = true;
			rates = await fetchServiceRates();
		} catch (e) {
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="no-wrap card relative flex w-full max-w-36 flex-col items-center rounded-md p-4">
	<div class="mb-3 text-nowrap text-center">
		<a href={url} target="_blank" rel="noopener" class="font-bold">{translatedServiceName}</a>
	</div>
	{#if Object.keys(rates).length > 0}
		<div class="">
			{#each Object.entries(rates) as [currencyName, rate]}
				<div class="flex justify-between gap-2 font-sans">
					<span class="font-medium">{currencyName}</span>
					<span>{rate}</span>
				</div>
			{/each}
		</div>
	{/if}
	{#if isLoading}
		<div class="absolute right-1 top-1 animate-spin">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 16 16"
				fill="currentColor"
				class="h-4 w-4"
			>
				<path
					fill-rule="evenodd"
					d="M13.836 2.477a.75.75 0 0 1 .75.75v3.182a.75.75 0 0 1-.75.75h-3.182a.75.75 0 0 1 0-1.5h1.37l-.84-.841a4.5 4.5 0 0 0-7.08.932.75.75 0 0 1-1.3-.75 6 6 0 0 1 9.44-1.242l.842.84V3.227a.75.75 0 0 1 .75-.75Zm-.911 7.5A.75.75 0 0 1 13.199 11a6 6 0 0 1-9.44 1.241l-.84-.84v1.371a.75.75 0 0 1-1.5 0V9.591a.75.75 0 0 1 .75-.75H5.35a.75.75 0 0 1 0 1.5H3.98l.841.841a4.5 4.5 0 0 0 7.08-.932.75.75 0 0 1 1.025-.273Z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	{/if}
</div>

<style lang="postcss">
	.card {
		background-image: radial-gradient(
			circle 311px at 8.6% 27.9%,
			rgba(62, 147, 252, 0.57) 12.9%,
			rgba(239, 183, 192, 0.44) 91.2%
		);
	}
</style>
