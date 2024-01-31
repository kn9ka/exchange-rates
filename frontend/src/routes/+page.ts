// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

type ExchangeRate = Record<string, number>;
type RatesResponse = Record<string, ExchangeRate>;

export const load = async (): Promise<RatesResponse> => {
	const response = await fetch('http://localhost:3000/exchanges/rates');
	if (!response.ok) {
		// @TODO: do stuff
		console.error('something went wrong');
	}
	return await response.json();
};
