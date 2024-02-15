export const Exchanges = {
	CBR: 'cbr',
	Corona: 'corona',
	Contact: 'contact'
} as const;

export type Exchanges = (typeof Exchanges)[keyof typeof Exchanges];

export const ExchangeNames = {
	[Exchanges.CBR]: 'ЦБ РФ',
	[Exchanges.Corona]: 'Золотая корона',
	[Exchanges.Contact]: 'CONTACT'
};
