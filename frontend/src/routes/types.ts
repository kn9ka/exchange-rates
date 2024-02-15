import type { Exchanges } from './constants';

export type ExchangesResponse = Record<Exchanges, { url: string }>;
