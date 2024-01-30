<script>
	import Header from '../components/Header/Header.svelte';
	import './styles.css';
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<main class="mx-auto my-0 box-border flex w-full flex-1 flex-col p-1">
		<slot />
	</main>
</div>

<style lang="postcss">
	:global(:root) {
		font-family: theme(fontFamily.sans);
		color: theme(colors.neutral.200);
	}

	:global(body) {
		min-height: 100%;
		margin: 0;
	}

	:global(html) {
		height: 100%;
		background-color: theme(colors.slate.900);
	}
</style>
