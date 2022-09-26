const STRICT_STRIP_REGEX = /[-/.]/g;
const LOOSE_STRIP_REGEX = /[^\d]/g;
const BLACKLIST = [
	'00000000000000',
	'11111111111111',
	'22222222222222',
	'33333333333333',
	'44444444444444',
	'55555555555555',
	'66666666666666',
	'77777777777777',
	'88888888888888',
	'99999999999999'
];

export const temQuatorze = number => {
	const stripped = strip(number);
	if (stripped.length === 14) {
		return true;
	}
	return false;
};

export const cnpjIsValid = number => {
	const stripped = strip(number);

	// CNPJ can't be blacklisted
	if (BLACKLIST.indexOf(stripped) >= 0) {
		return false;
	}

	let numbers = stripped.substr(0, 12);
	numbers += verifierDigitCnpj(numbers);
	numbers += verifierDigitCnpj(numbers);

	return numbers.substr(-2) === stripped.substr(-2);
};

export const strip = (number, strict) => {
	const regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
	return (number || '').toString().replace(regex, '');
};

export const verifierDigitCnpj = numbers => {
	let index = 2;
	const reverse = numbers.split('').reduce((buffer, number) => {
		return [
			parseInt(number, 10)
		].concat(buffer);
	}, []);

	const sum = reverse.reduce((buffer, number) => {
		buffer += number * index;
		index = index === 9 ? 2 : index + 1;
		return buffer;
	}, 0);

	const mod = sum % 11;
	return mod < 2 ? 0 : 11 - mod;
};
