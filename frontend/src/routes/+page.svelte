<script>
	import ExchangeCard from '../components/ExchangeCard/ExchangeCard.svelte';
</script>

<svelte:head>
	<title>Exchange rates</title>
	<meta name="description" content="Exchange rates" />
</svelte:head>

<section class="flex h-full flex-1 flex-col justify-center">
	<div class="flex h-full flex-row flex-wrap items-center justify-center gap-4">
		<ExchangeCard cardName="Contact" />
		<ExchangeCard cardName="Contact" />
	</div>
</section>
