<script>
	import Footer from '../components/Footer/Footer.svelte';
	import Header from '../components/Header/Header.svelte';
	import './styles.css';
</script>

<div class="flex min-h-screen flex-col">
	<Header />

	<main class="mx-auto my-0 box-border flex w-full flex-1 flex-col p-1">
		<slot />
	</main>
	<Footer />
</div>

<style lang="postcss">
	:global(:root) {
		font-family: theme(fontFamily.sans);
		color: theme(colors.neutral.200);
	}

	:global(body) {
		min-height: 100%;
		margin: 0;
		height: 100vh;
		overflow: hidden;
		background: #005c97;
		background: -webkit-linear-gradient(to bottom, #363795, #005c97);
		background: linear-gradient(to bottom, #363795, #005c97);
	}

	:global(html) {
		height: 100%;
	}
</style>
