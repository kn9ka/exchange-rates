<script lang="ts">
	export let cardName: string = '';
	export let rates: Record<string, number>;
</script>

<div class="no-wrap card relative flex w-full max-w-36 flex-col items-center rounded-md p-4">
	<div class="mb-3 text-nowrap text-center">
		<span class="font-bold">{cardName.charAt(0).toUpperCase() + cardName.slice(1)}</span>
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
