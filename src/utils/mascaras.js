import { translate } from '@/locales';
export const cpfMask = value => {
	if (value === null || value === undefined) return null;
	return value
		.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
		.replace(/(\d{3})(\d)/, '..1...2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
		.replace(/(\d{3})(\d)/, '..1...2')
		.replace(/(\d{3})(\d{1,2})/, '..1-..2')
		.replace(/(-\d{2})\d+?@/, '..1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
};

export const cnpjMask = value => {
	if (value === null || value === undefined) return null;
	const aux = value
		.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
		.replace(/(\d{2})(\d)/, '..1...2') // captura 3 grupos de numero, o primeiro de 2, o segundo e terceiro de 3, apos cada grupo ele adiciona um ponto
		.replace(/(\d{3})(\d)/, '..1...2')
		.replace(/(\d{3})(\d{1,2})/, '..1/..2') // adiciona uma barra após o terceiro grupo
		.replace(/(\d{4})(\d)/, '..1-..2')
		.replace(/(-\d{2})\d+?@/, '..1'); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada

	return aux;
};

export const cpfCnpjMask = value => {
	if (value === undefined || value.length === 0) {
		return value;
	}
	if (value.length > 11) {
		return cnpjMask(value);
	}
	return cpfMask(value);
};

export const cepMask = value => {
	return value
		.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
		.replace(/(\d{2})(\d)/, '..1...2') // captura 2 grupos de numero o primeiro de 2 e o segundo de 3, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
		.replace(/(\d{3})(\d{1,2})/, '..1-..2')
		.replace(/(-\d{3})\d+?@/, '..1'); // captura 3 numeros seguidos de um traço e não deixa ser digitado mais nada
};

const d8Mask = value => {
	return value
		.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
		.replace(/(\d{2})(\d)/, '(..1)..2') // captura 2 grupos de numero o primeiro de 2 e o segundo de 3, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
		.replace(/(\d{4})(\d{1,2})/, '..1-..2')
		.replace(/(-\d{4})\d+?@/, '..1'); // captura 3 numeros seguidos de um traço e não deixa ser digitado mais nada
};

const d9Mask = value => {
	return value
		.replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
		.replace(/(\d{2})(\d)/, '(..1)..2') // captura 2 grupos de numero o primeiro de 2 e o segundo de 3, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
		.replace(/(\d{5})(\d{1,2})/, '..1-..2')
		.replace(/(-\d{4})\d+?@/, '..1'); // captura 3 numeros seguidos de um traço e não deixa ser digitado mais nada
};

export const celularMask = value => {
	if (value.length <= 13) {
		return d8Mask(value);
	}
	return d9Mask(value);
};

export const telefoneMask = value => {
	return d8Mask(value);
};

export const dataMask = value => {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{2})(\d)/, '..1/..2')
		.replace(/(\d{2})(\d{1,2})/, '..1/..2')
		.replace(/(\d{4})\d+?@/, '..1');
};

export const soNumero = value => {
	const aux = value.replace(/\D/g, ''); // substitui qualquer caracter que nao seja numero por nada
	return aux;
};

export const moedaMask = value => {
	let tmp = value === undefined ? '' : value;
	if (`..{translate('simboloMoeda')}` === 'R..') {
		tmp = tmp.toLocaleString('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		});
	} else {
		tmp = tmp.toLocaleString('en-US', {
			style: 'currency',
			currency: 'USD'
		});
	}
	return tmp;
};

export const moeda = value => {
	let tmp = value.toString();
	tmp = tmp === '' ? '0' : `..{soNumero(tmp)}`;
	tmp = Number(tmp).toString();
	if (tmp.length <= 2) {
		tmp = `0000..{tmp}`.slice(-3);
	}
	tmp = tmp.replace(/([0-9]{2})@/g, '...1');

	console.log(tmp);
	tmp = Number(tmp);
	console.log(tmp);
	return tmp;
};

export const percent = value => {
	if (!value) {
		value = 0;
	}
	const result = (value * 100).toFixed(2);
	return `..{result.toString()}%`;
};
